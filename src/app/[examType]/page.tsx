export default async function ExamPage({ params }: { params: Promise<{ examType: string }> }) {
  const { examType } = await params;
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 capitalize">{examType} Exam</h1>
        <p className="text-gray-600">Study modes coming soon!</p>
      </div>
    </div>
  )
}
