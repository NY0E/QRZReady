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
      className="group relative bg-surface rounded-lg border border-border p-6 pl-7 cursor-pointer hover:border-amber-dim transition-colors overflow-hidden"
    >
      <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-amber-dim group-hover:bg-amber transition-colors" />
      {badge && (
        <a
          href={badge.href}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 inline-flex items-center gap-1 bg-amber-bg text-amber text-xs font-mono px-2.5 py-1 rounded-full border border-amber-dim hover:border-amber transition-colors"
        >
          {badge.text}
        </a>
      )}
      <div className="text-center">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-mono font-medium text-ink mb-2">{title}</h3>
        <p className="text-amber font-mono text-sm mb-3">{subtitle}</p>
        <p className="text-ink-mid text-sm mb-4">{description}</p>
        <p className="text-ink-dim text-xs font-mono mb-4">{questionCount} questions available</p>
        <button className="w-full bg-amber text-bg font-mono font-medium py-2 px-4 rounded-lg hover:bg-amber/90 transition-colors">
          Start Studying →
        </button>
      </div>
    </div>
  );
}
