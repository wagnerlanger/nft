import { delay, http, HttpResponse } from 'msw'

import { changePasswordSchema, updateProfileSchema } from '@/features/account/schemas'
import {
  changeUserPassword,
  getUserByToken,
  readBearerToken,
  toCollectorProfile,
  updateUserProfile,
} from '@/mocks/database/auth'
import { readScenario, scenarioDelay } from '@/mocks/scenarios'

export const profileHandlers = [
  http.get('/api/profile', async ({ request }) => {
    const scenario = readScenario(request)
    await delay(scenarioDelay(scenario))

    const user = getUserByToken(readBearerToken(request))
    if (!user) {
      return HttpResponse.json(
        { message: 'Sessão expirada. Entre novamente.', code: 'session_expired' },
        { status: 401 },
      )
    }

    return HttpResponse.json(toCollectorProfile(user))
  }),

  http.patch('/api/profile', async ({ request }) => {
    const scenario = readScenario(request)
    await delay(scenarioDelay(scenario))

    if (scenario === 'error') {
      return HttpResponse.json(
        { message: 'Não foi possível salvar o perfil.', code: 'profile_update_failed' },
        { status: 502 },
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

    const parsed = updateProfileSchema.safeParse(rawBody)
    if (!parsed.success) {
      return HttpResponse.json(
        { message: 'Dados do perfil inválidos.', code: 'validation_error' },
        { status: 400 },
      )
    }

    const result = updateUserProfile(readBearerToken(request), parsed.data)
    if (!result.ok) {
      const payload = await result.response.json()
      return HttpResponse.json(payload, { status: result.response.status })
    }

    return HttpResponse.json(result.profile)
  }),

  http.post('/api/profile/password', async ({ request }) => {
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

    const parsed = changePasswordSchema.safeParse(rawBody)
    if (!parsed.success) {
      return HttpResponse.json(
        { message: 'Dados de senha inválidos.', code: 'validation_error' },
        { status: 400 },
      )
    }

    const result = await changeUserPassword(readBearerToken(request), {
      currentPassword: parsed.data.currentPassword,
      newPassword: parsed.data.newPassword,
    })
    if (!result.ok) {
      const payload = await result.response.json()
      return HttpResponse.json(payload, { status: result.response.status })
    }

    return new HttpResponse(null, { status: 204 })
  }),
]
