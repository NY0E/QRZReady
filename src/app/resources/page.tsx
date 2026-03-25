export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recommended Study Resources</h1>
          <p className="text-gray-600">Helpful books, guides, and equipment to complement your exam prep</p>
        </div>

        {/* Technician Resources */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Technician Class License</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* ARRL Technician Manual */}
            <a 
              href="https://www.amazon.com/dp/1625952937?tag=YOUR_AMAZON_TAG" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-sm text-gray-500 mb-2">Official Study Guide</div>
              <h3 className="font-semibold text-gray-900 mb-2">ARRL Ham Radio License Manual</h3>
              <p className="text-sm text-gray-600 mb-4">The official ARRL guide with all test questions and detailed explanations</p>
              <div className="text-blue-600 text-sm font-medium">View on Amazon →</div>
            </a>

            {/* Gordon West Book */}
            <a 
              href="https://www.amazon.com/dp/0945053983?tag=YOUR_AMAZON_TAG" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-sm text-gray-500 mb-2">Popular Alternative</div>
              <h3 className="font-semibold text-gray-900 mb-2">Technician Class by Gordon West</h3>
              <p className="text-sm text-gray-600 mb-4">Easy-to-understand explanations with memory tricks and techniques</p>
              <div className="text-blue-600 text-sm font-medium">View on Amazon →</div>
            </a>

            {/* BaoFeng Radio */}
            <a 
              href="https://www.amazon.com/dp/B007H4VT7A?tag=YOUR_AMAZON_TAG" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-sm text-gray-500 mb-2">Starter Radio</div>
              <h3 className="font-semibold text-gray-900 mb-2">BaoFeng UV-5R</h3>
              <p className="text-sm text-gray-600 mb-4">Affordable dual-band radio perfect for new hams to start practicing</p>
              <div className="text-blue-600 text-sm font-medium">View on Amazon →</div>
            </a>
          </div>
        </section>

        {/* General Resources */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">General Class License</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* ARRL General Manual */}
            <a 
              href="https://www.amazon.com/dp/1625952945?tag=YOUR_AMAZON_TAG" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-sm text-gray-500 mb-2">Official Study Guide</div>
              <h3 className="font-semibold text-gray-900 mb-2">ARRL General Class License Manual</h3>
              <p className="text-sm text-gray-600 mb-4">Comprehensive guide covering all General exam topics and questions</p>
              <div className="text-blue-600 text-sm font-medium">View on Amazon →</div>
            </a>

            {/* Gordon West General */}
            <a 
              href="https://www.amazon.com/dp/0945053991?tag=YOUR_AMAZON_TAG" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-sm text-gray-500 mb-2">Popular Choice</div>
              <h3 className="font-semibold text-gray-900 mb-2">General Class by Gordon West</h3>
              <p className="text-sm text-gray-600 mb-4">Proven study methods with practical tips for exam success</p>
              <div className="text-blue-600 text-sm font-medium">View on Amazon →</div>
            </a>

            {/* HF Radio */}
            <a 
              href="https://www.amazon.com/dp/B08YNDJ3BZ?tag=YOUR_AMAZON_TAG" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-sm text-gray-500 mb-2">HF Equipment</div>
              <h3 className="font-semibold text-gray-900 mb-2">Xiegu G90 HF Transceiver</h3>
              <p className="text-sm text-gray-600 mb-4">Portable HF radio great for General class operators starting on HF bands</p>
              <div className="text-blue-600 text-sm font-medium">View on Amazon →</div>
            </a>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
          <p className="mb-2"><strong>Disclosure:</strong> QRZ Ready participates in the Amazon Services LLC Associates Program. When you purchase through our links, we may earn a small commission at no additional cost to you. This helps us keep the study platform free!</p>
          <p>All recommendations are based on community feedback and popularity in the ham radio community.</p>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <a href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Practice Tests
          </a>
        </div>
      </div>
    </div>
  );
}
