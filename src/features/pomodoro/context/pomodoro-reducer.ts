import type { PomodoroState, PomodoroSettings } from '../types/pomodoro'
import { calculateNextSessionType, getDurationForSessionType } from '../utils/timer'

export type PomodoroAction =
  | { type: 'START_TIMER' }
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESET_TIMER' }
  | { type: 'TICK' }
  | { type: 'COMPLETE_SESSION' }
  | { type: 'UPDATE_SETTINGS'; payload: PomodoroSettings }

export function pomodoroReducer(
  state: PomodoroState,
  action: PomodoroAction
): PomodoroState {
  switch (action.type) {
    case 'START_TIMER':
      return {
        ...state,
        timerState: 'running',
      }

    case 'PAUSE_TIMER':
      return {
        ...state,
        timerState: 'paused',
      }

    case 'RESET_TIMER': {
      const duration = getDurationForSessionType(state.currentSessionType, state.settings)
      return {
        ...state,
        timerState: 'idle',
        timeRemaining: duration,
      }
    }

    case 'TICK': {
      const newTimeRemaining = Math.max(0, state.timeRemaining - 1)
      const isCompleted = newTimeRemaining === 0 && state.timeRemaining > 0

      return {
        ...state,
        timeRemaining: newTimeRemaining,
        timerState: isCompleted ? 'completed' : state.timerState,
      }
    }

    case 'COMPLETE_SESSION': {
      // Increment pomodoros only if completing a work session
      const newPomodorosCompleted =
        state.currentSessionType === 'work'
          ? state.pomodorosCompletedToday + 1
          : state.pomodorosCompletedToday

      // Calculate next session type
      const nextSessionType = calculateNextSessionType(
        state.currentSessionType,
        newPomodorosCompleted,
        state.settings.longBreakInterval
      )

      // Get duration for next session
      const nextDuration = getDurationForSessionType(nextSessionType, state.settings)

      // Determine next timer state based on auto-start setting
      const nextTimerState = state.settings.autoStartNextSession ? 'running' : 'idle'

      return {
        ...state,
        currentSessionType: nextSessionType,
        pomodorosCompletedToday: newPomodorosCompleted,
        timeRemaining: nextDuration,
        timerState: nextTimerState,
      }
    }

    case 'UPDATE_SETTINGS': {
      const newSettings = action.payload

      // If timer is idle, update time remaining to match new duration
      let newTimeRemaining = state.timeRemaining
      if (state.timerState === 'idle') {
        newTimeRemaining = getDurationForSessionType(state.currentSessionType, newSettings)
      }

      return {
        ...state,
        settings: newSettings,
        timeRemaining: newTimeRemaining,
      }
    }

    default:
      return state
  }
}
