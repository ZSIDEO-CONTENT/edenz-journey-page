
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import (
    User, Education, Document, Application, Consultation, 
    Questionnaire, QuestionnaireResponse, DestinationGuide,
    DestinationDocument, DestinationFAQ, StudentSubscription
)


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'role', 'phone', 'address', 'profile_picture',
                  'preferred_country', 'education_level', 'funding_source', 'budget',
                  'travel_history', 'visa_rejections', 'family_abroad',
                  'is_first_time_consultation', 'consultation_goals', 'managed_regions')
        read_only_fields = ('id', 'email', 'role')


class UserRegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('name', 'email', 'password', 'password2', 'phone', 'role')
        extra_kwargs = {
            'name': {'required': True},
            'email': {'required': True},
            'phone': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create(
            username=validated_data['email'],
            email=validated_data['email'],
            name=validated_data['name'],
            phone=validated_data['phone'],
            role=validated_data.get('role', 'student')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class ProcessingMemberRegisterSerializer(serializers.ModelSerializer):
    """Serializer for registering processing team members (by admin)"""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('name', 'email', 'password', 'password2', 'phone', 'managed_regions')
        extra_kwargs = {
            'name': {'required': True},
            'email': {'required': True},
            'phone': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create(
            username=validated_data['email'],
            email=validated_data['email'],
            name=validated_data['name'],
            phone=validated_data['phone'],
            role='processing',
            managed_regions=validated_data.get('managed_regions', []),
            created_by=self.context['request'].user
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, style={'input_type': 'password'})


class EducationSerializer(serializers.ModelSerializer):
    """Serializer for Education model"""
    class Meta:
        model = Education
        fields = '__all__'
        read_only_fields = ('id', 'student', 'created_at')


class DocumentSerializer(serializers.ModelSerializer):
    """Serializer for Document model"""
    class Meta:
        model = Document
        fields = '__all__'
        read_only_fields = ('id', 'student', 'uploaded_at', 'updated_at')


class ApplicationSerializer(serializers.ModelSerializer):
    """Serializer for Application model"""
    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ('id', 'student', 'created_at', 'updated_at')


class ConsultationSerializer(serializers.ModelSerializer):
    """Serializer for Consultation model"""
    class Meta:
        model = Consultation
        fields = '__all__'
        read_only_fields = ('id', 'created_at')


class QuestionnaireSerializer(serializers.ModelSerializer):
    """Serializer for Questionnaire model"""
    class Meta:
        model = Questionnaire
        fields = '__all__'
        read_only_fields = ('id', 'created_at')


class QuestionnaireResponseSerializer(serializers.ModelSerializer):
    """Serializer for QuestionnaireResponse model"""
    class Meta:
        model = QuestionnaireResponse
        fields = '__all__'
        read_only_fields = ('id', 'student', 'created_at')


class DestinationGuideSerializer(serializers.ModelSerializer):
    """Serializer for DestinationGuide model"""
    class Meta:
        model = DestinationGuide
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')


class DestinationDocumentSerializer(serializers.ModelSerializer):
    """Serializer for DestinationDocument model"""
    class Meta:
        model = DestinationDocument
        fields = '__all__'
        read_only_fields = ('id', 'created_at')


class DestinationFAQSerializer(serializers.ModelSerializer):
    """Serializer for DestinationFAQ model"""
    class Meta:
        model = DestinationFAQ
        fields = '__all__'
        read_only_fields = ('id', 'created_at')


class StudentSubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for StudentSubscription model"""
    class Meta:
        model = StudentSubscription
        fields = '__all__'
        read_only_fields = ('id', 'student', 'created_at')
