import os

from dotenv import load_dotenv

load_dotenv()

GITHUB_TOKEN = os.getenv(
    "GITHUB_TOKEN"
)

GEMINI_API_KEY = os.getenv(
    "GEMINI_API_KEY"
)