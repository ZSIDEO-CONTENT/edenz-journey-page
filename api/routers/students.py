
from fastapi import APIRouter, HTTPException, Request, status, Depends, Header
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
from datetime import datetime
import supabase
from api.config import SUPABASE_URL, SUPABASE_KEY

# Initialize Supabase client
supabase_client = supabase.create_client(SUPABASE_URL, SUPABASE_KEY)

router = APIRouter(prefix="/student", tags=["student"])


class StudentProfile(BaseModel):
    name: str
    email: str
    phone: str
    address: Optional[str] = None
    dob: Optional[str] = None
    bio: Optional[str] = None
    profile_picture: Optional[str] = None
    preferred_country: Optional[str] = None
    education_level: Optional[str] = None
    funding_source: Optional[str] = None
    budget: Optional[str] = None
    travel_history: Optional[List[Dict[str, str]]] = None
    visa_rejections: Optional[List[Dict[str, str]]] = None
    family_abroad: Optional[bool] = None
    is_first_time_consultation: Optional[bool] = True
    consultation_goals: Optional[List[str]] = None


class Document(BaseModel):
    name: str
    type: str
    file_url: str
    user_id: str
    status: str = "pending"
    feedback: Optional[str] = None
    created_at: Optional[datetime] = None


class EducationEntry(BaseModel):
    degree: str
    institution: str
    year_completed: str
    gpa: str
    country: Optional[str] = None
    major: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    documents: Optional[List[str]] = None


async def get_supabase_user(authorization: Optional[str] = Header(None)):
    """Get the current user from Supabase token"""
    # ... keep existing code (authentication function)


@router.get("/profile/{student_id}")
async def get_student_profile(student_id: str, current_user: dict = Depends(get_supabase_user)):
    """Get a student's profile"""
    # ... keep existing code (get profile function)


@router.put("/profile/{student_id}")
async def update_student_profile(student_id: str, profile: StudentProfile, current_user: dict = Depends(get_supabase_user)):
    """Update a student's profile"""
    try:
        # Verify user is updating their own profile
        if student_id != current_user.id:
            # Check if user is admin
            user_response = supabase_client.table("admins").select("*").eq("id", current_user.id).execute()
            is_admin = user_response and hasattr(user_response, "data") and len(user_response.data) > 0
            
            if not is_admin:
                raise HTTPException(status_code=403, detail="Not authorized to update this profile")
        
        response = supabase_client.table("students").update({
            "name": profile.name,
            "email": profile.email,
            "phone": profile.phone,
            "address": profile.address,
            "dob": profile.dob,
            "bio": profile.bio,
            "profile_picture": profile.profile_picture,
            "preferred_country": profile.preferred_country,
            "education_level": profile.education_level,
            "funding_source": profile.funding_source,
            "budget": profile.budget,
            "travel_history": profile.travel_history,
            "visa_rejections": profile.visa_rejections,
            "family_abroad": profile.family_abroad,
            "is_first_time_consultation": profile.is_first_time_consultation,
            "consultation_goals": profile.consultation_goals,
            "updated_at": datetime.now().isoformat()
        }).eq("id", student_id).execute()
        
        if not response or not hasattr(response, "data") or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Student not found")
        
        return {"success": True, "message": "Profile updated successfully"}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/education/{student_id}")
async def get_student_education(student_id: str, current_user: dict = Depends(get_supabase_user)):
    """Get education history for a student"""
    # ... keep existing code (get education function)


@router.post("/education")
async def add_education(
    education: EducationEntry,
    student_id: str,
    current_user: dict = Depends(get_supabase_user)
):
    """Add education entry for a student"""
    try:
        # Verify user is adding to their own profile
        if student_id != current_user.id:
            # Check if user is admin
            user_response = supabase_client.table("admins").select("*").eq("id", current_user.id).execute()
            is_admin = user_response and hasattr(user_response, "data") and len(user_response.data) > 0
            
            if not is_admin:
                raise HTTPException(status_code=403, detail="Not authorized to update this profile")
        
        result = supabase_client.table("education").insert({
            "student_id": student_id,
            "degree": education.degree,
            "institution": education.institution,
            "year_completed": education.year_completed,
            "gpa": education.gpa,
            "country": education.country,
            "major": education.major,
            "start_date": education.start_date,
            "end_date": education.end_date,
            "documents": education.documents,
            "created_at": datetime.now().isoformat()
        }).execute()
        
        if not result or not hasattr(result, "data") or len(result.data) == 0:
            raise HTTPException(status_code=500, detail="Failed to add education")
        
        return {"success": True, "message": "Education added successfully", "id": result.data[0]["id"]}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/applications/{student_id}")
async def get_student_applications(student_id: str, current_user: dict = Depends(get_supabase_user)):
    """Get applications for a student"""
    # ... keep existing code (get applications function)


@router.get("/onboarding-steps/{student_id}")
async def get_onboarding_steps(student_id: str, current_user: dict = Depends(get_supabase_user)):
    """Get onboarding steps for a new student"""
    try:
        # Verify user is fetching their own onboarding steps
        if student_id != current_user.id:
            # Check if user is admin
            user_response = supabase_client.table("admins").select("*").eq("id", current_user.id).execute()
            is_admin = user_response and hasattr(user_response, "data") and len(user_response.data) > 0
            
            if not is_admin:
                raise HTTPException(status_code=403, detail="Not authorized to view these onboarding steps")
        
        # Get student profile
        student_response = supabase_client.table("students").select("*").eq("id", student_id).execute()
        
        if not student_response or not hasattr(student_response, "data") or len(student_response.data) == 0:
            raise HTTPException(status_code=404, detail="Student not found")
        
        student = student_response.data[0]
        
        # Get education history
        education_response = supabase_client.table("education").select("*").eq("student_id", student_id).execute()
        has_education = education_response and hasattr(education_response, "data") and len(education_response.data) > 0
        
        # Get required documents
        documents_response = supabase_client.table("documents").select("*").eq("user_id", student_id).execute()
        documents = documents_response.data if hasattr(documents_response, "data") else []
        
        # Define required document types
        required_doc_types = ["passport", "academic_transcript", "cv_resume"]
        submitted_doc_types = set(doc["type"] for doc in documents)
        missing_docs = [doc_type for doc_type in required_doc_types if doc_type not in submitted_doc_types]
        
        # Define onboarding steps
        steps = [
            {
                "id": "profile",
                "title": "Complete Your Profile",
                "description": "Fill in your personal details and background information",
                "completed": all(student.get(field) for field in ["name", "email", "phone", "address", "dob"]),
                "required": True,
                "link": "/student/profile"
            },
            {
                "id": "education",
                "title": "Add Education History",
                "description": "Enter details about your academic background",
                "completed": has_education,
                "required": True,
                "link": "/student/profile#education"
            },
            {
                "id": "documents",
                "title": "Upload Required Documents",
                "description": f"Upload your {', '.join(required_doc_types)}",
                "completed": len(missing_docs) == 0,
                "required": True,
                "missing": missing_docs,
                "link": "/student/documents"
            },
            {
                "id": "questionnaire",
                "title": "Complete Questionnaires",
                "description": "Answer questions about your study goals and preferences",
                "completed": False,  # Will be calculated from the questionnaires endpoint
                "required": True,
                "link": "/student/questionnaires"
            },
            {
                "id": "consultation",
                "title": "Book a Consultation",
                "description": "Schedule a meeting with our education consultant",
                "completed": False,  # This will be determined by existing consultations
                "required": True,
                "link": "/student/consultations"
            }
        ]
        
        # Get questionnaire completion status
        try:
            questionnaires_response = supabase_client.table("questionnaires").select("*").eq("is_required", True).execute()
            required_questionnaires = questionnaires_response.data if hasattr(questionnaires_response, "data") else []
            
            responses_response = supabase_client.table("questionnaire_responses").select("questionnaire_id").eq("student_id", student_id).execute()
            completed_questionnaire_ids = []
            if responses_response and hasattr(responses_response, "data"):
                completed_questionnaire_ids = [response["questionnaire_id"] for response in responses_response.data]
            
            questionnaire_step = next((step for step in steps if step["id"] == "questionnaire"), None)
            if questionnaire_step:
                missing_questionnaires = [q for q in required_questionnaires if q["id"] not in completed_questionnaire_ids]
                questionnaire_step["completed"] = len(missing_questionnaires) == 0
                if missing_questionnaires:
                    questionnaire_step["missing"] = [{"id": q["id"], "title": q["title"]} for q in missing_questionnaires]
        except Exception as e:
            print(f"Error getting questionnaire status: {str(e)}")
        
        # Check if consultation is booked
        try:
            consultation_response = supabase_client.table("consultations").select("*").eq("student_id", student_id).execute()
            has_consultation = consultation_response and hasattr(consultation_response, "data") and len(consultation_response.data) > 0
            
            consultation_step = next((step for step in steps if step["id"] == "consultation"), None)
            if consultation_step:
                consultation_step["completed"] = has_consultation
        except Exception as e:
            print(f"Error checking consultation status: {str(e)}")
        
        # Calculate progress percentage
        completed_required_steps = sum(1 for step in steps if step["completed"] and step["required"])
        total_required_steps = sum(1 for step in steps if step["required"])
        progress_percentage = int((completed_required_steps / total_required_steps) * 100) if total_required_steps > 0 else 0
        
        return {
            "steps": steps,
            "progress": progress_percentage,
            "can_book_consultation": progress_percentage >= 80  # Require 80% completion before booking
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/guide/{destination_country}")
async def get_destination_guide(destination_country: str, current_user: dict = Depends(get_supabase_user)):
    """Get application guide for a specific destination country"""
    try:
        # Get the guide information from the database
        guide_response = supabase_client.table("destination_guides").select("*").eq("country_code", destination_country.lower()).execute()
        
        if not guide_response or not hasattr(guide_response, "data") or len(guide_response.data) == 0:
            raise HTTPException(status_code=404, detail=f"Guide for {destination_country} not found")
        
        guide = guide_response.data[0]
        
        # Get required documents for this destination
        doc_response = supabase_client.table("destination_documents").select("*").eq("country_code", destination_country.lower()).execute()
        
        required_documents = []
        if doc_response and hasattr(doc_response, "data"):
            required_documents = doc_response.data
        
        # Get frequently asked questions for this destination
        faq_response = supabase_client.table("destination_faqs").select("*").eq("country_code", destination_country.lower()).execute()
        
        faqs = []
        if faq_response and hasattr(faq_response, "data"):
            faqs = faq_response.data
        
        return {
            "country": guide["country_name"],
            "code": guide["country_code"],
            "overview": guide["overview"],
            "education_system": guide["education_system"],
            "visa_process": guide["visa_process"],
            "costs": guide["costs"],
            "scholarships": guide["scholarships"],
            "work_opportunities": guide["work_opportunities"],
            "accommodation": guide["accommodation"],
            "required_documents": required_documents,
            "faqs": faqs,
            "updated_at": guide["updated_at"]
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/subscription-status/{student_id}")
async def check_subscription_status(student_id: str, current_user: dict = Depends(get_supabase_user)):
    """Check if a student has an active subscription package"""
    try:
        # Verify user is checking their own subscription
        if student_id != current_user.id:
            # Check if user is admin
            user_response = supabase_client.table("admins").select("*").eq("id", current_user.id).execute()
            is_admin = user_response and hasattr(user_response, "data") and len(user_response.data) > 0
            
            if not is_admin:
                raise HTTPException(status_code=403, detail="Not authorized to check this subscription")
        
        # Get student subscriptions
        subscription_response = supabase_client.table("student_subscriptions").select("*").eq("student_id", student_id).order("created_at", {"ascending": False}).limit(1).execute()
        
        if not subscription_response or not hasattr(subscription_response, "data") or len(subscription_response.data) == 0:
            return {
                "has_subscription": False,
                "subscription": None
            }
        
        subscription = subscription_response.data[0]
        current_date = datetime.now().isoformat()
        
        # Check if subscription is still valid
        is_valid = subscription["expiry_date"] > current_date if subscription.get("expiry_date") else False
        
        return {
            "has_subscription": is_valid,
            "subscription": {
                "id": subscription["id"],
                "package_name": subscription["package_name"],
                "start_date": subscription["start_date"],
                "expiry_date": subscription["expiry_date"],
                "features": subscription["features"],
                "remaining_consultations": subscription["remaining_consultations"],
                "total_consultations": subscription["total_consultations"]
            } if is_valid else None
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))
