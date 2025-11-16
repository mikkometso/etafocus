import { describe, it, expect } from 'vitest'
import {
  calculateNextSessionType,
  shouldTakeLongBreak,
  getDefaultSettings,
  getDurationForSessionType,
} from './timer'
import type { PomodoroSettings } from '../types/pomodoro'

describe('timer utilities', () => {
  const mockSettings: PomodoroSettings = {
    workDuration: 25 * 60,
    shortBreakDuration: 5 * 60,
    longBreakDuration: 15 * 60,
    longBreakInterval: 4,
    autoStartNextSession: false,
    soundEnabled: true,
    notificationEnabled: true,
    soundSelection: 'default',
  }

  describe('calculateNextSessionType', () => {
    it('should return short-break after work session when not time for long break', () => {
      const result = calculateNextSessionType('work', 1, 4)
      expect(result).toBe('short-break')
    })

    it('should return long-break after work session when it is time for long break', () => {
      const result = calculateNextSessionType('work', 4, 4)
      expect(result).toBe('long-break')
    })

    it('should return work after short-break', () => {
      const result = calculateNextSessionType('short-break', 2, 4)
      expect(result).toBe('work')
    })

    it('should return work after long-break', () => {
      const result = calculateNextSessionType('long-break', 4, 4)
      expect(result).toBe('work')
    })
  })

  describe('shouldTakeLongBreak', () => {
    it('should return true when pomodoros completed equals interval', () => {
      expect(shouldTakeLongBreak(4, 4)).toBe(true)
    })

    it('should return true when pomodoros completed is multiple of interval', () => {
      expect(shouldTakeLongBreak(8, 4)).toBe(true)
      expect(shouldTakeLongBreak(12, 4)).toBe(true)
    })

    it('should return false when pomodoros completed is not multiple of interval', () => {
      expect(shouldTakeLongBreak(1, 4)).toBe(false)
      expect(shouldTakeLongBreak(2, 4)).toBe(false)
      expect(shouldTakeLongBreak(3, 4)).toBe(false)
      expect(shouldTakeLongBreak(5, 4)).toBe(false)
    })

    it('should return false when pomodoros completed is 0', () => {
      expect(shouldTakeLongBreak(0, 4)).toBe(false)
    })
  })

  describe('getDefaultSettings', () => {
    it('should return default pomodoro settings', () => {
      const settings = getDefaultSettings()

      expect(settings).toEqual({
        workDuration: 25 * 60,
        shortBreakDuration: 5 * 60,
        longBreakDuration: 15 * 60,
        longBreakInterval: 4,
        autoStartNextSession: false,
        soundEnabled: true,
        notificationEnabled: false,
        soundSelection: 'default',
      })
    })
  })

  describe('getDurationForSessionType', () => {
    it('should return work duration for work session', () => {
      const duration = getDurationForSessionType('work', mockSettings)
      expect(duration).toBe(25 * 60)
    })

    it('should return short break duration for short-break session', () => {
      const duration = getDurationForSessionType('short-break', mockSettings)
      expect(duration).toBe(5 * 60)
    })

    it('should return long break duration for long-break session', () => {
      const duration = getDurationForSessionType('long-break', mockSettings)
      expect(duration).toBe(15 * 60)
    })
  })
})
