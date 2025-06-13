import type { UserProgress, TestScore, ExamType } from '@/types/exam';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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
  
  // Fallback to localStorage
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
  
  // Save to Firebase if user is logged in
  if (user) {
    try {
      const docRef = doc(db, 'users', user.uid, 'progress', examType);
      await setDoc(docRef, currentProgress);
    } catch (error) {
      console.error('Error saving progress to Firebase:', error);
    }
  }
  
  // Always save to localStorage as backup
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
  
  // Save to localStorage as backup
  const localKey = `scores-${score.examType}`;
  const existingScores = JSON.parse(localStorage.getItem(localKey) || '[]');
  existingScores.push(score);
  localStorage.setItem(localKey, JSON.stringify(existingScores));
}
