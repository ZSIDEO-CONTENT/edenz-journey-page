
from fastapi import APIRouter, HTTPException, Request, status, Depends, Header
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
from datetime import datetime
import supabase
from api.config import SUPABASE_URL, SUPABASE_KEY
from api.routers.auth import get_supabase_user

# Initialize Supabase client
supabase_client = supabase.create_client(SUPABASE_URL, SUPABASE_KEY)

router = APIRouter(prefix="/processing", tags=["processing"])

class ApplicationCreate(BaseModel):
    student_id: str
    university_name: str
    program_name: str
    intake: str
    status: str = "new"
    application_fee: Optional[float] = None
    tuition_fee: Optional[float] = None
    estimated_living_cost: Optional[float] = None
    documents_required: Optional[List[str]] = None
    notes: Optional[str] = None

class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    progress: Optional[int] = None
    notes: Optional[str] = None
    update_message: Optional[str] = None

@router.get("/students")
async def get_all_students(current_user: dict = Depends(get_supabase_user)):
    """Get all students (for processing team)"""
    try:
        # Verify user is in processing team or admin
        user_id = current_user.id
        user_role = None
        
        # Check processing team
        proc_response = supabase_client.table("processing_team").select("*").eq("id", user_id).execute()
        if proc_response and hasattr(proc_response, "data") and len(proc_response.data) > 0:
            user_role = "processing"
        
        # If not in processing team, check if admin
        if not user_role:
            admin_response = supabase_client.table("admins").select("*").eq("id", user_id).execute()
            if admin_response and hasattr(admin_response, "data") and len(admin_response.data) > 0:
                user_role = "admin"
        
        if not user_role or user_role not in ["processing", "admin"]:
            raise HTTPException(status_code=403, detail="Not authorized to access student data")
        
        # Get all students
        students_response = supabase_client.table("students").select("id,name,email,phone,created_at,preferred_country").execute()
        
        if not students_response or not hasattr(students_response, "data"):
            return []
        
        students = students_response.data
        
        # Get applications count for each student
        for student in students:
            app_count_response = supabase_client.table("applications").select("id", count="exact").eq("student_id", student["id"]).execute()
            student["application_count"] = app_count_response.count if hasattr(app_count_response, "count") else 0
            
            # Get documents count
            doc_count_response = supabase_client.table("documents").select("id", count="exact").eq("user_id", student["id"]).execute()
            student["document_count"] = doc_count_response.count if hasattr(doc_count_response, "count") else 0
        
        return students
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/students/{student_id}")
async def get_student_details(student_id: str, current_user: dict = Depends(get_supabase_user)):
    """Get detailed student information (for processing team)"""
    try:
        # Verify user is in processing team or admin
        user_id = current_user.id
        user_role = None
        
        # Check processing team
        proc_response = supabase_client.table("processing_team").select("*").eq("id", user_id).execute()
        if proc_response and hasattr(proc_response, "data") and len(proc_response.data) > 0:
            user_role = "processing"
        
        # If not in processing team, check if admin
        if not user_role:
            admin_response = supabase_client.table("admins").select("*").eq("id", user_id).execute()
            if admin_response and hasattr(admin_response, "data") and len(admin_response.data) > 0:
                user_role = "admin"
        
        if not user_role or user_role not in ["processing", "admin"]:
            raise HTTPException(status_code=403, detail="Not authorized to access student data")
        
        # Get student profile
        student_response = supabase_client.table("students").select("*").eq("id", student_id).execute()
        
        if not student_response or not hasattr(student_response, "data") or len(student_response.data) == 0:
            raise HTTPException(status_code=404, detail="Student not found")
        
        student = student_response.data[0]
        
        # Get student's education history
        education_response = supabase_client.table("education").select("*").eq("student_id", student_id).execute()
        education = education_response.data if hasattr(education_response, "data") else []
        
        # Get student's documents
        documents_response = supabase_client.table("documents").select("*").eq("user_id", student_id).execute()
        documents = documents_response.data if hasattr(documents_response, "data") else []
        
        # Get student's applications
        applications_response = supabase_client.table("applications").select("*").eq("student_id", student_id).execute()
        applications = applications_response.data if hasattr(applications_response, "data") else []
        
        return {
            "profile": student,
            "education": education,
            "documents": documents,
            "applications": applications
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/applications")
async def create_student_application(application: ApplicationCreate, current_user: dict = Depends(get_supabase_user)):
    """Create a new application for a student (processing team only)"""
    try:
        # Verify user is in processing team or admin
        user_id = current_user.id
        user_role = None
        
        # Check processing team
        proc_response = supabase_client.table("processing_team").select("*").eq("id", user_id).execute()
        if proc_response and hasattr(proc_response, "data") and len(proc_response.data) > 0:
            user_role = "processing"
        
        # If not in processing team, check if admin
        if not user_role:
            admin_response = supabase_client.table("admins").select("*").eq("id", user_id).execute()
            if admin_response and hasattr(admin_response, "data") and len(admin_response.data) > 0:
                user_role = "admin"
        
        if not user_role or user_role not in ["processing", "admin"]:
            raise HTTPException(status_code=403, detail="Not authorized to create applications")
        
        # Verify student exists
        student_response = supabase_client.table("students").select("*").eq("id", application.student_id).execute()
        
        if not student_response or not hasattr(student_response, "data") or len(student_response.data) == 0:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Create application
        app_data = {
            "student_id": application.student_id,
            "university_name": application.university_name,
            "program_name": application.program_name,
            "intake": application.intake,
            "status": application.status,
            "progress": 10,  # Initial progress
            "application_fee": application.application_fee,
            "tuition_fee": application.tuition_fee,
            "estimated_living_cost": application.estimated_living_cost,
            "documents_required": application.documents_required,
            "notes": application.notes,
            "created_by": user_id,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        
        result = supabase_client.table("applications").insert(app_data).execute()
        
        if not result or not hasattr(result, "data") or len(result.data) == 0:
            raise HTTPException(status_code=500, detail="Failed to create application")
        
        # Create application history entry
        history_data = {
            "application_id": result.data[0]["id"],
            "status": application.status,
            "progress": 10,
            "notes": f"Application created for {application.university_name}, {application.program_name}",
            "created_by": user_id,
            "created_at": datetime.now().isoformat()
        }
        
        supabase_client.table("application_history").insert(history_data).execute()
        
        return {
            "success": True, 
            "message": "Application created successfully", 
            "application_id": result.data[0]["id"]
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/applications/{application_id}")
async def update_student_application(application_id: str, application: ApplicationUpdate, current_user: dict = Depends(get_supabase_user)):
    """Update application status and progress (processing team only)"""
    try:
        # Verify user is in processing team or admin
        user_id = current_user.id
        user_role = None
        
        # Check processing team
        proc_response = supabase_client.table("processing_team").select("*").eq("id", user_id).execute()
        if proc_response and hasattr(proc_response, "data") and len(proc_response.data) > 0:
            user_role = "processing"
        
        # If not in processing team, check if admin
        if not user_role:
            admin_response = supabase_client.table("admins").select("*").eq("id", user_id).execute()
            if admin_response and hasattr(admin_response, "data") and len(admin_response.data) > 0:
                user_role = "admin"
        
        if not user_role or user_role not in ["processing", "admin"]:
            raise HTTPException(status_code=403, detail="Not authorized to update applications")
        
        # Verify application exists
        app_response = supabase_client.table("applications").select("*").eq("id", application_id).execute()
        
        if not app_response or not hasattr(app_response, "data") or len(app_response.data) == 0:
            raise HTTPException(status_code=404, detail="Application not found")
        
        # Update application
        update_data = {"updated_at": datetime.now().isoformat()}
        if application.status is not None:
            update_data["status"] = application.status
        if application.progress is not None:
            update_data["progress"] = application.progress
        if application.notes is not None:
            update_data["notes"] = application.notes
        
        result = supabase_client.table("applications").update(update_data).eq("id", application_id).execute()
        
        if not result or not hasattr(result, "data") or len(result.data) == 0:
            raise HTTPException(status_code=500, detail="Failed to update application")
        
        # Create application history entry
        history_data = {
            "application_id": application_id,
            "status": application.status if application.status is not None else result.data[0]["status"],
            "progress": application.progress if application.progress is not None else result.data[0]["progress"],
            "notes": application.update_message or "Application updated",
            "created_by": user_id,
            "created_at": datetime.now().isoformat()
        }
        
        supabase_client.table("application_history").insert(history_data).execute()
        
        return {
            "success": True, 
            "message": "Application updated successfully"
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/applications/{application_id}/history")
async def get_application_history(application_id: str, current_user: dict = Depends(get_supabase_user)):
    """Get application history (processing team only)"""
    try:
        # Verify user is in processing team, admin, or the student who owns the application
        user_id = current_user.id
        user_role = None
        
        # Check processing team
        proc_response = supabase_client.table("processing_team").select("*").eq("id", user_id).execute()
        if proc_response and hasattr(proc_response, "data") and len(proc_response.data) > 0:
            user_role = "processing"
        
        # If not in processing team, check if admin
        if not user_role:
            admin_response = supabase_client.table("admins").select("*").eq("id", user_id).execute()
            if admin_response and hasattr(admin_response, "data") and len(admin_response.data) > 0:
                user_role = "admin"
        
        # Verify application exists
        app_response = supabase_client.table("applications").select("*").eq("id", application_id).execute()
        
        if not app_response or not hasattr(app_response, "data") or len(app_response.data) == 0:
            raise HTTPException(status_code=404, detail="Application not found")
        
        # If user is a student, check if they own the application
        if not user_role:
            student_id = app_response.data[0]["student_id"]
            if user_id != student_id:
                raise HTTPException(status_code=403, detail="Not authorized to view this application history")
        
        # Get application history
        history_response = supabase_client.table("application_history").select("*").eq("application_id", application_id).order("created_at", desc=True).execute()
        
        if not history_response or not hasattr(history_response, "data"):
            return []
        
        return history_response.data
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-recommendation/{student_id}")
async def generate_specific_recommendation(student_id: str, current_user: dict = Depends(get_supabase_user)):
    """Generate AI recommendations for a specific student (processing team only)"""
    try:
        # Verify user is in processing team or admin
        user_id = current_user.id
        user_role = None
        
        # Check processing team
        proc_response = supabase_client.table("processing_team").select("*").eq("id", user_id).execute()
        if proc_response and hasattr(proc_response, "data") and len(proc_response.data) > 0:
            user_role = "processing"
        
        # If not in processing team, check if admin
        if not user_role:
            admin_response = supabase_client.table("admins").select("*").eq("id", user_id).execute()
            if admin_response and hasattr(admin_response, "data") and len(admin_response.data) > 0:
                user_role = "admin"
        
        if not user_role or user_role not in ["processing", "admin"]:
            raise HTTPException(status_code=403, detail="Not authorized to generate recommendations")
        
        # Fetch student data
        student_response = supabase_client.table("students").select("*").eq("id", student_id).execute()
        
        if not student_response or not hasattr(student_response, "data") or len(student_response.data) == 0:
            raise HTTPException(status_code=404, detail="Student not found")
        
        student = student_response.data[0]
        
        # Get student's education history
        education_response = supabase_client.table("education").select("*").eq("student_id", student_id).execute()
        education = education_response.data if hasattr(education_response, "data") else []
        
        # Use the student data to create a recommendation (placeholder for now)
        recommendation = {
            "student_id": student_id,
            "created_by": user_id,
            "type": "university",
            "title": "University of Example",
            "subtitle": "MSc in Computer Science",
            "description": f"Based on {student['name']}'s profile, we recommend University of Example which offers excellent programs matching their academic background.",
            "match_percentage": 90,
            "details": {
                "location": "Example City",
                "tuition": "$20,000 per year",
                "duration": "2 years",
                "requirements": "Bachelor's degree, IELTS 6.5+",
                "notes": "This university has a high acceptance rate for international students with similar profiles."
            },
            "created_at": datetime.now().isoformat()
        }
        
        # Store recommendation in database
        result = supabase_client.table("recommendations").insert(recommendation).execute()
        
        if not result or not hasattr(result, "data") or len(result.data) == 0:
            raise HTTPException(status_code=500, detail="Failed to create recommendation")
        
        return {
            "success": True, 
            "message": "Recommendation generated successfully", 
            "recommendation": result.data[0]
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))
