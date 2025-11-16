import { formatTime } from '@/utils/time'
import type { SessionType } from '@/features/pomodoro/types/pomodoro'
import { cn } from '@/lib/utils'

type TimerDisplayProps = {
  timeRemaining: number
  sessionType: SessionType
  progress?: number
}

const sessionLabels: Record<SessionType, string> = {
  work: 'Focus Time',
  'short-break': 'Short Break',
  'long-break': 'Long Break',
}

const sessionColors: Record<SessionType, string> = {
  work: 'text-primary',
  'short-break': 'text-green-600 dark:text-green-400',
  'long-break': 'text-blue-600 dark:text-blue-400',
}

const progressColors: Record<SessionType, string> = {
  work: 'bg-primary',
  'short-break': 'bg-green-600 dark:bg-green-400',
  'long-break': 'bg-blue-600 dark:bg-blue-400',
}

export function TimerDisplay({ timeRemaining, sessionType, progress = 0 }: TimerDisplayProps) {
  const formattedTime = formatTime(timeRemaining)
  const sessionLabel = sessionLabels[sessionType]

  return (
    <div className={cn('flex flex-col items-center gap-6', sessionColors[sessionType])}>
      {/* Session Label */}
      <h2 className="text-2xl font-semibold">{sessionLabel}</h2>

      {/* Timer Display */}
      <div className="text-8xl font-bold tabular-nums tracking-tight">
        {formattedTime}
      </div>

      {/* Progress Bar */}
      {progress !== undefined && (
        <div className="w-full max-w-md">
          <div
            role="progressbar"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-2 w-full overflow-hidden rounded-full bg-secondary"
          >
            <div
              className={cn('h-full transition-all duration-300', progressColors[sessionType])}
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
