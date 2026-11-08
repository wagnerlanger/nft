import { expect, test } from '@playwright/test'

import { DEMO_EMAIL, DEMO_PASSWORD, loginAsCollector, resetDemo, setScenario } from '../helpers/demo'

test.describe('Autenticação', () => {
  test.beforeEach(async ({ page }) => {
    await resetDemo(page)
  })

  test('login, logout e troca de usuário', async ({ page }) => {
    await page.goto('/')
    await loginAsCollector(page)
    await expect
      .poll(async () => page.evaluate(() => window.localStorage.getItem('kurio:session-token')))
      .toBeTruthy()

    await page.goto('/account')
    await expect(page.locator('main')).toBeVisible()

    await page.evaluate(async () => {
      const token = window.localStorage.getItem('kurio:session-token')
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })
        window.localStorage.removeItem('kurio:session-token')
      }
    })
    await page.reload({ waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('button', { name: /entrar/i }).first()).toBeVisible()
  })

  test('cadastro com conflito de e-mail', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /entrar/i }).first().click()
    const dialog = page.getByRole('dialog')
    await dialog.getByRole('button', { name: /criar conta/i }).click()
    await dialog.locator('#register-username').fill('nova_colecionadora')
    await dialog.locator('#register-email').fill(DEMO_EMAIL)
    await dialog.locator('#register-password').fill(DEMO_PASSWORD)
    await dialog.locator('#register-confirm').fill(DEMO_PASSWORD)
    await dialog.locator('button[type="submit"]').click()
    await expect(dialog.getByText(/já está em uso|e-mail/i).first()).toBeVisible({ timeout: 10_000 })
  })

  test('expiração de sessão', async ({ page }) => {
    await page.goto('/')
    await loginAsCollector(page)
    await setScenario(page, 'session_expired')
    await page.goto('/account')
    await expect(page.getByRole('dialog').or(page.getByRole('button', { name: /entrar/i }).first())).toBeVisible({
      timeout: 15_000,
    })
  })
})
