import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-500">
        <span>&copy; {new Date().getFullYear()} QRZ Ready</span>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-gray-700">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gray-700">Terms of Service</Link>
          <a href="mailto:ny0e@ny0e.com" className="hover:text-gray-700">Contact</a>
        </div>
      </div>
    </footer>
  );
}
