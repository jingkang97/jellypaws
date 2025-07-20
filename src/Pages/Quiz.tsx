// Quiz.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import questions from "../Data/questions.json";
import { QuestionCard } from "../Components/Question";

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleAnswer = (type: string) => {
    const nextAnswers = [...answers, type];
    if (current + 1 === questions.length) {
      const result = mostCommon(nextAnswers);
      navigate(`/result?type=${result}`);
    } else {
      setAnswers(nextAnswers);
      setCurrent(current + 1);
    }
  };

  return (
    <div>
      <p>
        Question {current + 1} of {questions.length}
      </p>
      <QuestionCard question={questions[current]} onAnswer={handleAnswer} />
    </div>
  );
}

function mostCommon(types: string[]): string {
  const freq = types.reduce<Record<string, number>>((acc, type) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
}
