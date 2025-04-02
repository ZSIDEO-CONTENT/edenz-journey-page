
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


class Document(BaseModel):
    name: str
    type: str
    file_url: str
    user_id: str
    status: str = "pending"
    feedback: Optional[str] = None
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


@router.get("/profile/{student_id}")
async def get_student_profile(student_id: str, current_user: dict = Depends(get_supabase_user)):
    """Get a student's profile"""
    try:
        # Verify user is fetching their own profile or is an admin
        if student_id != current_user.id:
            # Check if user is admin
            user_response = supabase_client.table("admins").select("*").eq("id", current_user.id).execute()
            is_admin = user_response and hasattr(user_response, "data") and len(user_response.data) > 0
            
            if not is_admin:
                raise HTTPException(status_code=403, detail="Not authorized to view this profile")
        
        response = supabase_client.table("students").select("*").eq("id", student_id).execute()
        
        if not response or not hasattr(response, "data") or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Student not found")
        
        student = response.data[0]
        
        return {
            "id": student["id"],
            "name": student["name"],
            "email": student["email"],
            "phone": student.get("phone"),
            "address": student.get("address"),
            "dob": student.get("dob"),
            "bio": student.get("bio"),
            "profile_picture": student.get("profile_picture")
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))


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
    try:
        # Verify user is fetching their own education
        if student_id != current_user.id:
            # Check if user is admin
            user_response = supabase_client.table("admins").select("*").eq("id", current_user.id).execute()
            is_admin = user_response and hasattr(user_response, "data") and len(user_response.data) > 0
            
            if not is_admin:
                raise HTTPException(status_code=403, detail="Not authorized to view this education data")
        
        response = supabase_client.table("education").select("*").eq("student_id", student_id).execute()
        
        if not response or not hasattr(response, "data"):
            return []
        
        return response.data
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/education")
async def add_education(
    student_id: str,
    degree: str,
    institution: str,
    year_completed: str,
    gpa: str,
    current_user: dict = Depends(get_supabase_user)
):
    """Add education entry for a student"""
    try:
        # Verify user is adding to their own profile
        if student_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to update this profile")
        
        result = supabase_client.table("education").insert({
            "student_id": student_id,
            "degree": degree,
            "institution": institution,
            "year_completed": year_completed,
            "gpa": gpa,
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
    try:
        # Verify user is fetching their own applications
        if student_id != current_user.id:
            # Check if user is admin
            user_response = supabase_client.table("admins").select("*").eq("id", current_user.id).execute()
            is_admin = user_response and hasattr(user_response, "data") and len(user_response.data) > 0
            
            if not is_admin:
                raise HTTPException(status_code=403, detail="Not authorized to view these applications")
        
        response = supabase_client.table("applications").select("*").eq("student_id", student_id).execute()
        
        if not response or not hasattr(response, "data"):
            return []
        
        return response.data
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

