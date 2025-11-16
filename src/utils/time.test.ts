import { describe, it, expect } from 'vitest'
import { formatTime, formatDuration, minutesToSeconds, secondsToMinutes } from './time'

describe('time utils', () => {
  describe('formatTime', () => {
    it('formats seconds into MM:SS format', () => {
      expect(formatTime(0)).toBe('00:00')
      expect(formatTime(59)).toBe('00:59')
      expect(formatTime(60)).toBe('01:00')
      expect(formatTime(125)).toBe('02:05')
      expect(formatTime(1500)).toBe('25:00')
    })
  })

  describe('formatDuration', () => {
    it('formats short durations in minutes', () => {
      expect(formatDuration(60)).toBe('1m')
      expect(formatDuration(300)).toBe('5m')
      expect(formatDuration(1500)).toBe('25m')
    })

    it('formats long durations with hours', () => {
      expect(formatDuration(3600)).toBe('1h 0m')
      expect(formatDuration(3660)).toBe('1h 1m')
      expect(formatDuration(7200)).toBe('2h 0m')
    })
  })

  describe('minutesToSeconds', () => {
    it('converts minutes to seconds', () => {
      expect(minutesToSeconds(1)).toBe(60)
      expect(minutesToSeconds(5)).toBe(300)
      expect(minutesToSeconds(25)).toBe(1500)
    })
  })

  describe('secondsToMinutes', () => {
    it('converts seconds to minutes', () => {
      expect(secondsToMinutes(60)).toBe(1)
      expect(secondsToMinutes(300)).toBe(5)
      expect(secondsToMinutes(1500)).toBe(25)
      expect(secondsToMinutes(90)).toBe(1) // floors the result
    })
  })
})
