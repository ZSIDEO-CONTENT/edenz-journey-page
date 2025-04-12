
from fastapi import APIRouter, HTTPException, Request, status, UploadFile, File, Form, Depends, Header
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
import uuid
from datetime import datetime
import psycopg2
import psycopg2.extras
from api.db_utils import get_db_connection
from api.config import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD

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
            conn = get_db_connection()
            cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
            
            cur.execute("""
                SELECT * FROM users 
                WHERE id = %s AND role = 'admin'
            """, (current_user.id,))
            
            is_admin = cur.fetchone() is not None
            
            cur.close()
            conn.close()
            
            if not is_admin:
                raise HTTPException(status_code=403, detail="Not authorized to view these documents")
        
        # If destination country not provided, get it from student profile
        if not destination_country:
            conn = get_db_connection()
            cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
            
            cur.execute("""
                SELECT preferred_country FROM users
                WHERE id = %s AND role = 'student'
            """, (student_id,))
            
            student = cur.fetchone()
            
            cur.close()
            conn.close()
            
            if not student:
                raise HTTPException(status_code=404, detail="Student not found")
            
            destination_country = student.get("preferred_country")
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        # Check if required_documents table exists
        cur.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'required_documents'
            )
        """)
        
        table_exists = cur.fetchone()[0]
        
        if not table_exists:
            # Create required_documents table if it doesn't exist
            cur.execute("""
                CREATE TABLE required_documents (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    type VARCHAR(100) NOT NULL,
                    description TEXT,
                    country_code VARCHAR(10),
                    is_required BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            conn.commit()
        
        # Get base required documents (required for all countries)
        cur.execute("""
            SELECT * FROM required_documents
            WHERE country_code IS NULL
        """)
        
        base_required_docs = cur.fetchall()
        
        # Get country-specific required documents
        country_docs = []
        if destination_country:
            cur.execute("""
                SELECT * FROM required_documents
                WHERE country_code = %s
            """, (destination_country.lower(),))
            
            country_docs = cur.fetchall()
        
        # Combine both sets of documents, with country-specific ones overriding base ones
        all_required_docs = [dict(doc) for doc in base_required_docs]
        
        # Add country-specific docs, overriding base docs with the same type
        for doc in country_docs:
            doc_dict = dict(doc)
            # Check if this document type already exists in base docs
            existing_index = next((i for i, base_doc in enumerate(all_required_docs) if base_doc["type"] == doc_dict["type"]), None)
            
            if existing_index is not None:
                # Replace the base doc with the country-specific one
                all_required_docs[existing_index] = doc_dict
            else:
                # Add new country-specific doc
                all_required_docs.append(doc_dict)
        
        # Get documents already submitted by student
        cur.execute("""
            SELECT * FROM documents
            WHERE student_id = %s
        """, (student_id,))
        
        submitted_docs = cur.fetchall()
        
        cur.close()
        conn.close()
        
        # Create a dictionary of submitted docs by type
        submitted_docs_by_type = {}
        for doc in submitted_docs:
            doc_dict = dict(doc)
            submitted_docs_by_type[doc_dict["document_type"]] = doc_dict
        
        # Mark required documents as submitted or not
        required_docs_with_status = []
        for doc in all_required_docs:
            doc_copy = doc.copy()
            doc_copy["submitted"] = doc["type"] in submitted_docs_by_type
            
            if doc_copy["submitted"]:
                doc_copy["document_id"] = submitted_docs_by_type[doc["type"]]["id"]
                doc_copy["status"] = submitted_docs_by_type[doc["type"]]["status"]
                doc_copy["feedback"] = submitted_docs_by_type[doc["type"]]["feedback"]
            
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
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        cur.execute("""
            SELECT * FROM users 
            WHERE id = %s AND role = 'admin'
        """, (current_user.id,))
        
        is_admin = cur.fetchone() is not None
        
        if not is_admin:
            cur.close()
            conn.close()
            raise HTTPException(status_code=403, detail="Not authorized to verify documents")
        
        # Check if document_verifications table exists
        cur.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'document_verifications'
            )
        """)
        
        table_exists = cur.fetchone()[0]
        
        if not table_exists:
            # Create document_verifications table if it doesn't exist
            cur.execute("""
                CREATE TABLE document_verifications (
                    id SERIAL PRIMARY KEY,
                    document_id INTEGER NOT NULL,
                    verification_result JSONB NOT NULL,
                    verification_status VARCHAR(50) NOT NULL,
                    officer_id INTEGER,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
                    FOREIGN KEY (officer_id) REFERENCES users(id) ON DELETE SET NULL
                )
            """)
            conn.commit()
        
        # Update the document verification status
        cur.execute("""
            UPDATE documents
            SET status = %s, 
                updated_at = %s
            WHERE id = %s
            RETURNING id
        """, (verification.verification_status, datetime.now(), document_id))
        
        updated_doc = cur.fetchone()
        
        if not updated_doc:
            cur.close()
            conn.close()
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Add feedback if verification failed or needs manual review
        if verification.verification_status == "failed":
            cur.execute("""
                UPDATE documents
                SET feedback = 'Document verification failed. Please check the issues and resubmit.'
                WHERE id = %s
            """, (document_id,))
        elif verification.verification_status == "manual_review":
            cur.execute("""
                UPDATE documents
                SET feedback = 'Document requires manual review by our team.'
                WHERE id = %s
            """, (document_id,))
        
        # Store verification data
        cur.execute("""
            INSERT INTO document_verifications (
                document_id, verification_result, verification_status, officer_id, created_at
            )
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
        """, (
            document_id,
            psycopg2.extras.Json(verification.verification_result),
            verification.verification_status,
            verification.officer_id or current_user.id,
            datetime.now()
        ))
        
        verification_id = cur.fetchone()[0]
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {"success": True, "message": "Document verification recorded successfully"}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/templates/{document_type}")
async def get_document_template(document_type: str, current_user: dict = Depends(get_supabase_user)):
    """Get a template or example for a specific document type"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        # Check if document_templates table exists
        cur.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'document_templates'
            )
        """)
        
        table_exists = cur.fetchone()[0]
        
        if not table_exists:
            # Create document_templates table if it doesn't exist
            cur.execute("""
                CREATE TABLE document_templates (
                    id SERIAL PRIMARY KEY,
                    document_type VARCHAR(100) NOT NULL UNIQUE,
                    title VARCHAR(255) NOT NULL,
                    description TEXT,
                    sample_url TEXT,
                    instructions TEXT,
                    common_mistakes TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            conn.commit()
            cur.close()
            conn.close()
            raise HTTPException(status_code=404, detail=f"Template for {document_type} not found")
        
        # Get the template from the database
        cur.execute("""
            SELECT * FROM document_templates
            WHERE document_type = %s
        """, (document_type,))
        
        template = cur.fetchone()
        
        cur.close()
        conn.close()
        
        if not template:
            raise HTTPException(status_code=404, detail=f"Template for {document_type} not found")
        
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
