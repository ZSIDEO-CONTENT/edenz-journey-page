
from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
import uuid
from datetime import datetime
import logging
import json

from .models import (
    User, Education, Document, Application, Consultation, 
    Questionnaire, QuestionnaireResponse, DestinationGuide,
    DestinationDocument, DestinationFAQ, StudentSubscription
)
from .serializers import (
    UserSerializer, UserRegisterSerializer, ProcessingMemberRegisterSerializer,
    LoginSerializer, EducationSerializer, DocumentSerializer, ApplicationSerializer,
    ConsultationSerializer, QuestionnaireSerializer, QuestionnaireResponseSerializer,
    DestinationGuideSerializer, DestinationDocumentSerializer, DestinationFAQSerializer,
    StudentSubscriptionSerializer
)

# Configure logging
logger = logging.getLogger(__name__)

# Custom permissions
class IsProcessingOrAdmin(permissions.BasePermission):
    """Permission for processing team members or admins"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['processing', 'admin']

class IsStudent(permissions.BasePermission):
    """Permission for students"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'student'

class IsOwnerOrStaff(permissions.BasePermission):
    """Permission to check if user is owner or staff"""
    def has_object_permission(self, request, view, obj):
        # Allow admin and processing to access
        if request.user.role in ['admin', 'processing']:
            return True
            
        # Check if user owns the record
        if hasattr(obj, 'student'):
            return obj.student == request.user
        return False

# Auth views
class LoginView(APIView):
    """API view for user login"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            user = authenticate(request, username=email, password=password)
            
            if user is not None:
                refresh = RefreshToken.for_user(user)
                
                return Response({
                    'access_token': str(refresh.access_token),
                    'token_type': 'bearer',
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'name': user.name,
                        'role': user.role,
                        'managed_regions': user.managed_regions if user.role == 'processing' else None
                    }
                })
            else:
                return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(APIView):
    """API view for student registration"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            # Make sure role is set to student
            if 'role' in serializer.validated_data and serializer.validated_data['role'] != 'student':
                serializer.validated_data['role'] = 'student'
                
            user = serializer.save()
            return Response({'success': True, 'message': 'Student registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminRegisterView(APIView):
    """API view for admin registration (requires admin secret key)"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        # Verify admin secret key
        admin_secret = 'admin123'  # Use environment variable in production
        if 'adminSecretKey' not in request.data or request.data['adminSecretKey'] != admin_secret:
            return Response({'detail': 'Invalid admin secret key'}, status=status.HTTP_403_FORBIDDEN)
            
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            # Set role to admin
            serializer.validated_data['role'] = 'admin'
            user = serializer.save()
            return Response({'success': True, 'message': 'Admin registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProcessingMemberRegisterView(APIView):
    """API view for registering processing team members (admin only)"""
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def post(self, request):
        serializer = ProcessingMemberRegisterSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.save()
            return Response({'success': True, 'message': 'Processing team member registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CurrentUserView(APIView):
    """API view to get current authenticated user information"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

# ViewSets for models
class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for User model"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsProcessingOrAdmin]
    
    def get_queryset(self):
        """Filter queryset based on user role"""
        if self.request.user.role == 'admin':
            return User.objects.all()
        elif self.request.user.role == 'processing':
            return User.objects.filter(role='student')
        return User.objects.none()

class EducationViewSet(viewsets.ModelViewSet):
    """ViewSet for Education model"""
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrStaff]
    
    def get_queryset(self):
        """Filter queryset based on user role"""
        if self.request.user.role in ['admin', 'processing']:
            # Filter by student_id if provided
            student_id = self.request.query_params.get('student_id')
            if student_id:
                return Education.objects.filter(student_id=student_id)
            return Education.objects.all()
        # Students can only see their own records
        return Education.objects.filter(student=self.request.user)
    
    def perform_create(self, serializer):
        """Set student to current user if student or from request data if admin/processing"""
        if self.request.user.role == 'student':
            serializer.save(student=self.request.user)
        else:
            student_id = self.request.data.get('student_id')
            if not student_id:
                raise ValidationError({'student_id': 'Student ID is required'})
            student = get_object_or_404(User, id=student_id, role='student')
            serializer.save(student=student)

class DocumentViewSet(viewsets.ModelViewSet):
    """ViewSet for Document model"""
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrStaff]
    
    def get_queryset(self):
        """Filter queryset based on user role"""
        if self.request.user.role in ['admin', 'processing']:
            # Filter by student_id if provided
            student_id = self.request.query_params.get('student_id')
            if student_id:
                return Document.objects.filter(student_id=student_id)
            return Document.objects.all()
        # Students can only see their own records
        return Document.objects.filter(student=self.request.user)
    
    def perform_create(self, serializer):
        """Set student to current user if student or from request data if admin/processing"""
        if self.request.user.role == 'student':
            serializer.save(student=self.request.user)
        else:
            student_id = self.request.data.get('student_id')
            if not student_id:
                raise ValidationError({'student_id': 'Student ID is required'})
            student = get_object_or_404(User, id=student_id, role='student')
            serializer.save(student=student)

class ApplicationViewSet(viewsets.ModelViewSet):
    """ViewSet for Application model"""
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrStaff]
    
    def get_queryset(self):
        """Filter queryset based on user role"""
        if self.request.user.role in ['admin', 'processing']:
            # Filter by student_id if provided
            student_id = self.request.query_params.get('student_id')
            if student_id:
                return Application.objects.filter(student_id=student_id)
            return Application.objects.all()
        # Students can only see their own records
        return Application.objects.filter(student=self.request.user)
    
    def perform_create(self, serializer):
        """Set student to current user if student or from request data if admin/processing"""
        if self.request.user.role == 'student':
            serializer.save(student=self.request.user)
        else:
            student_id = self.request.data.get('student_id')
            if not student_id:
                raise ValidationError({'student_id': 'Student ID is required'})
            student = get_object_or_404(User, id=student_id, role='student')
            serializer.save(student=student)

class ConsultationViewSet(viewsets.ModelViewSet):
    """ViewSet for Consultation model"""
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer
    
    def get_permissions(self):
        """Return appropriate permissions based on action"""
        if self.action == 'create':
            return [AllowAny()]  # Allow anyone to create a consultation
        return [IsAuthenticated(), IsOwnerOrStaff()]
    
    def get_queryset(self):
        """Filter queryset based on user role"""
        if self.request.user.role in ['admin', 'processing']:
            return Consultation.objects.all()
        # Students can only see their own records
        return Consultation.objects.filter(student=self.request.user)
    
    def perform_create(self, serializer):
        """Link consultation to student if logged in"""
        if self.request.user.is_authenticated and self.request.user.role == 'student':
            serializer.save(student=self.request.user)
        else:
            serializer.save()

class QuestionnaireViewSet(viewsets.ModelViewSet):
    """ViewSet for Questionnaire model"""
    queryset = Questionnaire.objects.all()
    serializer_class = QuestionnaireSerializer
    
    def get_permissions(self):
        """Return appropriate permissions based on action"""
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]  # All authenticated users can view
        return [IsAuthenticated(), IsProcessingOrAdmin()]  # Only staff can modify

class QuestionnaireResponseViewSet(viewsets.ModelViewSet):
    """ViewSet for QuestionnaireResponse model"""
    queryset = QuestionnaireResponse.objects.all()
    serializer_class = QuestionnaireResponseSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrStaff]
    
    def get_queryset(self):
        """Filter queryset based on user role"""
        if self.request.user.role in ['admin', 'processing']:
            # Filter by student_id if provided
            student_id = self.request.query_params.get('student_id')
            if student_id:
                return QuestionnaireResponse.objects.filter(student_id=student_id)
            return QuestionnaireResponse.objects.all()
        # Students can only see their own records
        return QuestionnaireResponse.objects.filter(student=self.request.user)
    
    def perform_create(self, serializer):
        """Set student to current user"""
        serializer.save(student=self.request.user)

class DestinationGuideViewSet(viewsets.ModelViewSet):
    """ViewSet for DestinationGuide model"""
    queryset = DestinationGuide.objects.all()
    serializer_class = DestinationGuideSerializer
    
    def get_permissions(self):
        """Return appropriate permissions based on action"""
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]  # Anyone can view destination guides
        return [IsAuthenticated(), IsProcessingOrAdmin()]  # Only staff can modify

class DestinationDocumentViewSet(viewsets.ModelViewSet):
    """ViewSet for DestinationDocument model"""
    queryset = DestinationDocument.objects.all()
    serializer_class = DestinationDocumentSerializer
    
    def get_permissions(self):
        """Return appropriate permissions based on action"""
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]  # Anyone can view destination documents
        return [IsAuthenticated(), IsProcessingOrAdmin()]  # Only staff can modify

class DestinationFAQViewSet(viewsets.ModelViewSet):
    """ViewSet for DestinationFAQ model"""
    queryset = DestinationFAQ.objects.all()
    serializer_class = DestinationFAQSerializer
    
    def get_permissions(self):
        """Return appropriate permissions based on action"""
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]  # Anyone can view FAQs
        return [IsAuthenticated(), IsProcessingOrAdmin()]  # Only staff can modify

class StudentSubscriptionViewSet(viewsets.ModelViewSet):
    """ViewSet for StudentSubscription model"""
    queryset = StudentSubscription.objects.all()
    serializer_class = StudentSubscriptionSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrStaff]
    
    def get_queryset(self):
        """Filter queryset based on user role"""
        if self.request.user.role in ['admin', 'processing']:
            # Filter by student_id if provided
            student_id = self.request.query_params.get('student_id')
            if student_id:
                return StudentSubscription.objects.filter(student_id=student_id)
            return StudentSubscription.objects.all()
        # Students can only see their own records
        return StudentSubscription.objects.filter(student=self.request.user)
    
    def perform_create(self, serializer):
        """Set student from request data"""
        student_id = self.request.data.get('student_id')
        if not student_id and self.request.user.role == 'student':
            student_id = self.request.user.id
            
        if not student_id:
            raise ValidationError({'student_id': 'Student ID is required'})
            
        student = get_object_or_404(User, id=student_id, role='student')
        serializer.save(student=student)

# Additional API views
class ChatView(APIView):
    """API view for chat functionality"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        # Simple implementation - in production, integrate with your existing chat logic
        message = request.data.get('message')
        session_id = request.data.get('session_id') or str(uuid.uuid4())
        
        if not message:
            return Response({'error': 'Message cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Simple fallback response
        response = f"Thank you for your message. Our team will get back to you soon. Your query was: {message}"
        
        return Response({
            'response': response,
            'session_id': session_id,
            'success': True,
            'action': None
        })

class RecommendationsView(APIView):
    """API view for student recommendations"""
    permission_classes = [IsAuthenticated, IsOwnerOrStaff]
    
    def get(self, request, student_id):
        # Get the student
        if str(request.user.id) != str(student_id) and request.user.role not in ['admin', 'processing']:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
            
        student = get_object_or_404(User, id=student_id)
        
        # Simple mock recommendations
        recommendations = [
            {
                'id': 1,
                'university': 'University of London',
                'program': 'MSc Computer Science',
                'country': 'UK',
                'tuition': '£15,000 per year',
                'match': '90%',
                'description': 'Excellent program with flexible study options.'
            },
            {
                'id': 2,
                'university': 'Technical University of Munich',
                'program': 'MSc Informatics',
                'country': 'Germany',
                'tuition': '€0 (free)',
                'match': '85%',
                'description': 'Renowned university offering tuition-free education.'
            },
            {
                'id': 3,
                'university': 'University of Toronto',
                'program': 'MSc Computer Engineering',
                'country': 'Canada',
                'tuition': 'CAD 25,000 per year',
                'match': '80%',
                'description': 'World-class education with post-graduation work opportunities.'
            }
        ]
        
        return Response(recommendations)
    
    def post(self, request, student_id):
        # Generate new recommendations
        if str(request.user.id) != str(student_id) and request.user.role not in ['admin', 'processing']:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
            
        student = get_object_or_404(User, id=student_id)
        
        # Simple mock generated recommendations
        generated_recommendations = [
            {
                'id': 4,
                'university': 'ETH Zurich',
                'program': 'MSc Computer Science',
                'country': 'Switzerland',
                'tuition': 'CHF 1,500 per year',
                'match': '92%',
                'description': 'World-leading institution with excellent research opportunities.'
            },
            {
                'id': 5,
                'university': 'KTH Royal Institute of Technology',
                'program': 'MSc Software Engineering',
                'country': 'Sweden',
                'tuition': '€0 for EU students, €15,000 for non-EU',
                'match': '88%',
                'description': 'Strong industry connections and practical focus.'
            }
        ]
        
        return Response(generated_recommendations)
