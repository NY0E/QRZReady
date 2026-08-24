'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { AuthModal } from './AuthModal';
export function AuthHeader() {
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const handleSignOut = async () => {
    try {
      await logout();
      setShowDropdown(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  return (
    <>
      <header className="bg-bg border-b border-border px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
          <Link href="/"><h1 className="text-xl font-mono font-medium text-amber hover:text-amber/80 cursor-pointer tracking-tight">QRZ Ready</h1></Link>          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-ink-mid hover:text-ink font-mono text-sm transition-colors"
                >
                  <span>{user.displayName || user.email}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface rounded-lg shadow-lg border border-border z-10 overflow-hidden">
                    <div className="py-1">
                      <Link
                        href="/account"
                        onClick={() => setShowDropdown(false)}
                        className="block w-full text-left px-4 py-2 text-sm font-mono text-ink-mid hover:bg-amber-bg hover:text-amber transition-colors"
                      >
                        My Account
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm font-mono text-ink-mid hover:bg-amber-bg hover:text-amber transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-amber text-bg font-mono text-sm font-medium px-4 py-2 rounded-lg hover:bg-amber/90 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
