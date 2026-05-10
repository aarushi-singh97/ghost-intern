import React from "react";

import ReactDOM from "react-dom/client";

import App from "./App";

import "./styles/globals.css";

const savedTheme =
  localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add(
    "dark"
  );
}

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);