import { z } from 'zod'

import { cartItemSchema } from '@/features/cart/schemas'

export const promoStatusSchema = z.enum(['none', 'applied', 'invalid', 'expired'])

export const quoteSchema = z.object({
  items: z.array(cartItemSchema),
  subtotalEth: z.string(),
  discountEth: z.string(),
  networkFeeEth: z.string(),
  totalEth: z.string(),
  promoCode: z.string().nullable(),
  promoStatus: promoStatusSchema,
  fingerprint: z.string(),
})

export const quoteRequestSchema = z.object({
  promoCode: z.string().trim().optional(),
  clearPromo: z.boolean().optional(),
})

export type QuoteRequest = z.infer<typeof quoteRequestSchema>
