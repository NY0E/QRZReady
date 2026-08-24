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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-700">Sign in to view your account.</p>
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Account</h1>
          <p className="text-gray-600">{user.email}{user.displayName ? ` · ${user.displayName}` : ''}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Download your data</h2>
          <p className="text-gray-700 mb-4">
            Get a copy of everything stored under your account: your profile, quiz progress, and test
            scores, as a JSON file.
          </p>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {exporting ? 'Preparing…' : 'Download my data'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Delete your account</h2>
          <p className="text-gray-700 mb-4">
            This permanently deletes your account and all study progress and test scores. This can&apos;t
            be undone.
          </p>

          {!confirmOpen ? (
            <button
              onClick={() => setConfirmOpen(true)}
              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete my account
            </button>
          ) : (
            <div className="space-y-3">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm your password to permanently delete your account
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleting || !password}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {deleting ? 'Deleting…' : 'Permanently delete'}
                </button>
                <button
                  onClick={() => { setConfirmOpen(false); setPassword(''); setError(''); }}
                  className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {error && <div className="text-red-600 text-sm mt-3">{error}</div>}
        </div>

        <div className="text-sm text-gray-500 mb-8">
          See our <Link href="/privacy" className="text-blue-600 hover:text-blue-800">Privacy Policy</Link> for
          details on what we collect and why.
        </div>

        <div className="text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to QRZ Ready
          </Link>
        </div>
      </div>
    </div>
  );
}
