import os

from dotenv import load_dotenv

load_dotenv()

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "")
if len(JWT_SECRET_KEY) < 32:
    raise RuntimeError("JWT_SECRET_KEY must be set and at least 32 characters long.")

CORS_ORIGINS = [item.strip() for item in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",") if item.strip()]

GITHUB_TOKEN = os.getenv(
    "GITHUB_TOKEN"
)

GEMINI_API_KEY = os.getenv(
    "GEMINI_API_KEY"
)

if not GEMINI_API_KEY:
    GEMINI_API_KEY = os.getenv(
        "AI_API_KEY"
    )

if not GEMINI_API_KEY:
    GEMINI_API_KEY = os.getenv(
        "GOOGLE_API_KEY"
    )
