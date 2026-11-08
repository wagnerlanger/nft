import type { Page } from '@playwright/test'

export const DEMO_EMAIL = 'colecionador@kurio.dev'
export const DEMO_PASSWORD = 'Kurio123!'

export async function resetDemo(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => typeof window.kurioResetDemoState === 'function', null, {
    timeout: 15_000,
  })
  await page.evaluate(() => {
    window.kurioResetDemoState?.()
  })
  await page.reload({ waitUntil: 'domcontentloaded' })
}

export async function setScenario(page: Page, scenario: string) {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => typeof window.kurioSetScenario === 'function', null, {
    timeout: 15_000,
  })
  await page.evaluate((value) => {
    window.kurioSetScenario?.(value)
  }, scenario)
  await page.reload({ waitUntil: 'domcontentloaded' })
}

export async function loginAsCollector(page: Page) {
  await page.getByRole('button', { name: /entrar/i }).first().click()
  const dialog = page.getByRole('dialog')
  await dialog.locator('#login-email').fill(DEMO_EMAIL)
  await dialog.locator('#login-password').fill(DEMO_PASSWORD)
  await dialog.locator('button[type="submit"]').click()
  await page.waitForFunction(() => Boolean(window.localStorage.getItem('kurio:session-token')), null, {
    timeout: 15_000,
  })
  await page.waitForTimeout(300)
}

export async function addFirstNftToCartViaApi(page: Page) {
  await page.evaluate(async () => {
    const list = await fetch('/api/nfts?page=1').then((r) => r.json())
    const nftId = list.items?.[0]?.id as string
    if (!nftId) throw new Error('Nenhum NFT no catálogo')
    const response = await fetch('/api/cart/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.localStorage.getItem('kurio:session-token') ?? ''}`,
        'x-guest-id': window.localStorage.getItem('kurio:guest-id') ?? crypto.randomUUID(),
      },
      body: JSON.stringify({ nftId, quantity: 1 }),
    })
    if (!response.ok) throw new Error(`Falha ao adicionar ao carrinho: ${response.status}`)
  })
}

export async function fillCheckoutForm(page: Page) {
  await page.locator('#checkout-display-name').fill('Ana Colecionadora')
  await page.locator('#checkout-wallet-alias').fill('Principal')
  await page.locator('#checkout-network').selectOption({ index: 1 })
  await page.locator('#checkout-profile-name').fill('ana')
  await page.locator('#checkout-wallet-address').fill('0x1234567890abcdef1234567890abcdef12345678')
  await page.locator('#checkout-wallet-type').selectOption({ index: 1 })
  await page.locator('#checkout-referral').fill('KURIO')
  await page.locator('#checkout-email').fill(DEMO_EMAIL)
  await page.locator('#checkout-ens-name').fill('ana')
}
