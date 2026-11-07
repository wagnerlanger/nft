import { delay, http, HttpResponse } from 'msw'

import {
  addFavorite,
  listFavorites,
  removeFavorite,
  requireSessionUser,
} from '@/mocks/database/favorites'
import { readScenario, scenarioDelay } from '@/mocks/scenarios'

export const favoritesHandlers = [
  http.get('/api/favorites', async ({ request }) => {
    const scenario = readScenario(request)
    await delay(scenarioDelay(scenario))

    if (scenario === 'error') {
      return HttpResponse.json(
        { message: 'Não foi possível carregar os favoritos.', code: 'favorites_unavailable' },
        { status: 500 },
      )
    }

    const auth = requireSessionUser(request)
    if (!auth.ok) return auth.response

    return HttpResponse.json(listFavorites(auth.userId))
  }),

  http.post('/api/favorites', async ({ request }) => {
    const scenario = readScenario(request)
    await delay(scenarioDelay(scenario))

    if (scenario === 'error') {
      return HttpResponse.json(
        { message: 'Não foi possível favoritar este NFT.', code: 'favorites_unavailable' },
        { status: 500 },
      )
    }

    const auth = requireSessionUser(request)
    if (!auth.ok) return auth.response

    const body = (await request.json()) as { nftId?: string }
    if (!body.nftId) {
      return HttpResponse.json(
        { message: 'Informe o NFT a favoritar.', code: 'validation_error' },
        { status: 400 },
      )
    }

    const result = addFavorite(auth.userId, body.nftId)
    if (!result.ok) {
      return HttpResponse.json(
        { message: result.message, code: result.code },
        { status: result.status },
      )
    }

    return HttpResponse.json({ items: result.items }, { status: 201 })
  }),

  http.delete('/api/favorites/:nftId', async ({ params, request }) => {
    const scenario = readScenario(request)
    await delay(scenarioDelay(scenario))

    if (scenario === 'error') {
      return HttpResponse.json(
        { message: 'Não foi possível remover o favorito.', code: 'favorites_unavailable' },
        { status: 500 },
      )
    }

    const auth = requireSessionUser(request)
    if (!auth.ok) return auth.response

    const result = removeFavorite(auth.userId, String(params.nftId))
    if (!result.ok) {
      return HttpResponse.json(
        { message: result.message, code: result.code },
        { status: result.status },
      )
    }

    return new HttpResponse(null, { status: 204 })
  }),
]
