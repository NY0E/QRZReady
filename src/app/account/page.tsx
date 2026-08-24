'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function AccountPage() {
  const { user, loading, exportUserData, deleteAccount, logout } = useAuth();
  const router = useRouter();
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (loading) return null;

  if (!user) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="max-w-3xl mx-auto px-4 py-8 text-center">
          <p className="text-ink-mid">Sign in to view your account.</p>
        </div>
      </div>
    );
  }

  const handleExport = async () => {
    setExporting(true);
    setError('');
    try {
      const data = await exportUserData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qrz-ready-my-data.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'Failed to export data.');
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError('');
    try {
      await deleteAccount(password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to delete account. Check your password and try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-mono font-medium text-ink mb-2">Your Account</h1>
          <p className="text-ink-mid font-mono text-sm">{user.email}{user.displayName ? ` · ${user.displayName}` : ''}</p>
        </div>

        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
          <h2 className="text-xl font-mono font-medium text-ink mb-2">Download your data</h2>
          <p className="text-ink-mid mb-4">
            Get a copy of everything stored under your account: your profile, quiz progress, and test
            scores, as a JSON file.
          </p>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="bg-amber text-bg font-mono font-medium py-2 px-4 rounded-lg hover:bg-amber/90 disabled:opacity-50 transition-colors"
          >
            {exporting ? 'Preparing…' : 'Download my data'}
          </button>
        </div>

        <div className="bg-surface rounded-lg border border-red-900/60 p-6 mb-6">
          <h2 className="text-xl font-mono font-medium text-ink mb-2">Delete your account</h2>
          <p className="text-ink-mid mb-4">
            This permanently deletes your account and all study progress and test scores. This can&apos;t
            be undone.
          </p>

          {!confirmOpen ? (
            <button
              onClick={() => setConfirmOpen(true)}
              className="bg-red-900 text-red-100 font-mono font-medium py-2 px-4 rounded-lg hover:bg-red-800 transition-colors"
            >
              Delete my account
            </button>
          ) : (
            <div className="space-y-3">
              <label htmlFor="confirmPassword" className="block text-sm font-mono text-ink-mid">
                Confirm your password to permanently delete your account
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-ink focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none transition-colors"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleting || !password}
                  className="bg-red-900 text-red-100 font-mono font-medium py-2 px-4 rounded-lg hover:bg-red-800 disabled:opacity-50 transition-colors"
                >
                  {deleting ? 'Deleting…' : 'Permanently delete'}
                </button>
                <button
                  onClick={() => { setConfirmOpen(false); setPassword(''); setError(''); }}
                  className="bg-bg border border-border text-ink-mid font-mono py-2 px-4 rounded-lg hover:text-ink hover:border-amber-dim transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {error && <div className="text-red-400 text-sm font-mono mt-3">{error}</div>}
        </div>

        <div className="text-sm text-ink-dim mb-8">
          See our <Link href="/privacy" className="text-amber hover:text-amber/80 transition-colors">Privacy Policy</Link> for
          details on what we collect and why.
        </div>

        <div className="text-center">
          <Link href="/" className="text-amber hover:text-amber/80 font-mono font-medium transition-colors">
            ← Back to QRZ Ready
          </Link>
        </div>
      </div>
    </div>
  );
}
