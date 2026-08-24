'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [callSign, setCallSign] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const { login, register, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        onClose();
      } else if (mode === 'register') {
        if (!ageConfirmed) {
          setError('You must confirm you are 13 or older to create an account.');
          setLoading(false);
          return;
        }
        if (!termsAccepted) {
          setError('You must agree to the Terms of Service and Privacy Policy.');
          setLoading(false);
          return;
        }
        await register(email, password, callSign || undefined);
        onClose();
      } else if (mode === 'reset') {
        await resetPassword(email);
        setMessage('Password reset email sent! Check your inbox.');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setCallSign('');
    setAgeConfirmed(false);
    setTermsAccepted(false);
    setError('');
    setMessage('');
  };

  const switchMode = (newMode: typeof mode) => {
    setMode(newMode);
    resetForm();
  };

  if (!isOpen) return null;

  const inputClass = "w-full px-3 py-2 bg-bg border border-border rounded-lg text-ink placeholder:text-ink-dim focus:ring-1 focus:ring-amber focus:border-amber outline-none transition-colors";
  const labelClass = "block text-sm font-mono text-ink-mid mb-1";
  const linkClass = "text-amber hover:text-amber/80 transition-colors";

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-surface border border-border rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-mono font-medium text-ink">
            {mode === 'login' && 'Sign In'}
            {mode === 'register' && 'Create Account'}
            {mode === 'reset' && 'Reset Password'}
          </h2>
          <button
            onClick={onClose}
            className="text-ink-dim hover:text-ink transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          {mode !== 'reset' && (
            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className={inputClass}
              />
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label htmlFor="callSign" className={labelClass}>
                Call Sign (Optional)
              </label>
              <input
                type="text"
                id="callSign"
                value={callSign}
                onChange={(e) => setCallSign(e.target.value.toUpperCase())}
                placeholder="NY0E"
                className={inputClass}
              />
            </div>
          )}

          {mode === 'register' && (
            <div className="space-y-2">
              <label className="flex items-start gap-2 text-sm text-ink-mid">
                <input
                  type="checkbox"
                  checked={ageConfirmed}
                  onChange={(e) => setAgeConfirmed(e.target.checked)}
                  className="mt-0.5 accent-amber"
                />
                <span>I confirm I am 13 years of age or older.</span>
              </label>
              <label className="flex items-start gap-2 text-sm text-ink-mid">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 accent-amber"
                />
                <span>
                  I agree to the{' '}
                  <a href="/terms" target="_blank" className={linkClass}>Terms of Service</a>
                  {' '}and{' '}
                  <a href="/privacy" target="_blank" className={linkClass}>Privacy Policy</a>.
                </span>
              </label>
            </div>
          )}

          {error && (
            <div className="text-red-400 text-sm font-mono">{error}</div>
          )}

          {message && (
            <div className="text-emerald-400 text-sm font-mono">{message}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber text-bg font-mono font-medium py-2 px-4 rounded-lg hover:bg-amber/90 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Processing...' : (
              mode === 'login' ? 'Sign In' :
              mode === 'register' ? 'Create Account' :
              'Send Reset Email'
            )}
          </button>
        </form>

        <div className="mt-4 text-center text-sm font-mono">
          {mode === 'login' && (
            <>
              <button
                onClick={() => switchMode('register')}
                className={linkClass}
              >
                Don't have an account? Sign up
              </button>
              <br />
              <button
                onClick={() => switchMode('reset')}
                className={`${linkClass} mt-2`}
              >
                Forgot password?
              </button>
            </>
          )}

          {mode === 'register' && (
            <button
              onClick={() => switchMode('login')}
              className={linkClass}
            >
              Already have an account? Sign in
            </button>
          )}

          {mode === 'reset' && (
            <button
              onClick={() => switchMode('login')}
              className={linkClass}
            >
              Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
