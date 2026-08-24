export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center p-6 bg-amber-bg border border-amber-dim rounded-lg max-w-md">
        <h2 className="text-lg font-mono font-medium text-amber mb-2">📡 You&apos;re offline</h2>
        <p className="text-ink-mid text-sm">
          Pages you&apos;ve already visited are still available. Reconnect to load anything new.
        </p>
      </div>
    </div>
  );
}
