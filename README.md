# Ghost Intern

An authenticated web application for inspecting GitHub repositories: it gathers repository metadata and structure, detects technologies from dependency manifests, generates an optional Gemini summary, and saves each user's analyses locally.

> **Current repository status:** the tracked React source and public assets under `frontend/src` and `frontend/public` are deleted in the current working tree. As checked out, the frontend cannot run. The backend source remains present, but dependencies must be installed before it can start. This README documents the implemented code and does not claim the current checkout is deployable.

## Overview

Ghost Intern is aimed at developers who want a quick, high-level view of a GitHub repository. A signed-in user submits a GitHub URL. The backend reads GitHub metadata, the repository tree, language bytes, a README, every discoverable `package.json`, and the first discoverable `requirements.txt`. It returns a structured analysis, optionally augments it with a Gemini-generated README summary, and stores the result in SQLite for that user.

The code does not clone or deeply parse repositories. Its architecture observations are derived from GitHub's tree and language endpoints plus manifest-file heuristics.

## Implemented Features

- Account signup, login, and authenticated user lookup.
- Per-user analysis history stored in SQLite.
- GitHub URL validation for `github.com/<owner>/<repo>` URLs.
- GitHub metadata, recursive file-tree, language, README, `package.json`, and `requirements.txt` collection.
- Dependency extraction and technology/framework detection from JavaScript and Python manifests.
- Ranked key-file list and basic repository metrics.
- Optional Gemini repository summary with a non-AI fallback when no API key is configured or generation fails.
- Authenticated AI Q&A endpoint. Repository questions use client-supplied analysis context; general questions are sent to Gemini without repository context.
- JSON export of the signed-in user's profile and stored analysis history.

## Architecture

```mermaid
flowchart LR
    U[Signed-in user] --> F[React client\n(source currently deleted)]
    F -->|Bearer token| A[FastAPI API]
    A --> AU[Auth and token verification]
    A --> G[GitHub service]
    G --> GH[GitHub REST API]
    A --> D[Technology and architecture heuristics]
    A --> AI[Gemini service\nwhen configured]
    A --> S[(SQLite)]
    A --> F
```

The FastAPI application exposes route modules for authentication, repository analysis, Q&A, and export. `github_service` performs synchronous HTTP calls to GitHub and builds the structural response; `tech_detector` maps dependency names to a fixed technology list; `ai_service` calls Gemini when a key is available. SQLite holds `users` and serialized `analyses` rows.

## API

`/auth/me`, analysis, Q&A, history, and export require `Authorization: Bearer <token>`. The logout route does not validate or revoke a token.

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/auth/signup` | Create a user and return an access token. |
| `POST` | `/auth/login` | Authenticate by email and return an access token. |
| `POST` | `/auth/logout` | Returns a success message; it does not revoke tokens. |
| `GET` | `/auth/me` | Return the authenticated user. |
| `POST` | `/analyze/` | Analyze a GitHub repository and store the result. |
| `GET` | `/analyze/history` | Return the authenticated user's saved analyses. |
| `POST` | `/ask/` | Ask Gemini a repository-context or general question. |
| `GET` | `/export/` | Export the authenticated user's profile and analysis history. |

## Technology Stack

- **Frontend (committed design):** React, React Router, Vite, Lucide React, React Markdown. The source files are currently deleted from the working tree.
- **Backend:** Python, FastAPI, Uvicorn, Pydantic.
- **Database:** SQLite via Python's standard `sqlite3` module.
- **External services:** GitHub REST API and Google Gemini through `google-genai`.
- **Authentication:** custom HMAC-SHA256 bearer tokens and PBKDF2-HMAC-SHA256 password hashing.
- **Developer tooling:** npm, ESLint, Vite, `python-dotenv`.

## Configuration

Create `backend/.env` with the values appropriate for your environment:

```dotenv
# Optional, but avoids unauthenticated GitHub API rate limits
GITHUB_TOKEN=...

# One of these enables Gemini features
GEMINI_API_KEY=...
# AI_API_KEY=...
# GOOGLE_API_KEY=...

# Required outside local development; do not use the application's built-in default
JWT_SECRET_KEY=...
```

`GEMINI_API_KEY` takes precedence over `AI_API_KEY`, then `GOOGLE_API_KEY`. Without a Gemini key, analysis returns a short local summary, while Q&A responds that Gemini is not configured.

## Run the Backend

From the repository root:

```bash
cd backend
python -m venv .venv
# Activate the environment using your platform's standard command
python -m pip install -r requirements.txt
uvicorn app.main:app --reload
```

On startup, the application creates `backend/ghost_intern.db` and its `users` and `analyses` tables if they do not exist. The API listens on Uvicorn's default local address unless configured otherwise.

## Frontend Status

`frontend/package.json` includes the usual Vite scripts (`dev`, `build`, `lint`, and `preview`), but the checked-out `frontend/src/main.jsx`, application components, pages, and public assets are deleted. Restore those user-owned deletions before attempting to install dependencies or run the frontend. The committed client was configured to call `http://127.0.0.1:8000` by default, overridable with `VITE_API_BASE_URL`.

## Data Model

| Table | Stored fields |
| --- | --- |
| `users` | id, username, email, hashed password, creation timestamp |
| `analyses` | repository URL/name, serialized analysis JSON, creation timestamp, user id |

## Known Limitations

- The current working tree is not runnable as a full-stack application because the frontend source is deleted.
- No automated tests, CI workflow, container configuration, or deployment configuration is tracked.
- Dependency versions in `requirements.txt` are unpinned.
- The default JWT signing secret is insecure if `JWT_SECRET_KEY` is not set, and tokens cannot be revoked; logout is client-side only.
- Password and email validation is minimal. There are no rate limits, password-reset flow, email verification, account deletion, or token rotation.
- SQLite connections do not enable foreign-key enforcement explicitly, and no migrations or indexes are defined.
- GitHub errors are generally collapsed into generic responses; API status distinctions and rate-limit feedback are not preserved.
- Analysis is limited to metadata, a tree, language bytes, README content, JavaScript dependency manifests, and one Python requirements file. It does not inspect arbitrary source code, commits, contributors, stars, forks, or dependency graphs.
- The AI summary receives only README text (limited to 4,000 characters) and detected technologies. Repository Q&A trusts context supplied by the client.
- The backend uses synchronous `requests` calls inside async route handlers, which can block the server under concurrent load.
- CORS is restricted to two local Vite origins, so a deployed frontend needs configuration changes.

## Suggested Next Steps

1. Restore the deleted frontend source and add a clean-install/build check.
2. Add backend integration tests, frontend component tests, and a CI workflow.
3. Replace the custom token implementation with a maintained JWT library, require a strong secret, and add token revocation or short-lived refresh flows.
4. Add stricter request validation, GitHub error/rate-limit handling, and rate limiting for auth and AI endpoints.
5. Move blocking GitHub calls to an async client or worker queue and introduce a production database and migrations before multi-user deployment.

## License

This repository includes an [MIT License](LICENSE).
