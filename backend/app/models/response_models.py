from pydantic import BaseModel
from typing import List, Dict


class RepoData(BaseModel):
    name: str
    owner: str
    description: str


class RepoAnalysisResponse(BaseModel):
    repo: RepoData
    techStack: List[str]
    keyFiles: List[str]
    summary: str
    architectureNotes: List[str]