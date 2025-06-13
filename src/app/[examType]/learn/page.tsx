export default async function LearnPage({ params }: { params: Promise<{ examType: string }> }) {
  const { examType } = await params;
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Learn Page Test</h1>
        <p>Exam Type: {examType}</p>
        <p>If you see this, navigation is working!</p>
        <a href={`/${examType}`} className="text-blue-600 hover:text-blue-800">
          ← Back to exam page
        </a>
      </div>
    </div>
  );
}
