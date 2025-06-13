import type { Question, ExamType } from '@/types/exam';

const GITHUB_RAW_URLS = {
  technician: 'https://raw.githubusercontent.com/ny0e/ham_radio_question_pool/master/technician-2022-2026/technician.json',
  general: 'https://raw.githubusercontent.com/ny0e/ham_radio_question_pool/master/general-2023-2027/general.json',
  extra: 'https://raw.githubusercontent.com/ny0e/ham_radio_question_pool/master/extra-2024-2028/extra.json'
};

const questionCache = new Map<ExamType, Question[]>();

export async function getExamData(examType: ExamType): Promise<Question[]> {
  if (questionCache.has(examType)) {
    return questionCache.get(examType)!;
  }

  const cacheKey = `ham-questions-${examType}`;
  const cachedData = localStorage.getItem(cacheKey);
  
  if (cachedData) {
    try {
      const questions = JSON.parse(cachedData);
      questionCache.set(examType, questions);
      return questions;
    } catch (error) {
      console.warn('Failed to parse cached data, fetching fresh');
    }
  }

  try {
    const response = await fetch(GITHUB_RAW_URLS[examType]);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    const rawData = await response.json();
    const questions: Question[] = rawData.map((item: any) => ({
      id: item.id,
      question: item.question,
      answers: item.answers,
      correct: item.correct,
      refs: item.refs,
      subelement: extractSubelement(item.id),
      section: extractSection(item.id)
    }));
    
    questionCache.set(examType, questions);
    localStorage.setItem(cacheKey, JSON.stringify(questions));
    
    return questions;
  } catch (error) {
    console.error(`Failed to load ${examType} questions:`, error);
    return [];
  }
}

function extractSubelement(id: string): string {
  const match = id.match(/^([A-Z]\d+[A-Z])/);
  return match ? match[1] : '';
}

function extractSection(id: string): string {
  const match = id.match(/^([A-Z]\d+[A-Z]\d+)/);
  return match ? match[1] : '';
}
9. Create src/utils/userProgress.ts (Progress Tracking)
import type { UserProgress, TestScore, ExamType } from '@/types/exam';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export async function getUserProgress(examType: ExamType): Promise<UserProgress> {
  const user = auth.currentUser;
  
  if (user) {
    try {
      const docRef = doc(db, 'users', user.uid, 'progress', examType);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as UserProgress;
      }
    } catch (error) {
      console.error('Error fetching progress from Firebase:', error);
    }
  }
  
  const localKey = `progress-${examType}`;
  const localData = localStorage.getItem(localKey);
  return localData ? JSON.parse(localData) : {};
}

export async function updateUserProgress(
  examType: ExamType, 
  questionId: string, 
  isCorrect: boolean
): Promise<void> {
  const currentProgress = await getUserProgress(examType);
  
  const questionProgress = currentProgress[questionId] || {
    correct: 0,
    incorrect: 0,
    consecutiveCorrect: 0,
    lastSeen: Date.now()
  };

  if (isCorrect) {
    questionProgress.correct += 1;
    questionProgress.consecutiveCorrect += 1;
  } else {
    questionProgress.incorrect += 1;
    questionProgress.consecutiveCorrect = 0;
  }
  
  questionProgress.lastSeen = Date.now();
  currentProgress[questionId] = questionProgress;

  const user = auth.currentUser;
  
  if (user) {
    try {
      const docRef = doc(db, 'users', user.uid, 'progress', examType);
      await setDoc(docRef, currentProgress);
    } catch (error) {
      console.error('Error saving progress to Firebase:', error);
    }
  }
  
  const localKey = `progress-${examType}`;
  localStorage.setItem(localKey, JSON.stringify(currentProgress));
}

export async function saveTestScore(score: TestScore): Promise<void> {
  const user = auth.currentUser;
  
  if (user) {
    try {
      const scoresRef = doc(db, 'users', user.uid, 'scores', `${score.examType}-${score.date}`);
      await setDoc(scoresRef, score);
    } catch (error) {
      console.error('Error saving test score to Firebase:', error);
    }
  }
  
  const localKey = `scores-${score.examType}`;
  const existingScores = JSON.parse(localStorage.getItem(localKey) || '[]');
  existingScores.push(score);
  localStorage.setItem(localKey, JSON.stringify(existingScores));
}
