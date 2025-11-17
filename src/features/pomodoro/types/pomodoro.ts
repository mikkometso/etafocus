export type TimerState = 'idle' | 'running' | 'paused' | 'completed'

export type SessionType = 'work' | 'short-break' | 'long-break'

export type PomodoroSettings = {
  workDuration: number // in seconds
  shortBreakDuration: number // in seconds
  longBreakDuration: number // in seconds
  longBreakInterval: number // number of pomodoros before long break
  autoStartNextSession: boolean
  soundEnabled: boolean
  notificationEnabled: boolean
  soundSelection: string
}

export type PomodoroSession = {
  id: string
  type: SessionType
  startTime: Date
  endTime?: Date
  completed: boolean
  linkedTodoId?: string
}

export type PomodoroState = {
  currentSessionType: SessionType
  timerState: TimerState
  timeRemaining: number // in seconds
  pomodorosCompletedToday: number // Only increments when completing work sessions
  workSessionsToday: number // Increments for both completed and skipped work sessions
  currentStreak: number
  sessions: PomodoroSession[]
  settings: PomodoroSettings
}
