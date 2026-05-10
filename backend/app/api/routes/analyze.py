from fastapi import APIRouter, HTTPException

from app.models.request_models import RepoRequest
from app.models.response_models import RepoAnalysisResponse

from app.services.github_service import fetch_repository_data
from app.services.tech_detector import detect_technologies
from app.services.ai_service import generate_repository_summary


router = APIRouter(
    prefix="/analyze",
    tags=["Analyze"]
)


@router.post(
    "/",
    response_model=RepoAnalysisResponse
)
async def analyze_repo(
    request: RepoRequest
):
    try:
        repo_data = fetch_repository_data(
            request.repo_url
        )

        tech_stack = detect_technologies(
            repo_data["package_json"]
        )

        ai_summary = generate_repository_summary(
            repo_data["readme"],
            tech_stack
        )

        return RepoAnalysisResponse(
            repo=repo_data["repo"],
            techStack=tech_stack,
            keyFiles=repo_data["key_files"],
            summary=ai_summary,
            architectureNotes=[
                "Monolithic backend structure",
                "AI-powered repository analysis",
                "Technology detection system",
            ],
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )