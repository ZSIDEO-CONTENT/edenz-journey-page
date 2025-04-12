from fastapi import APIRouter, HTTPException, Request, status, Depends, Header
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
from datetime import datetime
import psycopg2
import psycopg2.extras
from api.config import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
from api.db_utils import get_db_connection

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


async def get_current_user(authorization: Optional[str] = Header(None)):
    """Get the current user from JWT token"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # This function should be imported from auth.py
    # For now, we'll use a simplified version
    from api.routers.auth import decode_access_token
    
    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user from database
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    cur.execute("SELECT * FROM users WHERE id = %s", (payload.get("sub"),))
    user = cur.fetchone()
    
    cur.close()
    conn.close()
    
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    return dict(user)


@router.get("/profile/{student_id}")
async def get_student_profile(student_id: str, current_user: dict = Depends(get_current_user)):
    """Get a student's profile"""
    try:
        # Verify user is viewing their own profile or is an admin
        if student_id != str(current_user["id"]):
            # Check if user is admin
            if current_user["role"] != "admin":
                raise HTTPException(status_code=403, detail="Not authorized to view this profile")
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        # Get student profile from users table
        cur.execute("""
            SELECT id, name, email, phone, 
                address, dob, bio, profile_picture, 
                preferred_country, education_level, funding_source, 
                budget, travel_history, visa_rejections, 
                family_abroad, is_first_time_consultation, 
                consultation_goals, created_at, role
            FROM users
            WHERE id = %s AND role = 'student'
        """, (student_id,))
        
        student = cur.fetchone()
        
        cur.close()
        conn.close()
        
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        return dict(student)
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/profile/{student_id}")
async def update_student_profile(student_id: str, profile: StudentProfile, current_user: dict = Depends(get_current_user)):
    """Update a student's profile"""
    try:
        # Verify user is updating their own profile or is an admin
        if student_id != str(current_user["id"]):
            # Check if user is admin
            if current_user["role"] != "admin":
                raise HTTPException(status_code=403, detail="Not authorized to update this profile")
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        # Update student profile
        cur.execute("""
            UPDATE users
            SET name = %s, email = %s, phone = %s,
                address = %s, dob = %s, bio = %s,
                profile_picture = %s, preferred_country = %s,
                education_level = %s, funding_source = %s,
                budget = %s, travel_history = %s,
                visa_rejections = %s, family_abroad = %s,
                is_first_time_consultation = %s, consultation_goals = %s
            WHERE id = %s AND role = 'student'
            RETURNING id
        """, (
            profile.name,
            profile.email,
            profile.phone,
            profile.address,
            profile.dob,
            profile.bio,
            profile.profile_picture,
            profile.preferred_country,
            profile.education_level,
            profile.funding_source,
            profile.budget,
            profile.travel_history,
            profile.visa_rejections,
            profile.family_abroad,
            profile.is_first_time_consultation,
            profile.consultation_goals,
            student_id
        ))
        
        updated = cur.fetchone()
        
        conn.commit()
        cur.close()
        conn.close()
        
        if not updated:
            raise HTTPException(status_code=404, detail="Student not found")
        
        return {"success": True, "message": "Profile updated successfully"}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/education/{student_id}")
async def get_student_education(student_id: str, current_user: dict = Depends(get_current_user)):
    """Get education history for a student"""
    try:
        # Verify user is viewing their own education or is an admin
        if student_id != str(current_user["id"]):
            # Check if user is admin
            if current_user["role"] != "admin":
                raise HTTPException(status_code=403, detail="Not authorized to view this profile")
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        # Get student education from education table
        cur.execute("""
            SELECT id, student_id, degree, institution, 
                year_completed, gpa, country, major, 
                start_date, end_date, documents, created_at
            FROM education
            WHERE student_id = %s
            ORDER BY created_at DESC
        """, (student_id,))
        
        education_entries = cur.fetchall()
        
        cur.close()
        conn.close()
        
        # Convert to list of dictionaries
        result = [dict(entry) for entry in education_entries]
        
        return result
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/education")
async def add_education(
    education: EducationEntry,
    student_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Add education entry for a student"""
    try:
        # Verify user is adding to their own profile or is an admin
        if student_id != str(current_user["id"]):
            # Check if user is admin
            if current_user["role"] != "admin":
                raise HTTPException(status_code=403, detail="Not authorized to update this profile")
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        # Insert education entry
        cur.execute("""
            INSERT INTO education (
                student_id, degree, institution, year_completed,
                gpa, country, major, start_date, end_date, documents
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            ) RETURNING id
        """, (
            student_id,
            education.degree,
            education.institution,
            education.year_completed,
            education.gpa,
            education.country,
            education.major,
            education.start_date,
            education.end_date,
            education.documents
        ))
        
        new_id = cur.fetchone()[0]
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {"success": True, "message": "Education added successfully", "id": new_id}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/applications/{student_id}")
async def get_student_applications(student_id: str, current_user: dict = Depends(get_current_user)):
    """Get applications for a student"""
    try:
        # Verify user is viewing their own applications or is an admin/processing
        if student_id != str(current_user["id"]):
            # Check if user is admin or processing
            if current_user["role"] not in ["admin", "processing"]:
                raise HTTPException(status_code=403, detail="Not authorized to view these applications")
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        # Get applications from applications table
        cur.execute("""
            SELECT id, student_id, university_name, program_name, 
                status, progress, created_at, updated_at
            FROM applications
            WHERE student_id = %s
            ORDER BY updated_at DESC
        """, (student_id,))
        
        applications = cur.fetchall()
        
        cur.close()
        conn.close()
        
        # Convert to list of dictionaries
        result = [dict(app) for app in applications]
        
        return result
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/onboarding-steps/{student_id}")
async def get_onboarding_steps(student_id: str, current_user: dict = Depends(get_current_user)):
    """Get onboarding steps for a new student"""
    try:
        # Verify user is fetching their own onboarding steps or is an admin
        if student_id != str(current_user["id"]):
            # Check if user is admin
            if current_user["role"] != "admin":
                raise HTTPException(status_code=403, detail="Not authorized to view these onboarding steps")
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        # Get student profile
        cur.execute("""
            SELECT id, name, email, phone, address, dob
            FROM users
            WHERE id = %s AND role = 'student'
        """, (student_id,))
        
        student = cur.fetchone()
        
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Get education history
        cur.execute("""
            SELECT COUNT(*) as count
            FROM education
            WHERE student_id = %s
        """, (student_id,))
        
        education_count = cur.fetchone()["count"]
        has_education = education_count > 0
        
        # Get documents
        cur.execute("""
            SELECT id, document_type as type, file_path, status
            FROM documents
            WHERE student_id = %s
        """, (student_id,))
        
        documents = cur.fetchall()
        
        # Get questionnaire completion status (if table exists)
        try:
            cur.execute("""
                SELECT id 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'questionnaires'
            """)
            has_questionnaires_table = cur.fetchone() is not None
            
            has_questionnaire = False
            missing_questionnaires = []
            
            if has_questionnaires_table:
                # Get required questionnaires
                cur.execute("""
                    SELECT id, title 
                    FROM questionnaires 
                    WHERE is_required = TRUE
                """)
                required_questionnaires = cur.fetchall()
                
                # Get completed questionnaire IDs
                cur.execute("""
                    SELECT DISTINCT questionnaire_id 
                    FROM questionnaire_responses 
                    WHERE student_id = %s
                """, (student_id,))
                completed_questionnaire_ids = [row["questionnaire_id"] for row in cur.fetchall()]
                
                # Check if all required questionnaires are completed
                all_completed = True
                for q in required_questionnaires:
                    if q["id"] not in completed_questionnaire_ids:
                        all_completed = False
                        missing_questionnaires.append({"id": q["id"], "title": q["title"]})
                
                has_questionnaire = all_completed
        except Exception as e:
            print(f"Error getting questionnaire status: {str(e)}")
            has_questionnaire = False
            missing_questionnaires = []
        
        # Get consultation booking status (if table exists)
        try:
            cur.execute("""
                SELECT COUNT(*) as count 
                FROM consultations 
                WHERE student_id = %s
            """, (student_id,))
            has_consultation = cur.fetchone()["count"] > 0
        except Exception as e:
            print(f"Error checking consultation status: {str(e)}")
            has_consultation = False
        
        cur.close()
        conn.close()
        
        # Define required document types
        required_doc_types = ["passport", "academic_transcript", "cv_resume"]
        submitted_doc_types = [doc["type"] for doc in documents] if documents else []
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
                "completed": has_questionnaire,
                "required": True,
                "missing": missing_questionnaires if missing_questionnaires else None,
                "link": "/student/questionnaires"
            },
            {
                "id": "consultation",
                "title": "Book a Consultation",
                "description": "Schedule a meeting with our education consultant",
                "completed": has_consultation,
                "required": True,
                "link": "/student/consultations"
            }
        ]
        
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
async def get_destination_guide(destination_country: str, current_user: dict = Depends(get_current_user)):
    """Get application guide for a specific destination country"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        # Get the guide information from the database
        cur.execute("""
            SELECT * 
            FROM destination_guides 
            WHERE country_code = %s
        """, (destination_country.lower(),))
        
        guide = cur.fetchone()
        
        if not guide:
            raise HTTPException(status_code=404, detail=f"Guide for {destination_country} not found")
        
        # Get required documents for this destination
        cur.execute("""
            SELECT * 
            FROM destination_documents 
            WHERE country_code = %s
        """, (destination_country.lower(),))
        
        required_documents = cur.fetchall()
        
        # Get frequently asked questions for this destination
        cur.execute("""
            SELECT * 
            FROM destination_faqs 
            WHERE country_code = %s
        """, (destination_country.lower(),))
        
        faqs = cur.fetchall()
        
        cur.close()
        conn.close()
        
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
            "required_documents": [dict(doc) for doc in required_documents],
            "faqs": [dict(faq) for faq in faqs],
            "updated_at": guide["updated_at"]
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/subscription-status/{student_id}")
async def check_subscription_status(student_id: str, current_user: dict = Depends(get_current_user)):
    """Check if a student has an active subscription package"""
    try:
        # Verify user is checking their own subscription or is an admin
        if student_id != str(current_user["id"]):
            # Check if user is admin
            if current_user["role"] != "admin":
                raise HTTPException(status_code=403, detail="Not authorized to check this subscription")
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        # Get student subscriptions
        cur.execute("""
            SELECT * 
            FROM student_subscriptions 
            WHERE student_id = %s 
            ORDER BY created_at DESC 
            LIMIT 1
        """, (student_id,))
        
        subscription = cur.fetchone()
        
        cur.close()
        conn.close()
        
        if not subscription:
            return {
                "has_subscription": False,
                "subscription": None
            }
        
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
