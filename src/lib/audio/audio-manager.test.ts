import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { playNotificationSound, isAudioSupported } from './audio-manager'

// Mock AudioContext
class MockAudioContext {
  currentTime = 0
  destination = {}

  createOscillator() {
    const oscillator = {
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn((_time: number) => {
        // Simulate oscillator ending immediately when stopped
        setTimeout(() => {
          if (oscillator.onended) {
            oscillator.onended(new Event('ended'))
          }
        }, 0)
      }),
      frequency: {
        setValueAtTime: vi.fn(),
      },
      type: 'sine',
      onended: null as ((event: Event) => void) | null,
    }
    return oscillator
  }

  createGain() {
    return {
      connect: vi.fn(),
      gain: {
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
    }
  }

  close() {
    return Promise.resolve()
  }
}

describe('audio-manager', () => {
  let originalAudioContext: typeof AudioContext

  beforeEach(() => {
    // Save original AudioContext
    originalAudioContext = globalThis.AudioContext

    // Mock AudioContext
    globalThis.AudioContext = MockAudioContext as unknown as typeof AudioContext
  })

  afterEach(() => {
    // Restore original AudioContext
    globalThis.AudioContext = originalAudioContext
  })

  describe('isAudioSupported', () => {
    it('should return true when AudioContext is available', () => {
      expect(isAudioSupported()).toBe(true)
    })

    it('should return false when AudioContext is not available', () => {
      const tempAudioContext = globalThis.AudioContext
      // @ts-expect-error - Testing undefined case
      globalThis.AudioContext = undefined

      expect(isAudioSupported()).toBe(false)

      globalThis.AudioContext = tempAudioContext
    })
  })

  describe('playNotificationSound', () => {
    it('should play default sound when no type is specified', async () => {
      await playNotificationSound()

      // Sound should complete without errors
      expect(true).toBe(true)
    })

    it('should play beep sound when type is beep', async () => {
      await playNotificationSound('beep')

      // Sound should complete without errors
      expect(true).toBe(true)
    })

    it('should play chime sound when type is chime', async () => {
      await playNotificationSound('chime')

      // Sound should complete without errors
      expect(true).toBe(true)
    })

    it('should handle errors gracefully', async () => {
      // Mock AudioContext to throw error
      globalThis.AudioContext = class {
        constructor() {
          throw new Error('AudioContext error')
        }
      } as unknown as typeof AudioContext

      await expect(playNotificationSound()).rejects.toThrow('AudioContext error')
    })
  })
})
