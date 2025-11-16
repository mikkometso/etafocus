import { type Page, expect } from '@playwright/test'

/**
 * Helper functions for E2E timer tests
 */

export class TimerHelpers {
  constructor(public page: Page) {}

  /**
   * Navigate to the app
   */
  async goto() {
    await this.page.goto('/')
  }

  /**
   * Get the timer display text (MM:SS)
   */
  async getTimerDisplay(): Promise<string> {
    const timerElement = this.page.getByText(/^\d{2}:\d{2}$/)
    return await timerElement.textContent() || ''
  }

  /**
   * Get the session type label (Focus Time, Short Break, Long Break)
   */
  async getSessionType(): Promise<string> {
    const sessionElement = this.page.getByRole('heading', { level: 2 })
    return await sessionElement.textContent() || ''
  }

  /**
   * Click the Start/Resume button
   */
  async clickStart() {
    await this.page.getByRole('button', { name: /start|resume/i }).click()
  }

  /**
   * Click the Pause button
   */
  async clickPause() {
    await this.page.getByRole('button', { name: /pause/i }).click()
  }

  /**
   * Click the Reset button
   */
  async clickReset() {
    await this.page.getByRole('button', { name: /reset/i }).click()
  }

  

  /**
   * Click the Next Session button (when timer is completed)
   */
  async clickNext() {
    await this.page.getByRole('button', { name: /next session/i }).click()
  }

  /**
   * Wait for timer to tick (decrease by 1 second)
   */
  async waitForTimerTick() {
    const initialTime = await this.getTimerDisplay()
    await this.page.waitForFunction(
      (expected) => {
        const current = document.querySelector('[class*="text-8xl"]')?.textContent || ''
        return current !== expected
      },
      initialTime,
      { timeout: 2000 }
    )
  }

  /**
   * Get pomodoros completed count
   */
  async getPomodorosCompleted(): Promise<number> {
    const completedText = await this.page
      .locator('text=Completed Today')
      .locator('..')
      .locator('.text-3xl')
      .textContent()
    return parseInt(completedText || '0', 10)
  }

  /**
   * Get current streak
   */
  async getCurrentStreak(): Promise<number> {
    const streakText = await this.page
      .locator('text=/\\d+ Days? Streak/i')
      .locator('..')
      .locator('.text-3xl')
      .textContent()
    return parseInt(streakText || '0', 10)
  }

  /**
   * Verify button state
   */
  async verifyButtonExists(name: RegExp) {
    await expect(this.page.getByRole('button', { name })).toBeVisible()
  }

  /**
   * Verify button is disabled
   */
  async verifyButtonDisabled(name: RegExp) {
    await expect(this.page.getByRole('button', { name })).toBeDisabled()
  }

  /**
   * Convert MM:SS to total seconds
   */
  timeToSeconds(time: string): number {
    const [minutes, seconds] = time.split(':').map(Number)
    return minutes * 60 + seconds
  }

  /**
   * Clear localStorage
   */
  async clearStorage() {
    await this.page.evaluate(() => localStorage.clear())
  }

  /**
   * Get localStorage item
   */
  async getStorageItem(key: string): Promise<string | null> {
    return await this.page.evaluate((k) => localStorage.getItem(k), key)
  }

  /**
   * Toggle theme
   */
  async toggleTheme() {
    // Assuming there will be a theme toggle button
    // Update this selector based on actual implementation
    await this.page.getByRole('button', { name: /theme/i }).click()
  }

  /**
   * Get current theme
   */
  async getCurrentTheme(): Promise<'light' | 'dark'> {
    const html = this.page.locator('html')
    const className = await html.getAttribute('class')
    return className?.includes('dark') ? 'dark' : 'light'
  }

  /**
   * Complete the current timer instantly by setting time to 0 and reloading
   */
  async completeTimer() {
    await this.page.evaluate(() => {
      const key = 'etafocus_pomodoro_state'
      const raw = localStorage.getItem(key)
      if (!raw) return

      const state = JSON.parse(raw)
      state.timeRemaining = 0
      state.timerState = 'completed'
      localStorage.setItem(key, JSON.stringify(state))
    })

    // Reload to see the completed state
    await this.page.reload()
  }
}
