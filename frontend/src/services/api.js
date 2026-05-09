// Calls the Anthropic API directly using the Claude AI integration

const MODEL = "claude-sonnet-4-20250514";
const MAX_TOKENS = 1000;

async function callClaude(messages, systemPrompt) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages,
    }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || "API request failed");
  }
  const data = await response.json();
  const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";
  return text;
}

/**
 * Extract owner/repo from a GitHub URL
 */
export function parseGitHubUrl(url) {
  const match = url.match(/github\.com\/([^/]+)\/([^/?#]+)/);
  if (!match) throw new Error("Invalid GitHub URL");
  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
}

/**
 * Fetch basic repo info from GitHub API (no auth, public repos only)
 */
export async function fetchRepoInfo(owner, repo) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
  if (!res.ok) throw new Error(`Repository not found or is private (${res.status})`);
  const data = await res.json();
  return {
    name: data.name,
    fullName: data.full_name,
    description: data.description || "",
    url: data.html_url,
    stars: data.stargazers_count,
    forks: data.forks_count,
    defaultBranch: data.default_branch,
    language: data.language,
    topics: data.topics || [],
  };
}

/**
 * Fetch the repo's directory tree (top-level + key dirs)
 */
async function fetchRepoTree(owner, repo, branch) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.tree || [])
    .filter(f => f.type === "blob")
    .map(f => f.path)
    .slice(0, 300); // limit for prompt
}

/**
 * Detect tech stack from file paths + repo language
 */
function detectTechStack(files, repoInfo) {
  const all = files.join("\n").toLowerCase();
  const lang = (repoInfo.language || "").toLowerCase();

  const languages = new Set();
  const frameworks = new Set();
  const build = new Set();
  const databases = new Set();
  const cicd = new Set();

  // Languages
  if (lang === "javascript" || all.includes(".js") || all.includes(".jsx")) languages.add("JavaScript");
  if (lang === "typescript" || all.includes(".ts") || all.includes(".tsx")) languages.add("TypeScript");
  if (lang === "python" || all.includes(".py")) languages.add("Python");
  if (lang === "rust" || all.includes(".rs")) languages.add("Rust");
  if (lang === "go" || all.includes(".go")) languages.add("Go");
  if (lang === "java" || all.includes(".java")) languages.add("Java");
  if (lang === "ruby" || all.includes(".rb")) languages.add("Ruby");
  if (lang === "c#" || all.includes(".cs")) languages.add("C#");
  if (lang === "c++" || all.includes(".cpp") || all.includes(".cc")) languages.add("C++");
  if (all.includes(".css") || all.includes(".scss") || all.includes(".sass")) languages.add("CSS");

  // Frameworks
  if (all.includes("next.config") || all.includes("nextjs")) frameworks.add("Next.js");
  if (all.includes("react") || all.includes(".jsx") || all.includes(".tsx")) frameworks.add("React");
  if (all.includes("vue.config") || all.includes(".vue")) frameworks.add("Vue");
  if (all.includes("nuxt.config")) frameworks.add("Nuxt");
  if (all.includes("svelte")) frameworks.add("Svelte");
  if (all.includes("angular.json") || all.includes("ng-")) frameworks.add("Angular");
  if (all.includes("django")) frameworks.add("Django");
  if (all.includes("fastapi") || all.includes("fast_api")) frameworks.add("FastAPI");
  if (all.includes("flask")) frameworks.add("Flask");
  if (all.includes("rails") || all.includes("gemfile")) frameworks.add("Rails");
  if (all.includes("spring")) frameworks.add("Spring");
  if (all.includes("express")) frameworks.add("Express");

  // Build tools
  if (all.includes("vite.config")) build.add("Vite");
  if (all.includes("webpack.config")) build.add("Webpack");
  if (all.includes("rollup.config")) build.add("Rollup");
  if (all.includes("turbo.json")) build.add("Turborepo");
  if (all.includes("cargo.toml")) build.add("Cargo");
  if (all.includes("makefile")) build.add("Make");
  if (all.includes("gradle")) build.add("Gradle");
  if (all.includes("pom.xml")) build.add("Maven");
  if (all.includes("package.json")) build.add("npm/yarn");
  if (all.includes("docker")) build.add("Docker");
  if (all.includes("dockerfile")) build.add("Docker");

  // Databases
  if (all.includes("postgres") || all.includes("postgresql")) databases.add("PostgreSQL");
  if (all.includes("mysql") || all.includes("mariadb")) databases.add("MySQL");
  if (all.includes("mongodb") || all.includes("mongoose")) databases.add("MongoDB");
  if (all.includes("redis")) databases.add("Redis");
  if (all.includes("sqlite")) databases.add("SQLite");
  if (all.includes("prisma")) databases.add("Prisma");
  if (all.includes("supabase")) databases.add("Supabase");
  if (all.includes("firebase")) databases.add("Firebase");

  // CI/CD
  if (all.includes(".github/workflows")) cicd.add("GitHub Actions");
  if (all.includes("gitlab-ci")) cicd.add("GitLab CI");
  if (all.includes("circleci")) cicd.add("CircleCI");
  if (all.includes("jenkinsfile")) cicd.add("Jenkins");
  if (all.includes("travis.yml")) cicd.add("Travis CI");
  if (all.includes("vercel.json") || all.includes(".vercel")) cicd.add("Vercel");

  return {
    languages: [...languages],
    frameworks: [...frameworks],
    build: [...build],
    databases: [...databases],
    cicd: [...cicd],
  };
}

/**
 * Pick the most important files to show
 */
function pickKeyFiles(files) {
  const priority = [
    "readme.md", "readme.txt",
    "package.json", "cargo.toml", "pyproject.toml", "go.mod",
    "dockerfile", "docker-compose.yml",
    ".github/workflows",
    "src/index", "src/main", "src/app",
    "main.py", "app.py", "server.py",
    "main.go", "main.rs",
  ];
  const scored = files.map(f => {
    const lower = f.toLowerCase();
    const score = priority.findIndex(p => lower.includes(p));
    return { f, score: score === -1 ? 999 : score };
  });
  scored.sort((a, b) => a.score - b.score);
  return scored.slice(0, 5).map(s => s.f);
}

/**
 * Generate AI summary using Claude
 */
async function generateSummary(repoInfo, files, techStack) {
  const fileList = files.slice(0, 80).join("\n");
  const prompt = `You are analyzing a GitHub repository. Provide a concise, insightful analysis.

Repository: ${repoInfo.fullName}
Description: ${repoInfo.description}
Primary Language: ${repoInfo.language || "unknown"}
Topics: ${repoInfo.topics.join(", ") || "none"}

Tech stack detected:
- Languages: ${techStack.languages.join(", ") || "none"}
- Frameworks: ${techStack.frameworks.join(", ") || "none"}
- Build tools: ${techStack.build.join(", ") || "none"}
- Databases: ${techStack.databases.join(", ") || "none"}
- CI/CD: ${techStack.cicd.join(", ") || "none"}

Key file paths (sample):
${fileList}

Respond in JSON only. No markdown, no explanation:
{
  "summary": "2-3 sentence plain-text overview of what this project does and who it's for. Be specific.",
  "architectureNotes": "2-3 sentences describing the technical architecture. Reference specific technologies and patterns using backtick-quoted \`names\` where appropriate."
}`;

  const text = await callClaude([{ role: "user", content: prompt }],
    "You are a senior software architect. Always respond with valid JSON only, no preamble.");

  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return {
      summary: text.split("\n")[0] || "Analysis complete.",
      architectureNotes: "",
    };
  }
}

/**
 * Main analysis function
 */
export async function analyzeRepo(url) {
  const { owner, repo } = parseGitHubUrl(url);
  const repoInfo = await fetchRepoInfo(owner, repo);
  const files = await fetchRepoTree(owner, repo, repoInfo.defaultBranch);
  const techStack = detectTechStack(files, repoInfo);
  const keyFiles = pickKeyFiles(files);
  const { summary, architectureNotes } = await generateSummary(repoInfo, files, techStack);

  return {
    repo: {
      ...repoInfo,
      analyzedAt: "just now",
      cached: false,
    },
    techStack,
    keyFiles,
    summary,
    architectureNotes,
  };
}

/**
 * Ask a follow-up question about the repo
 */
export async function askQuestion(question, repoContext) {
  const { repo, techStack, summary, architectureNotes } = repoContext;

  const system = `You are Ghost Intern, an AI assistant that has just analyzed the GitHub repository ${repo?.fullName || "unknown"}. 
Answer questions concisely and accurately based on the repository context.
Always respond with JSON: { "text": "your answer", "confidence": "high"|"medium"|"low" }`;

  const context = `Repository: ${repo?.fullName}
Description: ${repo?.description}
Tech stack: ${JSON.stringify(techStack)}
Summary: ${summary}
Architecture: ${architectureNotes}`;

  const userMsg = `Context:\n${context}\n\nQuestion: ${question}`;

  const text = await callClaude(
    [{ role: "user", content: userMsg }],
    system
  );

  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return { text: text || "I couldn't generate a response.", confidence: "low" };
  }
}
