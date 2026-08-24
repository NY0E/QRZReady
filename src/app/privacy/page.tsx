import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — QRZ Ready',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-mono font-medium text-ink mb-2">Privacy Policy</h1>
          <p className="text-ink-mid">Last updated August 24, 2026</p>
        </div>

        <div className="bg-surface rounded-lg border border-border p-6 mb-6 space-y-4 text-ink-mid">
          <p>
            QRZ Ready (&quot;QRZ Ready,&quot; &quot;we,&quot; &quot;us&quot;) is operated by an individual
            developer, not a company. This policy explains what information QRZ Ready collects, why,
            and what choices you have. Questions or requests about your data can be sent to{' '}
            <a href="mailto:ny0e@ny0e.com" className="text-amber hover:text-amber/80 transition-colors">ny0e@ny0e.com</a>.
          </p>
        </div>

        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
          <h2 className="text-xl font-mono font-medium text-ink mb-4">1. Information we collect</h2>
          <div className="space-y-3 text-ink-mid">
            <p>
              <strong className="text-ink">Account information.</strong> If you create an account, we collect the email
              address and password you provide, and optionally the call sign you enter as your display
              name. Your password is handled entirely by Firebase Authentication (a Google service) —
              QRZ Ready never sees or stores your password itself.
            </p>
            <p>
              <strong className="text-ink">Study activity.</strong> If you&apos;re signed in, your quiz answers, correct/incorrect
              counts, and test scores are stored under your account so your progress is saved across
              devices. If you&apos;re not signed in, this same information is stored only in your
              browser&apos;s local storage and never leaves your device.
            </p>
            <p>
              <strong className="text-ink">What we don&apos;t collect.</strong> QRZ Ready does not use analytics or advertising
              trackers, does not sell data, and does not knowingly collect any information beyond what&apos;s
              described above.
            </p>
          </div>
        </div>

        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
          <h2 className="text-xl font-mono font-medium text-ink mb-4">2. How we use information</h2>
          <ul className="list-disc list-inside space-y-2 text-ink-mid">
            <li>To create and secure your account, and let you sign in from any device</li>
            <li>To save and display your study progress and test scores</li>
            <li>To respond if you contact us for support or a data request</li>
          </ul>
        </div>

        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
          <h2 className="text-xl font-mono font-medium text-ink mb-4">3. Who we share it with</h2>
          <p className="text-ink-mid">
            Account and study data is stored with Firebase (Google Cloud), which acts as our hosting
            and infrastructure provider under Google&apos;s own privacy and data processing terms. We do
            not share your data with any other third party, and we do not sell your data to anyone.
          </p>
        </div>

        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
          <h2 className="text-xl font-mono font-medium text-ink mb-4">4. Your rights and choices</h2>
          <div className="space-y-3 text-ink-mid">
            <p>
              You can view, export, or permanently delete your account and stored study data at any
              time from your{' '}
              <Link href="/account" className="text-amber hover:text-amber/80 transition-colors">Account page</Link>{' '}
              — no need to email us first. Deleting your account removes your Firebase Authentication
              record and all study progress and scores tied to it.
            </p>
            <p>
              <strong className="text-ink">If you&apos;re in the EU/EEA or UK (GDPR):</strong> our legal basis for processing
              account data is your consent and our need to perform the service you signed up for
              (contract). You have the right to access, correct, export (data portability), or erase
              your data, and to object to or restrict processing, using the Account page or by emailing
              us. You may also lodge a complaint with your local data protection authority.
            </p>
            <p>
              <strong className="text-ink">If you&apos;re a California resident (CCPA/CPRA):</strong> we do not sell or share
              your personal information, and never have. You have the right to know what we collect,
              request deletion, and not be discriminated against for exercising these rights.
            </p>
          </div>
        </div>

        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
          <h2 className="text-xl font-mono font-medium text-ink mb-4">5. Children&apos;s privacy (COPPA)</h2>
          <p className="text-ink-mid">
            QRZ Ready is a general-audience study tool and is not directed at children. Creating an
            account requires confirming you are 13 years of age or older. If you are under 13, please
            don&apos;t create an account — you can still study using the practice tools without signing
            in, in which case nothing is sent to our servers. If we learn that we&apos;ve collected
            account information from a child under 13, we will delete it.
          </p>
        </div>

        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
          <h2 className="text-xl font-mono font-medium text-ink mb-4">6. Data retention &amp; security</h2>
          <p className="text-ink-mid">
            We keep your account and study data for as long as your account exists, or until you
            delete it. We rely on Firebase Authentication and Firestore&apos;s built-in security
            controls to protect your data, but no system is 100% secure, and we can&apos;t guarantee
            absolute security.
          </p>
        </div>

        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
          <h2 className="text-xl font-mono font-medium text-ink mb-4">7. Changes to this policy</h2>
          <p className="text-ink-mid">
            If this policy changes materially, we&apos;ll update the date at the top of this page.
            Continued use of QRZ Ready after a change means you accept the updated policy.
          </p>
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
