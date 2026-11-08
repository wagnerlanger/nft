import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  addCartItemRequest,
  fetchCart,
  mergeGuestCartRequest,
  removeCartItemRequest,
  updateCartItemRequest,
} from '@/features/cart/api/cart-api'
import type { CartResponse } from '@/features/cart/types'
import { quoteKeys } from '@/features/quote/hooks/use-quote'
import { isHttpError } from '@/infrastructure/http/errors'

export const cartKeys = {
  all: ['cart'] as const,
}

function invalidateCartAndQuote(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: cartKeys.all })
  void queryClient.invalidateQueries({ queryKey: quoteKeys.all })
}

function retryQuery(failureCount: number, error: unknown) {
  if (isHttpError(error) && error.status >= 400 && error.status < 500) return false
  return failureCount < 1
}

function syncCartCache(
  queryClient: ReturnType<typeof useQueryClient>,
  cart: CartResponse,
) {
  queryClient.setQueryData<CartResponse>(cartKeys.all, cart)
}

export function useCart() {
  return useQuery({
    queryKey: cartKeys.all,
    queryFn: ({ signal }) => fetchCart(signal),
    staleTime: 15_000,
    retry: retryQuery,
  })
}

export function useAddToCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: string | { nftId: string; quantity?: number }) => {
      if (typeof input === 'string') {
        return addCartItemRequest(input, 1)
      }
      return addCartItemRequest(input.nftId, input.quantity ?? 1)
    },
    onSuccess: (cart) => {
      syncCartCache(queryClient, cart)
    },
    onSettled: () => {
      invalidateCartAndQuote(queryClient)
    },
  })
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ nftId, quantity }: { nftId: string; quantity: number }) =>
      updateCartItemRequest(nftId, quantity),
    onSuccess: (cart) => {
      syncCartCache(queryClient, cart)
    },
    onSettled: () => {
      invalidateCartAndQuote(queryClient)
    },
  })
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (nftId: string) => removeCartItemRequest(nftId),
    onSuccess: (cart) => {
      syncCartCache(queryClient, cart)
    },
    onSettled: () => {
      invalidateCartAndQuote(queryClient)
    },
  })
}

export async function mergeGuestCart(queryClient: ReturnType<typeof useQueryClient>) {
  const cart = await mergeGuestCartRequest()
  queryClient.setQueryData<CartResponse>(cartKeys.all, cart)
  await queryClient.invalidateQueries({ queryKey: cartKeys.all })
  await queryClient.invalidateQueries({ queryKey: quoteKeys.all })
  return cart
}
