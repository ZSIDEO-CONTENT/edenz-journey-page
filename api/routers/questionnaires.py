
from fastapi import APIRouter, HTTPException, Request, status, Depends, Header
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
from datetime import datetime
import supabase
from api.config import SUPABASE_URL, SUPABASE_KEY

# Initialize Supabase client
supabase_client = supabase.create_client(SUPABASE_URL, SUPABASE_KEY)

router = APIRouter(prefix="/questionnaires", tags=["questionnaires"])


class QuestionnaireResponse(BaseModel):
    student_id: str
    questionnaire_id: str
    responses: Dict[str, Any]


class Questionnaire(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    questions: List[Dict[str, Any]]
    is_required: bool = True
    destination_country: Optional[str] = None
    education_level: Optional[str] = None
    created_at: Optional[datetime] = None


async def get_supabase_user(authorization: Optional[str] = Header(None)):
    """Get the current user from Supabase token"""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    try:
        # Extract the token from the Authorization header
        token = authorization.replace("Bearer ", "")
        
        # Verify token with Supabase
        response = supabase_client.auth.get_user(token)
        if not response or not hasattr(response, "user"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        return response.user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication error: {str(e)}"
        )


@router.get("")
async def get_all_questionnaires(current_user: dict = Depends(get_supabase_user)):
    """Get all questionnaires available to the student"""
    try:
        # Get system questionnaires (available to all students)
        response = supabase_client.table("questionnaires").select("*").execute()
        
        if not response or not hasattr(response, "data"):
            return []
        
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/student/{student_id}")
async def get_student_questionnaire_responses(student_id: str, current_user: dict = Depends(get_supabase_user)):
    """Get all questionnaire responses for a student"""
    try:
        # Verify user is fetching their own responses
        if student_id != current_user.id:
            # Check if user is admin
            user_response = supabase_client.table("admins").select("*").eq("id", current_user.id).execute()
            is_admin = user_response and hasattr(user_response, "data") and len(user_response.data) > 0
            
            if not is_admin:
                raise HTTPException(status_code=403, detail="Not authorized to view these responses")
        
        response = supabase_client.table("questionnaire_responses").select("*").eq("student_id", student_id).execute()
        
        if not response or not hasattr(response, "data"):
            return []
        
        return response.data
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/respond")
async def submit_questionnaire_response(response_data: QuestionnaireResponse, current_user: dict = Depends(get_supabase_user)):
    """Submit responses to a questionnaire"""
    try:
        # Verify user is submitting their own responses
        if response_data.student_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to submit for this user")
        
        # Check if questionnaire exists
        questionnaire = supabase_client.table("questionnaires").select("*").eq("id", response_data.questionnaire_id).execute()
        
        if not questionnaire or not hasattr(questionnaire, "data") or len(questionnaire.data) == 0:
            raise HTTPException(status_code=404, detail="Questionnaire not found")
        
        # Check if student has already responded to this questionnaire
        existing_response = supabase_client.table("questionnaire_responses").select("*").eq("student_id", response_data.student_id).eq("questionnaire_id", response_data.questionnaire_id).execute()
        
        if existing_response and hasattr(existing_response, "data") and len(existing_response.data) > 0:
            # Update existing response
            result = supabase_client.table("questionnaire_responses").update({
                "responses": response_data.responses,
                "updated_at": datetime.now().isoformat()
            }).eq("student_id", response_data.student_id).eq("questionnaire_id", response_data.questionnaire_id).execute()
        else:
            # Create new response
            result = supabase_client.table("questionnaire_responses").insert({
                "student_id": response_data.student_id,
                "questionnaire_id": response_data.questionnaire_id,
                "responses": response_data.responses,
                "created_at": datetime.now().isoformat()
            }).execute()
        
        if result and hasattr(result, "data") and len(result.data) > 0:
            return {"success": True, "message": "Questionnaire response submitted successfully"}
        
        raise HTTPException(status_code=500, detail="Failed to submit questionnaire response")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/required/{student_id}")
async def get_required_questionnaires(student_id: str, current_user: dict = Depends(get_supabase_user)):
    """Get all required questionnaires for a student that they haven't completed yet"""
    try:
        # Verify user is fetching their own required questionnaires
        if student_id != current_user.id:
            # Check if user is admin
            user_response = supabase_client.table("admins").select("*").eq("id", current_user.id).execute()
            is_admin = user_response and hasattr(user_response, "data") and len(user_response.data) > 0
            
            if not is_admin:
                raise HTTPException(status_code=403, detail="Not authorized to view these questionnaires")
        
        # Get student profile to check preferred country and education level
        student_response = supabase_client.table("students").select("*").eq("id", student_id).execute()
        
        if not student_response or not hasattr(student_response, "data") or len(student_response.data) == 0:
            raise HTTPException(status_code=404, detail="Student not found")
        
        student = student_response.data[0]
        preferred_country = student.get("preferred_country")
        education_level = student.get("education_level")
        
        # Get all required questionnaires
        questionnaires_response = supabase_client.table("questionnaires").select("*").eq("is_required", True).execute()
        
        if not questionnaires_response or not hasattr(questionnaires_response, "data"):
            return []
        
        questionnaires = questionnaires_response.data
        
        # Get all questionnaires already completed by the student
        completed_response = supabase_client.table("questionnaire_responses").select("questionnaire_id").eq("student_id", student_id).execute()
        
        completed_questionnaire_ids = []
        if completed_response and hasattr(completed_response, "data"):
            completed_questionnaire_ids = [response["questionnaire_id"] for response in completed_response.data]
        
        # Filter questionnaires that are required for this student and not completed yet
        required_questionnaires = []
        for questionnaire in questionnaires:
            # Skip if already completed
            if questionnaire["id"] in completed_questionnaire_ids:
                continue
            
            # Check if questionnaire is applicable to student's preferred country and education level
            country_match = not questionnaire.get("destination_country") or questionnaire.get("destination_country") == preferred_country
            education_match = not questionnaire.get("education_level") or questionnaire.get("education_level") == education_level
            
            if country_match and education_match:
                required_questionnaires.append(questionnaire)
        
        return required_questionnaires
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/profile-completeness/{student_id}")
async def check_profile_completeness(student_id: str, current_user: dict = Depends(get_supabase_user)):
    """Check how complete a student's profile is, including required documents and questionnaires"""
    try:
        # Verify user is checking their own profile
        if student_id != current_user.id:
            # Check if user is admin
            user_response = supabase_client.table("admins").select("*").eq("id", current_user.id).execute()
            is_admin = user_response and hasattr(user_response, "data") and len(user_response.data) > 0
            
            if not is_admin:
                raise HTTPException(status_code=403, detail="Not authorized to check this profile")
        
        # Get student profile data
        student_response = supabase_client.table("students").select("*").eq("id", student_id).execute()
        
        if not student_response or not hasattr(student_response, "data") or len(student_response.data) == 0:
            raise HTTPException(status_code=404, detail="Student not found")
        
        student = student_response.data[0]
        
        # Get education history
        education_response = supabase_client.table("education").select("*").eq("student_id", student_id).execute()
        education_history = education_response.data if hasattr(education_response, "data") else []
        
        # Get documents
        documents_response = supabase_client.table("documents").select("*").eq("user_id", student_id).execute()
        documents = documents_response.data if hasattr(documents_response, "data") else []
        
        # Get questionnaire responses
        responses_response = supabase_client.table("questionnaire_responses").select("*").eq("student_id", student_id).execute()
        questionnaire_responses = responses_response.data if hasattr(responses_response, "data") else []
        
        # Calculate completeness
        profile_fields = ["name", "email", "phone", "address", "dob", "bio"]
        total_profile_fields = len(profile_fields)
        completed_profile_fields = sum(1 for field in profile_fields if student.get(field))
        
        profile_percentage = int((completed_profile_fields / total_profile_fields) * 100)
        
        # Check required document types
        required_doc_types = ["passport", "academic_transcript", "cv_resume"]
        submitted_doc_types = set(doc["type"] for doc in documents)
        missing_docs = [doc_type for doc_type in required_doc_types if doc_type not in submitted_doc_types]
        
        # Get all required questionnaires
        questionnaires_response = supabase_client.table("questionnaires").select("*").eq("is_required", True).execute()
        required_questionnaires = questionnaires_response.data if hasattr(questionnaires_response, "data") else []
        
        # Calculate questionnaire completeness
        completed_questionnaire_ids = [response["questionnaire_id"] for response in questionnaire_responses]
        missing_questionnaires = [q for q in required_questionnaires if q["id"] not in completed_questionnaire_ids]
        
        # Calculate overall completeness
        education_complete = len(education_history) > 0
        documents_complete = len(missing_docs) == 0
        questionnaires_complete = len(missing_questionnaires) == 0
        
        # Calculate total completeness percentage
        sections = [
            {"name": "Profile", "complete": profile_percentage == 100, "percentage": profile_percentage},
            {"name": "Education History", "complete": education_complete, "percentage": 100 if education_complete else 0},
            {"name": "Required Documents", "complete": documents_complete, "percentage": int(((len(required_doc_types) - len(missing_docs)) / len(required_doc_types)) * 100) if required_doc_types else 100},
            {"name": "Questionnaires", "complete": questionnaires_complete, "percentage": int(((len(required_questionnaires) - len(missing_questionnaires)) / len(required_questionnaires)) * 100) if required_questionnaires else 100},
        ]
        
        total_percentage = sum(section["percentage"] for section in sections) // len(sections)
        
        return {
            "completeness": {
                "percentage": total_percentage,
                "sections": sections,
            },
            "missing": {
                "profile_fields": [field for field in profile_fields if not student.get(field)],
                "documents": missing_docs,
                "questionnaires": [{"id": q["id"], "title": q["title"]} for q in missing_questionnaires],
                "education": not education_complete,
            },
            "can_book_consultation": total_percentage >= 70,  # Require at least 70% completeness to book consultation
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

