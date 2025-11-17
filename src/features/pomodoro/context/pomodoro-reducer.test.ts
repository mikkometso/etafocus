import { describe, it, expect } from 'vitest'
import { pomodoroReducer, type PomodoroAction } from './pomodoro-reducer'
import type { PomodoroState } from '../types/pomodoro'
import { getDefaultSettings } from '../utils/timer'

describe('pomodoroReducer', () => {
  const initialState: PomodoroState = {
    currentSessionType: 'work',
    timerState: 'idle',
    timeRemaining: 25 * 60,
    pomodorosCompletedToday: 0,
    workSessionsToday: 0,
    currentStreak: 0,
    sessions: [],
    settings: getDefaultSettings(),
  }

  describe('START_TIMER', () => {
    it('should start the timer from idle state', () => {
      const action: PomodoroAction = { type: 'START_TIMER' }
      const newState = pomodoroReducer(initialState, action)

      expect(newState.timerState).toBe('running')
      expect(newState.timeRemaining).toBe(25 * 60)
    })

    it('should resume the timer from paused state', () => {
      const pausedState: PomodoroState = {
        ...initialState,
        timerState: 'paused',
        timeRemaining: 10 * 60,
      }
      const action: PomodoroAction = { type: 'START_TIMER' }
      const newState = pomodoroReducer(pausedState, action)

      expect(newState.timerState).toBe('running')
      expect(newState.timeRemaining).toBe(10 * 60)
    })
  })

  describe('PAUSE_TIMER', () => {
    it('should pause a running timer', () => {
      const runningState: PomodoroState = {
        ...initialState,
        timerState: 'running',
      }
      const action: PomodoroAction = { type: 'PAUSE_TIMER' }
      const newState = pomodoroReducer(runningState, action)

      expect(newState.timerState).toBe('paused')
    })
  })

  describe('RESET_TIMER', () => {
    it('should reset timer to initial duration for current session type', () => {
      const modifiedState: PomodoroState = {
        ...initialState,
        timerState: 'running',
        timeRemaining: 10 * 60,
      }
      const action: PomodoroAction = { type: 'RESET_TIMER' }
      const newState = pomodoroReducer(modifiedState, action)

      expect(newState.timerState).toBe('idle')
      expect(newState.timeRemaining).toBe(25 * 60) // work duration
    })

    it('should reset break timer to break duration', () => {
      const breakState: PomodoroState = {
        ...initialState,
        currentSessionType: 'short-break',
        timeRemaining: 2 * 60,
      }
      const action: PomodoroAction = { type: 'RESET_TIMER' }
      const newState = pomodoroReducer(breakState, action)

      expect(newState.timeRemaining).toBe(5 * 60) // short break duration
    })
  })

  describe('TICK', () => {
    it('should decrement time remaining by 1 second', () => {
      const runningState: PomodoroState = {
        ...initialState,
        timerState: 'running',
        timeRemaining: 100,
      }
      const action: PomodoroAction = { type: 'TICK' }
      const newState = pomodoroReducer(runningState, action)

      expect(newState.timeRemaining).toBe(99)
    })

    it('should not go below 0', () => {
      const almostDoneState: PomodoroState = {
        ...initialState,
        timerState: 'running',
        timeRemaining: 0,
      }
      const action: PomodoroAction = { type: 'TICK' }
      const newState = pomodoroReducer(almostDoneState, action)

      expect(newState.timeRemaining).toBe(0)
    })

    it('should mark timer as completed when reaching 0', () => {
      const almostDoneState: PomodoroState = {
        ...initialState,
        timerState: 'running',
        timeRemaining: 1,
      }
      const action: PomodoroAction = { type: 'TICK' }
      const newState = pomodoroReducer(almostDoneState, action)

      expect(newState.timeRemaining).toBe(0)
      expect(newState.timerState).toBe('completed')
    })
  })

  describe('COMPLETE_SESSION', () => {
    it('should increment both counters when finishing work session', () => {
      const workDoneState: PomodoroState = {
        ...initialState,
        timerState: 'completed',
        timeRemaining: 0,
      }
      const action: PomodoroAction = { type: 'COMPLETE_SESSION' }
      const newState = pomodoroReducer(workDoneState, action)

      expect(newState.pomodorosCompletedToday).toBe(1)
      expect(newState.workSessionsToday).toBe(1)
      expect(newState.currentSessionType).toBe('short-break')
      expect(newState.timeRemaining).toBe(5 * 60)
      expect(newState.timerState).toBe('idle')
    })

    it('should transition to long break after 4th pomodoro', () => {
      const fourthPomodoroState: PomodoroState = {
        ...initialState,
        timerState: 'completed',
        timeRemaining: 0,
        pomodorosCompletedToday: 3,
        workSessionsToday: 3,
      }
      const action: PomodoroAction = { type: 'COMPLETE_SESSION' }
      const newState = pomodoroReducer(fourthPomodoroState, action)

      expect(newState.pomodorosCompletedToday).toBe(4)
      expect(newState.workSessionsToday).toBe(4)
      expect(newState.currentSessionType).toBe('long-break')
      expect(newState.timeRemaining).toBe(15 * 60)
    })

    it('should not increment pomodoros when completing break session', () => {
      const breakDoneState: PomodoroState = {
        ...initialState,
        currentSessionType: 'short-break',
        timerState: 'completed',
        timeRemaining: 0,
        pomodorosCompletedToday: 1,
      }
      const action: PomodoroAction = { type: 'COMPLETE_SESSION' }
      const newState = pomodoroReducer(breakDoneState, action)

      expect(newState.pomodorosCompletedToday).toBe(1) // unchanged
      expect(newState.currentSessionType).toBe('work')
      expect(newState.timeRemaining).toBe(25 * 60)
    })

    it('should auto-start next session if setting is enabled', () => {
      const autoStartState: PomodoroState = {
        ...initialState,
        timerState: 'completed',
        timeRemaining: 0,
        settings: {
          ...getDefaultSettings(),
          autoStartNextSession: true,
        },
      }
      const action: PomodoroAction = { type: 'COMPLETE_SESSION' }
      const newState = pomodoroReducer(autoStartState, action)

      expect(newState.timerState).toBe('running')
    })
  })

  describe('SKIP_SESSION', () => {
    it('should increment workSessionsToday but not pomodorosCompletedToday when skipping work', () => {
      const workState: PomodoroState = {
        ...initialState,
        currentSessionType: 'work',
        timerState: 'running',
        pomodorosCompletedToday: 2,
        workSessionsToday: 2,
      }
      const action: PomodoroAction = { type: 'SKIP_SESSION' }
      const newState = pomodoroReducer(workState, action)

      expect(newState.pomodorosCompletedToday).toBe(2) // unchanged
      expect(newState.workSessionsToday).toBe(3) // incremented
      expect(newState.currentSessionType).toBe('short-break')
      expect(newState.timeRemaining).toBe(5 * 60)
    })

    it('should skip short break without changing either counter', () => {
      const shortBreakState: PomodoroState = {
        ...initialState,
        currentSessionType: 'short-break',
        timerState: 'running',
        pomodorosCompletedToday: 2,
        workSessionsToday: 2,
      }
      const action: PomodoroAction = { type: 'SKIP_SESSION' }
      const newState = pomodoroReducer(shortBreakState, action)

      expect(newState.pomodorosCompletedToday).toBe(2) // unchanged
      expect(newState.workSessionsToday).toBe(2) // unchanged
      expect(newState.currentSessionType).toBe('work')
      expect(newState.timeRemaining).toBe(25 * 60)
    })

    it('should reset workSessionsToday to 0 when skipping long break', () => {
      const longBreakState: PomodoroState = {
        ...initialState,
        currentSessionType: 'long-break',
        timerState: 'running',
        pomodorosCompletedToday: 4,
        workSessionsToday: 4,
      }
      const action: PomodoroAction = { type: 'SKIP_SESSION' }
      const newState = pomodoroReducer(longBreakState, action)

      expect(newState.pomodorosCompletedToday).toBe(4) // unchanged
      expect(newState.workSessionsToday).toBe(0) // reset to 0
      expect(newState.currentSessionType).toBe('work')
      expect(newState.timeRemaining).toBe(25 * 60)
    })

    it('should show long break after skipping 4 work sessions', () => {
      // Start state
      let state: PomodoroState = {
        ...initialState,
        currentSessionType: 'work',
        timerState: 'idle',
        pomodorosCompletedToday: 0,
        workSessionsToday: 0,
      }

      // Skip work sessions 4 times
      for (let i = 0; i < 4; i++) {
        // Skip work
        state = pomodoroReducer(state, { type: 'SKIP_SESSION' })
        expect(state.currentSessionType).toBe(i < 3 ? 'short-break' : 'long-break')

        if (i < 3) {
          // Skip break (except for last one)
          state = pomodoroReducer(state, { type: 'SKIP_SESSION' })
          expect(state.currentSessionType).toBe('work')
        }
      }

      // After 4 skipped work sessions
      expect(state.pomodorosCompletedToday).toBe(0) // No completed pomodoros
      expect(state.workSessionsToday).toBe(4) // 4 work sessions (skipped)
      expect(state.currentSessionType).toBe('long-break') // Should be long break
    })

    it('should ensure next break is short after skipping long break', () => {
      // Skip long break
      const longBreakState: PomodoroState = {
        ...initialState,
        currentSessionType: 'long-break',
        timerState: 'running',
        pomodorosCompletedToday: 4,
        workSessionsToday: 4,
      }
      const skipAction: PomodoroAction = { type: 'SKIP_SESSION' }
      const afterSkip = pomodoroReducer(longBreakState, skipAction)

      expect(afterSkip.pomodorosCompletedToday).toBe(4) // unchanged
      expect(afterSkip.workSessionsToday).toBe(0) // reset
      expect(afterSkip.currentSessionType).toBe('work')

      // Complete work session
      const completeAction: PomodoroAction = { type: 'COMPLETE_SESSION' }
      const afterWork = pomodoroReducer(
        { ...afterSkip, timerState: 'completed' },
        completeAction
      )

      expect(afterWork.pomodorosCompletedToday).toBe(5)
      expect(afterWork.workSessionsToday).toBe(1)
      expect(afterWork.currentSessionType).toBe('short-break') // Should be short break
    })

    it('should respect autoStartNextSession setting when skipping', () => {
      const autoStartState: PomodoroState = {
        ...initialState,
        currentSessionType: 'work',
        timerState: 'running',
        pomodorosCompletedToday: 2,
        settings: {
          ...getDefaultSettings(),
          autoStartNextSession: true,
        },
      }
      const action: PomodoroAction = { type: 'SKIP_SESSION' }
      const newState = pomodoroReducer(autoStartState, action)

      expect(newState.timerState).toBe('running')
    })
  })

  describe('UPDATE_SETTINGS', () => {
    it('should update settings', () => {
      const newSettings = {
        ...getDefaultSettings(),
        workDuration: 30 * 60,
        autoStartNextSession: true,
      }
      const action: PomodoroAction = {
        type: 'UPDATE_SETTINGS',
        payload: newSettings,
      }
      const newState = pomodoroReducer(initialState, action)

      expect(newState.settings).toEqual(newSettings)
    })

    it('should update time remaining if currently idle and on work session', () => {
      const action: PomodoroAction = {
        type: 'UPDATE_SETTINGS',
        payload: {
          ...getDefaultSettings(),
          workDuration: 30 * 60,
        },
      }
      const newState = pomodoroReducer(initialState, action)

      expect(newState.timeRemaining).toBe(30 * 60)
    })

    it('should not update time remaining if timer is running', () => {
      const runningState: PomodoroState = {
        ...initialState,
        timerState: 'running',
        timeRemaining: 15 * 60,
      }
      const action: PomodoroAction = {
        type: 'UPDATE_SETTINGS',
        payload: {
          ...getDefaultSettings(),
          workDuration: 30 * 60,
        },
      }
      const newState = pomodoroReducer(runningState, action)

      expect(newState.timeRemaining).toBe(15 * 60) // unchanged
    })
  })
})
