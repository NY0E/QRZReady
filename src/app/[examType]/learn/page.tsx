'use client';


import { useState, useEffect , useMemo} from 'react';
import { getExamData } from '@/utils/examData';
import { getUserProgress, updateUserProgress } from '@/utils/userProgress';
import { useAuth } from '@/contexts/AuthContext';
import type { Question, ExamType, UserProgress } from '@/types/exam';
import { getMilestoneForCount } from '@/data/milestones';
import MilestoneCelebration from '@/components/MilestoneCelebration';
import PomodoroBreak from '@/components/PomodoroBreak';
import { getRandomStudyBreakFactoid, StudyBreakFactoid } from '@/data/studyBreakFactoids';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import { startStudySession, touchStudySessionEnd, logAttempt, logPassMilestone } from '@/utils/studyLogging';

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
    const [currentMilestone, setCurrentMilestone] = useState<ReturnType<typeof getMilestoneForCount>>(null);
  const [shownMilestones, setShownMilestones] = useState<Set<number>>(new Set());
    
  // Pomodoro timer state
  const [pomodoroStartTime, setPomodoroStartTime] = useState<number | null>(null);
  const [showPomodoroBreak, setShowPomodoroBreak] = useState(false);
  const [currentFactoid, setCurrentFactoid] = useState<StudyBreakFactoid | null>(null);

  // Instrumentation: study session + per-question response timing
  const [studySessionId, setStudySessionId] = useState<string | null>(null);
  const [questionDisplayedAt, setQuestionDisplayedAt] = useState<number>(Date.now());

  // Adaptive difficulty: memoized on the question + mastery level, NOT on
  // selectedAnswer/showResult, so the distractor set shown doesn't change
  // out from under the user after they click an answer.
  const adaptiveAnswers = useMemo(() => {
    const question = studySet[currentQuestionIndex];
    if (!question) {
      return { stage: '', stageColor: '', availableAnswers: [] as Array<{ text: string; index: number }>, fullSetUnlocked: false, distractorCount: 0 };
    }

    const consecutiveCorrect = userProgress[question.id]?.consecutiveCorrect || 0;
    let stage: string;
    let stageColor: string;
    let availableAnswers: Array<{ text: string; index: number }>;

    if (consecutiveCorrect === 0) {
      stage = "First Time (1 choice)";
      stageColor = "text-sky-400";
      availableAnswers = [{ text: question.answers[question.correct], index: question.correct }];
    } else if (consecutiveCorrect === 1) {
      stage = "Basic Practice (2 choices)";
      stageColor = "text-orange-400";
      const wrongAnswers = question.answers
        .map((answer, index) => ({ text: answer, index }))
        .filter(answer => answer.index !== question.correct);
      const randomWrong = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
      availableAnswers = [
        { text: question.answers[question.correct], index: question.correct },
        randomWrong
      ].sort(() => Math.random() - 0.5);
    } else if (consecutiveCorrect <= 3) {
      stage = "Intermediate Practice (3 choices)";
      stageColor = "text-yellow-400";
      const wrongAnswers = question.answers
        .map((answer, index) => ({ text: answer, index }))
        .filter(answer => answer.index !== question.correct);
      const randomWrongs = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 2);
      availableAnswers = [
        { text: question.answers[question.correct], index: question.correct },
        ...randomWrongs
      ].sort(() => Math.random() - 0.5);
    } else {
      stage = "Mastery Mode (4 choices)";
      stageColor = "text-emerald-400";
      availableAnswers = [...question.answers]
        .map((answer, index) => ({ text: answer, index }))
        .sort(() => Math.random() - 0.5);
    }

    return {
      stage,
      stageColor,
      availableAnswers,
      fullSetUnlocked: consecutiveCorrect >= 4,
      distractorCount: availableAnswers.length - 1
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studySet, currentQuestionIndex, userProgress[studySet[currentQuestionIndex]?.id]?.consecutiveCorrect]);

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

  // Instrumentation: start a study_sessions row once examType is known,
  // and mark it "ended" (a last-known-active heartbeat) on tab hide / unmount.
  useEffect(() => {
    if (!examType) return;

    let sessionId: string | null = null;
    let cancelled = false;

    startStudySession(examType).then(id => {
      if (!cancelled) {
        sessionId = id;
        setStudySessionId(id);
      }
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && sessionId) {
        touchStudySessionEnd(sessionId);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (sessionId) {
        touchStudySessionEnd(sessionId);
      }
    };
  }, [examType]);

  // Reset the response-time clock whenever a new question is shown
  useEffect(() => {
    setQuestionDisplayedAt(Date.now());
  }, [currentQuestionIndex, studySet]);

    // Pomodoro timer - check every minute if 25 minutes have passed
  useEffect(() => {
    if (!pomodoroStartTime) {
      // Initialize timer when component mounts
      setPomodoroStartTime(Date.now());
      return;
    }

    const checkInterval = setInterval(() => {
      const elapsed = Date.now() - pomodoroStartTime;
      const TWENTY_FIVE_MINUTES = 25 * 60 * 1000;

      if (elapsed >= TWENTY_FIVE_MINUTES && !showPomodoroBreak) {
        // Time for a break!
        setCurrentFactoid(getRandomStudyBreakFactoid());
        setShowPomodoroBreak(true);
        // Reset timer for next session
        setPomodoroStartTime(Date.now());
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, [pomodoroStartTime, showPomodoroBreak]);

  const handleReportPass = () => {
    if (!examType) return;
    const scoreInput = window.prompt('What score did you get (0-100)? Leave blank to skip.');
    const parsedScore = scoreInput ? parseFloat(scoreInput) : NaN;
    logPassMilestone({
      examType,
      milestoneType: 'real_exam',
      score: Number.isFinite(parsedScore) ? parsedScore : undefined
    });
    window.alert('Logged — thanks, and congratulations! 🎉');
  };

  const handleClosePomodoroBreak = () => {
    setShowPomodoroBreak(false);
    // Reset timer to start new 25-minute session
    setPomodoroStartTime(Date.now());
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
  };

  const handleNext = async () => {
    if (selectedAnswer !== null && examType && studySet.length > 0) {
      const currentQuestion = studySet[currentQuestionIndex];
      const isCorrect = selectedAnswer === currentQuestion.correct;
      const consecutiveCorrectBefore = userProgress[currentQuestion.id]?.consecutiveCorrect || 0;

      // Instrumentation: log this attempt against the distractor set that was
      // actually shown (adaptiveAnswers is memoized on this exact question)
      logAttempt({
        sessionId: studySessionId,
        examType,
        questionId: currentQuestion.id,
        consecutiveCorrectBefore,
        distractorCount: adaptiveAnswers.distractorCount,
        distractorsShown: adaptiveAnswers.availableAnswers
          .filter(a => a.index !== currentQuestion.correct)
          .map(a => a.text),
        fullSetUnlocked: adaptiveAnswers.fullSetUnlocked,
        selectedAnswerIndex: selectedAnswer,
        correctAnswerIndex: currentQuestion.correct,
        isCorrect,
        responseTimeMs: Date.now() - questionDisplayedAt
      });

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

               // Check for milestone achievements
               const totalMastered = Object.values(newUserProgress).filter(p => p && typeof p === 'object' && 'consecutiveCorrect' in p && p.consecutiveCorrect >= 4).length;
               const milestone = getMilestoneForCount(totalMastered);

               if (milestone && !shownMilestones.has(milestone.milestone)) {
                          setCurrentMilestone(milestone);
                          setShownMilestones(prev => new Set([...Array.from(prev), milestone.milestone]));
                        }
        
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
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber mx-auto mb-4"></div>
          <p className="text-ink-mid font-mono text-sm">Building your personalized study set...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center p-6 bg-red-950/30 border border-red-900 rounded-lg max-w-md">
          <h2 className="text-lg font-mono font-medium text-red-400 mb-2">Error Loading Study Session</h2>
          <p className="text-red-300/80 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-900 text-red-100 font-mono px-4 py-2 rounded hover:bg-red-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!examType || studySet.length === 0) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center p-6 bg-amber-bg border border-amber-dim rounded-lg max-w-md">
          <h2 className="text-lg font-mono font-medium text-amber mb-2">🎉 Great Progress!</h2>
          <p className="text-ink-mid text-sm mb-4">
            Generating your next study set based on your learning progress...
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-amber text-bg font-mono font-medium px-4 py-2 rounded hover:bg-amber/90 transition-colors"
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

// Calculate total mastery progress
const totalMastered = Object.values(userProgress).filter(p => p && typeof p === 'object' && 'consecutiveCorrect' in p && p.consecutiveCorrect >= 4).length;
const masteryPercentage = allQuestions.length > 0 ? Math.round((totalMastered / allQuestions.length) * 100) : 0;

// Get mastery color based on percentage
const getMasteryColor = () => {
  if (masteryPercentage >= 75) return "text-emerald-400";
  if (masteryPercentage >= 40) return "text-yellow-400";
  return "text-amber";
};

  // Adaptive difficulty (memoized above in adaptiveAnswers, keyed on question + mastery level)
  const { stage, stageColor, availableAnswers, fullSetUnlocked } = adaptiveAnswers;

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {examType === 'technician' && (
          <AnnouncementBanner
            id="technician-2026-2030"
            message="The Technician question pool was updated to 2026-2030 on July 1, 2026 — QRZReady is fully up to date."
            linkHref="/changelog"
            linkText="See what changed"
          />
        )}

        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-mono font-medium text-ink capitalize">
              {examType} Learn Mode
            </h1>
            <div className="text-sm text-ink-mid font-mono">
              Question {currentQuestionIndex + 1} of {studySet.length}
            </div>
          </div>

          {/* Study Set Info */}
          <div className="flex justify-between items-center mb-2">
            <div className={`text-sm font-mono font-medium ${stageColor}`}>
              {stage}
            </div>
            <div className="text-xs text-ink-dim font-mono">
              Study Set: {studySetStats.neverSeen} new • {studySetStats.needsPractice} practice • {studySetStats.needsReview} review • {studySetStats.mastered} mastered
            </div>
          </div>

          <div className="w-full bg-border rounded-full h-2">
            <div
              className="bg-amber h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / studySet.length) * 100}%` }}
            ></div>
          </div>

          {/* Session Stats */}
          {sessionStats.questionsAnswered > 0 && (
            <div className="text-xs text-ink-dim font-mono mt-2 text-center">
              Session: {sessionStats.correctAnswers}/{sessionStats.questionsAnswered} correct
              ({Math.round((sessionStats.correctAnswers / sessionStats.questionsAnswered) * 100)}%)
            </div>
          )}

{/* Overall Mastery Progress */}
<div className="text-xs font-mono mt-2 text-center">
  <span className={`font-medium ${getMasteryColor()}`}>
    🌟 {totalMastered}/{allQuestions.length} mastered ({masteryPercentage}%)
  </span>
  {masteryPercentage >= 75 && (
    <span className="ml-2 text-emerald-400">🎯 Exam Ready!</span>
  )}
</div>

        </div>

        {/* Question Card */}
        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm text-ink-mid font-mono">
              <span className="font-medium text-ink">{currentQuestion.id}</span>
              {currentQuestion.refs && (
                <span className="ml-2">{currentQuestion.refs}</span>
              )}
            </div>
            <div className="text-xs text-ink-dim font-mono">
              Consecutive: {consecutiveCorrect}
            </div>
          </div>

          <h2 className="text-lg font-medium text-ink mb-6">
            {currentQuestion.question}
          </h2>

          {currentQuestion.figure && (
            <img
              src={`/images/${currentQuestion.figure}`}
              alt={`Diagram for question ${currentQuestion.id}`}
              className="max-w-full mb-6 border border-border rounded-lg"
            />
          )}

          <div className="space-y-3">
            {availableAnswers.map((answer, displayIndex) => {
              const isSelected = selectedAnswer === answer.index;
              const isCorrectAnswer = answer.index === currentQuestion.correct;

              let buttonClass = "w-full text-left p-4 rounded-lg border transition-all ";

              if (showResult) {
                if (isCorrectAnswer) {
                  buttonClass += "bg-emerald-950/40 border-emerald-600 text-emerald-300";
                } else if (isSelected && !isCorrectAnswer) {
                  buttonClass += "bg-red-950/40 border-red-600 text-red-300";
                } else {
                  buttonClass += "bg-bg border-border text-ink-dim";
                }
              } else {
                if (isSelected) {
                  buttonClass += "bg-amber-bg border-amber text-amber";
                } else {
                  buttonClass += "bg-bg border-border text-ink hover:border-amber hover:bg-amber-bg";
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
            <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-emerald-950/30 text-emerald-300' : 'bg-red-950/30 text-red-300'}`}>
              <div className="font-medium">
                {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
              </div>
              {!isCorrect && (
                <div className="text-sm mt-1">
                  The correct answer is: {currentQuestion.answers[currentQuestion.correct]}
                </div>
              )}
              {isCorrect && consecutiveCorrect < 3 && (
                <div className="text-sm mt-1 text-emerald-400/90">
                  Great! Next time this question will have {consecutiveCorrect === 0 ? '2' : consecutiveCorrect === 1 ? '3' : '4'} choices.
                </div>
              )}
              {isCorrect && consecutiveCorrect === 3 && (
                <div className="text-sm mt-1 text-emerald-400/90">
                  🎉 One more correct answer and you'll master this question!
                </div>
              )}
              {isCorrect && consecutiveCorrect >= 4 && (
                <div className="text-sm mt-1 text-emerald-400/90">
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
            className="text-ink-mid hover:text-ink font-mono text-sm transition-colors"
          >
            ← Back to {examType} exam
         </button>

          {showResult && (
            <button
              onClick={handleNext}
              className="bg-amber text-bg font-mono font-medium px-6 py-2 rounded-lg hover:bg-amber/90 transition-colors"
            >
              Next Question →
            </button>
          )}
        </div>

        {/* User Status */}
        {user && (
          <div className="mt-6 text-center text-sm text-ink-dim font-mono">
            Studying as: {user.displayName || user.email} • Intelligent Study Set: {studySet.length} questions
          </div>
        )}

        {/* Trial instrumentation: self-reported pass milestone */}
        <div className="mt-2 text-center">
          <button
            onClick={handleReportPass}
            className="text-xs text-ink-dim hover:text-amber font-mono underline transition-colors"
          >
            🎉 Passed your {examType} exam? Report it
          </button>
        </div>

              {/* Milestone Celebration Modal */}
      {currentMilestone && (
        <MilestoneCelebration
          milestone={currentMilestone}
          onClose={() => setCurrentMilestone(null)}
        />
      )}

              {/* Pomodoro Break Modal */}
      {showPomodoroBreak && currentFactoid && (
        <PomodoroBreak
          factoid={currentFactoid}
          onClose={handleClosePomodoroBreak}
        />
      )}
      </div>
    </div>
  );
}
