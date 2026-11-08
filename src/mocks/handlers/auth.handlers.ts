import { delay, http, HttpResponse } from 'msw'

import {
  expireAllSessions,
  getSessionByToken,
  loginUser,
  logoutSession,
  readBearerToken,
  registerUser,
} from '@/mocks/database/auth'
import { readScenario, scenarioDelay } from '@/mocks/scenarios'

export const authHandlers = [
  http.post('/api/auth/register', async ({ request }) => {
    const scenario = readScenario(request)
    await delay(scenarioDelay(scenario))

    if (scenario === 'error') {
      return HttpResponse.json(
        { message: 'Não foi possível criar a conta.', code: 'auth_unavailable' },
        { status: 500 },
      )
    }

    const body = (await request.json()) as {
      username?: string
      email?: string
      password?: string
    }

    if (!body.username || !body.email || !body.password) {
      return HttpResponse.json(
        { message: 'Dados de cadastro incompletos.', code: 'validation_error' },
        { status: 400 },
      )
    }

    const result = await registerUser({
      username: body.username,
      email: body.email,
      password: body.password,
    })

    if (!result.ok) {
      return HttpResponse.json(
        { message: result.message, code: result.code },
        { status: 409 },
      )
    }

    return HttpResponse.json(result.session, { status: 201 })
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const scenario = readScenario(request)
    await delay(scenarioDelay(scenario))

    if (scenario === 'error') {
      return HttpResponse.json(
        { message: 'Não foi possível autenticar.', code: 'auth_unavailable' },
        { status: 500 },
      )
    }

    const body = (await request.json()) as { email?: string; password?: string }
    if (!body.email || !body.password) {
      return HttpResponse.json(
        { message: 'Informe e-mail e senha.', code: 'validation_error' },
        { status: 400 },
      )
    }

    const result = await loginUser({ email: body.email, password: body.password })
    if (!result.ok) {
      return HttpResponse.json(
        { message: result.message, code: result.code },
        { status: 401 },
      )
    }

    return HttpResponse.json(result.session)
  }),

  http.get('/api/auth/session', async ({ request }) => {
    const scenario = readScenario(request)
    await delay(scenario === 'slow' ? 800 : 200)

    if (scenario === 'error') {
      return HttpResponse.json(
        { message: 'Sessão indisponível.', code: 'auth_unavailable' },
        { status: 500 },
      )
    }

    if (scenario === 'session_expired') {
      expireAllSessions()
      return HttpResponse.json(
        { message: 'Sessão expirada ou inválida.', code: 'session_expired' },
        { status: 401 },
      )
    }

    const session = getSessionByToken(readBearerToken(request))
    if (!session) {
      return HttpResponse.json(
        { message: 'Sessão expirada ou inválida.', code: 'session_expired' },
        { status: 401 },
      )
    }

    return HttpResponse.json(session)
  }),

  http.post('/api/auth/logout', async ({ request }) => {
    await delay(200)
    logoutSession(readBearerToken(request))
    return new HttpResponse(null, { status: 204 })
  }),
]
