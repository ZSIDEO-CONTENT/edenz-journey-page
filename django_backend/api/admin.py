
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from .models import (
    User, Education, Document, Application, Consultation, 
    Questionnaire, QuestionnaireResponse, DestinationGuide,
    DestinationDocument, DestinationFAQ, StudentSubscription
)

class CustomUserAdmin(BaseUserAdmin):
    """Custom admin for User model"""
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        (_('Personal info'), {'fields': ('name', 'phone', 'address', 'dob', 'bio', 'profile_picture')}),
        (_('Role and Permissions'), {'fields': ('role', 'managed_regions', 'is_staff', 'is_active', 'is_superuser')}),
        (_('Student Info'), {'fields': ('preferred_country', 'education_level', 'funding_source', 
                                       'budget', 'travel_history', 'visa_rejections', 'family_abroad',
                                       'is_first_time_consultation', 'consultation_goals')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'role'),
        }),
    )
    list_display = ('email', 'name', 'role', 'is_active')
    list_filter = ('role', 'is_active', 'is_staff')
    search_fields = ('email', 'name', 'username')
    ordering = ('email',)

# Register models with admin site
admin.site.register(User, CustomUserAdmin)
admin.site.register(Education)
admin.site.register(Document)
admin.site.register(Application)
admin.site.register(Consultation)
admin.site.register(Questionnaire)
admin.site.register(QuestionnaireResponse)
admin.site.register(DestinationGuide)
admin.site.register(DestinationDocument)
admin.site.register(DestinationFAQ)
admin.site.register(StudentSubscription)
