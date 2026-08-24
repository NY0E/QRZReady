'use client';

import { useState, useEffect } from 'react';
import { getExamData } from '@/utils/examData';
import type { Question, ExamType } from '@/types/exam';
import AnnouncementBanner from '@/components/AnnouncementBanner';

interface ExamPageProps {
  params: Promise<{ examType: string }>;
}

export default function ExamPage({ params }: ExamPageProps) {
  const [examType, setExamType] = useState<ExamType | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const resolvedParams = await params;
        const type = resolvedParams.examType as ExamType;
        setExamType(type);

        const questionData = await getExamData(type);
        if (questionData.length === 0) {
          throw new Error(`No questions found for ${type} exam`);
        }

        setQuestions(questionData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber mx-auto mb-4"></div>
          <p className="text-ink-mid font-mono text-sm">Loading exam questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center p-6 bg-red-950/30 border border-red-900 rounded-lg max-w-md">
          <h2 className="text-lg font-mono font-medium text-red-400 mb-2">Error Loading Questions</h2>
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

  if (!examType) return null;

  // Group questions by subelement for display
  const subelements = questions.reduce((acc, question) => {
    const sub = question.subelement;
    if (!acc[sub]) acc[sub] = [];
    acc[sub].push(question);
    return acc;
  }, {} as Record<string, Question[]>);

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {examType === 'technician' && (
          <AnnouncementBanner
            id="technician-2026-2030"
            message="The Technician question pool was updated to 2026-2030 on July 1, 2026 — QRZReady is fully up to date."
            linkHref="/changelog"
            linkText="See what changed"
          />
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-mono font-medium text-ink mb-2 capitalize">
            {examType} License Exam
          </h1>
          <p className="text-lg text-ink-mid">
            {questions.length} questions loaded from official question pool
          </p>
        </div>

        {/* Quick Stats */}
        <div className="bg-surface rounded-lg border border-border p-6 mb-8">
          <div className="text-xs font-mono uppercase tracking-[2px] text-ink-dim mb-4">Question Pool Overview</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-mono font-medium text-amber">{questions.length}</div>
              <div className="text-sm text-ink-mid">Total Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono font-medium text-amber">{Object.keys(subelements).length}</div>
              <div className="text-sm text-ink-mid">Subelements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono font-medium text-amber">
                {examType === 'technician' ? 35 : examType === 'general' ? 35 : 50}
              </div>
              <div className="text-sm text-ink-mid">Exam Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono font-medium text-amber">
                {examType === 'technician' ? 26 : examType === 'general' ? 26 : 37}
              </div>
              <div className="text-sm text-ink-mid">To Pass</div>
            </div>
          </div>
        </div>

        {/* Study Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div
            onClick={() => window.location.href = `/${examType}/learn`}
            className="group relative bg-surface rounded-lg border border-border p-6 pl-7 cursor-pointer hover:border-amber-dim transition-colors overflow-hidden"
          >
            <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-amber-dim group-hover:bg-amber transition-colors" />
            <h3 className="text-xl font-mono font-medium text-ink mb-2">📚 Start Learning</h3>
            <p className="text-ink-mid text-sm mb-4">
              Study with adaptive flashcards that adjust difficulty as you improve.
            </p>
            <div className="text-amber font-mono text-sm">Begin Study Session →</div>
          </div>

          <div
            onClick={() => window.location.href = `/${examType}/practice`}
            className="group relative bg-surface rounded-lg border border-border p-6 pl-7 cursor-pointer hover:border-amber-dim transition-colors overflow-hidden"
          >
            <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-amber-dim group-hover:bg-amber transition-colors" />
            <h3 className="text-xl font-mono font-medium text-ink mb-2">🎯 Practice Test</h3>
            <p className="text-ink-mid text-sm mb-4">
              Take a realistic practice exam with proper timing and scoring.
            </p>
            <div className="text-amber font-mono text-sm">Start Practice Test →</div>
          </div>
        </div>

        {/* Subelement Breakdown */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <div className="text-xs font-mono uppercase tracking-[2px] text-ink-dim mb-4">Question Breakdown by Topic</div>
          <div className="grid gap-3">
            {Object.entries(subelements).sort().map(([subelement, subQuestions]) => (
              <div key={subelement} className="flex justify-between items-center p-3 bg-bg border border-border rounded">
                <div>
                  <span className="font-mono font-medium text-ink">{subelement}</span>
                  <span className="text-ink-mid ml-2 text-sm">
                    {subQuestions[0]?.question.split(' ').slice(0, 8).join(' ')}...
                  </span>
                </div>
                <span className="text-sm text-ink-dim font-mono">{subQuestions.length} questions</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
