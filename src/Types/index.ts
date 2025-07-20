export type PersonalityType =
  | "Introvert"
  | "Extrovert"
  | "Adventurer"
  | "Thinker";

export interface Option {
  text: string;
  type: PersonalityType;
}

export interface Question {
  id: number;
  question: string;
  options: Option[];
}
