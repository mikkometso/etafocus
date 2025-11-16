import { test, expect } from '@playwright/test'
import { TimerHelpers } from './helpers/timer-helpers'

test.describe('Session Flow & Transitions', () => {
  let timer: TimerHelpers

  test.beforeEach(async ({ page }) => {
    timer = new TimerHelpers(page)
    await timer.goto()
    await timer.clearStorage() // Start fresh
    await timer.page.reload()
  })

  test('should transition from work to short break after completing session', async () => {
    // Verify starting with work session
    let sessionType = await timer.getSessionType()
    expect(sessionType).toBe('Focus Time')

    // Complete the work session instantly
    await timer.completeTimer()

    // Should show Next Session button
    await timer.verifyButtonExists(/next session/i)

    // Click next
    await timer.clickNext()

    // Should transition to short break
    sessionType = await timer.getSessionType()
    expect(sessionType).toBe('Short Break')

    const display = await timer.getTimerDisplay()
    expect(display).toBe('05:00')
  })

  test('should transition to long break after 4th pomodoro', async () => {
    // Setup: 3 pomodoros completed, on 4th work session
    await timer.page.evaluate(() => {
      const key = 'etafocus_pomodoro_state'
      const state = JSON.parse(localStorage.getItem(key) || '{}')
      state.currentSessionType = 'work'
      state.timeRemaining = 25 * 60 // Start with full 25 minutes
      state.timerState = 'idle'
      state.pomodorosCompletedToday = 3
      localStorage.setItem(key, JSON.stringify(state))
    })
    await timer.page.reload()

    // Complete the 4th pomodoro instantly
    await timer.completeTimer()

    // Click next session
    await timer.clickNext()

    // Verify it transitions to LONG break
    const sessionType = await timer.getSessionType()
    expect(sessionType).toBe('Long Break')

    const display = await timer.getTimerDisplay()
    expect(display).toBe('15:00')
  })

})
