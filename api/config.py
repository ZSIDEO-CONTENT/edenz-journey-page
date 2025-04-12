
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

# Database configuration
DB_HOST = os.getenv("DB_HOST", "92.113.25.36")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "devdb")
DB_USER = os.getenv("DB_USER", "ali")
DB_PASSWORD = os.getenv("DB_PASSWORD", "Allah123")

# JWT Secret
JWT_SECRET = os.getenv("JWT_SECRET", "edenz_consultants_secret_key_please_change_in_production")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days
