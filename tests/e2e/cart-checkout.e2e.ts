import { expect, test } from '@playwright/test'

import {
  addFirstNftToCartViaApi,
  fillCheckoutForm,
  loginAsCollector,
  resetDemo,
  setScenario,
} from '../helpers/demo'

test.describe('Carrinho e compra', () => {
  test.beforeEach(async ({ page }) => {
    await resetDemo(page)
  })

  test('favoritos, carrinho, cupom e persistência', async ({ page }) => {
    await page.goto('/')
    await loginAsCollector(page)
    await page.getByRole('button', { name: /favoritar/i }).first().click({ force: true })
    await addFirstNftToCartViaApi(page)
    await page.goto('/cart')
    await expect(page.getByRole('heading', { name: /resumo/i })).toBeVisible({ timeout: 15_000 })

    await page.getByPlaceholder(/digite o código/i).fill('KURIO10')
    await page.getByRole('button', { name: /aplicar/i }).click()
    await expect(page.getByText(/aplicado|kurio10/i).first()).toBeVisible({ timeout: 10_000 })

    await page.reload({ waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { name: /resumo/i })).toBeVisible()
  })

  test('compra completa até recibo', async ({ page }) => {
    await page.goto('/')
    await loginAsCollector(page)
    await addFirstNftToCartViaApi(page)
    await page.goto('/checkout')
    await fillCheckoutForm(page)
    await page.getByRole('radio').first().click()
    await page.getByRole('button', { name: /confirmar compra/i }).click()

    await expect(page.getByText(/processando|agora estão na sua carteira/i).first()).toBeVisible({
      timeout: 25_000,
    })
    await expect(page.getByText(/agora estão na sua carteira/i)).toBeVisible({ timeout: 25_000 })
  })

  test('pagamento recusado preserva carrinho', async ({ page }) => {
    await page.goto('/')
    await loginAsCollector(page)
    await addFirstNftToCartViaApi(page)
    await setScenario(page, 'payment_refused')
    await page.goto('/checkout')
    await fillCheckoutForm(page)
    await page.getByRole('radio').first().click()
    await page.getByRole('button', { name: /confirmar compra/i }).click()

    await expect(page.getByText(/recusado/i).first()).toBeVisible({ timeout: 25_000 })
    await page.goto('/cart')
    await expect(page.getByRole('heading', { name: /resumo/i })).toBeVisible()
  })
})
