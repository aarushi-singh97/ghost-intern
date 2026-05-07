def detect_technologies(package_json):
    technologies = []

    dependencies = package_json.get("dependencies", {})
    dev_dependencies = package_json.get("devDependencies", {})

    all_deps = {
        **dependencies,
        **dev_dependencies
    }

    dep_keys = [key.lower() for key in all_deps.keys()]

    if "react" in dep_keys:
        technologies.append("React")

    if "next" in dep_keys:
        technologies.append("Next.js")

    if "express" in dep_keys:
        technologies.append("Express")

    if "typescript" in dep_keys:
        technologies.append("TypeScript")

    if "mongoose" in dep_keys:
        technologies.append("MongoDB")

    if "tailwindcss" in dep_keys:
        technologies.append("Tailwind CSS")

    return technologies