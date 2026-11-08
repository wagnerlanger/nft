import { expect, test } from '@playwright/test'

import { resetDemo, setScenario } from '../helpers/demo'

test.describe('Acessibilidade e loading', () => {
  test.beforeEach(async ({ page }) => {
    await resetDemo(page)
  })

  test('foco no diálogo de autenticação e teclado', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /entrar/i }).first().click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toHaveCount(0)
  })

  test('skeletons em carregamento lento e recuperação de erro', async ({ page }) => {
    await page.goto('/')
    await setScenario(page, 'slow')
    await page.goto('/')
    await expect(page.locator('.animate-shimmer, [aria-busy="true"]').first()).toBeVisible({
      timeout: 5_000,
    })

    await setScenario(page, 'error')
    await page.goto('/')
    const retry = page.getByRole('button', { name: /tentar novamente/i }).first()
    await expect(retry).toBeVisible({ timeout: 15_000 })

    await page.evaluate(() => window.kurioSetScenario?.('success'))
    await retry.click()
    await expect(page.getByRole('button', { name: /adicionar ao carrinho/i }).first()).toBeVisible({
      timeout: 15_000,
    })
  })
})
