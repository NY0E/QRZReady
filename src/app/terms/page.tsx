import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service — QRZ Ready',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-600">Last updated August 24, 2026</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 text-gray-700">
          <p>
            These terms govern your use of QRZ Ready, a free study tool for amateur radio license
            exams operated by an individual developer. By using QRZ Ready, you agree to these terms.
            If you don&apos;t agree, please don&apos;t use the site.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Who can use QRZ Ready</h2>
          <p className="text-gray-700">
            You must be at least 13 years old to create an account. Anyone can use the practice tools
            without an account; creating an account requires confirming you meet this age requirement.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">2. No warranty on exam content</h2>
          <div className="space-y-3 text-gray-700">
            <p>
              QRZ Ready is an independent study aid and is not affiliated with, endorsed by, or
              operated by the FCC, ARRL, NCVEC, or any Volunteer Examiner Coordinator. We do our best
              to keep question pools accurate and current, but we make no guarantee that the content is
              complete, error-free, or that studying here will result in passing any exam.
            </p>
            <p>
              QRZ Ready is provided &quot;as is&quot; and &quot;as available,&quot; without warranties of
              any kind, express or implied. Use it as a study aid, not as your sole source of truth for
              exam content.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Your account</h2>
          <p className="text-gray-700">
            You&apos;re responsible for keeping your login credentials secure and for activity that
            happens under your account. Let us know if you believe your account has been compromised.
            See our{' '}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-800">Privacy Policy</Link>{' '}
            for how we handle your account data, and your Account page to export or delete it at any
            time.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Acceptable use</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Don&apos;t attempt to disrupt, overload, or gain unauthorized access to the site or its systems</li>
            <li>Don&apos;t scrape or republish the question content in bulk for commercial purposes</li>
            <li>Don&apos;t use the site for any unlawful purpose</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Limitation of liability</h2>
          <p className="text-gray-700">
            To the fullest extent permitted by law, QRZ Ready and its operator are not liable for any
            indirect, incidental, or consequential damages arising from your use of the site, including
            exam results, lost study progress, or service interruptions. QRZ Ready is provided free of
            charge on a best-effort basis.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Changes to the service or terms</h2>
          <p className="text-gray-700">
            We may update these terms or change, suspend, or discontinue the service at any time.
            Material changes to these terms will update the date at the top of this page. Continued
            use after a change means you accept the updated terms.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Governing law</h2>
          <p className="text-gray-700">
            These terms are governed by the laws of the State of Missouri, without regard to conflict
            of law principles.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Contact</h2>
          <p className="text-gray-700">
            Questions about these terms? Email{' '}
            <a href="mailto:ny0e@ny0e.com" className="text-blue-600 hover:text-blue-800">ny0e@ny0e.com</a>.
          </p>
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
