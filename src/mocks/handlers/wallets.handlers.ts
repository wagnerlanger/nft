import { delay, http, HttpResponse } from 'msw'
import { z } from 'zod'

import { walletFieldsSchema } from '@/features/wallets/schemas'
import {
  getWallets,
  savePrimaryWallet,
  saveSecondaryWallet,
  setSameAsPrimary,
} from '@/mocks/database/wallets'
import { readScenario, scenarioDelay } from '@/mocks/scenarios'

const sameAsPrimarySchema = z.object({
  sameAsPrimary: z.boolean(),
})

export const walletsHandlers = [
  http.get('/api/wallets', async ({ request }) => {
    const scenario = readScenario(request)
    await delay(scenarioDelay(scenario))

    if (scenario === 'session_expired') {
      return HttpResponse.json(
        { message: 'Sessão expirada. Entre novamente.', code: 'session_expired' },
        { status: 401 },
      )
    }

    const result = getWallets(request)
    if (!result.ok) {
      const payload = await result.response.json()
      return HttpResponse.json(payload, { status: result.response.status })
    }
    return HttpResponse.json(result.wallets)
  }),

  http.put('/api/wallets/primary', async ({ request }) => {
    const scenario = readScenario(request)
    await delay(scenarioDelay(scenario))

    let rawBody: unknown
    try {
      rawBody = await request.json()
    } catch {
      return HttpResponse.json(
        { message: 'Corpo da requisição inválido.', code: 'validation_error' },
        { status: 400 },
      )
    }

    const parsed = walletFieldsSchema.safeParse(rawBody)
    if (!parsed.success) {
      return HttpResponse.json(
        { message: 'Dados da carteira inválidos.', code: 'validation_error' },
        { status: 400 },
      )
    }

    const result = savePrimaryWallet(request, parsed.data)
    if (!result.ok) {
      const payload = await result.response.json()
      return HttpResponse.json(payload, { status: result.response.status })
    }
    return HttpResponse.json(result.wallets)
  }),

  http.put('/api/wallets/secondary', async ({ request }) => {
    const scenario = readScenario(request)
    await delay(scenarioDelay(scenario))

    let rawBody: unknown
    try {
      rawBody = await request.json()
    } catch {
      return HttpResponse.json(
        { message: 'Corpo da requisição inválido.', code: 'validation_error' },
        { status: 400 },
      )
    }

    const parsed = walletFieldsSchema.safeParse(rawBody)
    if (!parsed.success) {
      return HttpResponse.json(
        { message: 'Dados da carteira inválidos.', code: 'validation_error' },
        { status: 400 },
      )
    }

    const result = saveSecondaryWallet(request, parsed.data)
    if (!result.ok) {
      const payload = await result.response.json()
      return HttpResponse.json(payload, { status: result.response.status })
    }
    return HttpResponse.json(result.wallets)
  }),

  http.patch('/api/wallets/same-as-primary', async ({ request }) => {
    const scenario = readScenario(request)
    await delay(scenarioDelay(scenario))

    let rawBody: unknown
    try {
      rawBody = await request.json()
    } catch {
      return HttpResponse.json(
        { message: 'Corpo da requisição inválido.', code: 'validation_error' },
        { status: 400 },
      )
    }

    const parsed = sameAsPrimarySchema.safeParse(rawBody)
    if (!parsed.success) {
      return HttpResponse.json(
        { message: 'Dados inválidos.', code: 'validation_error' },
        { status: 400 },
      )
    }

    const result = setSameAsPrimary(request, parsed.data.sameAsPrimary)
    if (!result.ok) {
      const payload = await result.response.json()
      return HttpResponse.json(payload, { status: result.response.status })
    }
    return HttpResponse.json(result.wallets)
  }),
]
