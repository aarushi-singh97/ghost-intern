import requests


REQUEST_TIMEOUT = 10


def extract_repo_info(
    repo_url: str,
):
    cleaned = repo_url.replace(
        "https://github.com/",
        ""
    ).strip("/")

    parts = cleaned.split("/")

    if len(parts) < 2:
        raise ValueError(
            "Invalid GitHub repository URL."
        )

    owner = parts[0]
    repo = parts[1]

    return owner, repo


def fetch_file_from_github(
    owner: str,
    repo: str,
    filename: str,
):
    branches = ["main", "master"]

    for branch in branches:
        url = (
            f"https://raw.githubusercontent.com/"
            f"{owner}/{repo}/{branch}/{filename}"
        )

        try:
            response = requests.get(
                url,
                timeout=REQUEST_TIMEOUT,
            )

            if response.status_code == 200:
                return response

        except requests.RequestException:
            continue

    return None


def fetch_readme(
    owner: str,
    repo: str,
):
    response = fetch_file_from_github(
        owner,
        repo,
        "README.md",
    )

    if response:
        return response.text

    return "No README found"


def fetch_package_json(
    owner: str,
    repo: str,
):
    response = fetch_file_from_github(
        owner,
        repo,
        "package.json",
    )

    if response:
        return response.json()

    return {}


def fetch_repository_data(
    repo_url: str,
):
    owner, repo = extract_repo_info(
        repo_url
    )

    readme = fetch_readme(
        owner,
        repo,
    )

    package_json = fetch_package_json(
        owner,
        repo,
    )

    return {
        "repo": {
            "name": repo,
            "owner": owner,
            "description": package_json.get(
                "description",
                "No description available",
            ),
        },

        "readme": readme,

        "package_json": package_json,

        "key_files": [
            "README.md",
            "package.json",
        ],
    }