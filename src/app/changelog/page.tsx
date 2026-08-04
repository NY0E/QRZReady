export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Technician pool updated to 2026–2030</h1>
          <p className="text-gray-600">Effective July 1, 2026</p>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <p className="text-gray-700">
            The FCC Technician (Element 2) question pool changed. QRZReady is fully up to date:
            409 questions, matched exactly against the official NCVEC pool (including the
            February 2026 errata corrections).
          </p>
        </div>

        {/* What changed */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What changed in this pool cycle</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>27 new questions, 30 retired, about 155 reworded</li>
            <li>Expanded coverage of digital modes (DMR, Winlink, FT8)</li>
            <li>3 new diagram-based questions — fully supported here, figures included</li>
          </ul>
        </div>

        {/* Advice */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <p className="text-gray-700">
            If you studied with QRZReady before July 2026, some material you saw may no longer
            be on the real exam, and some new material has been added. Worth another pass
            through any sections you haven't reviewed recently.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700 mb-8">
          <p>
            The old 2022–2026 pool is retired. If you&apos;re testing on or after July 1, 2026,
            you&apos;re tested on this new pool — no action needed on your end, it&apos;s already
            reflected here.
          </p>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <a href="/technician" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Technician exam
          </a>
        </div>
      </div>
    </div>
  );
}
