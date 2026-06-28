import traceback

from google import genai

from app.utils.prompt_builder import (
    build_summary_prompt,
    build_chat_prompt,
    build_intent_prompt,
    build_general_prompt,
)

from app.config import GEMINI_API_KEY


GEMINI_MODEL = "gemini-3.1-flash-lite"
client = (
    genai.Client(api_key=GEMINI_API_KEY)
    if GEMINI_API_KEY
    else None
)


def build_local_summary(
    readme,
    technologies,
):
    tech_text = (
        ", ".join(technologies)
        if technologies
        else "no JavaScript package stack was detected"
    )

    readme_text = " ".join(readme.split())

    readme_preview = (
        readme_text[:280] + "..."
        if len(readme_text) > 280
        else readme_text
    )

    return (
        f"This repository appears to use {tech_text}. "
        f"README preview: {readme_preview}"
    )


def generate_repository_summary(
    readme,
    technologies,
):
    if not GEMINI_API_KEY:
        return build_local_summary(
            readme,
            technologies,
        )

    prompt = build_summary_prompt(
        readme,
        technologies,
    )

    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )

        return response.text

    except Exception:
        print("Repository summary generation failed:")
        traceback.print_exc()

        return build_local_summary(
            readme,
            technologies,
        )


def ask_repository_question(
    question,
    context,
):
    prompt = build_chat_prompt(
        question,
        context,
    )

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
    )

    return response.text


def classify_question(
    question,
):
    if not GEMINI_API_KEY:
        return "general"

    prompt = build_intent_prompt(
        question,
    )

    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )
        raw_response = getattr(
            response,
            "text",
            "",
        ) or ""
        intent = raw_response.strip().lower()

        if intent in ["repository", "general"]:
            return intent

        print("\n========== UNEXPECTED CLASSIFICATION ==========")
        print(f"Question: {question}")
        print(f"Raw response: {raw_response!r}")
        print(f"Parsed intent: {intent!r}")

    except Exception as e:
        print("\n========== CLASSIFICATION ERROR ==========")
        print(f"Question: {question}")
        print(f"Prompt: {prompt}")
        print(f"Error: {e}")
        traceback.print_exc()

    return "general"


def ask_general_question(
    question,
):
    prompt = build_general_prompt(
        question,
    )

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
    )

    return response.text


def answer_question(
    question,
    context,
):
    if not GEMINI_API_KEY:
        return (
            "Gemini is not configured right now. Please add a Gemini API key "
            "to use repository and general AI chat."
        )

    try:
        intent = classify_question(
            question,
        )

        if intent == "general":
            return ask_general_question(
                question,
            )

        if not context or not context.get("repo"):
            return (
                "Please analyze a GitHub repository first so I have repository "
                "context. I can still answer general questions if you'd like."
            )

        return ask_repository_question(
            question,
            context,
        )

    except Exception:
        print("AI question failed:")
        traceback.print_exc()

        return "Gemini is temporarily unavailable. Please try again in a moment."
