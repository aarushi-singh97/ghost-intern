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
          maxWidth: "1280px",
          margin: "0 auto",
          paddingBottom: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "flex-start",
            gap: "50px",
            flexWrap: "wrap",
            marginBottom: "70px",
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
                  "12px 22px",
                borderRadius:
                  "999px",
                background:
                  "rgba(124,92,255,0.12)",
                border:
                  "1px solid rgba(124,92,255,0.22)",
                color: "#9f7aea",
                fontWeight: "700",
                marginBottom:
                  "30px",
                backdropFilter:
                  "blur(10px)",
                boxShadow:
                  "0 0 30px rgba(124,92,255,0.18)",
              }}
            >
              👻 Ghost Intelligence Workspace
            </div>

            <h1
              style={{
                fontSize:
                  "clamp(58px, 8vw, 110px)",
                lineHeight: "0.95",
                fontWeight: "900",
                letterSpacing:
                  "-5px",
                color: "#ffffff",
                marginBottom:
                  "34px",
                maxWidth: "900px",
                textShadow:
                  "0 0 35px rgba(255,255,255,0.08)",
              }}
            >
              Analyze
              repositories with
              AI-powered
              intelligence
            </h1>

            <p
              style={{
                fontSize: "21px",
                lineHeight: 1.9,
                color:
                  "rgba(255,255,255,0.72)",
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
              designed for modern
              engineers.
            </p>
          </div>

          <div
            style={{
              width: "320px",
              background:
                "rgba(15,23,42,0.75)",
              border:
                "1px solid rgba(255,255,255,0.08)",
              borderRadius: "30px",
              padding: "30px",
              backdropFilter:
                "blur(18px)",
              boxShadow:
                "0 0 45px rgba(124,92,255,0.12)",
            }}
          >
            <h3
              style={{
                color: "#ffffff",
                fontSize: "32px",
                marginBottom:
                  "18px",
                fontWeight: "800",
              }}
            >
              AI Analysis Engine
            </h3>

            <div
              style={{
                display: "flex",
                alignItems:
                  "center",
                gap: "14px",
                color:
                  "rgba(255,255,255,0.72)",
                fontSize: "17px",
                lineHeight: 1.5,
              }}
            >
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius:
                    "50%",
                  background:
                    "#22c55e",
                  boxShadow:
                    "0 0 20px #22c55e",
                }}
              />

              Real-time repository
              processing active
            </div>
          </div>
        </div>

        <div
          style={{
            background:
              "rgba(15,23,42,0.72)",
            border:
              "1px solid rgba(124,92,255,0.18)",
            borderRadius: "34px",
            padding: "28px",
            backdropFilter:
              "blur(18px)",
            boxShadow:
              "0 0 60px rgba(124,92,255,0.18)",
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