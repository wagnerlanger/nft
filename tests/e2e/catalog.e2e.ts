import { expect, test } from '@playwright/test'

import { resetDemo } from '../helpers/demo'

test.describe('Catálogo', () => {
  test.beforeEach(async ({ page }) => {
    await resetDemo(page)
  })

  test('busca, filtros, ordenação, paginação e histórico', async ({ page }) => {
    await page.goto('/?q=emerald')
    await expect(page).toHaveURL(/q=emerald/i)
    await page.waitForTimeout(600)

    await page.goto('/?page=2')
    await expect(page).toHaveURL(/page=2/)
    await page.goBack()
    await expect(page).toHaveURL(/q=emerald/i)
  })

  test('acesso direto ao detalhe e 404', async ({ page }) => {
    await page.goto('/nfts/emerald-ape-042')
    await expect(page.getByText(/ETH/i).first()).toBeVisible({ timeout: 15_000 })

    await page.goto('/nfts/does-not-exist')
    await expect(page.getByText(/não encontrad/i)).toBeVisible({ timeout: 15_000 })
  })
})
