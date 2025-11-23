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
      <div className="progress-bar__track">
        <div className="progress-bar__fill" style={{ width: `${percent}%` }} />
      </div>
      <div className="progress-bar__label">
        Question {Math.min(currentQuestionIndex + 1, totalQuestions)} /{" "}
        {totalQuestions}
      </div>
    </div>
  );
};

export default ProgressBar;
