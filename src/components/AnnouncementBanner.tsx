'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface AnnouncementBannerProps {
  id: string;
  message: string;
  linkHref: string;
  linkText: string;
}

export default function AnnouncementBanner({ id, message, linkHref, linkText }: AnnouncementBannerProps) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem(`dismissed-announcement-${id}`) === 'true');
  }, [id]);

  const handleDismiss = () => {
    localStorage.setItem(`dismissed-announcement-${id}`, 'true');
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="bg-amber-bg border border-amber-dim rounded-lg p-4 mb-6 flex items-start justify-between gap-4">
      <p className="text-sm text-ink">
        {message}{' '}
        <Link href={linkHref} className="font-medium text-amber underline hover:text-amber/80">
          {linkText}
        </Link>
      </p>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        className="text-ink-dim hover:text-ink transition-colors flex-shrink-0"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
