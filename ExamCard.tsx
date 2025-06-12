'use client';
import { useRouter } from 'next/navigation';

interface ExamInfo {
  questions: number;
  passingScore: number;
  timeLimit: string;
}

interface ExamCardProps {
  title: string;
  description: string;
  examType: string;
  questionCount: number;
  isLoading: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  examInfo: ExamInfo;
}

export const ExamCard: React.FC<ExamCardProps> = ({ 
  title, 
  description, 
  examType, 
  questionCount,
  isLoading,
  difficulty,
  examInfo
}) => {
  const router = useRouter();

  const handleClick = (): void => {
    router.push(`/exam/${examType}`);
  };

  const getDifficultyColor = (level: string): string => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExamIcon = (type: string): string => {
    switch (type) {
      case 'technician': return '📻';
      case 'general': return '📡';
      case 'extra': return '🔬';
      default: return '📚';
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all duration-200 group text-center"
    >
      {/* Icon */}
      <div className="text-4xl mb-4">
        {getExamIcon(examType)}
      </div>
      
      {/* Title & Difficulty */}
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
          {title}
        </h3>
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(difficulty)}`}>
          {difficulty}
        </span>
      </div>
      
      {/* Description */}
      <p className="text-gray-600 mb-6 text-lg">
        {description}
      </p>
      
      {/* Question Count */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="text-gray-600 text-sm mb-1">Study Pool</div>
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-500">Loading...</span>
          </div>
        ) : (
          <div className="text-2xl font-bold text-blue-600">
            {questionCount.toLocaleString()} Questions
          </div>
        )}
      </div>
      
      {/* Exam Details */}
      <div className="text-sm text-gray-500 mb-6">
        {examInfo.questions} questions • {examInfo.timeLimit} • {Math.round((examInfo.passingScore / examInfo.questions) * 100)}% to pass
      </div>
      
      {/* Call to Action */}
      <div className="bg-blue-600 text-white px-6 py-3 rounded-lg group-hover:bg-blue-700 transition-colors font-medium">
        Start Studying →
      </div>
    </div>
  );
};
