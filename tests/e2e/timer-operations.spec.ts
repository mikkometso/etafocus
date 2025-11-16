import { test, expect } from '@playwright/test'
import { TimerHelpers } from './helpers/timer-helpers'

test.describe('Timer Operations', () => {
  let timer: TimerHelpers

  test.beforeEach(async ({ page }) => {
    timer = new TimerHelpers(page)
    await timer.goto()
  })

  test('should display initial timer state', async () => {
    await expect(timer.page).toHaveTitle(/EtaFocus/)

    const display = await timer.getTimerDisplay()
    expect(display).toBe('25:00')

    const sessionType = await timer.getSessionType()
    expect(sessionType).toBe('Focus Time')

    await timer.verifyButtonExists(/start/i)
    await timer.verifyButtonDisabled(/reset/i)
  })

  test('should start timer and countdown', async () => {
    const initialTime = await timer.getTimerDisplay()
    expect(initialTime).toBe('25:00')

    await timer.clickStart()

    // Verify button changed to Pause
    await timer.verifyButtonExists(/pause/i)

    // Verify reset button is now enabled
    const resetButton = timer.page.getByRole('button', { name: /reset/i })
    await expect(resetButton).toBeEnabled()

    // Wait for timer to tick
    await timer.waitForTimerTick()

    const newTime = await timer.getTimerDisplay()
    expect(newTime).toBe('24:59')
  })

  test('should pause and resume timer', async () => {
    await timer.clickStart()
    await timer.waitForTimerTick()

    await timer.clickPause()

    // Verify button changed to Resume
    await timer.verifyButtonExists(/resume/i)

    const pausedTime = await timer.getTimerDisplay()

    // Wait a bit and verify time didn't change
    await timer.page.waitForTimeout(2000)

    const stillPausedTime = await timer.getTimerDisplay()
    expect(stillPausedTime).toBe(pausedTime)

    // Resume
    await timer.clickStart()

    // Verify button changed back to Pause
    await timer.verifyButtonExists(/pause/i)

    // Wait for tick and verify countdown continues
    await timer.waitForTimerTick()

    const resumedTime = await timer.getTimerDisplay()
    const pausedSeconds = timer.timeToSeconds(pausedTime)
    const resumedSeconds = timer.timeToSeconds(resumedTime)

    expect(resumedSeconds).toBeLessThan(pausedSeconds)
  })

  test('should reset timer to initial state', async () => {
    await timer.clickStart()

    // Let it run for a couple seconds
    await timer.waitForTimerTick()
    await timer.page.waitForTimeout(1000)

    await timer.clickReset()

    // Verify back to initial state
    const display = await timer.getTimerDisplay()
    expect(display).toBe('25:00')

    await timer.verifyButtonExists(/start/i)
    await timer.verifyButtonDisabled(/reset/i)
  })
})
