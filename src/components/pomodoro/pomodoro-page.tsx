import { usePomodoro } from '@/features/pomodoro/context/pomodoro-context'
import { useTimer } from '@/features/pomodoro/hooks/use-timer'
import { calculateNextSessionType, getDurationForSessionType } from '@/features/pomodoro/utils/timer'
import { TimerDisplay } from './timer-display'
import { TimerControls } from './timer-controls'
import { SessionInfo } from './session-info'

export function PomodoroPage() {
  const { state, dispatch } = usePomodoro()

  // Calculate progress for visual indicator
  const totalDuration = getDurationForSessionType(state.currentSessionType, state.settings)
  const progress = 1 - state.timeRemaining / totalDuration

  // Calculate next session type for display
  const nextSessionType = calculateNextSessionType(
    state.currentSessionType,
    state.currentSessionType === 'work' ? state.pomodorosCompletedToday + 1 : state.pomodorosCompletedToday,
    state.settings.longBreakInterval
  )

  // Timer hook - triggers TICK action every second when running
  useTimer({
    isRunning: state.timerState === 'running',
    onTick: () => {
      dispatch({ type: 'TICK' })
    },
  })

  // Handlers
  const handleStart = () => {
    dispatch({ type: 'START_TIMER' })
  }

  const handlePause = () => {
    dispatch({ type: 'PAUSE_TIMER' })
  }

  const handleReset = () => {
    dispatch({ type: 'RESET_TIMER' })
  }

  const handleNext = () => {
    dispatch({ type: 'COMPLETE_SESSION' })
  }

  return (
    <div className="container mx-auto max-w-4xl p-8">
      <div className="flex flex-col gap-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Pomodoro Timer</h1>
          <p className="mt-2 text-muted-foreground">
            Stay focused and productive with the Pomodoro Technique
          </p>
        </div>

        {/* Timer Display */}
        <TimerDisplay
          timeRemaining={state.timeRemaining}
          sessionType={state.currentSessionType}
          progress={progress}
        />

        {/* Timer Controls */}
        <TimerControls
          timerState={state.timerState}
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
          onNext={state.timerState === 'completed' ? handleNext : undefined}
        />

        {/* Session Info */}
        <SessionInfo
          pomodorosCompleted={state.pomodorosCompletedToday}
          currentStreak={state.currentStreak}
          nextSessionType={nextSessionType}
        />
      </div>
    </div>
  )
}
