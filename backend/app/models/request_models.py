from pydantic import BaseModel, EmailStr, Field, field_validator


class RepoRequest(BaseModel):
    repo_url: str = Field(min_length=1)


class ChatRequest(BaseModel):
    question: str = Field(min_length=1)
    analysis_id: int = Field(gt=0)


class SignupRequest(BaseModel):
    username: str = Field(min_length=1)
    email: EmailStr
    password: str = Field(min_length=12, max_length=128)

    @field_validator("password")
    @classmethod
    def password_policy(cls, value):
        if not (any(char.islower() for char in value) and any(char.isupper() for char in value) and any(char.isdigit() for char in value)):
            raise ValueError("Password must include uppercase, lowercase, and a number")
        return value


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)
