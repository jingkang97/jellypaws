import type { Question } from "../Types";
import "./Question.css";

type Props = {
  question: Question;
  onAnswer: (type: string) => void;
};

export const QuestionCard = ({ question, onAnswer }: Props) => (
  <div className="question-card">
    <h2>{question.question}</h2>
    <ul>
      {question.options.map((opt, idx) => (
        <li key={idx}>
          <button className="option-button" onClick={() => onAnswer(opt.type)}>
            {opt.text}
          </button>
        </li>
      ))}
    </ul>
  </div>
);
