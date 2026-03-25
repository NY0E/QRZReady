import { ExamCard } from '@/components/ExamCard'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            QRZ Ready
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-2">
            Prepare for your FCC Amateur Radio license exam with smart memorization techniques
          </p>
          <p className="text-sm text-gray-400 italic">
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
            questionCount={412}
            icon="📻"
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            How QRZReady.com Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Study Smart</h3>
              <p className="text-gray-600">
                10-question focused sessions with adaptive difficulty that builds memory progressively.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🧠</div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Build Memory</h3>
              <p className="text-gray-600">
                First see correct answers, then practice recall with increasing numbers of choices.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Practice Tests</h3>
              <p className="text-gray-600">
                Take realistic practice exams to verify your memorization and build confidence.
              </p>
            </div>
          </div>
        </div>

              {/* Recommended Study Resources CTA */}
              <div className="text-center mb-12">
                        <a
                                    href="/resources"
                                    className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                  >
                                    📚 View Recommended Study Resources
                                  </a>
                      </div>

        {/* Resources Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Resources &amp; Links</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">📡 About NY0E</h3>
              <p className="text-gray-600 mb-3">
                Aside from developing this app, I do other stuff too. Visit my homepage for more ham radio projects, notes, and technical content.
              </p>
              <a
                href="https://ny0e.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Visit NY0E.com &rarr;
              </a>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🚨 The FCC makes your registration public!</h3>
              <p className="text-gray-600 mb-3">
                You can protect your privacy (while supporting QRZReady) by using a virtual mailbox from iPostal1 to apply for your FRN and licenses.
              </p>
              <a
                href="https://ipostal1.com/?ref=6716"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Learn About iPostal1 &rarr;
              </a>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>Questions or Feedback?</strong> Contact me via my website or find me on{' '}
              <a
                href="https://www.qrz.com/db/NY0E"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
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
