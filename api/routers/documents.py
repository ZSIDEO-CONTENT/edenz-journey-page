
from fastapi import APIRouter, HTTPException, Request, status, UploadFile, File, Form
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

router = APIRouter(prefix="/documents", tags=["documents"])

class DocumentUpload(BaseModel):
    name: str
    type: str  # "academic", "financial", "visa", "custom"
    file_url: str
    user_id: str
    status: str = "pending"
    feedback: Optional[str] = None
    category_id: Optional[str] = None
    custom_name: Optional[str] = None

class DocumentFeedback(BaseModel):
    status: str  # "approved", "rejected", "pending"
    feedback: str

class DocumentCategory(BaseModel):
    name: str
    description: str
    user_id: Optional[str] = None  # If null, it's a system category

@router.post("")
async def upload_document(document: DocumentUpload):
    """Upload a new document"""
    try:
        result = supabase_client.table("documents").insert({
            "name": document.name,
            "type": document.type,
            "file_url": document.file_url,
            "user_id": document.user_id,
            "status": document.status,
            "category_id": document.category_id,
            "custom_name": document.custom_name,
            "created_at": datetime.now().isoformat()
        }).execute()
        
        if result and hasattr(result, "data") and len(result.data) > 0:
            return {"success": True, "message": "Document uploaded successfully", "document_id": result.data[0]["id"]}
        
        raise HTTPException(status_code=500, detail="Failed to upload document")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{student_id}")
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

@router.put("/{document_id}/feedback")
async def update_document_feedback(document_id: str, feedback: DocumentFeedback):
    """Update document status and feedback"""
    try:
        result = supabase_client.table("documents").update({
            "status": feedback.status,
            "feedback": feedback.feedback,
            "updated_at": datetime.now().isoformat()
        }).eq("id", document_id).execute()
        
        if not result or not hasattr(result, "data") or len(result.data) == 0:
            raise HTTPException(status_code=404, detail="Document not found")
        
        return {"success": True, "message": "Document feedback updated successfully"}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/categories/{student_id}")
async def get_document_categories(student_id: str):
    """Get document categories for a student"""
    try:
        # Get system categories first
        system_categories = supabase_client.table("document_categories").select("*").is_("user_id", "null").execute()
        
        # Get student custom categories
        user_categories = supabase_client.table("document_categories").select("*").eq("user_id", student_id).execute()
        
        # Combine results
        categories = []
        if system_categories and hasattr(system_categories, "data"):
            categories.extend(system_categories.data)
        
        if user_categories and hasattr(user_categories, "data"):
            categories.extend(user_categories.data)
        
        return categories
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/categories")
async def create_document_category(category: DocumentCategory):
    """Create a new document category"""
    try:
        result = supabase_client.table("document_categories").insert({
            "name": category.name,
            "description": category.description,
            "user_id": category.user_id,
            "created_at": datetime.now().isoformat()
        }).execute()
        
        if result and hasattr(result, "data") and len(result.data) > 0:
            return {"success": True, "message": "Category created successfully", "category_id": result.data[0]["id"]}
        
        raise HTTPException(status_code=500, detail="Failed to create category")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))
