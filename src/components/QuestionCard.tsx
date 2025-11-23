import React from "react";
import type { Question } from "../types";

interface QuestionCardProps {
  question: Question;
  onAnswerSelected: (answer: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswerSelected,
}) => {
  const prompt = question.question ?? "Untitled question";

  // Normalize options: prefer answers (structured), fall back to options (AnswerOption[])
  const normalizedOptions: { label: string; value: string }[] =
    question.answers?.map((a) => ({ label: a.text, value: a.value })) ??
    question.options?.map((o) => ({ label: o.text, value: o.value })) ??
    [];

  return (
    <div
      className="question-card"
      role="group"
      aria-labelledby="question-title"
    >
      <h2 id="question-title">{prompt}</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {normalizedOptions.map((opt) => (
          <li key={opt.value} style={{ margin: "8px 0" }}>
            <button
              type="button"
              onClick={() => onAnswerSelected(opt.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #ddd",
                background: "#fff",
                textAlign: "left",
                cursor: "pointer",
                color: "#333",
              }}
            >
              {opt.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionCard;
