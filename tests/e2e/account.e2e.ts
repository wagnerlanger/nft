import { expect, test } from '@playwright/test'

import { loginAsCollector, resetDemo } from '../helpers/demo'

test.describe('Conta', () => {
  test.beforeEach(async ({ page }) => {
    await resetDemo(page)
    await page.goto('/')
    await loginAsCollector(page)
  })

  test('edição de perfil e carteiras', async ({ page }) => {
    await page.goto('/account')
    await expect(page.locator('main')).toBeVisible({ timeout: 15_000 })
    await expect(page.locator('#profile-display-name')).toBeVisible({ timeout: 15_000 })

    await page.goto('/account/wallets')
    await expect(page.getByText(/carteira/i).first()).toBeVisible({ timeout: 15_000 })
  })
})
