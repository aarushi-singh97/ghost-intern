const API_BASE_URL = "http://127.0.0.1:8000";

export async function analyzeRepository(repoUrl) {
  const response = await fetch(
    `${API_BASE_URL}/analyze/`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        repo_url: repoUrl,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to analyze repository"
    );
  }

  return response.json();
}

export async function askQuestion(
  question,
  context
) {
  const response = await fetch(
    `${API_BASE_URL}/ask/`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        question,
        context,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to ask question"
    );
  }

  return response.json();
}