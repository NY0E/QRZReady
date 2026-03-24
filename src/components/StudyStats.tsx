interface StudyStatsProps {
  totalStudyTimeMs: number;
  pomodoroSessionsCompleted: number;
  studyDaysStreak: number;
}

function formatStudyTime(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export default function StudyStats({
  totalStudyTimeMs = 0,
  pomodoroSessionsCompleted = 0,
  studyDaysStreak = 0
}: StudyStatsProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">📊 Your Study Progress</h3>
      
      <div className="grid grid-cols-3 gap-3">
        {/* Study Time */}
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {formatStudyTime(totalStudyTimeMs)}
          </div>
          <div className="text-xs text-gray-600 mt-1">⏱️ Study Time</div>
        </div>

        {/* Pomodoro Sessions */}
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600">
            {pomodoroSessionsCompleted}
          </div>
          <div className="text-xs text-gray-600 mt-1">🍅 Focus Sessions</div>
        </div>

        {/* Study Streak */}
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {studyDaysStreak}
          </div>
          <div className="text-xs text-gray-600 mt-1">🔥 Day Streak</div>
        </div>
      </div>
      
      {/* Encouragement message */}
      {pomodoroSessionsCompleted > 0 && (
        <div className="mt-3 text-xs text-center text-gray-600 italic">
          {pomodoroSessionsCompleted >= 10
            ? '🎉 Amazing dedication! Keep up the great work!'
            : pomodoroSessionsCompleted >= 5
            ? '🚀 You\'re building great study habits!'
            : '🎯 Great start! Consistency is key!'}
        </div>
      )}
    </div>
  );
}
