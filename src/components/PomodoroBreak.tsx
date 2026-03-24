'use client';

import { useState, useEffect } from 'react';
import { StudyBreakFactoid } from '@/data/studyBreakFactoids';

interface PomodoroBreakProps {
  factoid: StudyBreakFactoid;
  onClose: () => void;
}

export default function PomodoroBreak({ factoid, onClose }: PomodoroBreakProps) {
  const BREAK_DURATION = 5 * 60; // 5 minutes in seconds
  const [timeRemaining, setTimeRemaining] = useState(BREAK_DURATION);
  const [audioPlayed, setAudioPlayed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          playBreakEndSound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const playBreakEndSound = () => {
    if (audioPlayed) return;
    
    // Create a gentle notification sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800; // Gentle tone
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
    
    setAudioPlayed(true);
    
    // Show browser notification if permitted
    if (Notification.permission === 'granted') {
      new Notification('Break time is over!', {
        body: 'Ready to continue studying?',
        icon: '/favicon.ico'
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((BREAK_DURATION - timeRemaining) / BREAK_DURATION) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🍅</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Pomodoro Break Time!
          </h2>
          <p className="text-lg text-gray-600">
            You've been studying for 25 minutes - great work!
          </p>
        </div>

        {/* Factoid */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-blue-900 mb-3">
            📻 Did You Know?
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            {factoid.factoid}
          </p>
          <a
            href={factoid.articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            📖 Read More: {factoid.articleTitle}
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>

        {/* Timer */}
        <div className="text-center mb-6">
          <div className="text-5xl font-bold text-gray-800 mb-2">
            ⏱️ {formatTime(timeRemaining)}
          </div>
          <p className="text-gray-600 mb-4">
            {timeRemaining === 0
              ? '✨ Break is over! Ready to continue?'
              : 'Take a moment to stretch and rest your eyes'}
          </p>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {timeRemaining === 0 ? 'Continue Studying →' : 'Skip Break & Continue'}
          </button>
        </div>

        {/* Settings hint */}
        <p className="text-center text-sm text-gray-500 mt-4">
          You can disable Pomodoro breaks in your account settings
        </p>
      </div>
    </div>
  );
}
