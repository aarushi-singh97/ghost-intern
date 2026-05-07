import requests


def extract_repo_info(repo_url: str):
    parts = repo_url.replace("https://github.com/", "").split("/")

    owner = parts[0]
    repo = parts[1]

    return owner, repo


def fetch_readme(owner: str, repo: str):
    url = f"https://raw.githubusercontent.com/{owner}/{repo}/main/README.md"

    response = requests.get(url)

    if response.status_code == 200:
        return response.text

    return "No README found"


def fetch_package_json(owner: str, repo: str):
    url = f"https://raw.githubusercontent.com/{owner}/{repo}/main/package.json"

    response = requests.get(url)

    if response.status_code == 200:
        return response.json()

    return {}