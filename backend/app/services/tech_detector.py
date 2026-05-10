def detect_technologies(
    package_json,
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

        # Cloud / Services
        "firebase": "Firebase",
        "supabase": "Supabase",

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