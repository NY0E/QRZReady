'use client';

import { useRouter } from 'next/navigation';

interface ExamCardProps {
  title: string;
  subtitle: string;
  description: string;
  examType: string;
  questionCount: number;
  icon: string;
  badge?: { text: string; href: string };
}

export function ExamCard({ title, subtitle, description, examType, questionCount, icon, badge }: ExamCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/${examType}`)}
      className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
    >
      {badge && (
        <a
          href={badge.href}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors"
        >
          {badge.text}
        </a>
      )}
      <div className="text-center">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-blue-600 font-medium mb-3">{subtitle}</p>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <p className="text-gray-500 text-xs mb-4">{questionCount} questions available</p>
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
          Start Studying →
        </button>
      </div>
    </div>
  );
}
