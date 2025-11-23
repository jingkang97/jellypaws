export interface AnswerOption {
  text: string;
  value: string;
}

export interface Question {
  id?: number;
  text?: string; // Optional text field
  question?: string; // Optional question field
  options?: AnswerOption[]; // Optional array of AnswerOption
  answers?: AnswerOption[]; // Change to an array of AnswerOption
}
