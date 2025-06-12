
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    LoginView, RegisterView, AdminRegisterView, ProcessingMemberRegisterView,
    UserViewSet, EducationViewSet, DocumentViewSet, ApplicationViewSet, 
    ConsultationViewSet, QuestionnaireViewSet, QuestionnaireResponseViewSet,
    DestinationGuideViewSet, DestinationDocumentViewSet, DestinationFAQViewSet,
    StudentSubscriptionViewSet, ChatView, CurrentUserView, RecommendationsView,
    B2BRegisterView, B2BUsersViewSet
)

# Create a router for ViewSets
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'education', EducationViewSet)
router.register(r'documents', DocumentViewSet)
router.register(r'applications', ApplicationViewSet)
router.register(r'consultations', ConsultationViewSet)
router.register(r'questionnaires', QuestionnaireViewSet)
router.register(r'questionnaire-responses', QuestionnaireResponseViewSet)
router.register(r'destination-guides', DestinationGuideViewSet)
router.register(r'destination-documents', DestinationDocumentViewSet)
router.register(r'destination-faqs', DestinationFAQViewSet)
router.register(r'student-subscriptions', StudentSubscriptionViewSet)
router.register(r'b2b-users', B2BUsersViewSet, basename='b2buser')

urlpatterns = [
    # Authentication endpoints
    path('auth/token/', LoginView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/student/', RegisterView.as_view(), name='register'),
    path('auth/register/admin/', AdminRegisterView.as_view(), name='admin_register'),
    path('auth/register/b2b/', B2BRegisterView.as_view(), name='b2b_register'),
    path('auth/processing/register/', ProcessingMemberRegisterView.as_view(), name='processing_register'),
    path('auth/me/', CurrentUserView.as_view(), name='current_user'),
    
    # Chat endpoint
    path('chat/', ChatView.as_view(), name='chat'),
    
    # Recommendations endpoint
    path('recommendations/<int:student_id>/', RecommendationsView.as_view(), name='recommendations'),
    path('recommendations/generate/<int:student_id>/', RecommendationsView.as_view(), name='generate_recommendations'),
    
    # Include router URLs
    path('', include(router.urls)),
]
