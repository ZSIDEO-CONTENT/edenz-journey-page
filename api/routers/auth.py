
from fastapi import APIRouter, HTTPException, Request, status, Depends, Header
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
from datetime import datetime, timedelta
import supabase
from api.config import SUPABASE_URL, SUPABASE_KEY, JWT_SECRET, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from jose import JWTError, jwt

# Initialize Supabase client
supabase_client = supabase.create_client(SUPABASE_URL, SUPABASE_KEY)

# Initialize OAuth2 Bearer for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

router = APIRouter(prefix="/auth", tags=["auth"])

class Token(BaseModel):
    access_token: str
    token_type: str
    user: Dict[str, Any]

class UserAuth(BaseModel):
    email: str
    password: str
    role: Optional[str] = "student"

class StudentRegister(BaseModel):
    name: str
    email: str
    password: str
    phone: str

# Helper function to create JWT token
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

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

@router.post("/register/student", status_code=status.HTTP_201_CREATED)
async def register_student(user: StudentRegister):
    """Register a new student"""
    try:
        # Register with Supabase Auth
        response = supabase_client.auth.sign_up({
            "email": user.email,
            "password": user.password,
        })
        
        if not response or not hasattr(response, "user") or not response.user:
            raise HTTPException(status_code=400, detail="Registration failed")
        
        # Add additional user data to students table
        result = supabase_client.table("students").insert({
            "id": response.user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "created_at": datetime.now().isoformat()
        }).execute()
        
        return {"success": True, "message": "Student registered successfully"}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login and get an access token"""
    try:
        # Sign in with Supabase Auth
        response = supabase_client.auth.sign_in_with_password({
            "email": form_data.username,
            "password": form_data.password
        })
        
        if not response or not hasattr(response, "user") or not response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )
        
        # Get user details from students table
        user_id = response.user.id
        user_data_response = supabase_client.table("students").select("*").eq("id", user_id).execute()
        
        if not user_data_response or not hasattr(user_data_response, "data") or len(user_data_response.data) == 0:
            # If not found in students, check admins
            user_data_response = supabase_client.table("admins").select("*").eq("id", user_id).execute()
            
        if user_data_response and hasattr(user_data_response, "data") and len(user_data_response.data) > 0:
            user_data = user_data_response.data[0]
        else:
            user_data = {"id": user_id, "email": response.user.email, "role": "student"}
        
        # Return token and user info
        return {
            "access_token": response.session.access_token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "email": user_data.get("email", response.user.email),
                "name": user_data.get("name", ""),
                "role": user_data.get("role", "student")
            }
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication error: {str(e)}",
        )

@router.get("/me")
async def read_users_me(current_user: dict = Depends(get_supabase_user)):
    """Get current user profile"""
    try:
        # Get user data from students table
        user_id = current_user.id
        user_response = supabase_client.table("students").select("*").eq("id", user_id).execute()
        
        if not user_response or not hasattr(user_response, "data") or len(user_response.data) == 0:
            # If not found in students, check admins
            user_response = supabase_client.table("admins").select("*").eq("id", user_id).execute()
        
        if user_response and hasattr(user_response, "data") and len(user_response.data) > 0:
            user_data = user_response.data[0]
            return {
                "id": user_id,
                "email": user_data.get("email", current_user.email),
                "name": user_data.get("name", ""),
                "role": user_data.get("role", "student")
            }
        
        return {
            "id": user_id,
            "email": current_user.email,
            "name": "",
            "role": "student"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching user data: {str(e)}")
