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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Questions</h2>
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

  // Group questions by subelement for display
  const subelements = questions.reduce((acc, question) => {
    const sub = question.subelement;
    if (!acc[sub]) acc[sub] = [];
    acc[sub].push(question);
    return acc;
  }, {} as Record<string, Question[]>);

  return (
    <div className="min-h-screen bg-gray-50">
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 capitalize">
            {examType} License Exam
          </h1>
          <p className="text-lg text-gray-600">
            {questions.length} questions loaded from official question pool
          </p>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Question Pool Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{Object.keys(subelements).length}</div>
              <div className="text-sm text-gray-600">Subelements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {examType === 'technician' ? 35 : examType === 'general' ? 35 : 50}
              </div>
              <div className="text-sm text-gray-600">Exam Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {examType === 'technician' ? 26 : examType === 'general' ? 26 : 37}
              </div>
              <div className="text-sm text-gray-600">To Pass</div>
            </div>
          </div>
        </div>

        {/* Study Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div 
            onClick={() => window.location.href = `/${examType}/learn`}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">📚 Start Learning</h3>
            <p className="text-gray-600 mb-4">
              Study with adaptive flashcards that adjust difficulty as you improve.
            </p>
            <div className="text-blue-600 font-medium">Begin Study Session →</div>
          </div>
          
          <div 
            onClick={() => window.location.href = `/${examType}/practice`}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">🎯 Practice Test</h3>
            <p className="text-gray-600 mb-4">
              Take a realistic practice exam with proper timing and scoring.
            </p>
            <div className="text-blue-600 font-medium">Start Practice Test →</div>
          </div>
        </div>

        {/* Subelement Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Question Breakdown by Topic</h2>
          <div className="grid gap-3">
            {Object.entries(subelements).sort().map(([subelement, subQuestions]) => (
              <div key={subelement} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <span className="font-medium text-gray-900">{subelement}</span>
                  <span className="text-gray-600 ml-2">
                    {subQuestions[0]?.question.split(' ').slice(0, 8).join(' ')}...
                  </span>
                </div>
                <span className="text-sm text-gray-500">{subQuestions.length} questions</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
