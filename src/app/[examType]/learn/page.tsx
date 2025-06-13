'use client';

import { useState, useEffect } from 'react';
import { getExamData } from '@/utils/examData';
import { getUserProgress, updateUserProgress } from '@/utils/userProgress';
import { useAuth } from '@/contexts/AuthContext';
import type { Question, ExamType, UserProgress } from '@/types/exam';

interface LearnPageProps {
  params: Promise<{ examType: string }>;
}

export default function LearnPage({ params }: LearnPageProps) {
  const { user } = useAuth();
  const [examType, setExamType] = useState<ExamType | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
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

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
  };

  const handleNext = async () => {
    if (selectedAnswer !== null && examType) {
      const currentQuestion = questions[currentQuestionIndex];
      const isCorrect = selectedAnswer === currentQuestion.correct;
      
      // Update progress
      try {
        await updateUserProgress(examType, currentQuestion.id, isCorrect);
        
        // Update local progress state
        const currentProgress = userProgress[currentQuestion.id] || {
          correct: 0,
          incorrect: 0,
          consecutiveCorrect: 0,
          lastSeen: Date.now()
        };
        
        if (isCorrect) {
          currentProgress.correct += 1;
          currentProgress.consecutiveCorrect += 1;
        } else {
          currentProgress.incorrect += 1;
          currentProgress.consecutiveCorrect = 0;
        }
        
        setUserProgress(prev => ({
          ...prev,
          [currentQuestion.id]: currentProgress
        }));
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
    
    // Move to next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentQuestionIndex(0); // Loop back to beginning
    }
    
    setSelectedAnswer(null);
    setShowResult(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading study session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Study Session</h2>
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

  if (!examType || questions.length === 0) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const currentProgress = userProgress[currentQuestion.id];
  const isCorrect = selectedAnswer === currentQuestion.correct;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-gray-900 capitalize">
              {examType} Learn Mode
            </h1>
            <div className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          {/* Question Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{currentQuestion.id}</span>
              {currentQuestion.refs && (
                <span className="ml-2">{currentQuestion.refs}</span>
              )}
            </div>
            {currentProgress && (
              <div className="text-xs text-gray-500">
                Correct: {currentProgress.correct} | Consecutive: {currentProgress.consecutiveCorrect}
              </div>
            )}
          </div>

          {/* Question Text */}
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            {currentQuestion.question}
          </h2>

          {/* Answer Choices */}
          <div className="space-y-3">
            {currentQuestion.answers.map((answer, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = index === currentQuestion.correct;
              
              let buttonClass = "w-full text-left p-4 rounded-lg border transition-all ";
              
              if (showResult) {
                if (isCorrectAnswer) {
                  buttonClass += "bg-green-100 border-green-500 text-green-800";
                } else if (isSelected && !isCorrectAnswer) {
                  buttonClass += "bg-red-100 border-red-500 text-red-800";
                } else {
                  buttonClass += "bg-gray-50 border-gray-300 text-gray-600";
                }
              } else {
                if (isSelected) {
                  buttonClass += "bg-blue-100 border-blue-500 text-blue-800";
                } else {
                  buttonClass += "bg-white border-gray-300 text-gray-900 hover:border-blue-500 hover:bg-blue-50";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => !showResult && handleAnswerSelect(index)}
                  disabled={showResult}
                  className={buttonClass}
                >
                  <span className="font-medium">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="ml-2">{answer}</span>
                </button>
              );
            })}
          </div>

          {/* Result Message */}
          {showResult && (
            <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <div className="font-medium">
                {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
              </div>
              {!isCorrect && (
                <div className="text-sm mt-1">
                  The correct answer is {String.fromCharCode(65 + currentQuestion.correct)}: {currentQuestion.answers[currentQuestion.correct]}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => window.history.back()}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back to {examType} exam
          </button>
          
          {showResult && (
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next Question →
            </button>
          )}
        </div>

        {/* User Status */}
        {user && (
          <div className="mt-6 text-center text-sm text-gray-600">
            Studying as: {user.displayName || user.email}
          </div>
        )}
      </div>
    </div>
  );
}
