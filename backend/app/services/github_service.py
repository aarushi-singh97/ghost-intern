import base64
import json
from urllib.parse import urlparse

import requests
from app.config import GITHUB_TOKEN


REQUEST_TIMEOUT = 10
GITHUB_API_URL = "https://api.github.com"


def github_headers():
    headers = {
        "Accept": "application/vnd.github+json",
    }

    if GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"

    return headers


def extract_repo_info(
    repo_url: str,
):
    parsed_url = urlparse(
        repo_url.strip()
    )
    parts = parsed_url.path.strip("/").split("/")

    if parsed_url.hostname != "github.com" or len(parts) < 2:
        raise ValueError(
            "Invalid GitHub repository URL."
        )

    owner = parts[0]
    repo = parts[1].removesuffix(".git")

    if not owner or not repo:
        raise ValueError(
            "Invalid GitHub repository URL."
        )

    return owner, repo


def fetch_file_from_github(
    owner: str,
    repo: str,
    filename: str,
    branch: str = None,
):
    branches = [branch] if branch else ["main", "master"]

    for branch in branches:
        url = f"{GITHUB_API_URL}/repos/{owner}/{repo}/contents/{filename}"

        try:
            response = requests.get(
                url,
                headers=github_headers(),
                params={
                    "ref": branch,
                },
                timeout=REQUEST_TIMEOUT,
            )

            if response.status_code == 200:
                data = response.json()
                content = base64.b64decode(
                    data.get("content", "")
                )
                response._content = content
                return response

        except requests.RequestException:
            continue

    return None


def fetch_default_branch(
    repo_metadata,
):
    return repo_metadata.get(
        "default_branch",
    ) or "main"


def fetch_github_repo_metadata(
    owner: str,
    repo: str,
):
    url = f"{GITHUB_API_URL}/repos/{owner}/{repo}"

    try:
        response = requests.get(
            url,
            headers=github_headers(),
            timeout=REQUEST_TIMEOUT,
        )

        if response.status_code == 200:
            return response.json()

    except requests.RequestException:
        pass

    return {}


def fetch_repository_tree(
    owner: str,
    repo: str,
    branch: str,
):
    url = (
        f"{GITHUB_API_URL}/repos/{owner}/{repo}/git/trees/"
        f"{branch}?recursive=1"
    )

    try:
        response = requests.get(
            url,
            headers=github_headers(),
            timeout=REQUEST_TIMEOUT,
        )

        if response.status_code == 200:
            return response.json().get(
                "tree",
                [],
            )

    except requests.RequestException:
        pass

    return []


def fetch_repository_languages(
    owner: str,
    repo: str,
):
    url = f"{GITHUB_API_URL}/repos/{owner}/{repo}/languages"

    try:
        response = requests.get(
            url,
            headers=github_headers(),
            timeout=REQUEST_TIMEOUT,
        )

        if response.status_code == 200:
            return response.json()

    except requests.RequestException:
        pass

    return {}


def find_files_in_tree(
    tree,
    filename: str,
):
    matches = [
        item["path"]
        for item in tree
        if item.get("type") == "blob"
        and item.get("path", "").split("/")[-1].lower() == filename.lower()
    ]

    return sorted(
        matches,
        key=lambda path: (
            path.count("/"),
            len(path),
            path.lower(),
        ),
    )


def rank_key_files(
    tree,
    preferred_paths,
):
    file_scores = {
        "main.py": 100,
        "app.jsx": 100,
        "app.tsx": 100,
        "auth.py": 95,
        "github_service.py": 95,
        "ai_service.py": 95,
        "database.py": 90,
        "routes.py": 90,
        "package.json": 85,
        "requirements.txt": 85,
        "readme": 80,
        "readme.md": 80,
        "readme.rst": 80,
        "readme.txt": 80,
        "vite.config.js": 75,
        "dockerfile": 75,
    }
    preferred = {
        path for path in preferred_paths if path
    }
    ranked_files = []

    for item in tree:
        if item.get("type") != "blob":
            continue

        path = item.get("path", "")
        filename = path.split("/")[-1].lower()
        score = file_scores.get(filename, 0)

        if path in preferred:
            score += 30

        if score:
            ranked_files.append((score, path))

    ranked_files.sort(
        key=lambda item: (
            -item[0],
            item[1].count("/"),
            len(item[1]),
            item[1].lower(),
        )
    )

    return [
        path for _, path in ranked_files[:12]
    ]


def fetch_readme(
    owner: str,
    repo: str,
    tree,
    branch: str,
):
    readme_paths = sorted(
        [
            item["path"]
            for item in tree
            if item.get("type") == "blob"
            and item.get("path", "").split("/")[-1].lower()
            in ["readme", "readme.md", "readme.rst", "readme.txt"]
        ],
        key=lambda path: (
            path.count("/"),
            len(path),
            path.lower(),
        ),
    )
    path = readme_paths[0] if readme_paths else "README.md"

    response = fetch_file_from_github(
        owner,
        repo,
        path,
        branch,
    )

    if response:
        return response.text, path

    return "No README found", None


def fetch_text_file(
    owner: str,
    repo: str,
    path: str,
    branch: str,
):
    response = fetch_file_from_github(
        owner,
        repo,
        path,
        branch,
    )

    if response:
        return response.text

    return ""


def fetch_package_json(
    owner: str,
    repo: str,
    tree,
    branch: str,
):
    package_paths = find_files_in_tree(
        tree,
        "package.json",
    )
    merged_package = {}
    all_dependencies = {}
    all_dev_dependencies = {}

    for path in package_paths:
        content = fetch_text_file(
            owner,
            repo,
            path,
            branch,
        )

        if not content:
            continue

        try:
            package_data = json.loads(content)
        except json.JSONDecodeError:
            continue

        if not merged_package:
            merged_package = package_data.copy()

        for name, version in package_data.get("dependencies", {}).items():
            all_dependencies.setdefault(name, version)

        for name, version in package_data.get("devDependencies", {}).items():
            all_dev_dependencies.setdefault(name, version)

    if not merged_package:
        return {}, []

    merged_package["dependencies"] = all_dependencies
    merged_package["devDependencies"] = all_dev_dependencies

    return merged_package, package_paths


def extract_dependencies(
    package_json,
    requirements_text,
):
    dependencies = []

    for dep_type, values in [
        ("runtime", package_json.get("dependencies", {})),
        ("dev", package_json.get("devDependencies", {})),
    ]:
        for name, version in values.items():
            dependencies.append(
                {
                    "name": name,
                    "version": version,
                    "type": dep_type,
                }
            )

    for line in requirements_text.splitlines():
        cleaned = line.split("#", 1)[0].strip()

        if not cleaned or cleaned.startswith("-"):
            continue

        cleaned = cleaned.split(";", 1)[0].strip()

        separators = ["==", ">=", "<=", "~=", ">", "<"]
        name = cleaned
        version = "unspecified"

        for separator in separators:
            if separator in cleaned:
                name, version = cleaned.split(
                    separator,
                    1,
                )
                version = f"{separator}{version}"
                break

        name = name.split("[", 1)[0]

        dependencies.append(
            {
                "name": name.strip(),
                "version": version.strip(),
                "type": "python",
            }
        )

    return dependencies


def detect_frameworks(
    dependencies,
):
    framework_map = {
        "react": "React",
        "next": "Next.js",
        "vue": "Vue.js",
        "angular": "Angular",
        "svelte": "Svelte",
        "fastapi": "FastAPI",
        "django": "Django",
        "flask": "Flask",
        "express": "Express.js",
        "nestjs": "NestJS",
    }
    detected = []

    for dependency in dependencies:
        name = dependency["name"].lower()

        if name in framework_map:
            detected.append(
                framework_map[name]
            )

    return sorted(
        list(set(detected))
    )


def detect_package_manager(
    files,
    requirements_path,
):
    file_paths = {
        file["path"]
        for file in files
    }

    if any(path.endswith("pnpm-lock.yaml") for path in file_paths):
        return "pnpm"

    if any(path.endswith("yarn.lock") for path in file_paths):
        return "Yarn"

    if any(path.endswith("package-lock.json") for path in file_paths):
        return "npm"

    if requirements_path:
        return "pip"

    return "Unknown"


def build_architecture_notes(
    folders,
    files,
    languages,
    dependencies,
    frameworks,
    package_manager,
):
    notes = []
    folder_paths = {
        folder["path"]
        for folder in folders
    }
    dependency_names = {
        dependency["name"].lower()
        for dependency in dependencies
    }

    if "backend" in folder_paths and "frontend" in folder_paths:
        notes.append(
            "Repository is split into separate frontend and backend applications."
        )
    elif "src" in folder_paths:
        notes.append(
            "Repository uses a source-first application structure under src."
        )

    if "fastapi" in dependency_names:
        notes.append(
            "Backend API layer is built with FastAPI."
        )

    if "react" in dependency_names:
        notes.append(
            "Frontend UI layer is built with React."
        )

    if "vite" in dependency_names:
        notes.append(
            "Frontend build tooling uses Vite."
        )

    if frameworks:
        notes.append(
            f"Detected framework layer: {', '.join(frameworks)}."
        )

    if package_manager != "Unknown":
        notes.append(
            f"Package management is handled with {package_manager}."
        )

    if languages:
        primary_language = max(
            languages,
            key=languages.get,
        )
        notes.append(
            f"Primary repository language by byte count is {primary_language}."
        )

    if not notes:
        notes.append(
            "Architecture notes are based on repository folders, files, languages, and dependency manifests."
        )

    return notes


def build_architecture_data(
    tree,
    languages,
    readme_path,
    package_json,
    package_json_paths,
    requirements_text,
    requirements_path,
):
    folders = [
        {
            "path": item["path"],
            "type": "folder",
            "size": item.get("size"),
        }
        for item in tree
        if item.get("type") == "tree"
    ]
    files = [
        {
            "path": item["path"],
            "type": "file",
            "size": item.get("size"),
        }
        for item in tree
        if item.get("type") == "blob"
    ]
    key_files = rank_key_files(
        tree,
        [
            readme_path,
            package_json_paths[0] if package_json_paths else None,
            requirements_path,
        ],
    )

    dependencies = extract_dependencies(
        package_json,
        requirements_text,
    )
    frameworks = detect_frameworks(
        dependencies,
    )
    package_manager = detect_package_manager(
        files,
        requirements_path,
    )
    notes = build_architecture_notes(
        folders,
        files,
        languages,
        dependencies,
        frameworks,
        package_manager,
    )
    total_size = sum(
        file.get("size") or 0
        for file in files
    )
    largest_file = max(
        files,
        key=lambda file: file.get("size") or 0,
        default=None,
    )

    return {
        "folders": folders,
        "files": files,
        "languages": languages,
        "frameworks": frameworks,
        "packageManager": package_manager,
        "dependencies": dependencies,
        "keyFiles": key_files,
        "metrics": {
            "folderCount": len(folders),
            "fileCount": len(files),
            "languageCount": len(languages),
            "dependencyCount": len(dependencies),
            "largestFile": largest_file["path"] if largest_file else "Unknown",
            "largestFileSize": largest_file.get("size") or 0 if largest_file else 0,
            "averageFileSize": round(total_size / len(files)) if files else 0,
            "repositorySize": total_size,
        },
        "notes": notes,
    }


def fetch_requirements_txt(
    owner: str,
    repo: str,
    tree,
    branch: str,
):
    requirements_paths = find_files_in_tree(
        tree,
        "requirements.txt",
    )

    for path in requirements_paths:
        content = fetch_text_file(
            owner,
            repo,
            path,
            branch,
        )

        if content:
            return content, path

    return "", None


def fetch_repository_data(
    repo_url: str,
):
    owner, repo = extract_repo_info(
        repo_url
    )

    repo_metadata = fetch_github_repo_metadata(
        owner,
        repo,
    )

    if not repo_metadata:
        raise ValueError(
            "Repository not found or GitHub could not be reached."
        )
    default_branch = fetch_default_branch(
        repo_metadata,
    )
    tree = fetch_repository_tree(
        owner,
        repo,
        default_branch,
    )
    languages = fetch_repository_languages(
        owner,
        repo,
    )

    readme, readme_path = fetch_readme(
        owner,
        repo,
        tree,
        default_branch,
    )

    package_json, package_json_paths = fetch_package_json(
        owner,
        repo,
        tree,
        default_branch,
    )

    requirements_text, requirements_path = fetch_requirements_txt(
        owner,
        repo,
        tree,
        default_branch,
    )
    architecture = build_architecture_data(
        tree,
        languages,
        readme_path,
        package_json,
        package_json_paths,
        requirements_text,
        requirements_path,
    )

    return {
        "repo": {
            "name": repo,
            "owner": owner,
            "description": repo_metadata.get(
                "description",
            ) or package_json.get(
                "description",
            ) or "No description available",
        },

        "readme": readme,

        "package_json": package_json,

        "requirements_text": requirements_text,

        "key_files": architecture["keyFiles"],

        "architecture": architecture,
    }
