import {
  useEffect,
  useState,
} from "react";

import Home from "./pages/Home";

import ThemeToggle from "./components/ThemeToggle";

import "./styles/globals.css";

export default function App() {
  const [dark, setDark] =
    useState(() => {
      return (
        localStorage.getItem(
          "theme"
        ) === "dark"
      );
    });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "dark"
      );
    } else {
      document.documentElement.classList.remove(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "light"
      );
    }
  }, [dark]);

  return (
    <div
      style={{
        position: "relative",

        minHeight: "100vh",
      }}
    >
      {/* THEME TOGGLE */}
      <div
        style={{
          position: "fixed",

          top: "22px",

          right: "22px",

          zIndex: 9999,

          display: "flex",

          alignItems: "center",

          justifyContent:
            "center",

          width: "52px",

          height: "52px",

          borderRadius: "18px",

          background:
            "var(--card-bg)",

          border:
            "1px solid var(--border-color)",

          backdropFilter:
            "blur(18px)",

          WebkitBackdropFilter:
            "blur(18px)",

          boxShadow:
            "var(--shadow-soft)",
        }}
      >
        <ThemeToggle
          dark={dark}
          setDark={setDark}
        />
      </div>

      {/* APP */}
      <Home />
    </div>
  );
}