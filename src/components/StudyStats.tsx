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
    <div className="bg-amber-bg rounded-lg p-4 border border-amber-dim">
      <h3 className="text-sm font-mono font-medium text-ink mb-3">📊 Your Study Progress</h3>

      <div className="grid grid-cols-3 gap-3">
        {/* Study Time */}
        <div className="text-center">
          <div className="text-2xl font-mono font-medium text-amber">
            {formatStudyTime(totalStudyTimeMs)}
          </div>
          <div className="text-xs text-ink-mid mt-1">⏱️ Study Time</div>
        </div>

        {/* Pomodoro Sessions */}
        <div className="text-center">
          <div className="text-2xl font-mono font-medium text-amber">
            {pomodoroSessionsCompleted}
          </div>
          <div className="text-xs text-ink-mid mt-1">🍅 Focus Sessions</div>
        </div>

        {/* Study Streak */}
        <div className="text-center">
          <div className="text-2xl font-mono font-medium text-amber">
            {studyDaysStreak}
          </div>
          <div className="text-xs text-ink-mid mt-1">🔥 Day Streak</div>
        </div>
      </div>

      {/* Encouragement message */}
      {pomodoroSessionsCompleted > 0 && (
        <div className="mt-3 text-xs text-center text-ink-mid italic">
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
