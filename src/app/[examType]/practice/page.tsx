export default async function PracticePage({ params }: { params: Promise<{ examType: string }> }) {
  const { examType } = await params;

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-mono font-medium text-ink mb-4 capitalize">{examType} Practice Tests</h1>
        <p className="text-ink-mid">Practice exams coming soon!</p>
      </div>
    </div>
  )
}
