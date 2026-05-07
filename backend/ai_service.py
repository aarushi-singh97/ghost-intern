import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.0-flash")


def generate_summary(readme, technologies):
    prompt = f"""
    You are analyzing a GitHub repository.

    Technologies:
    {technologies}

    README:
    {readme[:4000]}

    Explain:
    1. What this project does
    2. Main technologies
    3. Architecture overview

    Keep it short and clean.
    """

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return "AI summary temporarily unavailable due to API limits."


def ask_question(question, readme):
    prompt = f"""
    README:
    {readme[:4000]}

    Question:
    {question}
    """

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return "AI summary temporarily unavailable due to API limits."