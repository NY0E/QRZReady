import { ExamCard } from '@/components/ExamCard'

export default function Home() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-mono font-medium text-amber mb-4 tracking-tight">
            QRZ Ready
          </h1>
          <p className="text-xl md:text-2xl text-ink mb-2">
            Prepare for your FCC Amateur Radio license exam with smart memorization techniques
          </p>
          <p className="text-sm text-ink-dim italic">
            QRZ? That&apos;s ham radio for &ldquo;who&apos;s calling?&rdquo; &mdash; and soon, the answer will be you.
          </p>
        </div>

        {/* Exam Selection */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <ExamCard
            title="Technician License"
            subtitle="📻 Entry Level"
            description="Your first step into Amateur Radio. Most VHF/UHF privileges."
            examType="technician"
            questionCount={409}
            icon="📻"
            badge={{ text: 'Updated for 2026 exam changes', href: '/changelog' }}
          />
          <ExamCard
            title="General License"
            subtitle="📡 HF Access"
            description="Upgrade to gain significant HF band privileges worldwide."
            examType="general"
            questionCount={432}
            icon="📡"
          />
          <ExamCard
            title="Amateur Extra License"
            subtitle="🔬 All Privileges"
            description="The highest class with access to all amateur frequencies."
            examType="extra"
            questionCount={622}
            icon="🔬"
          />
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="text-xs font-mono uppercase tracking-[2px] text-ink-dim text-center mb-2">How It Works</div>
          <h2 className="text-2xl font-mono font-medium text-ink mb-6 text-center">
            QRZReady.com
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="font-mono font-medium text-ink mb-2">1. Study Smart</h3>
              <p className="text-ink-mid text-sm">
                10-question focused sessions with adaptive difficulty that builds memory progressively.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🧠</div>
              <h3 className="font-mono font-medium text-ink mb-2">2. Build Memory</h3>
              <p className="text-ink-mid text-sm">
                First see correct answers, then practice recall with increasing numbers of choices.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-mono font-medium text-ink mb-2">3. Practice Tests</h3>
              <p className="text-ink-mid text-sm">
                Take realistic practice exams to verify your memorization and build confidence.
              </p>
            </div>
          </div>
        </div>

        {/* Recommended Study Resources CTA */}
        <div className="text-center mb-12">
          <a
            href="/resources"
            className="inline-block bg-amber text-bg font-mono font-medium px-8 py-3 rounded-lg hover:bg-amber/90 transition-colors"
          >
            📚 View Recommended Study Resources
          </a>
        </div>

        {/* Resources Section */}
        <div className="bg-surface rounded-lg border border-border p-6 max-w-4xl mx-auto">
          <div className="text-xs font-mono uppercase tracking-[2px] text-ink-dim mb-4">Resources &amp; Links</div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-mono font-medium text-ink mb-2">📡 About NY0E</h3>
              <p className="text-ink-mid text-sm mb-3">
                Aside from developing this app, I do other stuff too. Visit my homepage for more ham radio projects, notes, and technical content.
              </p>
              <a
                href="https://ny0e.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber hover:text-amber/80 font-mono text-sm transition-colors"
              >
                Visit NY0E.com &rarr;
              </a>
            </div>
            <div>
              <h3 className="font-mono font-medium text-ink mb-2">🚨 The FCC makes your registration public!</h3>
              <p className="text-ink-mid text-sm mb-3">
                You can protect your privacy (while supporting QRZReady) by using a virtual mailbox from iPostal1 to apply for your FRN and licenses.
              </p>
              <a
                href="https://ipostal1.com/?ref=6716"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber hover:text-amber/80 font-mono text-sm transition-colors"
              >
                Learn About iPostal1 &rarr;
              </a>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-sm text-ink-mid">
              <strong className="text-ink">Questions or Feedback?</strong> Contact me via my website or find me on{' '}
              <a
                href="https://www.qrz.com/db/NY0E"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber hover:text-amber/80 transition-colors"
              >
                QRZ.com/db/NY0E
              </a>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
