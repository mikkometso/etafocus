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
    it('should increment pomodoros completed when finishing work session', () => {
      const workDoneState: PomodoroState = {
        ...initialState,
        timerState: 'completed',
        timeRemaining: 0,
      }
      const action: PomodoroAction = { type: 'COMPLETE_SESSION' }
      const newState = pomodoroReducer(workDoneState, action)

      expect(newState.pomodorosCompletedToday).toBe(1)
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
      }
      const action: PomodoroAction = { type: 'COMPLETE_SESSION' }
      const newState = pomodoroReducer(fourthPomodoroState, action)

      expect(newState.pomodorosCompletedToday).toBe(4)
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
