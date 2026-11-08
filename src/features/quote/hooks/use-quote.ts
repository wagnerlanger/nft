import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { cartKeys } from '@/features/cart/hooks/use-cart'
import { fetchQuoteRequest } from '@/features/quote/api/quote-api'
import type { Quote } from '@/features/quote/types'
import { isHttpError } from '@/infrastructure/http/errors'

export const quoteKeys = {
  all: ['quote'] as const,
}

function retryQuery(failureCount: number, error: unknown) {
  if (isHttpError(error) && error.status >= 400 && error.status < 500) return false
  return failureCount < 1
}

export function useQuote(enabled = true) {
  const cartQueryKey = cartKeys.all

  return useQuery({
    queryKey: quoteKeys.all,
    queryFn: ({ signal }) => fetchQuoteRequest({}, signal),
    enabled,
    staleTime: 10_000,
    retry: retryQuery,
    // Recompute when cart changes via invalidation from cart mutations.
    meta: { dependsOn: cartQueryKey },
  })
}

export function useApplyPromo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (promoCode: string) => fetchQuoteRequest({ promoCode }),
    onSuccess: (quote) => {
      queryClient.setQueryData<Quote>(quoteKeys.all, quote)
    },
  })
}

export function useClearPromo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => fetchQuoteRequest({ clearPromo: true }),
    onSuccess: (quote) => {
      queryClient.setQueryData<Quote>(quoteKeys.all, quote)
    },
  })
}

export function useRefreshQuote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => fetchQuoteRequest({}),
    onSuccess: (quote) => {
      queryClient.setQueryData<Quote>(quoteKeys.all, quote)
    },
  })
}

export async function invalidateQuote(queryClient: ReturnType<typeof useQueryClient>) {
  await queryClient.invalidateQueries({ queryKey: quoteKeys.all })
}
