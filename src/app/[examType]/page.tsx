export default function ExamPage({ params }: { params: { examType: string } }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 capitalize">{params.examType} Exam</h1>
        <p className="text-gray-600">Study modes coming soon!</p>
      </div>
    </div>
  )
}
