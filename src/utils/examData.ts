import type { Question, ExamType } from '@/types/exam';

const GITHUB_RAW_URLS = {
  technician: 'https://raw.githubusercontent.com/ny0e/ham_radio_question_pool/master/technician-2026-2030/technician.json',
  general: 'https://raw.githubusercontent.com/ny0e/ham_radio_question_pool/master/general-2023-2027/general.json',
  extra: 'https://raw.githubusercontent.com/ny0e/ham_radio_question_pool/master/extra-2024-2028/extra.json'
};

const questionCache = new Map<ExamType, Question[]>();

export async function getExamData(examType: ExamType): Promise<Question[]> {
  if (questionCache.has(examType)) {
    return questionCache.get(examType)!;
  }

  // Versioned so cached clients pick up the 2026-2030 pool instead of stale data
  const cacheKey = `ham-questions-${examType}-v2`;
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
