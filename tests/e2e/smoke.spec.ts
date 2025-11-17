import { test, expect } from '@playwright/test'

test.describe('EtaFocus Smoke Tests', () => {
  test('should load app and display all UI elements', async ({ page }) => {
    await page.goto('/')

    // Verify page title
    await expect(page).toHaveTitle(/EtaFocus/)

    // Verify main heading
    await expect(page.getByRole('heading', { name: /Pomodoro Timer/i })).toBeVisible()

    // Verify timer display shows default time
    await expect(page.getByText('25:00')).toBeVisible()

    // Verify session type
    await expect(page.getByRole('heading', { name: /Focus Time/i })).toBeVisible()

    // Verify control buttons exist
    await expect(page.getByRole('button', { name: /start/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /reset/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /reset/i })).toBeDisabled()
    await expect(page.getByRole('button', { name: /^skip$/i })).toBeVisible()

    // Verify quick preset buttons exist
    await expect(page.getByRole('button', { name: /^5 min$/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /^10 min$/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /^15 min$/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /^25 min$/i })).toBeVisible()

    // Verify session info cards are visible
    await expect(page.getByText(/Completed Today/i)).toBeVisible()
    await expect(page.getByText(/Streak/i)).toBeVisible()
    await expect(page.getByText(/Next/i)).toBeVisible()
  })

  test('should handle basic timer interactions', async ({ page }) => {
    await page.goto('/')

    // Start button should be visible and enabled
    const startButton = page.getByRole('button', { name: /start/i })
    await expect(startButton).toBeVisible()
    await expect(startButton).toBeEnabled()

    // Click Start
    await startButton.click()

    // Button should change to Pause
    await expect(page.getByRole('button', { name: /pause/i })).toBeVisible()

    // Reset button should now be enabled
    await expect(page.getByRole('button', { name: /reset/i })).toBeEnabled()

    // Click Pause
    await page.getByRole('button', { name: /pause/i }).click()

    // Button should change to Resume
    await expect(page.getByRole('button', { name: /resume/i })).toBeVisible()

    // Click Resume
    await page.getByRole('button', { name: /resume/i }).click()

    // Button should change back to Pause
    await expect(page.getByRole('button', { name: /pause/i })).toBeVisible()

    // Click Reset
    await page.getByRole('button', { name: /reset/i }).click()

    // Should return to initial state with Start button
    await expect(page.getByRole('button', { name: /start/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /reset/i })).toBeDisabled()
  })

  test('should maintain UI after page reload', async ({ page }) => {
    await page.goto('/')

    // Verify initial state
    await expect(page.getByText('25:00')).toBeVisible()
    await expect(page.getByRole('heading', { name: /Focus Time/i })).toBeVisible()

    // Reload page
    await page.reload()

    // UI should still render correctly
    await expect(page).toHaveTitle(/EtaFocus/)
    await expect(page.getByRole('heading', { name: /Pomodoro Timer/i })).toBeVisible()
    await expect(page.getByText('25:00')).toBeVisible()
    await expect(page.getByRole('heading', { name: /Focus Time/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /start/i })).toBeVisible()
  })
})
