import React from "react";

interface ProgressBarProps {
  currentQuestionIndex: number;
  totalQuestions: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentQuestionIndex,
  totalQuestions,
}) => {
  const percent = Math.round(
    ((currentQuestionIndex + 1) / Math.max(1, totalQuestions)) * 100
  );

  return (
    <div className="progress-bar" aria-hidden>
      <div
        className="progress-bar__track"
        style={{ background: "#eee", height: 8, borderRadius: 4 }}
      >
        <div
          className="progress-bar__fill"
          style={{
            width: `${percent}%`,
            height: "100%",
            background: "#4f46e5",
            borderRadius: 4,
            transition: "width 200ms ease",
          }}
        />
      </div>
      <div
        className="progress-bar__label"
        style={{ marginTop: 8, fontSize: 12 }}
      >
        Question {Math.min(currentQuestionIndex + 1, totalQuestions)} /{" "}
        {totalQuestions}
      </div>
    </div>
  );
};

export default ProgressBar;
