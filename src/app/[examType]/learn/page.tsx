'use client';

import { useState, useEffect } from 'react';
import { getExamData } from '@/utils/examData';
import { getUserProgress } from '@/utils/userProgress';
import { useAuth } from '@/contexts/AuthContext';
import type { Question, ExamType, UserProgress } from '@/types/exam';

interface ExamPageProps {
  params: Promise<{ examType: string }>;
}

export default function ExamPage({ params }: ExamPageProps) {
  const { user } = useAuth();
  const [examType, setExamType] = useState<ExamType | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const resolvedParams = await params;
        const type = resolvedParams.examType as ExamType;
        setExamType(type);
        
        const [questionData, progressData] = await Promise.all([
          getExamData(type),
          getUserProgress(type)
        ]);
        
        if (questionData.length === 0) {
          throw new Error(`No questions found for ${type} exam`);
        }
        
        setQuestions(questionData);
        setUserProgress(progressData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params]);

  // Calculate comprehensive progress statistics
  const getProgressStats = () => {
    const stats = {
      total: questions.length,
      neverSeen: 0,
      learning: 0,      // 1 consecutive correct
      practicing: 0,    // 2-3 consecutive correct  
      mastered: 0,      // 4+ consecutive correct
      totalStudied: 0,
      averageCorrect: 0,
      readinessScore: 0
    };

    let totalCorrectAnswers = 0;
    let totalAttempts = 0;

    questions.forEach(question => {
      const progress = userProgress[question.id];
      if (!progress) {
        stats.neverSeen++;
      } else {
        stats.totalStudied++;
        totalCorrectAnswers += progress.correct;
        totalAttempts += progress.correct + progress.incorrect;

        if (progress.consecutiveCorrect === 1) {
          stats.learning++;
        } else if (progress.consecutiveCorrect >= 2 && progress.consecutiveCorrect <= 3) {
          stats.practicing++;
        } else if (progress.consecutiveCorrect >= 4) {
          stats.mastered++;
        }
      }
    });

    // Calculate average accuracy
    stats.averageCorrect = totalAttempts > 0 ? Math.round((totalCorrectAnswers / totalAttempts) * 100) : 0;

    // Calculate exam readiness score (weighted)
    const masteredWeight = stats.mastered * 4;
    const practicingWeight = stats.practicing * 2;
    const learningWeight = stats.learning * 1;
    const maxPossibleWeight = stats.total * 4;
    
    stats.readinessScore = maxPossibleWeight > 0 ? 
      Math.round(((masteredWeight + practicingWeight + learningWeight) / maxPossibleWeight) * 100) : 0;

    return stats;
  };

  // Get progress by subelement
  const getSubelementProgress = () => {
    const subelements: Record<string, {
      total: number;
      neverSeen: number;
      learning: number;
      practicing: number;
      mastered: number;
      name: string;
    }> = {};

    questions.forEach(question => {
      const sub = question.subelement;
      if (!subelements[sub]) {
        subelements[sub] = {
          total: 0,
          neverSeen: 0,
          learning: 0,
          practicing: 0,
          mastered: 0,
          name: sub
        };
      }
      
      subelements[sub].total++;
      
      const progress = userProgress[question.id];
      if (!progress) {
        subelements[sub].neverSeen++;
      } else if (progress.consecutiveCorrect === 1) {
        subelements[sub].learning++;
      } else if (progress.consecutiveCorrect >= 2 && progress.consecutiveCorrect <= 3) {
        subelements[sub].practicing++;
      } else if (progress.consecutiveCorrect >= 4) {
        subelements[sub].mastered++;
      }
    });

    return Object.values(subelements).sort((a, b) => a.name.localeCompare(b.name));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam data and progress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Exam Data</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!examType) return null;

  const progressStats = getProgressStats();
  const subelementProgress = getSubelementProgress();

  // Get exam requirements
  const getExamRequirements = () => {
    switch (examType) {
      case 'technician':
      case 'general':
        return { questionsOnExam: 35, passingScore: 26 };
      case 'extra':
        return { questionsOnExam: 50, passingScore: 37 };
      default:
        return { questionsOnExam: 35, passingScore: 26 };
    }
  };

  const examReqs = getExamRequirements();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 capitalize">
            {examType} License Exam
          </h1>
          <p className="text-lg text-gray-600">
            {questions.length} questions in official question pool
          </p>
        </div>

        {/* Overall Progress Dashboard */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Progress Overview</h2>
            {user ? (
              <span className="text-sm text-green-600">✓ Progress synced to your account</span>
            ) : (
              <span className="text-sm text-orange-600">⚠ Sign in to sync progress across devices</span>
            )}
          </div>

          {/* Progress Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{progressStats.readinessScore}%</div>
              <div className="text-sm text-blue-800">Exam Readiness</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{progressStats.mastered}</div>
              <div className="text-sm text-green-800">Mastered Questions</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{progressStats.practicing}</div>
              <div className="text-sm text-yellow-800">Practicing Questions</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{progressStats.neverSeen}</div>
              <div className="text-sm text-gray-800">Not Yet Studied</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Overall Progress</span>
              <span>{progressStats.totalStudied} / {progressStats.total} questions studied</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="flex h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-green-500"
                  style={{ width: `${(progressStats.mastered / progressStats.total) * 100}%` }}
                ></div>
                <div 
                  className="bg-yellow-500"
                  style={{ width: `${(progressStats.practicing / progressStats.total) * 100}%` }}
                ></div>
                <div 
                  className="bg-blue-500"
                  style={{ width: `${(progressStats.learning / progressStats.total) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>🟢 Mastered</span>
              <span>🟡 Practicing</span>
              <span>🔵 Learning</span>
              <span>⚪ Not Started</span>
            </div>
          </div>

          {/* Study Statistics */}
          {progressStats.totalStudied > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{progressStats.averageCorrect}%</div>
                <div className="text-sm text-gray-600">Average Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{examReqs.questionsOnExam}</div>
                <div className="text-sm text-gray-600">Questions on Real Exam</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{examReqs.passingScore}</div>
                <div className="text-sm text-gray-600">Needed to Pass</div>
              </div>
            </div>
          )}
        </div>

        {/* Study Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div 
            onClick={() => window.location.href = `/${examType}/learn`}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">📚 Adaptive Learning</h3>
            <p className="text-gray-600 mb-4">
              Smart study sessions that adapt difficulty as you improve. Focus on 10 questions at a time.
            </p>
            {progressStats.neverSeen > 0 ? (
              <div className="text-blue-600 font-medium">Start with {progressStats.neverSeen} new questions →</div>
            ) : progressStats.learning + progressStats.practicing > 0 ? (
              <div className="text-yellow-600 font-medium">Continue practicing {progressStats.learning + progressStats.practicing} questions →</div>
            ) : (
              <div className="text-green-600 font-medium">Review mastered questions →</div>
            )}
          </div>
          
          <div 
            onClick={() => window.location.href = `/${examType}/practice`}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">🎯 Practice Test</h3>
            <p className="text-gray-600 mb-4">
              Take a realistic practice exam with proper timing and scoring.
            </p>
            {progressStats.readinessScore >= 80 ? (
              <div className="text-green-600 font-medium">You're ready! Take practice exam →</div>
            ) : progressStats.readinessScore >= 60 ? (
              <div className="text-yellow-600 font-medium">Good progress! Try a practice test →</div>
            ) : (
              <div className="text-blue-600 font-medium">Build skills first, then practice →</div>
            )}
          </div>
        </div>

        {/* Subelement Progress Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Progress by Topic</h2>
          <div className="space-y-3">
            {subelementProgress.map((sub) => {
              const masteryPercentage = Math.round((sub.mastered / sub.total) * 100);
              const studiedPercentage = Math.round(((sub.mastered + sub.practicing + sub.learning) / sub.total) * 100);
              
              return (
                <div key={sub.name} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{sub.name}</span>
                    <div className="text-sm text-gray-600">
                      {sub.mastered} mastered / {sub.total} total ({masteryPercentage}%)
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="flex h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-green-500"
                        style={{ width: `${(sub.mastered / sub.total) * 100}%` }}
                      ></div>
                      <div 
                        className="bg-yellow-500"
                        style={{ width: `${(sub.practicing / sub.total) * 100}%` }}
                      ></div>
                      <div 
                        className="bg-blue-500"
                        style={{ width: `${(sub.learning / sub.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{sub.learning} learning • {sub.practicing} practicing • {sub.mastered} mastered</span>
                    <span>{sub.neverSeen} not started</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
