import { useEffect, useState } from "react";

import Layout from "../components/Layout";

export default function Settings() {
  const [theme, setTheme] =
    useState("dark");

  useEffect(() => {
    const savedTheme =
      localStorage.getItem(
        "theme"
      ) || "dark";

    setTheme(savedTheme);

    if (savedTheme === "light") {
      document.body.classList.add(
        "light-theme"
      );
    }
  }, []);

  const toggleTheme = () => {
    const newTheme =
      theme === "dark"
        ? "light"
        : "dark";

    setTheme(newTheme);

    localStorage.setItem(
      "theme",
      newTheme
    );

    if (newTheme === "light") {
      document.body.classList.add(
        "light-theme"
      );
    } else {
      document.body.classList.remove(
        "light-theme"
      );
    }
  };

  return (
    <Layout>
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "72px",

            fontWeight: "900",

            letterSpacing:
              "-3px",

            color:
              "var(--text-primary)",

            marginBottom:
              "50px",
          }}
        >
          Settings
        </h1>

        <div
          style={{
            width: "340px",

            background:
              "var(--card-bg)",

            border:
              "1px solid var(--border-color)",

            borderRadius: "28px",

            padding: "32px",

            backdropFilter:
              "blur(14px)",

            boxShadow:
              "0 10px 40px rgba(0,0,0,0.18)",
          }}
        >
          <h2
            style={{
              fontSize: "32px",

              color:
                "var(--text-primary)",

              marginBottom:
                "28px",
            }}
          >
            Theme
          </h2>

          <button
            onClick={toggleTheme}
            style={{
              border: "none",

              background:
                "linear-gradient(135deg, #8b5cf6, #6366f1)",

              color: "#fff",

              padding:
                "16px 24px",

              borderRadius: "16px",

              fontSize: "16px",

              fontWeight: "700",

              cursor: "pointer",

              width: "100%",

              transition:
                "0.2s ease",
            }}
          >
            {theme === "dark"
              ? "Switch to Light Mode"
              : "Switch to Dark Mode"}
          </button>
        </div>
      </div>
    </Layout>
  );
}