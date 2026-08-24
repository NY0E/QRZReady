import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs font-mono text-ink-dim">
        <span>&copy; {new Date().getFullYear()} QRZ Ready</span>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-amber transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-amber transition-colors">Terms of Service</Link>
          <a href="mailto:ny0e@ny0e.com" className="hover:text-amber transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
