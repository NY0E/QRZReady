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
    // Study metrics
  totalStudyTimeMs?: number; // Total time spent studying in milliseconds
  pomodoroSessionsCompleted?: number; // Number of completed Pomodoro sessions
  studyDaysStreak?: number; // Current streak of consecutive study days
  lastStudyDate?: string; // Last date user studied (ISO format)
  studyDates?: string[]; // Array of dates when user studied
}

export interface TestScore {
  examType: ExamType;
  score: number;
  totalQuestions: number;
  date: number;
  timeSpent: number;
}
