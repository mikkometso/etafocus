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
  pomodorosCompletedToday: number
  currentStreak: number
  sessions: PomodoroSession[]
  settings: PomodoroSettings
}
