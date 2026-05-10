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
    prompt = build_summary_prompt(
        readme,
        technologies,
    )

    try:
        response = model.generate_content(
            prompt
        )

        return response.text

    except Exception as e:
        return str(e)


def ask_repository_question(
    question,
    context,
):
    prompt = build_chat_prompt(
        question,
        context,
    )

    try:
        response = model.generate_content(
            prompt
        )

        return response.text

    except Exception as e:
        return str(e)