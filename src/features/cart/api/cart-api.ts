import { cartResponseSchema } from '@/features/cart/schemas'
import type { CartResponse } from '@/features/cart/types'
import { http } from '@/infrastructure/http/axios'

export async function fetchCart(signal?: AbortSignal) {
  const { data } = await http.get<unknown>('/cart', { signal })
  return cartResponseSchema.parse(data) satisfies CartResponse
}

export async function addCartItemRequest(nftId: string, quantity = 1) {
  const { data } = await http.post<unknown>('/cart/items', { nftId, quantity })
  return cartResponseSchema.parse(data) satisfies CartResponse
}

export async function updateCartItemRequest(nftId: string, quantity: number) {
  const { data } = await http.patch<unknown>(`/cart/items/${nftId}`, { quantity })
  return cartResponseSchema.parse(data) satisfies CartResponse
}

export async function removeCartItemRequest(nftId: string) {
  const { data } = await http.delete<unknown>(`/cart/items/${nftId}`)
  return cartResponseSchema.parse(data) satisfies CartResponse
}

export async function mergeGuestCartRequest() {
  const { data } = await http.post<unknown>('/cart/merge')
  return cartResponseSchema.parse(data) satisfies CartResponse
}
