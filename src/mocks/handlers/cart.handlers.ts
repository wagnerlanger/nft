import { delay, http, HttpResponse } from 'msw'

import {
  addCartItem,
  getCart,
  mergeGuestCart,
  removeCartItem,
  updateCartItem,
} from '@/mocks/database/cart'
import { readScenario, scenarioDelay } from '@/mocks/scenarios'

export const cartHandlers = [
  http.get('/api/cart', async ({ request }) => {
    const scenario = readScenario(request)
    await delay(scenarioDelay(scenario))

    if (scenario === 'error') {
      return HttpResponse.json(
        { message: 'Não foi possível carregar o carrinho.', code: 'cart_unavailable' },
        { status: 500 },
      )
    }

    const result = getCart(request)
    if (!result.ok) return result.response
    return HttpResponse.json(result.cart)
  }),

  http.post('/api/cart/items', async ({ request }) => {
    const scenario = readScenario(request)
    await delay(scenarioDelay(scenario))

    if (scenario === 'error') {
      return HttpResponse.json(
        { message: 'Não foi possível adicionar ao carrinho.', code: 'cart_unavailable' },
        { status: 500 },
      )
    }

    const body = (await request.json()) as { nftId?: string; quantity?: number }
    if (!body.nftId) {
      return HttpResponse.json(
        { message: 'Informe o NFT a adicionar.', code: 'validation_error' },
        { status: 400 },
      )
    }

    const result = addCartItem(request, body.nftId, body.quantity ?? 1)
    if (!result.ok) return result.response
    return HttpResponse.json(result.cart, { status: 201 })
  }),

  http.patch('/api/cart/items/:nftId', async ({ params, request }) => {
    const scenario = readScenario(request)
    await delay(scenarioDelay(scenario))

    if (scenario === 'error') {
      return HttpResponse.json(
        { message: 'Não foi possível atualizar o carrinho.', code: 'cart_unavailable' },
        { status: 500 },
      )
    }

    const nftId = String(params.nftId ?? '')
    if (!nftId) {
      return HttpResponse.json(
        { message: 'Informe o NFT a atualizar.', code: 'validation_error' },
        { status: 400 },
      )
    }

    const body = (await request.json()) as { quantity?: number }
    if (typeof body.quantity !== 'number') {
      return HttpResponse.json(
        { message: 'Informe a quantidade.', code: 'validation_error' },
        { status: 400 },
      )
    }

    const result = updateCartItem(request, nftId, body.quantity)
    if (!result.ok) return result.response
    return HttpResponse.json(result.cart)
  }),

  http.delete('/api/cart/items/:nftId', async ({ params, request }) => {
    const scenario = readScenario(request)
    await delay(scenarioDelay(scenario))

    if (scenario === 'error') {
      return HttpResponse.json(
        { message: 'Não foi possível remover o item.', code: 'cart_unavailable' },
        { status: 500 },
      )
    }

    const nftId = String(params.nftId ?? '')
    if (!nftId) {
      return HttpResponse.json(
        { message: 'Informe o NFT a remover.', code: 'validation_error' },
        { status: 400 },
      )
    }

    const result = removeCartItem(request, nftId)
    if (!result.ok) return result.response
    return HttpResponse.json(result.cart)
  }),

  http.post('/api/cart/merge', async ({ request }) => {
    const scenario = readScenario(request)
    await delay(scenarioDelay(scenario))

    if (scenario === 'error') {
      return HttpResponse.json(
        { message: 'Não foi possível mesclar o carrinho.', code: 'cart_unavailable' },
        { status: 500 },
      )
    }

    const result = mergeGuestCart(request)
    if (!result.ok) return result.response
    return HttpResponse.json(result.cart)
  }),
]
