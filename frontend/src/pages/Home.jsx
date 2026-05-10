import { useState } from "react";

import Layout from "../components/Layout";
import RepoInputCard from "../components/RepoInputCard";
import AnalysisGrid from "../components/AnalysisGrid";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

import {
  analyzeRepository,
} from "../services/api";

export default function Home() {
  const [repoUrl, setRepoUrl] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [data, setData] =
    useState(null);

  const handleAnalyze =
    async () => {
      if (!repoUrl.trim()) {
        setError(
          "Please enter repository URL"
        );

        return;
      }

      try {
        setLoading(true);

        setError("");

        const result =
          await analyzeRepository(
            repoUrl
          );

        setData(result);

        const existingRepos =
          JSON.parse(
            localStorage.getItem(
              "recentRepos"
            ) || "[]"
          );

        const updatedRepos = [
          repoUrl,
          ...existingRepos.filter(
            (repo) =>
              repo !== repoUrl
          ),
        ].slice(0, 5);

        localStorage.setItem(
          "recentRepos",
          JSON.stringify(
            updatedRepos
          )
        );
      } catch (err) {
        setError(
          "Failed to analyze repository"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <Layout>
      <div
        style={{
          width: "100%",
          maxWidth: "1250px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",

            justifyContent:
              "space-between",

            alignItems: "flex-start",

            gap: "40px",

            flexWrap: "wrap",

            marginBottom: "60px",
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: "320px",
            }}
          >
            <div
              style={{
                display: "inline-flex",

                alignItems: "center",

                gap: "10px",

                padding:
                  "10px 18px",

                borderRadius:
                  "999px",

                background:
                  "rgba(139, 92, 246, 0.12)",

                border:
                  "1px solid rgba(139, 92, 246, 0.2)",

                color: "#8b5cf6",

                fontWeight: "600",

                marginBottom:
                  "28px",
              }}
            >
              👻 Ghost Intelligence
              Workspace
            </div>

            <h1
              style={{
                fontSize:
                  "clamp(52px, 7vw, 92px)",

                lineHeight: 1,

                fontWeight: "900",

                letterSpacing:
                  "-4px",

                color:
                  "var(--text-primary)",

                marginBottom:
                  "28px",

                maxWidth: "900px",
              }}
            >
              Analyze repositories
              with AI-powered
              intelligence
            </h1>

            <p
              style={{
                fontSize: "20px",

                lineHeight: 1.8,

                color:
                  "var(--text-secondary)",

                maxWidth: "760px",
              }}
            >
              Explore repository
              architecture,
              technologies, code
              structure, and
              developer insights
              through an intelligent
              analysis workspace
              designed for
              engineers.
            </p>
          </div>

          <div
            style={{
              width: "320px",

              background:
                "var(--card-bg)",

              border:
                "1px solid var(--border-color)",

              borderRadius: "28px",

              padding: "28px",

              backdropFilter:
                "blur(14px)",

              boxShadow:
                "0 10px 40px rgba(0,0,0,0.15)",
            }}
          >
            <h3
              style={{
                color:
                  "var(--text-primary)",

                fontSize: "28px",

                marginBottom:
                  "14px",
              }}
            >
              AI Analysis Engine
            </h3>

            <div
              style={{
                display: "flex",

                alignItems:
                  "center",

                gap: "12px",

                color:
                  "var(--text-secondary)",

                fontSize: "16px",
              }}
            >
              <div
                style={{
                  width: "12px",

                  height: "12px",

                  borderRadius:
                    "50%",

                  background:
                    "#22c55e",

                  boxShadow:
                    "0 0 14px #22c55e",
                }}
              />

              Real-time repository
              processing active
            </div>
          </div>
        </div>

        <div
          style={{
            marginBottom: "40px",
          }}
        >
          <RepoInputCard
            repoUrl={repoUrl}
            setRepoUrl={setRepoUrl}
            onAnalyze={
              handleAnalyze
            }
            loading={loading}
          />
        </div>

        {loading && (
          <LoadingState />
        )}

        {error && (
          <ErrorState
            message={error}
          />
        )}

        {data && !loading && (
          <AnalysisGrid
            data={data}
          />
        )}
      </div>
    </Layout>
  );
}