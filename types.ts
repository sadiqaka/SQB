export enum QuestionType {
  MultipleChoice = 'multiple_choice',
  TrueFalse = 'true_false',
  FillInTheBlank = 'fill_in_the_blank',
  Matching = 'matching',
  CauseAndEffect = 'cause_and_effect',
}

export interface Question {
  id: string;
  questionText: string;
  questionType: QuestionType;
  options?: string[]; // For MC, Cause/Effect, and Matching options
  stems?: string[]; // For Matching stems
  correctAnswer: string | boolean | { [key: string]: string };
  explanation?: string;
}

export interface UserAnswer {
  questionId: string;
  answer: string | boolean | { [key: string]: string };
}

export interface QuizResult {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  answers: UserAnswer[];
  questions: Question[];
}