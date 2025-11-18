import { usePomodoro } from '@/features/pomodoro/context/pomodoro-context'
import { useTimer } from '@/features/pomodoro/hooks/use-timer'
import { usePomodoroNotifications } from '@/features/pomodoro/hooks/use-pomodoro-notifications'
import { calculateNextSessionType, getDurationForSessionType } from '@/features/pomodoro/utils/timer'
import { TimerDisplay } from './timer-display'
import { TimerControls } from './timer-controls'
import { SessionInfo } from './session-info'
import { QuickPresets } from './quick-presets'
import { SettingsDialog } from './settings-dialog'
import type { PomodoroSettings, SessionType } from '@/features/pomodoro/types/pomodoro'

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

  // Notifications hook - plays sound and shows notifications on session complete
  usePomodoroNotifications({ state })

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

  const handleSkip = () => {
    dispatch({ type: 'SKIP_SESSION' })
  }

  const handlePresetSelect = (durationInMinutes: number, sessionType: SessionType) => {
    const newSettings: PomodoroSettings = { ...state.settings }

    // Update the appropriate duration based on session type
    switch (sessionType) {
      case 'work':
        newSettings.workDuration = durationInMinutes * 60
        break
      case 'short-break':
        newSettings.shortBreakDuration = durationInMinutes * 60
        break
      case 'long-break':
        newSettings.longBreakDuration = durationInMinutes * 60
        break
    }

    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings })
    dispatch({ type: 'RESET_TIMER' })
  }

  return (
    <div className="container mx-auto max-w-4xl p-8">
      <div className="flex flex-col gap-12">
        {/* Header */}
        <div className="relative text-center">
          <div className="absolute right-0 top-0">
            <SettingsDialog />
          </div>
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

        {/* Quick Presets */}
        <QuickPresets
          currentSessionType={state.currentSessionType}
          currentWorkDuration={state.settings.workDuration}
          currentShortBreakDuration={state.settings.shortBreakDuration}
          currentLongBreakDuration={state.settings.longBreakDuration}
          onPresetSelect={handlePresetSelect}
          disabled={state.timerState === 'running'}
        />

        {/* Timer Controls */}
        <TimerControls
          timerState={state.timerState}
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
          onNext={state.timerState === 'completed' ? handleNext : undefined}
          onSkip={handleSkip}
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
