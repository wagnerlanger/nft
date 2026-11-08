import { expect, test } from '@playwright/test'

import { loginAsCollector, resetDemo } from '../helpers/demo'

test.describe('Regressão visual', () => {
  test.beforeEach(async ({ page }) => {
    await resetDemo(page)
  })

  test('início', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(1000)
    await expect(page).toHaveScreenshot('home.png', { fullPage: true })
  })

  test('detalhe', async ({ page }) => {
    await page.goto('/nfts/emerald-ape-042')
    await page.waitForTimeout(1000)
    await expect(page).toHaveScreenshot('nft-detail.png', { fullPage: true })
  })

  test('carrinho', async ({ page }) => {
    await page.goto('/')
    await loginAsCollector(page)
    await page.getByRole('button', { name: /adicionar ao carrinho/i }).first().click({ force: true })
    await page.waitForTimeout(800)
    await page.goto('/cart')
    await page.waitForTimeout(1000)
    await expect(page).toHaveScreenshot('cart.png', { fullPage: true })
  })

  test('pagamento', async ({ page }) => {
    await page.goto('/')
    await loginAsCollector(page)
    await page.getByRole('button', { name: /adicionar ao carrinho/i }).first().click({ force: true })
    await page.waitForTimeout(800)
    await page.goto('/checkout')
    await page.waitForTimeout(1000)
    await expect(page).toHaveScreenshot('checkout.png', { fullPage: true })
  })
})
