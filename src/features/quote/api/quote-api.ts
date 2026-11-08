import { quoteSchema } from '@/features/quote/schemas'
import type { Quote } from '@/features/quote/types'
import { http } from '@/infrastructure/http/axios'

export async function fetchQuoteRequest(
  body: { promoCode?: string; clearPromo?: boolean } = {},
  signal?: AbortSignal,
) {
  const { data } = await http.post<unknown>('/quote', body, { signal })
  return quoteSchema.parse(data) satisfies Quote
}
