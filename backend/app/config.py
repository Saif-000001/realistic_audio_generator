import os
from pathlib import Path
from dotenv import load_dotenv
import torch

# Load environment variables from .env file
load_dotenv()

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Application settings
APP_NAME = "PDF/Image to Audio Converter"
# API_V1_STR = "/api/v1"

# Security settings
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-for-development")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Database settings
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

# File storage
UPLOAD_DIR = BASE_DIR / "temp" / "uploads"
AUDIO_DIR = BASE_DIR / "temp" / "audio"

# Ensure directories exist
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

# CORS settings
ALLOWED_ORIGINS = [
    "http://localhost:3000",
]


# Device settings
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# DEVICE = "cuda" if os.getenv("USE_CUDA", "0") == "1" else "cpu"