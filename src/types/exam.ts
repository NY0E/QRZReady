export type ExamType = 'technician' | 'general' | 'extra';

export interface Question {
  id: string;
  question: string;
  answers: string[];
  correct: number;
  refs: string;
  subelement: string;
  section: string;
}

export interface UserProgress {
  [questionId: string]: {
    correct: number;
    incorrect: number;
    consecutiveCorrect: number;
    lastSeen: number;
  };
}

export interface TestScore {
  examType: ExamType;
  score: number;
  totalQuestions: number;
  date: number;
  timeSpent: number;
}
