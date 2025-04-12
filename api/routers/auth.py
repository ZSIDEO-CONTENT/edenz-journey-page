
from fastapi import APIRouter, HTTPException, Request, status, Depends, Header
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from api.config import JWT_SECRET, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from api.db import get_db_cursor
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize OAuth2 Bearer for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(prefix="/auth", tags=["auth"])

class Token(BaseModel):
    access_token: str
    token_type: str
    user: Dict[str, Any]

class UserAuth(BaseModel):
    email: str
    password: str

class StudentRegister(BaseModel):
    name: str
    email: str
    password: str
    phone: str
    role: str = "student"  # Default to student role

class ProcessingMemberRegister(BaseModel):
    name: str
    email: str
    password: str
    phone: str
    managed_regions: Optional[List[str]] = None
    admin_token: str  # Token of the admin creating this user

class AdminRegister(BaseModel):
    name: str
    email: str
    password: str
    phone: str
    adminSecretKey: str

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now() + expires_delta
    else:
        expire = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

async def get_user_by_token(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    
    try:
        token_type, token = authorization.split(" ")
        if token_type.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token type",
            )
        
        # Decode JWT token
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
            )
        
        # Get user details from database
        with get_db_cursor() as cursor:
            cursor.execute(
                "SELECT * FROM users WHERE id = %s",
                (user_id,)
            )
            user = cursor.fetchone()
            
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User not found",
                )
            
            # Convert to dict if it's not already
            if not isinstance(user, dict):
                user = dict(user)
                
            # Convert managed_regions from DB array to Python list if needed
            if user.get("managed_regions") and isinstance(user["managed_regions"], str):
                user["managed_regions"] = user["managed_regions"].strip("{}").split(",")
                
            return user
            
    except (JWTError, Exception) as e:
        logger.error(f"Authentication error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )

@router.post("/register/admin", status_code=status.HTTP_201_CREATED)
async def register_admin(user: AdminRegister):
    """Register a new admin (requires admin secret key)"""
    try:
        # Verify admin secret key
        admin_secret = os.environ.get("ADMIN_SECRET_KEY", "admin123")  # Use environment variable in production
        if user.adminSecretKey != admin_secret:
            raise HTTPException(status_code=403, detail="Invalid admin secret key")
        
        # Check if email already exists
        with get_db_cursor() as cursor:
            cursor.execute(
                "SELECT id FROM users WHERE email = %s",
                (user.email,)
            )
            existing_user = cursor.fetchone()
            
            if existing_user:
                raise HTTPException(status_code=400, detail="Email already in use")
            
            # Hash the password
            hashed_password = get_password_hash(user.password)
            
            # Insert user data
            cursor.execute(
                """
                INSERT INTO users (name, email, password, phone, role, created_at)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id
                """,
                (
                    user.name,
                    user.email,
                    hashed_password,
                    user.phone,
                    "admin",
                    datetime.now()
                )
            )
            
            new_user_id = cursor.fetchone()["id"]
            
        logger.info(f"Admin user created successfully: {new_user_id}")
        return {"success": True, "message": "Admin registered successfully"}
    
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        logger.error(f"Admin registration error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/register/student", status_code=status.HTTP_201_CREATED)
async def register_student(user: StudentRegister):
    """Register a new student"""
    try:
        logger.info(f"Attempting to register student: {user.email}")
        
        # Check if email already exists
        with get_db_cursor() as cursor:
            cursor.execute(
                "SELECT id FROM users WHERE email = %s",
                (user.email,)
            )
            existing_user = cursor.fetchone()
            
            if existing_user:
                raise HTTPException(status_code=400, detail="Email already in use")
            
            # Hash the password
            hashed_password = get_password_hash(user.password)
            
            # Insert user data
            cursor.execute(
                """
                INSERT INTO users (name, email, password, phone, role, created_at)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id
                """,
                (
                    user.name,
                    user.email,
                    hashed_password,
                    user.phone,
                    "student",
                    datetime.now()
                )
            )
            
            new_user_id = cursor.fetchone()["id"]
            
        logger.info(f"Student user created successfully: {new_user_id}")
        return {"success": True, "message": "Student registered successfully"}
    
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        logger.error(f"Student registration error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/processing/register", status_code=status.HTTP_201_CREATED)
async def register_processing_member(user: ProcessingMemberRegister):
    """Register a new processing team member (admin only)"""
    try:
        # Verify admin token
        admin_user = None
        try:
            logger.info(f"Verifying admin token for processing member registration")
            
            # Get admin user from token
            admin_token = user.admin_token
            
            # Decode JWT token
            payload = jwt.decode(admin_token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            admin_id = payload.get("sub")
            
            if not admin_id:
                raise HTTPException(status_code=403, detail="Invalid admin token")
            
            # Verify admin exists and has admin role
            with get_db_cursor() as cursor:
                cursor.execute(
                    "SELECT * FROM users WHERE id = %s",
                    (admin_id,)
                )
                admin_user = cursor.fetchone()
                
                if not admin_user:
                    raise HTTPException(status_code=403, detail="Admin user not found")
                
                if admin_user["role"] != "admin":
                    logger.error(f"User does not have admin role: {admin_user['role']}")
                    raise HTTPException(status_code=403, detail="Not authorized as admin")
            
        except JWTError as e:
            logger.error(f"JWT verification error: {str(e)}")
            raise HTTPException(status_code=403, detail="Invalid admin token")
        except Exception as e:
            logger.error(f"Admin verification error: {str(e)}")
            raise HTTPException(status_code=403, detail=f"Admin verification failed: {str(e)}")
        
        # Check if email already exists
        with get_db_cursor() as cursor:
            cursor.execute(
                "SELECT id FROM users WHERE email = %s",
                (user.email,)
            )
            existing_user = cursor.fetchone()
            
            if existing_user:
                raise HTTPException(status_code=400, detail="Email already in use")
            
            # Hash the password
            hashed_password = get_password_hash(user.password)
            
            # Insert user data
            cursor.execute(
                """
                INSERT INTO users (name, email, password, phone, role, managed_regions, created_by, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
                """,
                (
                    user.name,
                    user.email,
                    hashed_password,
                    user.phone,
                    "processing",
                    user.managed_regions if user.managed_regions else [],
                    admin_id,
                    datetime.now()
                )
            )
            
            new_user_id = cursor.fetchone()["id"]
            
        logger.info(f"Processing user created successfully: {new_user_id}")
        return {"success": True, "message": "Processing team member registered successfully"}
    
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        logger.error(f"Processing member registration error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login and get an access token"""
    try:
        logger.info(f"Login attempt for: {form_data.username}")
        
        # Find user in database
        with get_db_cursor() as cursor:
            cursor.execute(
                "SELECT * FROM users WHERE email = %s",
                (form_data.username,)
            )
            user = cursor.fetchone()
            
            if not user or not verify_password(form_data.password, user["password"]):
                logger.error(f"Authentication failed for: {form_data.username}")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect email or password",
                )
        
        logger.info(f"Authentication success for: {form_data.username}")
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user["id"])},
            expires_delta=access_token_expires
        )
        
        # Convert managed_regions from DB array to Python list if needed
        managed_regions = None
        if user["role"] == "processing" and user.get("managed_regions"):
            if isinstance(user["managed_regions"], str):
                managed_regions = user["managed_regions"].strip("{}").split(",")
            else:
                managed_regions = user["managed_regions"]
        
        # Return token and user info
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(user["id"]),
                "email": user["email"],
                "name": user["name"],
                "role": user["role"],
                "managed_regions": managed_regions if user["role"] == "processing" else None
            }
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        logger.error(f"Authentication error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication error: {str(e)}",
        )

@router.get("/me")
async def read_users_me(current_user: dict = Depends(get_user_by_token)):
    return current_user
