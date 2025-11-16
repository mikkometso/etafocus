import { CheckCircle2, Flame, ArrowRight } from 'lucide-react'
import type { SessionType } from '@/features/pomodoro/types/pomodoro'

type SessionInfoProps = {
  pomodorosCompleted: number
  currentStreak: number
  nextSessionType: SessionType
}

const sessionLabels: Record<SessionType, string> = {
  work: 'Focus Time',
  'short-break': 'Short Break',
  'long-break': 'Long Break',
}

export function SessionInfo({
  pomodorosCompleted,
  currentStreak,
  nextSessionType,
}: SessionInfoProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Pomodoros Completed */}
      <div className="flex flex-col items-center rounded-lg border bg-card p-4 text-card-foreground">
        <div className="flex items-center gap-2 text-muted-foreground">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-sm">Completed Today</span>
        </div>
        <div className="mt-2 text-3xl font-bold">{pomodorosCompleted}</div>
      </div>

      {/* Current Streak */}
      <div className="flex flex-col items-center rounded-lg border bg-card p-4 text-card-foreground">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Flame className="h-4 w-4" />
          <span className="text-sm">
            {currentStreak === 1 ? '1 Day Streak' : `${currentStreak} Days Streak`}
          </span>
        </div>
        <div className="mt-2 text-3xl font-bold">{currentStreak}</div>
      </div>

      {/* Next Session */}
      <div className="flex flex-col items-center rounded-lg border bg-card p-4 text-card-foreground">
        <div className="flex items-center gap-2 text-muted-foreground">
          <ArrowRight className="h-4 w-4" />
          <span className="text-sm">Next</span>
        </div>
        <div className="mt-2 text-lg font-semibold">{sessionLabels[nextSessionType]}</div>
      </div>
    </div>
  )
}
