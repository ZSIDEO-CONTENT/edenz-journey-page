
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

class DocumentVerification(BaseModel):
    document_id: str
    verification_result: Dict[str, Any]
    verification_status: str  # "verified", "failed", "manual_review"
    officer_id: Optional[str] = None

async def get_supabase_user(authorization: Optional[str] = Header(None)):
    """Get the current user from Supabase token"""
    # ... keep existing code (authentication function)

@router.post("")
async def upload_document(document: DocumentUpload, current_user: dict = Depends(get_supabase_user)):
    """Upload a new document"""
    # ... keep existing code (upload document function)

@router.get("/{student_id}")
async def get_student_documents(student_id: str, current_user: dict = Depends(get_supabase_user)):
    """Get all documents for a student"""
    # ... keep existing code (get documents function)

@router.put("/{document_id}/feedback")
async def update_document_feedback(document_id: str, feedback: DocumentFeedback, current_user: dict = Depends(get_supabase_user)):
    """Update document status and feedback"""
    # ... keep existing code (feedback function)

@router.get("/categories/{student_id}")
async def get_document_categories(student_id: str, current_user: dict = Depends(get_supabase_user)):
    """Get document categories for a student"""
    # ... keep existing code (get categories function)

@router.post("/categories")
async def create_document_category(category: DocumentCategory, current_user: dict = Depends(get_supabase_user)):
    """Create a new document category"""
    # ... keep existing code (create category function)

@router.get("/required/{student_id}")
async def get_required_documents(student_id: str, destination_country: Optional[str] = None, current_user: dict = Depends(get_supabase_user)):
    """Get required documents for a student based on their destination country"""
    try:
        # Verify user is fetching their own required documents
        if student_id != current_user.id:
            # Check if user is admin
            user_response = supabase_client.table("admins").select("*").eq("id", current_user.id).execute()
            is_admin = user_response and hasattr(user_response, "data") and len(user_response.data) > 0
            
            if not is_admin:
                raise HTTPException(status_code=403, detail="Not authorized to view these documents")
        
        # If destination country not provided, get it from student profile
        if not destination_country:
            student_response = supabase_client.table("students").select("preferred_country").eq("id", student_id).execute()
            
            if not student_response or not hasattr(student_response, "data") or len(student_response.data) == 0:
                raise HTTPException(status_code=404, detail="Student not found")
            
            destination_country = student_response.data[0].get("preferred_country")
        
        # Get base required documents (required for all countries)
        base_docs_response = supabase_client.table("required_documents").select("*").is_("country_code", "null").execute()
        
        base_required_docs = []
        if base_docs_response and hasattr(base_docs_response, "data"):
            base_required_docs = base_docs_response.data
        
        # Get country-specific required documents
        country_docs = []
        if destination_country:
            country_docs_response = supabase_client.table("required_documents").select("*").eq("country_code", destination_country.lower()).execute()
            
            if country_docs_response and hasattr(country_docs_response, "data"):
                country_docs = country_docs_response.data
        
        # Combine both sets of documents, with country-specific ones overriding base ones
        all_required_docs = base_required_docs.copy()
        
        # Add country-specific docs, overriding base docs with the same type
        for doc in country_docs:
            # Check if this document type already exists in base docs
            existing_index = next((i for i, base_doc in enumerate(all_required_docs) if base_doc["type"] == doc["type"]), None)
            
            if existing_index is not None:
                # Replace the base doc with the country-specific one
                all_required_docs[existing_index] = doc
            else:
                # Add new country-specific doc
                all_required_docs.append(doc)
        
        # Get documents already submitted by student
        submitted_docs_response = supabase_client.table("documents").select("*").eq("user_id", student_id).execute()
        
        submitted_docs = {}
        if submitted_docs_response and hasattr(submitted_docs_response, "data"):
            for doc in submitted_docs_response.data:
                submitted_docs[doc["type"]] = doc
        
        # Mark required documents as submitted or not
        required_docs_with_status = []
        for doc in all_required_docs:
            doc_copy = doc.copy()
            doc_copy["submitted"] = doc["type"] in submitted_docs
            
            if doc_copy["submitted"]:
                doc_copy["document_id"] = submitted_docs[doc["type"]]["id"]
                doc_copy["status"] = submitted_docs[doc["type"]]["status"]
                doc_copy["feedback"] = submitted_docs[doc["type"]]["feedback"]
            
            required_docs_with_status.append(doc_copy)
        
        return required_docs_with_status
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{document_id}/verify")
async def verify_document(document_id: str, verification: DocumentVerification, current_user: dict = Depends(get_supabase_user)):
    """Record verification results for a document (admin only)"""
    try:
        # Check if user is admin
        user_response = supabase_client.table("admins").select("*").eq("id", current_user.id).execute()
        is_admin = user_response and hasattr(user_response, "data") and len(user_response.data) > 0
        
        if not is_admin:
            raise HTTPException(status_code=403, detail="Not authorized to verify documents")
        
        # Update the document verification status
        doc_update = {
            "status": verification.verification_status,
            "updated_at": datetime.now().isoformat()
        }
        
        if verification.verification_status == "failed":
            doc_update["feedback"] = "Document verification failed. Please check the issues and resubmit."
        elif verification.verification_status == "manual_review":
            doc_update["feedback"] = "Document requires manual review by our team."
        
        # Update the document
        doc_result = supabase_client.table("documents").update(doc_update).eq("id", document_id).execute()
        
        if not doc_result or not hasattr(doc_result, "data") or len(doc_result.data) == 0:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Store verification data
        verify_result = supabase_client.table("document_verifications").insert({
            "document_id": document_id,
            "verification_result": verification.verification_result,
            "verification_status": verification.verification_status,
            "officer_id": verification.officer_id or current_user.id,
            "created_at": datetime.now().isoformat()
        }).execute()
        
        if not verify_result or not hasattr(verify_result, "data"):
            raise HTTPException(status_code=500, detail="Failed to store verification data")
        
        return {"success": True, "message": "Document verification recorded successfully"}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/templates/{document_type}")
async def get_document_template(document_type: str, current_user: dict = Depends(get_supabase_user)):
    """Get a template or example for a specific document type"""
    try:
        # Get the template from the database
        template_response = supabase_client.table("document_templates").select("*").eq("document_type", document_type).execute()
        
        if not template_response or not hasattr(template_response, "data") or len(template_response.data) == 0:
            raise HTTPException(status_code=404, detail=f"Template for {document_type} not found")
        
        template = template_response.data[0]
        
        return {
            "document_type": template["document_type"],
            "title": template["title"],
            "description": template["description"],
            "sample_url": template["sample_url"],
            "instructions": template["instructions"],
            "common_mistakes": template["common_mistakes"]
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))
