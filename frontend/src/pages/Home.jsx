import { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import WorkspaceHeader from "../components/WorkspaceHeader";

import RepoInputCard from "../components/RepoInputCard";
import RepoHeaderCard from "../components/RepoHeaderCard";
import TechStackCard from "../components/TechStackCard";
import KeyFilesCard from "../components/KeyFilesCard";
import AISummaryCard from "../components/AISummaryCard";
import ChatCard from "../components/ChatCard";

import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

import {
  analyzeRepo,
  askQuestion,
} from "../services/api";

export default function Home() {
  const [state, setState] =
    useState("idle");

  const [error, setError] =
    useState("");

  const [data, setData] =
    useState(null);

  const [isMobile, setIsMobile] =
    useState(window.innerWidth < 900);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(
        window.innerWidth < 900
      );
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  const handleAnalyze = async (url) => {
    setState("loading");

    setError("");

    setData(null);

    try {
      const result =
        await analyzeRepo(url);

      setData(result);

      setState("results");
    } catch (e) {
      setError(
        e.message ||
          "Failed to analyze repository."
      );

      setState("error");
    }
  };

  const handleAsk = async (
    question
  ) => {
    return await askQuestion(
      question,
      data
    );
  };

  const handleRetry = () => {
    setState("idle");

    setError("");

    setData(null);
  };

  return (
    <div className="hero-glow">
      <Sidebar isMobile={isMobile} />

      <main
        style={{
          marginLeft: isMobile
            ? "0"
            : "240px",

          minHeight: "100vh",

          width: "100%",

          padding: isMobile
            ? "28px 18px 40px"
            : "48px 56px",

          position: "relative",

          zIndex: 2,

          overflowX: "hidden",

          boxSizing: "border-box",

          transition:
            "all 0.25s ease",
        }}
      >
        <div
          style={{
            width: "100%",

            maxWidth: "980px",

            margin: "0",

            paddingLeft: isMobile
              ? "0"
              : "40px",
          }}
        >
          <WorkspaceHeader
            isMobile={isMobile}
          />

          <RepoInputCard
            onAnalyze={handleAnalyze}
            loading={
              state === "loading"
            }
          />

          {state === "loading" && (
            <div
              style={{
                marginTop: "32px",
              }}
            >
              <LoadingState />
            </div>
          )}

          {state === "error" && (
            <div
              style={{
                marginTop: "32px",
              }}
            >
              <ErrorState
                message={error}
                onRetry={handleRetry}
              />
            </div>
          )}

          {state === "results" &&
            data && (
              <div
                className="animate-in"
                style={{
                  display: "flex",

                  flexDirection:
                    "column",

                  gap: "28px",

                  marginTop: "40px",
                }}
              >
                <RepoHeaderCard
                  repo={data.repo}
                />

                <div
                  style={{
                    display: "grid",

                    gridTemplateColumns:
                      isMobile
                        ? "1fr"
                        : "repeat(auto-fit, minmax(320px, 1fr))",

                    gap: "24px",
                  }}
                >
                  <TechStackCard
                    techStack={
                      data.techStack
                    }
                  />

                  <KeyFilesCard
                    files={
                      data.keyFiles
                    }
                  />
                </div>

                <AISummaryCard
                  summary={
                    data.summary
                  }
                  architectureNotes={
                    data.architectureNotes
                  }
                />

                <ChatCard
                  onAsk={handleAsk}
                  disabled={false}
                />
              </div>
            )}
        </div>
      </main>
    </div>
  );
}