
from fastapi import APIRouter, HTTPException, Request, status, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
import uuid
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import supabase

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL", "https://vxievjimtordkobtuink.supabase.co")
supabase_key = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4aWV2amltdG9yZGtvYnR1aW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwOTEyNDEsImV4cCI6MjA1ODY2NzI0MX0.h_YWBX9nhfGlq6MaR3jSDu56CagNpoprBgqiXwjhJAI")
supabase_client = supabase.create_client(supabase_url, supabase_key)

router = APIRouter(prefix="/auth", tags=["auth"])

# Security config
SECRET_KEY = os.getenv("SECRET_KEY", "edenz_consultants_secret_key_please_change_in_production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days

# Password context for hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

class Token(BaseModel):
    access_token: str
    token_type: str
    user: Dict[str, Any]

class TokenData(BaseModel):
    user_id: Optional[str] = None
    role: Optional[str] = None

class UserAuth(BaseModel):
    email: str
    password: str
    role: Optional[str] = "student"

def get_password_hash(password: str) -> str:
    """Hash a password for storing"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a stored password against a provided password"""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a new JWT token"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user_by_email(email: str, table: str = "students"):
    """Get a user by email from the specified table"""
    response = supabase_client.table(table).select("*").eq("email", email).execute()
    
    if response and hasattr(response, "data") and len(response.data) > 0:
        return response.data[0]
    
    return None

def authenticate_user(email: str, password: str, table: str = "students"):
    """Authenticate a user by email and password"""
    user = get_user_by_email(email, table)
    
    if not user:
        return False
    
    # In production, use verify_password(password, user["password"])
    # For demo, we're doing direct comparison since we're not hashing passwords
    if password != user["password"]:
        return False
    
    return user

@router.post("/register/student")
async def register_student(user: UserAuth):
    """Register a new student"""
    try:
        # Check if user already exists
        existing_user = get_user_by_email(user.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # In production, hash the password
        # hashed_password = get_password_hash(user.password)
        
        # Create a new student
        result = supabase_client.table("students").insert({
            "name": user.email.split('@')[0],  # Temporary name from email
            "email": user.email,
            "password": user.password,  # In production, use hashed_password
            "role": "student",
            "created_at": datetime.now().isoformat()
        }).execute()
        
        if result and hasattr(result, "data") and len(result.data) > 0:
            return {"success": True, "message": "Student registered successfully"}
        
        raise HTTPException(status_code=500, detail="Failed to register student")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login and get an access token"""
    # Try to authenticate as student first
    user = authenticate_user(form_data.username, form_data.password, "students")
    
    if not user:
        # Try to authenticate as admin
        user = authenticate_user(form_data.username, form_data.password, "admins")
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user["id"]), "role": user.get("role", "student")},
        expires_delta=access_token_expires
    )
    
    # Return token and user info
    user_data = {
        "id": user["id"],
        "email": user["email"],
        "name": user.get("name", ""),
        "role": user.get("role", "student")
    }
    
    return {"access_token": access_token, "token_type": "bearer", "user": user_data}

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get the current user from token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        role: str = payload.get("role", "student")
        
        if user_id is None:
            raise credentials_exception
        
        token_data = TokenData(user_id=user_id, role=role)
    except JWTError:
        raise credentials_exception
    
    # Get user from database
    table = "students" if token_data.role == "student" else "admins"
    response = supabase_client.table(table).select("*").eq("id", token_data.user_id).execute()
    
    if not response or not hasattr(response, "data") or len(response.data) == 0:
        raise credentials_exception
    
    user = response.data[0]
    return user

@router.get("/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    """Get current user profile"""
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "name": current_user.get("name", ""),
        "role": current_user.get("role", "student")
    }
