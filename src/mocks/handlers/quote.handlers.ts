import { delay, http, HttpResponse } from 'msw'

import { computeQuote } from '@/mocks/database/quote'
import { readScenario, scenarioDelay } from '@/mocks/scenarios'

export const quoteHandlers = [
  http.post('/api/quote', async ({ request }) => {
    const scenario = readScenario(request)
    await delay(scenarioDelay(scenario))

    if (scenario === 'error') {
      return HttpResponse.json(
        { message: 'Não foi possível calcular a cotação.', code: 'quote_unavailable' },
        { status: 500 },
      )
    }

    let body: { promoCode?: string; clearPromo?: boolean } = {}
    try {
      body = (await request.json()) as { promoCode?: string; clearPromo?: boolean }
    } catch {
      body = {}
    }

    const forcePromoStatus =
      scenario === 'coupon_invalid'
        ? ('invalid' as const)
        : scenario === 'coupon_expired'
          ? ('expired' as const)
          : null

    const result = computeQuote(request, {
      promoCode: body.promoCode,
      clearPromo: body.clearPromo,
      forcePromoStatus,
    })

    if (!result.ok) {
      const payload = await result.response.json()
      return HttpResponse.json(payload, { status: result.response.status })
    }

    return HttpResponse.json(result.quote)
  }),
]
