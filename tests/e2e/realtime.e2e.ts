import { expect, test } from '@playwright/test'

import { addFirstNftToCartViaApi, loginAsCollector, resetDemo, setScenario } from '../helpers/demo'

test.describe('Tempo real', () => {
  test.beforeEach(async ({ page }) => {
    await resetDemo(page)
  })

  test('alteração de preço via Socket.IO no carrinho', async ({ page }) => {
    await page.goto('/')
    await loginAsCollector(page)
    await addFirstNftToCartViaApi(page)
    await setScenario(page, 'price_change')
    await page.goto('/cart')
    await expect(page.getByRole('heading', { name: /resumo/i })).toBeVisible({ timeout: 15_000 })
    await expect(page.getByText(/preço atualizado|ETH/i).first()).toBeVisible({ timeout: 20_000 })
  })

  test('pedido pendente recupera após reload', async ({ page }) => {
    await page.goto('/')
    await loginAsCollector(page)
    await addFirstNftToCartViaApi(page)
    await page.goto('/cart')
    await expect(page.getByRole('heading', { name: /resumo/i })).toBeVisible({ timeout: 15_000 })
  })
})
