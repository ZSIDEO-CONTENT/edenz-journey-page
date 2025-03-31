
from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
import uuid
from datetime import datetime
import supabase

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL", "https://vxievjimtordkobtuink.supabase.co")
supabase_key = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4aWV2amltdG9yZGtvYnR1aW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwOTEyNDEsImV4cCI6MjA1ODY2NzI0MX0.h_YWBX9nhfGlq6MaR3jSDu56CagNpoprBgqiXwjhJAI")
supabase_client = supabase.create_client(supabase_url, supabase_key)

router = APIRouter(prefix="/student", tags=["student"])


class StudentRegister(BaseModel):
    name: str
    email: str
    password: str
    phone: str
    created_at: Optional[datetime] = None
    

class StudentLogin(BaseModel):
    email: str
    password: str


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


@router.post("/register")
async def register_student(student: StudentRegister):
    """Register a new student"""
    try:
        # Check if user already exists
        response = supabase_client.table("students").select("*").eq("email", student.email).execute()
        
        if response and hasattr(response, "data") and len(response.data) > 0:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create a new student
        result = supabase_client.table("students").insert({
            "name": student.name,
            "email": student.email,
            "password": student.password,  # In production, hash this password
            "phone": student.phone,
            "created_at": datetime.now().isoformat()
        }).execute()
        
        if result and hasattr(result, "data") and len(result.data) > 0:
            return {"success": True, "message": "Student registered successfully"}
        
        raise HTTPException(status_code=500, detail="Failed to register student")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/login")
async def login_student(login: StudentLogin):
    """Login a student"""
    try:
        # In production, verify hashed password instead
        response = supabase_client.table("students").select("*").eq("email", login.email).eq("password", login.password).execute()
        
        if not response or not hasattr(response, "data") or len(response.data) == 0:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        student = response.data[0]
        
        # Generate a token (in production, use a proper JWT)
        token = str(uuid.uuid4())
        
        return {
            "token": token,
            "user": {
                "id": student["id"],
                "name": student["name"],
                "email": student["email"],
                "phone": student["phone"]
            }
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/profile/{student_id}")
async def get_student_profile(student_id: str):
    """Get a student's profile"""
    try:
        response = supabase_client.table("students").select("*").eq("id", student_id).execute()
        
        if not response or not hasattr(response, "data") or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Student not found")
        
        student = response.data[0]
        
        return {
            "id": student["id"],
            "name": student["name"],
            "email": student["email"],
            "phone": student["phone"],
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
async def update_student_profile(student_id: str, profile: StudentProfile):
    """Update a student's profile"""
    try:
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


@router.post("/document")
async def upload_document(document: Document):
    """Upload a new document"""
    try:
        result = supabase_client.table("documents").insert({
            "name": document.name,
            "type": document.type,
            "file_url": document.file_url,
            "user_id": document.user_id,
            "status": document.status,
            "created_at": datetime.now().isoformat()
        }).execute()
        
        if result and hasattr(result, "data") and len(result.data) > 0:
            return {"success": True, "message": "Document uploaded successfully", "document_id": result.data[0]["id"]}
        
        raise HTTPException(status_code=500, detail="Failed to upload document")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/documents/{student_id}")
async def get_student_documents(student_id: str):
    """Get all documents for a student"""
    try:
        response = supabase_client.table("documents").select("*").eq("user_id", student_id).execute()
        
        if not response or not hasattr(response, "data"):
            raise HTTPException(status_code=500, detail="Failed to fetch documents")
        
        return response.data
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))
