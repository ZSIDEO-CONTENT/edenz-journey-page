
import os
from dotenv import load_dotenv

# Load environment variables from .env file
# Try different paths to find the .env file
env_paths = [
    os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"),  # Root project folder
    os.path.join(os.path.dirname(os.path.dirname(__file__)), "api/.env"),  # api folder
    os.path.join(os.path.dirname(__file__), ".env"),  # current directory
]

# Try to load from each possible location
for env_path in env_paths:
    if os.path.exists(env_path):
        load_dotenv(dotenv_path=env_path)
        break

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://vxievjimtordkobtuink.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4aWV2amltdG9yZGtvYnR1aW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwOTEyNDEsImV4cCI6MjA1ODY2NzI0MX0.h_YWBX9nhfGlq6MaR3jSDu56CagNpoprBgqiXwjhJAI")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")

# JWT Secret
JWT_SECRET = os.getenv("JWT_SECRET", "edenz_consultants_secret_key_please_change_in_production")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days
