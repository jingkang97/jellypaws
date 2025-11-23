export interface AnswerOption {
  text: string;
  value: string;
}

export interface Question {
  id: number;
  question: string;
  options: AnswerOption[];
  answers?: AnswerOption[];
}
