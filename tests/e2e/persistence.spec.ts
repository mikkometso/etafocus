import { test, expect } from '@playwright/test'
import { TimerHelpers } from './helpers/timer-helpers'

test.describe('Data Persistence', () => {
  let timer: TimerHelpers

  test.beforeEach(async ({ page }) => {
    timer = new TimerHelpers(page)
    await timer.goto()
    await timer.clearStorage() // Start fresh
    await timer.page.reload()
  })

  test('should persist timer state and session type after page refresh', async () => {
    // Set a complete valid state for short break
    await timer.page.evaluate(() => {
      const completeState = {
        currentSessionType: 'short-break',
        timeRemaining: 5 * 60,
        timerState: 'paused',
        pomodorosCompletedToday: 0,
        currentStreak: 0,
        settings: {
          workDuration: 25,
          shortBreakDuration: 5,
          longBreakDuration: 15,
          longBreakInterval: 4
        }
      }
      localStorage.setItem('etafocus_pomodoro_state', JSON.stringify(completeState))
    })

    await timer.page.waitForTimeout(100)
    await timer.page.reload()

    // Verify session type persisted
    const sessionType = await timer.getSessionType()
    expect(sessionType).toBe('Short Break')

    // Verify time persisted
    const display = await timer.getTimerDisplay()
    expect(display).toBe('05:00')

    // Verify state is saved to localStorage on updates
    await timer.clickStart()
    await timer.waitForTimerTick()

    const storedState = await timer.getStorageItem('etafocus_pomodoro_state')
    expect(storedState).not.toBeNull()

    const state = JSON.parse(storedState!)
    expect(state.timeRemaining).toBeLessThan(5 * 60)
  })

  test('should handle corrupted localStorage gracefully', async () => {
    // Set corrupted data
    await timer.page.evaluate(() => {
      localStorage.setItem('etafocus_pomodoro_state', 'corrupted-data-not-json')
    })

    await timer.page.reload()

    // Should fall back to defaults
    const display = await timer.getTimerDisplay()
    expect(display).toBe('25:00')

    const sessionType = await timer.getSessionType()
    expect(sessionType).toBe('Focus Time')
  })
})
