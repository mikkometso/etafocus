import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTimer } from './use-timer'

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should call onTick every second when running', () => {
    const onTick = vi.fn()
    const { result } = renderHook(() => useTimer({ isRunning: true, onTick }))

    expect(onTick).not.toHaveBeenCalled()

    // Advance time by 1 second
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(onTick).toHaveBeenCalledTimes(1)

    // Advance another second
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(onTick).toHaveBeenCalledTimes(2)
  })

  it('should not call onTick when not running', () => {
    const onTick = vi.fn()
    renderHook(() => useTimer({ isRunning: false, onTick }))

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(onTick).not.toHaveBeenCalled()
  })

  it('should stop calling onTick when isRunning changes to false', () => {
    const onTick = vi.fn()
    const { rerender } = renderHook(
      ({ isRunning }) => useTimer({ isRunning, onTick }),
      { initialProps: { isRunning: true } }
    )

    // Timer should tick when running
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(onTick).toHaveBeenCalledTimes(1)

    // Pause the timer
    rerender({ isRunning: false })

    // Advance time - should not tick
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(onTick).toHaveBeenCalledTimes(1) // Still just 1
  })

  it('should resume calling onTick when isRunning changes back to true', () => {
    const onTick = vi.fn()
    const { rerender } = renderHook(
      ({ isRunning }) => useTimer({ isRunning, onTick }),
      { initialProps: { isRunning: false } }
    )

    // Start as paused
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(onTick).not.toHaveBeenCalled()

    // Resume
    rerender({ isRunning: true })

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(onTick).toHaveBeenCalledTimes(1)
  })

  it('should cleanup interval on unmount', () => {
    const onTick = vi.fn()
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval')

    const { unmount } = renderHook(() => useTimer({ isRunning: true, onTick }))

    unmount()

    expect(clearIntervalSpy).toHaveBeenCalled()
  })

  it('should use custom interval if provided', () => {
    const onTick = vi.fn()
    renderHook(() => useTimer({ isRunning: true, onTick, interval: 500 }))

    // Should not tick at 400ms
    act(() => {
      vi.advanceTimersByTime(400)
    })
    expect(onTick).not.toHaveBeenCalled()

    // Should tick at 500ms
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(onTick).toHaveBeenCalledTimes(1)
  })
})
