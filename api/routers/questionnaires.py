
from fastapi import APIRouter, HTTPException, Request, status, Depends, Header
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
from datetime import datetime
import psycopg2
import psycopg2.extras
from api.db_utils import get_db_connection
from api.config import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD

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
    """Get the current user from JWT token"""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    try:
        # Extract the token from the Authorization header
        token = authorization.replace("Bearer ", "")
        
        # Verify token (simplified for now, should use proper JWT verification)
        # In a real implementation, you would verify the token and get the user ID
        from api.routers.auth import decode_access_token
        
        payload = decode_access_token(token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        user_id = payload.get('sub')
        
        # Get user from database
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        cur.execute("""
            SELECT * FROM users WHERE id = %s
        """, (user_id,))
        
        user = cur.fetchone()
        
        cur.close()
        conn.close()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        return dict(user)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication error: {str(e)}"
        )

@router.get("")
async def get_all_questionnaires(current_user: dict = Depends(get_supabase_user)):
    """Get all questionnaires available to the student"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        # Check if questionnaires table exists
        cur.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'questionnaires'
            )
        """)
        
        if not cur.fetchone()[0]:
            # Create questionnaires table if it doesn't exist
            cur.execute("""
                CREATE TABLE questionnaires (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    description TEXT,
                    questions JSONB NOT NULL,
                    is_required BOOLEAN DEFAULT TRUE,
                    destination_country VARCHAR(100),
                    education_level VARCHAR(100),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            conn.commit()
            cur.close()
            conn.close()
            return []
        
        # Get system questionnaires (available to all students)
        cur.execute("""
            SELECT * FROM questionnaires
        """)
        
        questionnaires = cur.fetchall()
        
        cur.close()
        conn.close()
        
        return [dict(q) for q in questionnaires] if questionnaires else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/student/{student_id}")
async def get_student_questionnaire_responses(student_id: str, current_user: dict = Depends(get_supabase_user)):
    """Get all questionnaire responses for a student"""
    try:
        # Verify user is fetching their own responses
        if student_id != str(current_user["id"]):
            # Check if user is admin
            if current_user["role"] != "admin":
                raise HTTPException(status_code=403, detail="Not authorized to view these responses")
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        # Check if questionnaire_responses table exists
        cur.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'questionnaire_responses'
            )
        """)
        
        if not cur.fetchone()[0]:
            # Create questionnaire_responses table if it doesn't exist
            cur.execute("""
                CREATE TABLE questionnaire_responses (
                    id SERIAL PRIMARY KEY,
                    student_id INTEGER NOT NULL,
                    questionnaire_id INTEGER NOT NULL,
                    responses JSONB NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id) ON DELETE CASCADE
                )
            """)
            conn.commit()
            cur.close()
            conn.close()
            return []
        
        # Get student's questionnaire responses
        cur.execute("""
            SELECT * FROM questionnaire_responses
            WHERE student_id = %s
        """, (student_id,))
        
        responses = cur.fetchall()
        
        cur.close()
        conn.close()
        
        return [dict(resp) for resp in responses] if responses else []
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/respond")
async def submit_questionnaire_response(response_data: QuestionnaireResponse, current_user: dict = Depends(get_supabase_user)):
    """Submit responses to a questionnaire"""
    try:
        # Verify user is submitting their own responses
        if response_data.student_id != str(current_user["id"]):
            raise HTTPException(status_code=403, detail="Not authorized to submit for this user")
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        # Check if questionnaires table exists
        cur.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'questionnaires'
            )
        """)
        
        table_exists = cur.fetchone()[0]
        
        if not table_exists:
            # Create questionnaires table if it doesn't exist
            cur.execute("""
                CREATE TABLE questionnaires (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    description TEXT,
                    questions JSONB NOT NULL,
                    is_required BOOLEAN DEFAULT TRUE,
                    destination_country VARCHAR(100),
                    education_level VARCHAR(100),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            conn.commit()
        
        # Check if questionnaire_responses table exists
        cur.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'questionnaire_responses'
            )
        """)
        
        table_exists = cur.fetchone()[0]
        
        if not table_exists:
            # Create questionnaire_responses table if it doesn't exist
            cur.execute("""
                CREATE TABLE questionnaire_responses (
                    id SERIAL PRIMARY KEY,
                    student_id INTEGER NOT NULL,
                    questionnaire_id INTEGER NOT NULL,
                    responses JSONB NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id) ON DELETE CASCADE
                )
            """)
            conn.commit()
        
        # Check if questionnaire exists
        cur.execute("""
            SELECT * FROM questionnaires
            WHERE id = %s
        """, (response_data.questionnaire_id,))
        
        questionnaire = cur.fetchone()
        
        if not questionnaire:
            cur.close()
            conn.close()
            raise HTTPException(status_code=404, detail="Questionnaire not found")
        
        # Check if student has already responded to this questionnaire
        cur.execute("""
            SELECT * FROM questionnaire_responses
            WHERE student_id = %s AND questionnaire_id = %s
        """, (response_data.student_id, response_data.questionnaire_id))
        
        existing_response = cur.fetchone()
        
        if existing_response:
            # Update existing response
            cur.execute("""
                UPDATE questionnaire_responses
                SET responses = %s, updated_at = %s
                WHERE student_id = %s AND questionnaire_id = %s
                RETURNING id
            """, (
                psycopg2.extras.Json(response_data.responses),
                datetime.now(),
                response_data.student_id,
                response_data.questionnaire_id
            ))
        else:
            # Create new response
            cur.execute("""
                INSERT INTO questionnaire_responses (
                    student_id, questionnaire_id, responses, created_at, updated_at
                )
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
            """, (
                response_data.student_id,
                response_data.questionnaire_id,
                psycopg2.extras.Json(response_data.responses),
                datetime.now(),
                datetime.now()
            ))
        
        response_id = cur.fetchone()[0]
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {"success": True, "message": "Questionnaire response submitted successfully"}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/required/{student_id}")
async def get_required_questionnaires(student_id: str, current_user: dict = Depends(get_supabase_user)):
    """Get all required questionnaires for a student that they haven't completed yet"""
    try:
        # Verify user is fetching their own required questionnaires
        if student_id != str(current_user["id"]):
            # Check if user is admin
            if current_user["role"] != "admin":
                raise HTTPException(status_code=403, detail="Not authorized to view these questionnaires")
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        # Get student profile to check preferred country and education level
        cur.execute("""
            SELECT * FROM users
            WHERE id = %s AND role = 'student'
        """, (student_id,))
        
        student = cur.fetchone()
        
        if not student:
            cur.close()
            conn.close()
            raise HTTPException(status_code=404, detail="Student not found")
        
        student_dict = dict(student)
        preferred_country = student_dict.get("preferred_country")
        education_level = student_dict.get("education_level")
        
        # Check if questionnaires table exists
        cur.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'questionnaires'
            )
        """)
        
        if not cur.fetchone()[0]:
            # Create questionnaires table if it doesn't exist
            cur.execute("""
                CREATE TABLE questionnaires (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    description TEXT,
                    questions JSONB NOT NULL,
                    is_required BOOLEAN DEFAULT TRUE,
                    destination_country VARCHAR(100),
                    education_level VARCHAR(100),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            conn.commit()
            cur.close()
            conn.close()
            return []
        
        # Get all required questionnaires
        cur.execute("""
            SELECT * FROM questionnaires
            WHERE is_required = TRUE
        """)
        
        questionnaires = cur.fetchall()
        
        # Check if questionnaire_responses table exists
        cur.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'questionnaire_responses'
            )
        """)
        
        table_exists = cur.fetchone()[0]
        
        completed_questionnaire_ids = []
        if table_exists:
            # Get all questionnaires already completed by the student
            cur.execute("""
                SELECT questionnaire_id FROM questionnaire_responses
                WHERE student_id = %s
            """, (student_id,))
            
            responses = cur.fetchall()
            completed_questionnaire_ids = [str(response["questionnaire_id"]) for response in responses] if responses else []
        
        cur.close()
        conn.close()
        
        # Filter questionnaires that are required for this student and not completed yet
        required_questionnaires = []
        for questionnaire in questionnaires:
            questionnaire_dict = dict(questionnaire)
            # Skip if already completed
            if str(questionnaire_dict["id"]) in completed_questionnaire_ids:
                continue
            
            # Check if questionnaire is applicable to student's preferred country and education level
            country_match = not questionnaire_dict.get("destination_country") or questionnaire_dict.get("destination_country") == preferred_country
            education_match = not questionnaire_dict.get("education_level") or questionnaire_dict.get("education_level") == education_level
            
            if country_match and education_match:
                required_questionnaires.append(questionnaire_dict)
        
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
        if student_id != str(current_user["id"]):
            # Check if user is admin
            if current_user["role"] != "admin":
                raise HTTPException(status_code=403, detail="Not authorized to check this profile")
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        # Get student profile data
        cur.execute("""
            SELECT * FROM users
            WHERE id = %s AND role = 'student'
        """, (student_id,))
        
        student = cur.fetchone()
        
        if not student:
            cur.close()
            conn.close()
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Get education history
        cur.execute("""
            SELECT * FROM education
            WHERE student_id = %s
        """, (student_id,))
        
        education_history = cur.fetchall()
        
        # Get documents
        cur.execute("""
            SELECT * FROM documents
            WHERE student_id = %s
        """, (student_id,))
        
        documents = cur.fetchall()
        
        # Check if questionnaire_responses table exists
        cur.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'questionnaire_responses'
            )
        """)
        
        questionnaire_responses = []
        required_questionnaires = []
        
        if cur.fetchone()[0]:
            # Get questionnaire responses
            cur.execute("""
                SELECT * FROM questionnaire_responses
                WHERE student_id = %s
            """, (student_id,))
            
            questionnaire_responses = cur.fetchall()
            
            # Get all required questionnaires
            cur.execute("""
                SELECT * FROM questionnaires
                WHERE is_required = TRUE
            """)
            
            required_questionnaires = cur.fetchall()
        
        cur.close()
        conn.close()
        
        # Calculate completeness
        student_dict = dict(student)
        profile_fields = ["name", "email", "phone", "address", "dob", "bio"]
        total_profile_fields = len(profile_fields)
        completed_profile_fields = sum(1 for field in profile_fields if student_dict.get(field))
        
        profile_percentage = int((completed_profile_fields / total_profile_fields) * 100)
        
        # Check required document types
        required_doc_types = ["passport", "academic_transcript", "cv_resume"]
        submitted_doc_types = set(doc["document_type"] for doc in documents) if documents else set()
        missing_docs = [doc_type for doc_type in required_doc_types if doc_type not in submitted_doc_types]
        
        # Calculate questionnaire completeness
        completed_questionnaire_ids = [str(response["questionnaire_id"]) for response in questionnaire_responses] if questionnaire_responses else []
        missing_questionnaires = [dict(q) for q in required_questionnaires if str(q["id"]) not in completed_questionnaire_ids] if required_questionnaires else []
        
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
                "profile_fields": [field for field in profile_fields if not student_dict.get(field)],
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
