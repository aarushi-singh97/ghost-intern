import google.generativeai as genai

from app.utils.prompt_builder import (
    build_summary_prompt,
    build_chat_prompt,
)

from app.config import GEMINI_API_KEY


genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel(
    "gemini-2.0-flash"
)


def generate_repository_summary(
    readme,
    technologies,
):
    fallback_summary = (
        "AI summary is temporarily unavailable because the Gemini API quota "
        "has been reached. The repository metadata, detected technologies, "
        "key files, and architecture notes are still available."
    )

    if not GEMINI_API_KEY:
        return (
            "AI summary is unavailable because GEMINI_API_KEY is not configured. "
            "Add a valid key to backend/.env to enable generated summaries."
        )

    prompt = build_summary_prompt(
        readme,
        technologies,
    )

    try:
        response = model.generate_content(
            prompt
        )

        return response.text

    except Exception:
        return fallback_summary


def ask_repository_question(
    question,
    context,
):
    if not GEMINI_API_KEY:
        return (
            "Q&A is unavailable because GEMINI_API_KEY is not configured. "
            "Add a valid key to backend/.env to enable repository questions."
        )

    prompt = build_chat_prompt(
        question,
        context,
    )

    try:
        response = model.generate_content(
            prompt
        )

        return response.text

    except Exception:
        return (
            "Q&A is temporarily unavailable because the Gemini API quota has "
            "been reached. Please try again later or use a key with available quota."
        )
