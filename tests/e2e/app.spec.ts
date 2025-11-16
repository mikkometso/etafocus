import { test, expect } from '@playwright/test'

test.describe('EtaFocus App', () => {
  test('should load and display the app title', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'EtaFocus' })).toBeVisible()
    await expect(page.getByText('Pomodoro Timer & Todo Application')).toBeVisible()
  })

  test('should have correct page title', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/EtaFocus/)
  })
})
