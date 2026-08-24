import { supabase } from '@/lib/supabase';
import { auth } from '@/lib/firebase';
import type { ExamType } from '@/types/exam';

const ANON_ID_KEY = 'qrzready-anon-id';

// Firebase UID when logged in, otherwise a stable per-browser id.
// This is a plain text label in Supabase, not a real auth identity.
export function getStudyUserId(): string {
  const uid = auth.currentUser?.uid;
  if (uid) return uid;

  let anonId = localStorage.getItem(ANON_ID_KEY);
  if (!anonId) {
    anonId = `anon-${crypto.randomUUID()}`;
    localStorage.setItem(ANON_ID_KEY, anonId);
  }
  return anonId;
}

// Writes go through SECURITY DEFINER RPC functions rather than direct table
// inserts — anon has no direct table grants, only execute on these.
export async function startStudySession(examType: ExamType): Promise<string | null> {
  const userId = getStudyUserId();
  const { data, error } = await supabase.rpc('rpc_start_study_session', {
    p_user_id: userId,
    p_exam_type: examType
  });

  if (error) {
    console.error('Error starting study session:', error);
    return null;
  }
  return data as string;
}

// Called on tab hide / unmount. Safe to call repeatedly — acts as a
// last-known-active-time heartbeat rather than a strict close event.
export async function touchStudySessionEnd(sessionId: string): Promise<void> {
  const { error } = await supabase.rpc('rpc_touch_study_session_end', {
    p_session_id: sessionId
  });

  if (error) {
    console.error('Error updating study session end:', error);
  }
}

interface LogAttemptParams {
  sessionId: string | null;
  examType: ExamType;
  questionId: string;
  consecutiveCorrectBefore: number;
  distractorCount: number;
  distractorsShown: string[];
  fullSetUnlocked: boolean;
  selectedAnswerIndex: number;
  correctAnswerIndex: number;
  isCorrect: boolean;
  responseTimeMs: number;
}

export async function logAttempt(params: LogAttemptParams): Promise<void> {
  const userId = getStudyUserId();
  const { error } = await supabase.rpc('rpc_log_attempt', {
    p_session_id: params.sessionId,
    p_user_id: userId,
    p_exam_type: params.examType,
    p_question_id: params.questionId,
    p_consecutive_correct_before: params.consecutiveCorrectBefore,
    p_distractor_count: params.distractorCount,
    p_distractors_shown: params.distractorsShown,
    p_full_set_unlocked: params.fullSetUnlocked,
    p_selected_answer_index: params.selectedAnswerIndex,
    p_correct_answer_index: params.correctAnswerIndex,
    p_is_correct: params.isCorrect,
    p_response_time_ms: params.responseTimeMs
  });

  if (error) {
    console.error('Error logging attempt:', error);
  }
}

export async function logPassMilestone(params: {
  examType: ExamType;
  milestoneType: 'practice_exam' | 'real_exam';
  score?: number;
  notes?: string;
}): Promise<void> {
  const userId = getStudyUserId();
  const { error } = await supabase.rpc('rpc_log_pass_event', {
    p_user_id: userId,
    p_exam_type: params.examType,
    p_milestone_type: params.milestoneType,
    p_score: params.score ?? null,
    p_notes: params.notes ?? null
  });

  if (error) {
    console.error('Error logging pass milestone:', error);
  }
}
