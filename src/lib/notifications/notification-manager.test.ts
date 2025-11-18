import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  requestNotificationPermission,
  getNotificationPermission,
  showNotification,
  showSessionCompleteNotification,
  isNotificationSupported,
} from './notification-manager'

// Mock Notification API
class MockNotification {
  static permission: NotificationPermission = 'default'
  static requestPermission = vi.fn()

  title: string
  options?: NotificationOptions

  constructor(title: string, options?: NotificationOptions) {
    this.title = title
    this.options = options
  }

  close() {
    // Mock close method
  }
}

// Helper type for testing notification with options
type MockNotificationInstance = Notification & { options?: NotificationOptions }

describe('notification-manager', () => {
  let originalNotification: typeof Notification

  beforeEach(() => {
    // Save original Notification
    originalNotification = globalThis.Notification

    // Mock Notification API
    globalThis.Notification = MockNotification as unknown as typeof Notification

    // Reset permission to default
    MockNotification.permission = 'default'
    MockNotification.requestPermission.mockReset()

    // Clear timers
    vi.useFakeTimers()
  })

  afterEach(() => {
    // Restore original Notification
    globalThis.Notification = originalNotification

    // Restore timers
    vi.useRealTimers()
  })

  describe('isNotificationSupported', () => {
    it('should return true when Notification API is available', () => {
      expect(isNotificationSupported()).toBe(true)
    })

    it('should return false when Notification API is not available', () => {
      const tempNotification = globalThis.Notification
      // @ts-expect-error - Testing undefined case
      delete globalThis.Notification

      expect(isNotificationSupported()).toBe(false)

      globalThis.Notification = tempNotification
    })
  })

  describe('getNotificationPermission', () => {
    it('should return current permission status', () => {
      MockNotification.permission = 'granted'
      expect(getNotificationPermission()).toBe('granted')

      MockNotification.permission = 'denied'
      expect(getNotificationPermission()).toBe('denied')

      MockNotification.permission = 'default'
      expect(getNotificationPermission()).toBe('default')
    })

    it('should return denied when Notification API is not supported', () => {
      const tempNotification = globalThis.Notification
      // @ts-expect-error - Testing undefined case
      delete globalThis.Notification

      expect(getNotificationPermission()).toBe('denied')

      globalThis.Notification = tempNotification
    })
  })

  describe('requestNotificationPermission', () => {
    it('should request permission and return granted', async () => {
      MockNotification.requestPermission.mockResolvedValue('granted')

      const result = await requestNotificationPermission()

      expect(result).toBe('granted')
      expect(MockNotification.requestPermission).toHaveBeenCalledTimes(1)
    })

    it('should request permission and return denied', async () => {
      MockNotification.requestPermission.mockResolvedValue('denied')

      const result = await requestNotificationPermission()

      expect(result).toBe('denied')
      expect(MockNotification.requestPermission).toHaveBeenCalledTimes(1)
    })

    it('should return denied when Notification API is not supported', async () => {
      const tempNotification = globalThis.Notification
      // @ts-expect-error - Testing undefined case
      delete globalThis.Notification

      const result = await requestNotificationPermission()

      expect(result).toBe('denied')

      globalThis.Notification = tempNotification
    })

    it('should handle errors gracefully', async () => {
      MockNotification.requestPermission.mockRejectedValue(new Error('Permission error'))

      const result = await requestNotificationPermission()

      expect(result).toBe('denied')
    })
  })

  describe('showNotification', () => {
    it('should show notification when permission is granted', async () => {
      MockNotification.permission = 'granted'

      const notification = await showNotification('Test Title', {
        body: 'Test body',
      })

      expect(notification).not.toBeNull()
      expect(notification?.title).toBe('Test Title')
      expect((notification as MockNotificationInstance)?.options?.body).toBe('Test body')
    })

    it('should not show notification when permission is denied', async () => {
      MockNotification.permission = 'denied'

      const notification = await showNotification('Test Title')

      expect(notification).toBeNull()
    })

    it('should not show notification when permission is default', async () => {
      MockNotification.permission = 'default'

      const notification = await showNotification('Test Title')

      expect(notification).toBeNull()
    })

    it('should return null when Notification API is not supported', async () => {
      const tempNotification = globalThis.Notification
      // @ts-expect-error - Testing undefined case
      delete globalThis.Notification

      const notification = await showNotification('Test Title')

      expect(notification).toBeNull()

      globalThis.Notification = tempNotification
    })

    it('should auto-close notification after 5 seconds', async () => {
      MockNotification.permission = 'granted'

      const notification = await showNotification('Test Title')
      const closeSpy = vi.spyOn(notification!, 'close')

      // Fast-forward time by 5 seconds
      vi.advanceTimersByTime(5000)

      expect(closeSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('showSessionCompleteNotification', () => {
    beforeEach(() => {
      MockNotification.permission = 'granted'
    })

    it('should show work session complete notification', async () => {
      const notification = await showSessionCompleteNotification('work')

      expect(notification).not.toBeNull()
      expect(notification?.title).toBe('Focus Session Complete!')
      expect((notification as MockNotificationInstance)?.options?.body).toBe('Great work! Time for a well-deserved break.')
    })

    it('should show short break complete notification', async () => {
      const notification = await showSessionCompleteNotification('short-break')

      expect(notification).not.toBeNull()
      expect(notification?.title).toBe('Short Break Complete!')
      expect((notification as MockNotificationInstance)?.options?.body).toBe('Break time is over. Ready to focus again?')
    })

    it('should show long break complete notification', async () => {
      const notification = await showSessionCompleteNotification('long-break')

      expect(notification).not.toBeNull()
      expect(notification?.title).toBe('Long Break Complete!')
      expect((notification as MockNotificationInstance)?.options?.body).toBe('Feeling refreshed? Time to start a new cycle.')
    })

    it('should set tag to session-complete', async () => {
      const notification = await showSessionCompleteNotification('work')

      expect((notification as MockNotificationInstance)?.options?.tag).toBe('session-complete')
    })
  })
})
