import { delay, http, HttpResponse } from 'msw'

import { createOrderBodySchema } from '@/features/orders/schemas'
import { createOrder, listOrdersForUser } from '@/mocks/database/orders'
import { readScenario, scenarioDelay } from '@/mocks/scenarios'

export const ordersHandlers = [
  http.get('/api/orders', async ({ request }) => {
    const scenario = readScenario(request)
    await delay(scenarioDelay(scenario))

    const result = listOrdersForUser(request)
    if (!result.ok) {
      const payload = await result.response.json()
      return HttpResponse.json(payload, { status: result.response.status })
    }

    return HttpResponse.json({ items: result.orders })
  }),

  http.post('/api/orders', async ({ request }) => {
    const scenario = readScenario(request)
    await delay(scenarioDelay(scenario))

    if (scenario === 'error') {
      return HttpResponse.json(
        { message: 'Pagamento recusado pela rede.', code: 'payment_refused' },
        { status: 502 },
      )
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

    const result = createOrder(request, parsed.data, idempotencyKey)
    if (!result.ok) {
      const payload = await result.response.json()
      return HttpResponse.json(payload, { status: result.response.status })
    }

    return HttpResponse.json(result.order, { status: result.reused ? 200 : 201 })
  }),
]
