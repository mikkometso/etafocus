import { useEffect, useRef } from 'react'
import { playNotificationSound, isAudioSupported, type SoundType } from '@/lib/audio/audio-manager'
import {
  showSessionCompleteNotification,
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
} from '@/lib/notifications/notification-manager'
import type { PomodoroState } from '../types/pomodoro'

type UsePomodoroNotificationsProps = {
  state: PomodoroState
}

/**
 * Custom hook to handle audio and notification triggers for pomodoro timer
 * Plays sounds and shows browser notifications when a session completes
 */
export function usePomodoroNotifications({ state }: UsePomodoroNotificationsProps) {
  const previousTimerState = useRef(state.timerState)

  useEffect(() => {
    // Detect transition to 'completed' state
    const justCompleted = previousTimerState.current !== 'completed' && state.timerState === 'completed'

    if (justCompleted) {
      // Play sound if enabled
      if (state.settings.soundEnabled && isAudioSupported()) {
        const soundType = (state.settings.soundSelection || 'default') as SoundType
        const soundDuration = state.settings.soundDuration || 1
        playNotificationSound(soundType, soundDuration).catch((error) => {
          console.error('Failed to play notification sound:', error)
        })
      }

      // Show notification if enabled
      if (state.settings.notificationEnabled && isNotificationSupported()) {
        const permission = getNotificationPermission()

        if (permission === 'granted') {
          showSessionCompleteNotification(state.currentSessionType)
        } else if (permission === 'default') {
          // Permission not yet requested, could auto-request here
          console.warn('Notification permission not yet requested')
        }
      }
    }

    // Update previous state for next render
    previousTimerState.current = state.timerState
  }, [state.timerState, state.currentSessionType, state.settings.soundEnabled, state.settings.notificationEnabled, state.settings.soundSelection])
}

/**
 * Helper function to request notification permission
 * Can be called from UI components to request permission before enabling notifications
 */
export async function requestNotificationPermissionForPomodoro(): Promise<boolean> {
  if (!isNotificationSupported()) {
    return false
  }

  const permission = await requestNotificationPermission()
  return permission === 'granted'
}
