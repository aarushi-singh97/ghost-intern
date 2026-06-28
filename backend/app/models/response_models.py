from pydantic import BaseModel
from typing import List, Dict, Optional


class RepoData(BaseModel):
    name: str
    owner: str
    description: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: str


class AuthResponse(BaseModel):
    token: str
    user: UserResponse


class AnalysisHistoryItem(BaseModel):
    id: int
    repository_url: str
    repository_name: str
    analysis_result: Dict
    created_at: str
    user_id: int


class FileEntry(BaseModel):
    path: str
    type: str
    size: Optional[int] = None


class DependencyEntry(BaseModel):
    name: str
    version: str
    type: str


class ArchitectureData(BaseModel):
    folders: List[FileEntry]
    files: List[FileEntry]
    languages: Dict[str, int]
    frameworks: List[str]
    packageManager: str
    dependencies: List[DependencyEntry]
    keyFiles: List[str]
    metrics: Dict[str, int | str]
    notes: List[str]


class RepoAnalysisResponse(BaseModel):
    repo: RepoData
    techStack: List[str]
    keyFiles: List[str]
    summary: str
    architectureNotes: List[str]
    architecture: ArchitectureData
