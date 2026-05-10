def build_summary_prompt(
    readme,
    technologies,
):
    return f"""
You are a senior software architect analyzing a GitHub repository.

Repository technologies:
{technologies}

Repository README:
{readme[:4000]}

Your task:
1. Explain what the project does
2. Identify the probable architecture
3. Explain the role of the main technologies
4. Mention possible strengths or engineering patterns

Rules:
- Be concise but technical
- Avoid generic statements
- Write like an experienced engineer
- Focus on architecture and implementation insights
- Keep response under 250 words
"""


def build_chat_prompt(
    question,
    context,
):
    return f"""
You are an AI engineering assistant helping developers understand a repository.

Repository context:
{context}

Developer question:
{question}

Rules:
- Answer technically and clearly
- Be concise
- Use engineering terminology when appropriate
- Avoid generic AI phrasing
- Focus on architecture, implementation, and repository reasoning
"""