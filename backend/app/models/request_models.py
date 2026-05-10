from pydantic import BaseModel
from typing import Dict, Any


class RepoRequest(BaseModel):
    repo_url: str


class ChatRequest(BaseModel):
    question: str
    context: Dict[str, Any]