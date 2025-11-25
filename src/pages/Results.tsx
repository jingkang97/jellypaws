import React, { useMemo, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import resultsData from "../data/results.json";
import questions from "../data/questions.json";

type LocationState = { userAnswers?: string[] };

const Results: React.FC = () => {
  const location = useLocation<LocationState>();
  const history = useHistory();

  // Try to get answers from route state first, fallback to localStorage
  const stateAnswers = location.state?.userAnswers;
  const storedAnswers = (() => {
    try {
      const stored = localStorage.getItem("jellypaws_quiz_answers");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure it's an array of strings
        return Array.isArray(parsed) ? (parsed as string[]) : null;
      }
      return null;
    } catch {
      return null;
    }
  })();

  const userAnswers: string[] = stateAnswers ?? storedAnswers ?? [];

  // Redirect if quiz is not completed (no answers or incomplete)
  useEffect(() => {
    if (userAnswers.length === 0 || userAnswers.length !== questions.length) {
      // Clear invalid stored data
      localStorage.removeItem("jellypaws_quiz_answers");
      history.replace("/");
    }
  }, [userAnswers.length, history]);

  const profile = useMemo(() => {
    const counts: Record<string, number> = {};
    userAnswers.forEach((v: string) => {
      const letter = String(v).toUpperCase();
      counts[letter] = (counts[letter] || 0) + 1;
    });

    const pick = (a: string, b: string) => {
      const ca = counts[a] || 0;
      const cb = counts[b] || 0;
      if (ca === cb) return a;
      return ca > cb ? a : b;
    };

    const typeKey =
      pick("E", "I") + pick("S", "N") + pick("T", "F") + pick("J", "P");

    const entry = (resultsData as any)[typeKey] ?? {
      name: "Unknown",
      summary: "No summary available.",
      traits: [],
      strengths: [],
      weaknesses: [],
      mostCompatible: [],
      leastCompatible: [],
    };

    return { key: typeKey, entry };
  }, [userAnswers]);

  // Show nothing while redirecting
  if (userAnswers.length === 0 || userAnswers.length !== questions.length) {
    return null;
  }

  const { key, entry } = profile;

  // image is served from public/jellys/<KEY>.png — fallback to DEFAULT.png on error
  const imgSrc = `/jellys/${key}.png`;

  return (
    <div className="results-page" style={{ padding: 20 }}>
      <h1>
        You are: {key} — {entry.name}
      </h1>

      <img
        src={imgSrc}
        alt={`${entry.name} result`}
        style={{
          maxWidth: 420,
          width: "100%",
          margin: "16px auto",
          display: "block",
        }}
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement;
          if (!target.dataset.fallback) {
            target.dataset.fallback = "1";
            target.src = "/jellys/DEFAULT.png";
          }
        }}
      />

      <p>{entry.summary}</p>

      <section>
        <h3>Top traits</h3>
        <ul>
          {(entry.traits || []).map((t: string, i: number) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Strengths</h3>
        <ul>
          {(entry.strengths || []).map((s: string, i: number) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Weaknesses</h3>
        <ul>
          {(entry.weaknesses || []).map((w: string, i: number) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Compatibility</h3>
        <div>
          <strong>Most compatible:</strong>{" "}
          {(entry.mostCompatible || []).join(", ")}
        </div>
        <div>
          <strong>Least compatible:</strong>{" "}
          {(entry.leastCompatible || []).join(", ")}
        </div>
      </section>

      <div style={{ marginTop: 16 }}>
        <button type="button" onClick={() => history.push("/quiz")}>
          Retake quiz
        </button>
        <button type="button" onClick={() => history.push("/")}>
          Home
        </button>
      </div>
    </div>
  );
};

export default Results;
