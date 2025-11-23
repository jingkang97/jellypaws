import React, { useMemo } from "react";
import { useLocation, useHistory } from "react-router-dom";
import resultsData from "../data/results.json";

type LocationState = { userAnswers?: string[] };

const Results: React.FC = () => {
  const location = useLocation<LocationState>();
  const history = useHistory();
  const userAnswers = location.state?.userAnswers ?? [];

  const profile = useMemo(() => {
    // count letters
    const counts: Record<string, number> = {};
    userAnswers.forEach((v) => {
      const letter = String(v).toUpperCase();
      counts[letter] = (counts[letter] || 0) + 1;
    });

    // decide each dichotomy by comparing counts
    const pick = (a: string, b: string) => {
      const ca = counts[a] || 0;
      const cb = counts[b] || 0;
      if (ca === cb) return a; // deterministic tie-breaker
      return ca > cb ? a : b;
    };

    const typeKey =
      pick("E", "I") + pick("S", "N") + pick("T", "F") + pick("J", "P");

    // lookup results.json by key (e.g. "INFJ")
    // resultsData is an object keyed by MBTI-like keys
    // fallback to a generic object if not found
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

  if (userAnswers.length === 0) {
    return (
      <div style={{ padding: 20 }}>
        <h2>We have no idea what jelly are you :(</h2>
        <p>Please complete the quiz in its entirety first!</p>
        <button type="button" onClick={() => history.push("/")}>
          Back to home
        </button>
      </div>
    );
  }

  const { key, entry } = profile;

  return (
    <div className="results-page" style={{ padding: 20 }}>
      <h1>
        You are: {key} — {entry.name}
      </h1>
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
        <button
          style={{ marginLeft: 8 }}
          type="button"
          onClick={() => history.push("/")}
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default Results;
