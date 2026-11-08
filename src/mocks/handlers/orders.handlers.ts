import { delay, http, HttpResponse } from 'msw'

import { createOrderBodySchema } from '@/features/orders/schemas'
import { createOrder, getOrderById, listOrdersForUser } from '@/mocks/database/orders'
import { readScenario, scenarioDelay } from '@/mocks/scenarios'

export const ordersHandlers = [
  http.get('/api/orders', async ({ request }) => {
    const scenario = readScenario(request)
    await delay(scenarioDelay(scenario))

    if (scenario === 'session_expired') {
      return HttpResponse.json(
        { message: 'Sessão expirada. Entre novamente.', code: 'session_expired' },
        { status: 401 },
      )
    }

    const result = listOrdersForUser(request)
    if (!result.ok) {
      const payload = await result.response.json()
      return HttpResponse.json(payload, { status: result.response.status })
    }

    return HttpResponse.json({ items: result.orders })
  }),

  http.get('/api/orders/:orderId', async ({ params, request }) => {
    const scenario = readScenario(request)
    await delay(scenarioDelay(scenario))

    if (scenario === 'session_expired') {
      return HttpResponse.json(
        { message: 'Sessão expirada. Entre novamente.', code: 'session_expired' },
        { status: 401 },
      )
    }

    const orderId = String(params.orderId ?? '')
    const result = getOrderById(request, orderId)
    if (!result.ok) {
      const payload = await result.response.json()
      return HttpResponse.json(payload, { status: result.response.status })
    }

    return HttpResponse.json(result.order)
  }),

  http.post('/api/orders', async ({ request }) => {
    const scenario = readScenario(request)
    await delay(scenarioDelay(scenario))

    if (scenario === 'session_expired') {
      return HttpResponse.json(
        { message: 'Sessão expirada. Entre novamente.', code: 'session_expired' },
        { status: 401 },
      )
    }

    // payment_refused still creates pending then settles to refused via timer
    if (scenario === 'error' && !['payment_refused', 'order_timeout'].includes(scenario)) {
      // unreachable due to includes check, kept for clarity
    }

    const idempotencyKey = request.headers.get('Idempotency-Key')?.trim()
    if (!idempotencyKey) {
      return HttpResponse.json(
        { message: 'Informe a chave de idempotência.', code: 'validation_error' },
        { status: 400 },
      )
    }

    let rawBody: unknown
    try {
      rawBody = await request.json()
    } catch {
      return HttpResponse.json(
        { message: 'Corpo da requisição inválido.', code: 'validation_error' },
        { status: 400 },
      )
    }

    const parsed = createOrderBodySchema.safeParse(rawBody)
    if (!parsed.success) {
      return HttpResponse.json(
        { message: 'Dados do pedido inválidos.', code: 'validation_error' },
        { status: 400 },
      )
    }

    const result = createOrder(request, parsed.data, idempotencyKey, scenario)
    if (!result.ok) {
      const payload = await result.response.json()
      return HttpResponse.json(payload, { status: result.response.status })
    }

    return HttpResponse.json(result.order, { status: result.reused ? 200 : 201 })
  }),
]
