from typing import Dict, Any

from pydantic import BaseModel, Field


class RepoRequest(BaseModel):
    repo_url: str = Field(min_length=1)


class ChatRequest(BaseModel):
    question: str = Field(min_length=1)
    context: Dict[str, Any] = Field(default_factory=dict)


class SignupRequest(BaseModel):
    username: str = Field(min_length=1)
    email: str = Field(min_length=1)
    password: str = Field(min_length=6)


class LoginRequest(BaseModel):
    email: str = Field(min_length=1)
    password: str = Field(min_length=1)
