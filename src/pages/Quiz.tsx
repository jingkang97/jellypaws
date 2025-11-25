import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import questions from "../data/questions.json";
import QuestionCard from "../components/QuestionCard";
import ProgressBar from "../components/ProgressBar";
import type { Question } from "../types";

const Quiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const history = useHistory();

  // Clear stored quiz data when starting a new quiz
  useEffect(() => {
    localStorage.removeItem("jellypaws_quiz_answers");
  }, []);

  const handleAnswerSelection = (answer: string) => {
    const nextAnswers = [...userAnswers, answer];
    setUserAnswers(nextAnswers);

    const isLast = currentQuestionIndex >= questions.length - 1;
    if (isLast) {
      // Save completed quiz answers to localStorage for persistence
      localStorage.setItem(
        "jellypaws_quiz_answers",
        JSON.stringify(nextAnswers)
      );
      // navigate to results and pass answers in route state
      history.push("/results", { userAnswers: nextAnswers });
    } else {
      setCurrentQuestionIndex((idx) => idx + 1);
    }
  };

  const current: Question = questions[currentQuestionIndex];
  if (!current) return <div>Loading...</div>;

  return (
    <div className="quiz-container">
      <ProgressBar
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
      />
      <QuestionCard
        question={current}
        onAnswerSelected={handleAnswerSelection}
      />
    </div>
  );
};

export default Quiz;
