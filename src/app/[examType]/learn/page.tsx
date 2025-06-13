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

  // Generate intelligent study set of 10 questions
  const generateStudySet = (questions: Question[], progress: UserProgress): Question[] => {
    // Categorize questions by progress level
    const neverSeen = questions.filter(q => !progress[q.id]);
    const needsPractice = questions.filter(q => {
      const p = progress[q.id];
      return p && p.consecutiveCorrect > 0 && p.consecutiveCorrect < 2;
    });
    const needsReview = questions.filter(q => {
      const p = progress[q.id];
      return p && p.consecutiveCorrect >= 2 && p.consecutiveCorrect < 4;
    });
    const mastered = questions.filter(q => {
      const p = progress[q.id];
      return p && p.consecutiveCorrect >= 4;
    });

    // Build study set with priority order
    let studySet: Question[] = [];
    
    // Priority 1: Never seen questions (up to 10)
    studySet.push(...neverSeen.slice(0, 10));
    
    // Priority 2: Questions needing practice (fill remaining slots)
    if (studySet.length < 10) {
      studySet.push(...needsPractice.slice(0, 10 - studySet.length));
    }
    
    // Priority 3: Questions needing review (fill remaining slots)
    if (studySet.length < 10) {
      studySet.push(...needsReview.slice(0, 10 - studySet.length));
    }
    
    // Priority 4: Include some mastered questions for retention (fill remaining slots)
    if (studySet.length < 10) {
      studySet.push(...mastered.slice(0, 10 - studySet.length));
    }

    // Shuffle the study set so it's not predictable
    return studySet.sort(() => Math.random() - 0.5);
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
        setError(err instanceof Error ? err.message : 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params]);

  // Get learning stage and available answers for current question
  const getCurrentQuestionData = () => {
    if (studySet.length === 0) return { stage: "", availableAnswers: [], consecutiveCorrect: 0 };
    
    const currentQuestion = studySet[currentQuestionIndex];
    const progress = userProgress[currentQuestion.id];
    const consecutiveCorrect = progress?.consecutiveCorrect || 0;
    
    let stage: string;
    let availableAnswers: Array<{ text: string; index: number; isCorrect: boolean }>;
    
    if (consecutiveCorrect === 0) {
      stage = "First Time (1 choice)";
      availableAnswers = [{
        text: currentQuestion.answers[currentQuestion.correct],
        index: currentQuestion.correct,
        isCorrect: true
      }];
    } else if (consecutiveCorrect === 1) {
      stage = "Basic Practice (2 choices)";
      const wrongAnswers = currentQuestion.answers
        .map((answer, index) => ({ text: answer, index, isCorrect: index === currentQuestion.correct }))
        .filter(answer => !answer.isCorrect);
      
      const randomWrong = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
      
      availableAnswers = [
        { text: currentQuestion.answers[currentQuestion.correct], index: currentQuestion.correct, isCorrect: true },
        randomWrong
      ].sort(() => Math.random() - 0.5);
      
    } else if (consecutiveCorrect <= 3) {
      stage = "Intermediate Practice (3 choices)";
      const wrongAnswers = currentQuestion.answers
        .map((answer, index) => ({ text: answer, index, isCorrect: index === currentQuestion.correct }))
        .filter(answer => !answer.isCorrect);
      
      const randomWrongs = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 2);
      
      availableAnswers = [
        { text: currentQuestion.answers[currentQuestion.correct], index: currentQuestion.correct, isCorrect: true },
        ...randomWrongs
      ].sort(() => Math.random() - 0.5);
      
    } else {
      stage = "Mastery Mode (4 choices)";
      availableAnswers = currentQuestion.answers.map((answer, index) => ({
        text: answer,
        index,
        isCorrect: index === currentQuestion.correct
      }));
    }
    
    return { stage, availableAnswers, consecutiveCorrect };
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
  };

  const handleNext = async () => {
    if (selectedAnswer !== null && examType && studySet.length > 0) {
      const currentQuestion = studySet[currentQuestionIndex];
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
        
        const newUserProgress = {
          ...userProgress,
          [currentQuestion.id]: currentProgress
        };
        setUserProgress(newUserProgress);
        
        // Check if we need to refresh the study set (if question is mastered)
        if (currentProgress.consecutiveCorrect >= 4) {
          // Generate new study set to replace mastered question
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
      if (!progress) {
        stats.neverSeen++;
      } else if (progress.consecutiveCorrect < 2) {
        stats.needsPractice++;
      } else if (progress.consecutiveCorrect < 4) {
        stats.needsReview++;
      } else {
        stats.mastered++;
      }
    });
    
    return stats;
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
          <h2 className="text-lg font-semibold text-blue-800 mb-2">🎉 Study Set Complete!</h2>
          <p className="text-blue-600 mb-4">
            Congratulations! You've made progress on all available questions. 
            Generating a new study set...
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
  const { stage, availableAnswers, consecutiveCorrect } = getCurrentQuestionData();
  const studySetStats = getStudySetStats();
  const isCorrect = selectedAnswer === currentQuestion.correct;

  // Get stage color
  const getStageColor = () => {
    if (consecutiveCorrect === 0) return "text-blue-600";
    if (consecutiveCorrect === 1) return "text-orange-600";
    if (consecutiveCorrect <= 3) return "text-yellow-600";
    return "text-green-600";
  };

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
          
          {/* Study Set Progress */}
          <div className="flex justify-between items-center mb-2">
            <div className={`text-sm font-medium ${getStageColor()}`}>
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
            <div className="text-xs text-gray-500">
              Consecutive Correct: {consecutiveCorrect}
            </div>
          </div>

          {/* Question Text */}
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            {currentQuestion.question}
          </h2>

          {/* Adaptive Answer Choices */}
          <div className="space-y-3">
            {availableAnswers.map((answer, displayIndex) => {
              const isSelected = selectedAnswer === answer.index;
              const isCorrectAnswer = answer.isCorrect;
              
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
              {isCorrect && consecutiveCorrect >= 3 && (
                <div className="text-sm mt-1 text-green-700">
                  🎉 You've mastered this question! It will be replaced with a new question in your study set.
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
            Studying as: {user.displayName || user.email} • Study Set: {studySet.length} questions
          </div>
        )}
      </div>
    </div>
  );
}
