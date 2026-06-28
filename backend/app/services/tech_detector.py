def detect_technologies(
    package_json,
    requirements_text="",
):
    technologies = []

    dependencies = package_json.get(
        "dependencies",
        {}
    )

    dev_dependencies = package_json.get(
        "devDependencies",
        {}
    )

    all_deps = {
        **dependencies,
        **dev_dependencies,
    }

    for line in requirements_text.splitlines():
        name = line.strip().lower()

        if not name or name.startswith("#"):
            continue

        for separator in ["==", ">=", "<=", "~=", ">", "<", "[", ";"]:
            name = name.split(separator, 1)[0]

        all_deps[name.strip()] = ""

    tech_map = {
        # Frontend
        "react": "React",
        "next": "Next.js",
        "vue": "Vue.js",
        "angular": "Angular",
        "svelte": "Svelte",

        # Backend
        "express": "Express.js",
        "nestjs": "NestJS",
        "fastify": "Fastify",
        "@nestjs/core": "NestJS",

        # Python
        "fastapi": "FastAPI",
        "django": "Django",
        "flask": "Flask",
        "sqlalchemy": "SQLAlchemy",
        "pydantic": "Pydantic",

        # Styling
        "tailwindcss": "Tailwind CSS",
        "sass": "Sass",
        "styled-components": "Styled Components",

        # Databases
        "mongoose": "MongoDB",
        "pg": "PostgreSQL",
        "mysql": "MySQL",

        # Language / Tooling
        "typescript": "TypeScript",
        "vite": "Vite",
        "webpack": "Webpack",
        "@angular/core": "Angular",

        # Cloud / Services
        "firebase": "Firebase",
        "supabase": "Supabase",
        "google-generativeai": "Gemini",
        "google-genai": "Gemini",

        # Testing
        "jest": "Jest",
        "cypress": "Cypress",
    }

    for dependency in all_deps:
        normalized = dependency.lower()

        if normalized in tech_map:
            technologies.append(
                tech_map[normalized]
            )

    return sorted(
        list(set(technologies))
    )
