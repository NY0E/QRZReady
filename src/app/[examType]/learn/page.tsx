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
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [studySet, setStudySet] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionStats, setSessionStats] = useState({
    questionsAnswered: 0,
    correctAnswers: 0
  });

  // Intelligent study set generation
  const generateStudySet = (questions: Question[], progress: UserProgress): Question[] => {
    try {
      // Categorize questions by learning status
      const categories = {
        neverSeen: [] as Question[],
        needsPractice: [] as Question[],     // 1 consecutive correct
        needsReview: [] as Question[],       // 2-3 consecutive correct
        mastered: [] as Question[]           // 4+ consecutive correct
      };

      questions.forEach(question => {
        const p = progress[question.id];
        if (!p || p.consecutiveCorrect === 0) {
          categories.neverSeen.push(question);
        } else if (p.consecutiveCorrect === 1) {
          categories.needsPractice.push(question);
        } else if (p.consecutiveCorrect >= 2 && p.consecutiveCorrect <= 3) {
          categories.needsReview.push(question);
        } else {
          categories.mastered.push(question);
        }
      });

      // Build study set with intelligent priority
      let studySet: Question[] = [];
      
      // Priority 1: Never seen questions (up to 6 slots)
      const neverSeenToAdd = Math.min(6, categories.neverSeen.length);
      studySet.push(...categories.neverSeen.slice(0, neverSeenToAdd));
      
      // Priority 2: Questions needing practice (fill remaining slots)
      const remainingSlots = 10 - studySet.length;
      if (remainingSlots > 0) {
        const practiceToAdd = Math.min(remainingSlots, categories.needsPractice.length);
        studySet.push(...categories.needsPractice.slice(0, practiceToAdd));
      }
      
      // Priority 3: Questions needing review (fill remaining slots)
      const stillRemaining = 10 - studySet.length;
      if (stillRemaining > 0) {
        const reviewToAdd = Math.min(stillRemaining, categories.needsReview.length);
        studySet.push(...categories.needsReview.slice(0, reviewToAdd));
      }
      
      // Priority 4: Include some mastered questions for retention (fill remaining slots)
      const finalRemaining = 10 - studySet.length;
      if (finalRemaining > 0) {
        const masteredToAdd = Math.min(finalRemaining, categories.mastered.length);
        studySet.push(...categories.mastered.slice(0, masteredToAdd));
      }

      // If we still don't have 10 questions, add more from any category
      if (studySet.length < 10) {
        const allAvailable = [...categories.neverSeen, ...categories.needsPractice, ...categories.needsReview, ...categories.mastered];
        const needed = 10 - studySet.length;
        const additional = allAvailable.filter(q => !studySet.includes(q)).slice(0, needed);
        studySet.push(...additional);
      }

      // Shuffle to avoid predictable order
      return studySet.sort(() => Math.random() - 0.5);
      
    } catch (error) {
      console.error('Error generating study set:', error);
      // Fallback: just return first 10 questions
      return questions.slice(0, 10);
    }
  };

  // Calculate study set statistics
  const getStudySetStats = () => {
    const stats = {
      neverSeen: 0,
      needsPractice: 0,
      needsReview: 0,
      mastered: 0
    };
    
    studySet.forEach(question => {
      const progress = userProgress[question.id];
      if (!progress || progress.consecutiveCorrect === 0) {
        stats.neverSeen++;
      } else if (progress.consecutiveCorrect === 1) {
        stats.needsPractice++;
      } else if (progress.consecutiveCorrect >= 2 && progress.consecutiveCorrect <= 3) {
        stats.needsReview++;
      } else {
        stats.mastered++;
      }
    });
    
    return stats;
  };

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
        
        setAllQuestions(questionData);
        setUserProgress(progressData);
        
        // Generate initial study set
        const initialStudySet = generateStudySet(questionData, progressData);
        setStudySet(initialStudySet);
        
      } catch (err) {
        console.error('Error loading data:', err);
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
    if (selectedAnswer !== null && examType && studySet.length > 0) {
      const currentQuestion = studySet[currentQuestionIndex];
      const isCorrect = selectedAnswer === currentQuestion.correct;
      
      // Update session stats
      setSessionStats(prev => ({
        questionsAnswered: prev.questionsAnswered + 1,
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0)
      }));
      
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
        
        currentProgress.lastSeen = Date.now();
        
        const newUserProgress = {
          ...userProgress,
          [currentQuestion.id]: currentProgress
        };
        setUserProgress(newUserProgress);
        
        // Check if question is now mastered (4+ consecutive correct)
        if (isCorrect && currentProgress.consecutiveCorrect >= 4) {
          // Question is mastered! Generate new study set
          const newStudySet = generateStudySet(allQuestions, newUserProgress);
          setStudySet(newStudySet);
          setCurrentQuestionIndex(0); // Reset to beginning of new set
        } else {
          // Move to next question in current study set
          setCurrentQuestionIndex((currentQuestionIndex + 1) % studySet.length);
        }
        
      } catch (error) {
        console.error('Error updating progress:', error);
        // Still move to next question even if progress save failed
        setCurrentQuestionIndex((currentQuestionIndex + 1) % studySet.length);
      }
    }
    
    setSelectedAnswer(null);
    setShowResult(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Building your personalized study set...</p>
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

  if (!examType || studySet.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-blue-50 rounded-lg max-w-md">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">🎉 Great Progress!</h2>
          <p className="text-blue-600 mb-4">
            Generating your next study set based on your learning progress...
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Continue Studying
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = studySet[currentQuestionIndex];
  const progress = userProgress[currentQuestion.id];
  const consecutiveCorrect = progress?.consecutiveCorrect || 0;
  const isCorrect = selectedAnswer === currentQuestion.correct;
  const studySetStats = getStudySetStats();

  // Adaptive difficulty logic
  let availableAnswers: Array<{ text: string; index: number }>;
  let stage: string;
  let stageColor: string;

  if (consecutiveCorrect === 0) {
    stage = "First Time (1 choice)";
    stageColor = "text-blue-600";
    availableAnswers = [{
      text: currentQuestion.answers[currentQuestion.correct],
      index: currentQuestion.correct
    }];
  } else if (consecutiveCorrect === 1) {
    stage = "Basic Practice (2 choices)";
    stageColor = "text-orange-600";
    const wrongAnswers = currentQuestion.answers
      .map((answer, index) => ({ text: answer, index }))
      .filter(answer => answer.index !== currentQuestion.correct);
    
    const randomWrong = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
    
    availableAnswers = [
      { text: currentQuestion.answers[currentQuestion.correct], index: currentQuestion.correct },
      randomWrong
    ].sort(() => Math.random() - 0.5);
    
  } else if (consecutiveCorrect <= 3) {
    stage = "Intermediate Practice (3 choices)";
    stageColor = "text-yellow-600";
    const wrongAnswers = currentQuestion.answers
      .map((answer, index) => ({ text: answer, index }))
      .filter(answer => answer.index !== currentQuestion.correct);
    
    const randomWrongs = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 2);
    
    availableAnswers = [
      { text: currentQuestion.answers[currentQuestion.correct], index: currentQuestion.correct },
      ...randomWrongs
    ].sort(() => Math.random() - 0.5);
    
  } else {
    stage = "Mastery Mode (4 choices)";
    stageColor = "text-green-600";
    availableAnswers = currentQuestion.answers.map((answer, index) => ({
      text: answer,
      index
    }));
  }

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
              Question {currentQuestionIndex + 1} of {studySet.length}
            </div>
          </div>
          
          {/* Study Set Info */}
          <div className="flex justify-between items-center mb-2">
            <div className={`text-sm font-medium ${stageColor}`}>
              {stage}
            </div>
            <div className="text-xs text-gray-500">
              Study Set: {studySetStats.neverSeen} new • {studySetStats.needsPractice} practice • {studySetStats.needsReview} review • {studySetStats.mastered} mastered
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / studySet.length) * 100}%` }}
            ></div>
          </div>

          {/* Session Stats */}
          {sessionStats.questionsAnswered > 0 && (
            <div className="text-xs text-gray-500 mt-2 text-center">
              Session: {sessionStats.correctAnswers}/{sessionStats.questionsAnswered} correct 
              ({Math.round((sessionStats.correctAnswers / sessionStats.questionsAnswered) * 100)}%)
            </div>
          )}
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{currentQuestion.id}</span>
              {currentQuestion.refs && (
                <span className="ml-2">{currentQuestion.refs}</span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              Consecutive: {consecutiveCorrect}
            </div>
          </div>

          <h2 className="text-lg font-medium text-gray-900 mb-6">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {availableAnswers.map((answer, displayIndex) => {
              const isSelected = selectedAnswer === answer.index;
              const isCorrectAnswer = answer.index === currentQuestion.correct;
              
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
                  key={answer.index}
                  onClick={() => !showResult && handleAnswerSelect(answer.index)}
                  disabled={showResult}
                  className={buttonClass}
                >
                  <span className="font-medium">
                    {String.fromCharCode(65 + displayIndex)}.
                  </span>
                  <span className="ml-2">{answer.text}</span>
                </button>
              );
            })}
          </div>

          {/* Result Message with Study Set Progression */}
          {showResult && (
            <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <div className="font-medium">
                {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
              </div>
              {!isCorrect && (
                <div className="text-sm mt-1">
                  The correct answer is: {currentQuestion.answers[currentQuestion.correct]}
                </div>
              )}
              {isCorrect && consecutiveCorrect < 3 && (
                <div className="text-sm mt-1 text-green-700">
                  Great! Next time this question will have {consecutiveCorrect === 0 ? '2' : consecutiveCorrect === 1 ? '3' : '4'} choices.
                </div>
              )}
              {isCorrect && consecutiveCorrect === 3 && (
                <div className="text-sm mt-1 text-green-700">
                  🎉 One more correct answer and you'll master this question!
                </div>
              )}
              {isCorrect && consecutiveCorrect >= 4 && (
                <div className="text-sm mt-1 text-green-700">
                  🌟 Question mastered! It will be replaced with a new question in your study set.
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
            Studying as: {user.displayName || user.email} • Intelligent Study Set: {studySet.length} questions
          </div>
        )}
      </div>
    </div>
  );
}
