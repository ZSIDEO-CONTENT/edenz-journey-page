
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.contrib.postgres.fields import ArrayField

class User(AbstractUser):
    """Custom User model that extends Django's AbstractUser"""
    name = models.CharField(max_length=255, blank=True)
    email = models.EmailField(_('email address'), unique=True)
    phone = models.CharField(max_length=255, blank=True, null=True)
    role = models.CharField(max_length=50, default='student')
    address = models.TextField(blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.TextField(blank=True, null=True)
    preferred_country = models.CharField(max_length=100, blank=True, null=True)
    education_level = models.CharField(max_length=100, blank=True, null=True)
    funding_source = models.CharField(max_length=100, blank=True, null=True)
    budget = models.CharField(max_length=100, blank=True, null=True)
    travel_history = models.JSONField(blank=True, null=True)
    visa_rejections = models.JSONField(blank=True, null=True)
    family_abroad = models.BooleanField(default=False)
    is_first_time_consultation = models.BooleanField(default=True)
    # uncomment in production
    # consultation_goals = ArrayField(models.TextField(), blank=True, null=True)
    # managed_regions = ArrayField(models.CharField(max_length=100), blank=True, null=True)
    consultation_goals = models.JSONField(blank=True, null=True)
    managed_regions = models.JSONField(blank=True, null=True)
    created_by = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='created_users')
    
    # Use email as the unique identifier for authentication
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # Username still required by Django
    
    def save(self, *args, **kwargs):
        # Set username to email if not provided
        if not self.username:
            self.username = self.email
        super().save(*args, **kwargs)
        
    def __str__(self):
        return self.email


class Education(models.Model):
    """Education records for students"""
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='education')
    degree = models.CharField(max_length=255)
    institution = models.CharField(max_length=255)
    year_completed = models.CharField(max_length=50)
    gpa = models.CharField(max_length=50)
    country = models.CharField(max_length=100, blank=True, null=True)
    major = models.CharField(max_length=255, blank=True, null=True)
    start_date = models.CharField(max_length=50, blank=True, null=True)
    end_date = models.CharField(max_length=50, blank=True, null=True)
    documents = ArrayField(models.TextField(), blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.email} - {self.degree} from {self.institution}"


class Document(models.Model):
    """Documents uploaded by students"""
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=100)
    file_path = models.CharField(max_length=255)
    status = models.CharField(max_length=50, default='pending')
    feedback = models.TextField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student.email} - {self.document_type}"


class Application(models.Model):
    """University applications by students"""
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    university_name = models.CharField(max_length=255)
    program_name = models.CharField(max_length=255)
    status = models.CharField(max_length=50, default='pending')
    progress = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student.email} - {self.program_name} at {self.university_name}"


class Consultation(models.Model):
    """Consultations booked by visitors or students"""
    student = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='consultations')
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    date = models.CharField(max_length=50)
    time = models.CharField(max_length=50)
    consultation_type = models.CharField(max_length=100)
    destination = models.CharField(max_length=100, blank=True, null=True)
    message = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=50, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Consultation by {self.name} ({self.email}) on {self.date}"


class Questionnaire(models.Model):
    """Questionnaires for students to fill"""
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    is_required = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class QuestionnaireResponse(models.Model):
    """Student responses to questionnaires"""
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='questionnaire_responses')
    questionnaire = models.ForeignKey(Questionnaire, on_delete=models.CASCADE, related_name='responses')
    responses = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.email} response to {self.questionnaire.title}"


class DestinationGuide(models.Model):
    """Information about study destinations"""
    country_code = models.CharField(max_length=10, unique=True)
    country_name = models.CharField(max_length=100)
    overview = models.TextField(blank=True, null=True)
    education_system = models.TextField(blank=True, null=True)
    visa_process = models.TextField(blank=True, null=True)
    costs = models.TextField(blank=True, null=True)
    scholarships = models.TextField(blank=True, null=True)
    work_opportunities = models.TextField(blank=True, null=True)
    accommodation = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.country_name


class DestinationDocument(models.Model):
    """Required documents for each destination"""
    country = models.ForeignKey(DestinationGuide, on_delete=models.CASCADE, to_field='country_code', related_name='required_documents')
    document_name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    is_required = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.country.country_name} - {self.document_name}"


class DestinationFAQ(models.Model):
    """FAQs for each destination"""
    country = models.ForeignKey(DestinationGuide, on_delete=models.CASCADE, to_field='country_code', related_name='faqs')
    question = models.TextField()
    answer = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.country.country_name} - {self.question[:50]}"


class StudentSubscription(models.Model):
    """Student subscription plans"""
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    package_name = models.CharField(max_length=100)
    start_date = models.DateTimeField()
    expiry_date = models.DateTimeField()
    features = models.JSONField(blank=True, null=True)
    remaining_consultations = models.IntegerField(default=0)
    total_consultations = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.email} - {self.package_name} subscription"
