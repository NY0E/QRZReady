export default async function LearnPage({ params }: { params: Promise<{ examType: string }> }) {
  const { examType } = await params;
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 capitalize">{examType} Learn Mode</h1>
        <p className="text-gray-600">Adaptive learning sessions coming soon!</p>
      </div>
    </div>
  )
}
