
from fastapi import APIRouter, HTTPException, Request, status, UploadFile, File, Form, Depends, Header
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
import uuid
from datetime import datetime
import supabase
from api.config import SUPABASE_URL, SUPABASE_KEY

# Initialize Supabase client
supabase_client = supabase.create_client(SUPABASE_URL, SUPABASE_KEY)

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

@router.post("")
async def upload_document(document: DocumentUpload, current_user: dict = Depends(get_supabase_user)):
    """Upload a new document"""
    try:
        # Verify user owns this document
        if document.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to upload for this user")
            
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
async def get_student_documents(student_id: str, current_user: dict = Depends(get_supabase_user)):
    """Get all documents for a student"""
    try:
        # Verify user is fetching their own documents
        if student_id != current_user.id:
            # Check if user is admin
            user_response = supabase_client.table("admins").select("*").eq("id", current_user.id).execute()
            is_admin = user_response and hasattr(user_response, "data") and len(user_response.data) > 0
            
            if not is_admin:
                raise HTTPException(status_code=403, detail="Not authorized to view these documents")
        
        response = supabase_client.table("documents").select("*").eq("user_id", student_id).execute()
        
        if not response or not hasattr(response, "data"):
            raise HTTPException(status_code=500, detail="Failed to fetch documents")
        
        return response.data
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{document_id}/feedback")
async def update_document_feedback(document_id: str, feedback: DocumentFeedback, current_user: dict = Depends(get_supabase_user)):
    """Update document status and feedback"""
    try:
        # Check if user is admin
        user_response = supabase_client.table("admins").select("*").eq("id", current_user.id).execute()
        is_admin = user_response and hasattr(user_response, "data") and len(user_response.data) > 0
        
        if not is_admin:
            # Check if document belongs to current user
            doc_response = supabase_client.table("documents").select("user_id").eq("id", document_id).execute()
            if not doc_response or not hasattr(doc_response, "data") or len(doc_response.data) == 0 or doc_response.data[0]["user_id"] != current_user.id:
                raise HTTPException(status_code=403, detail="Not authorized to update this document")
        
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
async def get_document_categories(student_id: str, current_user: dict = Depends(get_supabase_user)):
    """Get document categories for a student"""
    try:
        # Verify user is fetching their own categories
        if student_id != current_user.id:
            # Check if user is admin
            user_response = supabase_client.table("admins").select("*").eq("id", current_user.id).execute()
            is_admin = user_response and hasattr(user_response, "data") and len(user_response.data) > 0
            
            if not is_admin:
                raise HTTPException(status_code=403, detail="Not authorized to view these categories")
        
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
async def create_document_category(category: DocumentCategory, current_user: dict = Depends(get_supabase_user)):
    """Create a new document category"""
    try:
        # If category has user_id, verify it's the current user
        if category.user_id and category.user_id != current_user.id:
            # Check if user is admin
            user_response = supabase_client.table("admins").select("*").eq("id", current_user.id).execute()
            is_admin = user_response and hasattr(user_response, "data") and len(user_response.data) > 0
            
            if not is_admin:
                raise HTTPException(status_code=403, detail="Not authorized to create category for this user")
        
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
