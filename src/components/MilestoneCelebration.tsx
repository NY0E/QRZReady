'use client';

import { useEffect } from 'react';
import type { MilestoneCelebration as MilestoneType } from '@/data/milestones';

interface MilestoneCelebrationProps {
  milestone: MilestoneType;
  onClose: () => void;
}

export default function MilestoneCelebration({ milestone, onClose }: MilestoneCelebrationProps) {
  // Auto-close after 15 seconds if user doesn't interact
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 15000);

    return () => clearTimeout(timer);
  }, [onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 pointer-events-auto animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Celebration icon */}
          <div className="text-center mb-4">
            <div className="text-6xl animate-bounce">
              {milestone.milestone === 1 && '🎉'}
              {milestone.milestone === 5 && '🌟'}
              {milestone.milestone === 10 && '🚀'}
              {milestone.milestone === 25 && '⚡'}
              {milestone.milestone === 50 && '🎯'}
              {milestone.milestone === 75 && '💪'}
              {milestone.milestone === 100 && '🏆'}
              {milestone.milestone === 150 && '🌍'}
              {milestone.milestone === 200 && '📡'}
              {milestone.milestone === 300 && '🎓'}
              {milestone.milestone >= 411 && '🏅'}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-3">
            {milestone.title}
          </h2>

          {/* Message */}
          <p className="text-center text-gray-700 mb-4">
            {milestone.message}
          </p>

          {/* Divider */}
          <div className="border-t border-gray-200 my-4" />

          {/* Ham Radio Trivia */}
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
              <span className="mr-2">📻</span>
              Ham Radio Trivia
            </h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              {milestone.trivia}
            </p>
          </div>

          {/* Link (if present) */}
          {milestone.link && (
            <div className="space-y-2">
              {milestone.link.context && (
                <p className="text-xs text-gray-600 text-center">
                  {milestone.link.context}
                </p>
              )}
              <a
                href={milestone.link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {milestone.link.text} →
              </a>
            </div>
          )}

          {/* Continue button */}
          <button
            onClick={onClose}
            className={`w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium ${
              milestone.link ? 'mt-3' : 'mt-4'
            }`}
          >
            Continue Studying
          </button>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
