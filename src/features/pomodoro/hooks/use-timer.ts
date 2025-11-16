import { useEffect, useRef } from 'react'

type UseTimerOptions = {
  isRunning: boolean
  onTick: () => void
  interval?: number
}

/**
 * Custom hook to manage timer interval
 * Calls onTick callback every interval (default 1000ms) when isRunning is true
 */
export function useTimer({ isRunning, onTick, interval = 1000 }: UseTimerOptions) {
  const intervalRef = useRef<number | null>(null)
  const onTickRef = useRef(onTick)

  // Keep onTick ref up to date
  useEffect(() => {
    onTickRef.current = onTick
  }, [onTick])

  useEffect(() => {
    if (isRunning) {
      // Start interval
      intervalRef.current = window.setInterval(() => {
        onTickRef.current()
      }, interval)
    } else {
      // Clear interval if it exists
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRunning, interval])
}
