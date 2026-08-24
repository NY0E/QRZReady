export default function ResourcesPage() {
  const cardClass = "group relative bg-surface rounded-lg border border-border p-6 pl-7 hover:border-amber-dim transition-colors overflow-hidden";
  const cardAccent = "absolute left-0 top-0 bottom-0 w-[2px] bg-amber-dim group-hover:bg-amber transition-colors";

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-mono font-medium text-ink mb-2">Recommended Study Resources</h1>
          <p className="text-ink-mid">Helpful books, guides, and equipment to complement your exam prep</p>
        </div>

        {/* Technician Resources */}
        <section className="mb-12">
          <h2 className="text-2xl font-mono font-medium text-ink mb-6">Technician Class License</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* ARRL Technician Manual */}
            <a
              href="https://www.amazon.com/dp/1625952937?tag=qrzready-20"
              target="_blank"
              rel="noopener noreferrer"
              className={cardClass}
            >
              <span className={cardAccent} />
              <div className="text-xs font-mono uppercase tracking-[2px] text-ink-dim mb-2">Official Study Guide</div>
              <h3 className="font-mono font-medium text-ink mb-2">ARRL Ham Radio License Manual</h3>
              <p className="text-sm text-ink-mid mb-4">The official ARRL guide with all test questions and detailed explanations</p>
              <div className="text-amber text-sm font-mono">View on Amazon →</div>
            </a>

            {/* Gordon West Book */}
            <a
              href="https://www.amazon.com/dp/0945053983?tag=qrzready-20"
              target="_blank"
              rel="noopener noreferrer"
              className={cardClass}
            >
              <span className={cardAccent} />
              <div className="text-xs font-mono uppercase tracking-[2px] text-ink-dim mb-2">Popular Alternative</div>
              <h3 className="font-mono font-medium text-ink mb-2">Technician Class by Gordon West</h3>
              <p className="text-sm text-ink-mid mb-4">Easy-to-understand explanations with memory tricks and techniques</p>
              <div className="text-amber text-sm font-mono">View on Amazon →</div>
            </a>

            {/* BaoFeng Radio */}
            <a
              href="https://www.amazon.com/dp/B0BHQXV5FV?tag=qrzready-20" target="_blank"
              rel="noopener noreferrer"
              className={cardClass}
            >
              <span className={cardAccent} />
              <div className="text-xs font-mono uppercase tracking-[2px] text-ink-dim mb-2">Starter Radio</div>
              <h3 className="font-mono font-medium text-ink mb-2">Baofeng F8HP Pro</h3>
              <p className="text-sm text-ink-mid mb-4">Affordable dual-band radio perfect for new hams to start practicing</p>
              <div className="text-amber text-sm font-mono">View on Amazon →</div>
            </a>
          </div>
        </section>

        {/* General Resources */}
        <section className="mb-12">
          <h2 className="text-2xl font-mono font-medium text-ink mb-6">General Class License</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* ARRL General Manual */}
            <a
              href="https://www.amazon.com/dp/1625952945?tag=qrzready-20"
              target="_blank"
              rel="noopener noreferrer"
              className={cardClass}
            >
              <span className={cardAccent} />
              <div className="text-xs font-mono uppercase tracking-[2px] text-ink-dim mb-2">Official Study Guide</div>
              <h3 className="font-mono font-medium text-ink mb-2">ARRL General Class License Manual</h3>
              <p className="text-sm text-ink-mid mb-4">Comprehensive guide covering all General exam topics and questions</p>
              <div className="text-amber text-sm font-mono">View on Amazon →</div>
            </a>

            {/* Gordon West General */}
            <a
              href="https://www.amazon.com/dp/0945053991?tag=qrzready-20"
              target="_blank"
              rel="noopener noreferrer"
              className={cardClass}
            >
              <span className={cardAccent} />
              <div className="text-xs font-mono uppercase tracking-[2px] text-ink-dim mb-2">Popular Choice</div>
              <h3 className="font-mono font-medium text-ink mb-2">General Class by Gordon West</h3>
              <p className="text-sm text-ink-mid mb-4">Proven study methods with practical tips for exam success</p>
              <div className="text-amber text-sm font-mono">View on Amazon →</div>
            </a>

            {/* HF Radio */}
            <a
              href="https://www.amazon.com/dp/B08YNDJ3BZ?tag=qrzready-20"
              target="_blank"
              rel="noopener noreferrer"
              className={cardClass}
            >
              <span className={cardAccent} />
              <div className="text-xs font-mono uppercase tracking-[2px] text-ink-dim mb-2">HF Equipment</div>
              <h3 className="font-mono font-medium text-ink mb-2">Xiegu G90 HF Transceiver</h3>
              <p className="text-sm text-ink-mid mb-4">Portable HF radio great for General class operators starting on HF bands</p>
              <div className="text-amber text-sm font-mono">View on Amazon →</div>
            </a>
          </div>
        </section>

        {/* HamStudy.org Section */}
        <section className="mb-12 bg-emerald-950/20 border border-emerald-900 rounded-lg p-8">
          <h2 className="text-2xl font-mono font-medium mb-4 text-emerald-400">📝 Practice & Schedule Your Exam</h2>
          <p className="text-ink-mid mb-6">
            Looking for realistic exam practice and ready to schedule your test?
            <strong className="text-emerald-300"> HamStudy.org</strong> offers full exam simulations and helps you find local testing sessions in your area.
          </p>
          <a
            href="https://hamstudy.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-emerald-600 text-white font-mono font-medium px-6 py-3 rounded-lg hover:bg-emerald-500 transition-colors"
          >
            Visit HamStudy.org →
          </a>
        </section>

        {/* Dad.Tested Curated Products */}
        <section className="mb-12 bg-amber-bg border border-amber-dim rounded-lg p-8">
          <h2 className="text-2xl font-mono font-medium mb-4 text-amber">🎥 NY0E's Amazon Storefront</h2>
          <p className="text-ink-mid mb-6">
            Check out my curated collection of ham radio gear I've personally tested and reviewed on video.
            Each product includes my hands-on impressions and real-world testing.
          </p>
          <a
            href="https://www.amazon.com/shop/dad.tested/curation/74b6dcbc-7c97-422b-833e-891920bd892d?ccs_id=8726a5b0-4a38-4f14-8a91-b0e5c5607f34&ref_=aip_sf_cur_spv_ons_d"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-amber text-bg px-6 py-3 rounded-lg font-mono font-medium hover:bg-amber/90 transition-colors"
          >
            View My Shoppable Video Reviews →
          </a>
        </section>

        {/* Disclaimer */}
        <div className="bg-surface border border-border rounded-lg p-4 text-sm text-ink-mid">
          <p className="mb-2"><strong className="text-ink">Disclosure:</strong> QRZ Ready participates in the Amazon Services LLC Associates Program. When you purchase through our links, we may earn a small commission at no additional cost to you. This helps us keep the study platform free!</p>
          <p>All recommendations are based on community feedback and popularity in the ham radio community.</p>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <a href="/" className="text-amber hover:text-amber/80 font-mono font-medium transition-colors">
            ← Back to Practice Tests
          </a>
        </div>
      </div>
    </div>
  );
}
