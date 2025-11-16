import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { TimerState } from '@/features/pomodoro/types/pomodoro'

type TimerControlsProps = {
  timerState: TimerState
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onNext?: () => void
}

export function TimerControls({
  timerState,
  onStart,
  onPause,
  onReset,
  onNext,
}: TimerControlsProps) {
  const isIdle = timerState === 'idle'
  const isRunning = timerState === 'running'
  const isPaused = timerState === 'paused'
  const isCompleted = timerState === 'completed'

  const canReset = !isIdle

  return (
    <div className="flex items-center justify-center gap-4">
      {/* Primary Action Button */}
      {isCompleted && onNext ? (
        <Button size="lg" onClick={onNext} className="min-w-32">
          <SkipForward className="mr-2" />
          Next Session
        </Button>
      ) : (
        <>
          {(isIdle || isPaused) && (
            <Button size="lg" onClick={onStart} className="min-w-32">
              <Play className="mr-2" />
              {isPaused ? 'Resume' : 'Start'}
            </Button>
          )}

          {isRunning && (
            <Button size="lg" onClick={onPause} variant="secondary" className="min-w-32">
              <Pause className="mr-2" />
              Pause
            </Button>
          )}
        </>
      )}

      {/* Reset Button */}
      <Button
        size="lg"
        variant="outline"
        onClick={onReset}
        disabled={!canReset}
        className="min-w-32"
      >
        <RotateCcw className="mr-2" />
        Reset
      </Button>
    </div>
  )
}
