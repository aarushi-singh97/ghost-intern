from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from github_service import (
    extract_repo_info,
    fetch_readme,
    fetch_package_json
)

from parser import detect_technologies
from ai_service import generate_summary, ask_question

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RepoRequest(BaseModel):
    repo_url: str


class QuestionRequest(BaseModel):
    question: str
    readme: str


@app.get("/")
def home():
    return {
        "message": "Ghost Intern API running"
    }


@app.post("/analyze")
def analyze_repo(data: RepoRequest):
    owner, repo = extract_repo_info(data.repo_url)

    readme = fetch_readme(owner, repo)
    package_json = fetch_package_json(owner, repo)

    technologies = detect_technologies(package_json)

    summary = generate_summary(readme, technologies)

    return {
        "technologies": technologies,
        "summary": summary,
        "readme": readme
    }


@app.post("/ask")
def ask_repo_question(data: QuestionRequest):
    answer = ask_question(data.question, data.readme)

    return {
        "answer": answer
    }