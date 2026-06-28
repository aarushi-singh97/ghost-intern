import os

from dotenv import load_dotenv

load_dotenv()

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
