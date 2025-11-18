/**
 * Notification Manager - Handles browser popup notifications
 * Uses the Web Notifications API for desktop notifications
 */

export type NotificationPermissionStatus = 'granted' | 'denied' | 'default'

/**
 * Request permission to show browser notifications
 * @returns Promise that resolves with the permission status
 */
export async function requestNotificationPermission(): Promise<NotificationPermissionStatus> {
  if (!isNotificationSupported()) {
    console.warn('Notifications are not supported in this browser')
    return 'denied'
  }

  try {
    const permission = await Notification.requestPermission()
    return permission as NotificationPermissionStatus
  } catch (error) {
    console.error('Failed to request notification permission:', error)
    return 'denied'
  }
}

/**
 * Get the current notification permission status
 */
export function getNotificationPermission(): NotificationPermissionStatus {
  if (!isNotificationSupported()) {
    return 'denied'
  }

  return Notification.permission as NotificationPermissionStatus
}

/**
 * Show a browser notification
 * @param title - The notification title
 * @param options - Notification options (body, icon, etc.)
 * @returns The Notification instance or null if failed
 */
export function showNotification(
  title: string,
  options?: NotificationOptions
): Notification | null {
  // Check if notifications are supported
  if (!isNotificationSupported()) {
    console.warn('Notifications are not supported in this browser')
    return null
  }

  // Check permission
  const permission = getNotificationPermission()
  if (permission !== 'granted') {
    console.warn('Notification permission not granted')
    return null
  }

  try {
    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    })

    // Auto-close notification after 5 seconds
    setTimeout(() => {
      notification.close()
    }, 5000)

    return notification
  } catch (error) {
    console.error('Failed to show notification:', error)
    return null
  }
}

/**
 * Show a session completion notification
 * @param sessionType - The type of session that completed ('work', 'short-break', 'long-break')
 * @returns The Notification instance or null if failed
 */
export function showSessionCompleteNotification(
  sessionType: 'work' | 'short-break' | 'long-break'
): Notification | null {
  const messages = {
    work: {
      title: 'Focus Session Complete!',
      body: 'Great work! Time for a well-deserved break.',
    },
    'short-break': {
      title: 'Short Break Complete!',
      body: 'Break time is over. Ready to focus again?',
    },
    'long-break': {
      title: 'Long Break Complete!',
      body: 'Feeling refreshed? Time to start a new cycle.',
    },
  }

  const message = messages[sessionType]

  return showNotification(message.title, {
    body: message.body,
    tag: 'session-complete', // Replace existing notification with same tag
    requireInteraction: false,
  })
}

/**
 * Check if the Notification API is supported in the current browser
 */
export function isNotificationSupported(): boolean {
  return 'Notification' in window
}
