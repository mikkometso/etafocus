import {
  DEFAULT_WORK_DURATION,
  DEFAULT_SHORT_BREAK_DURATION,
  DEFAULT_LONG_BREAK_DURATION,
  DEFAULT_LONG_BREAK_INTERVAL,
} from '@/constants/pomodoro'
import type { SessionType, PomodoroSettings } from '../types/pomodoro'

/**
 * Calculate the next session type based on current session and pomodoros completed
 */
export function calculateNextSessionType(
  currentSessionType: SessionType,
  pomodorosCompleted: number,
  longBreakInterval: number
): SessionType {
  // If currently on a break, next session is always work
  if (currentSessionType === 'short-break' || currentSessionType === 'long-break') {
    return 'work'
  }

  // If currently working, check if it's time for long break
  if (shouldTakeLongBreak(pomodorosCompleted, longBreakInterval)) {
    return 'long-break'
  }

  return 'short-break'
}

/**
 * Check if it's time for a long break based on pomodoros completed
 */
export function shouldTakeLongBreak(
  pomodorosCompleted: number,
  longBreakInterval: number
): boolean {
  if (pomodorosCompleted === 0) return false
  return pomodorosCompleted % longBreakInterval === 0
}

/**
 * Get default Pomodoro settings
 */
export function getDefaultSettings(): PomodoroSettings {
  return {
    workDuration: DEFAULT_WORK_DURATION,
    shortBreakDuration: DEFAULT_SHORT_BREAK_DURATION,
    longBreakDuration: DEFAULT_LONG_BREAK_DURATION,
    longBreakInterval: DEFAULT_LONG_BREAK_INTERVAL,
    autoStartNextSession: false,
    soundEnabled: true,
    notificationEnabled: false,
    soundSelection: 'default',
    soundDuration: 1,
  }
}

/**
 * Get the duration in seconds for a given session type
 */
export function getDurationForSessionType(
  sessionType: SessionType,
  settings: PomodoroSettings
): number {
  switch (sessionType) {
    case 'work':
      return settings.workDuration
    case 'short-break':
      return settings.shortBreakDuration
    case 'long-break':
      return settings.longBreakDuration
  }
}
