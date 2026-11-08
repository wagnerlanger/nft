import { z } from 'zod'

import { orderSchema } from '@/features/orders/schemas'

export const nftUpdatedEventSchema = z.object({
  eventId: z.string(),
  resourceId: z.string(),
  version: z.number().int().positive(),
  userId: z.string().nullable().optional(),
  payload: z.object({
    nftId: z.string(),
    priceEth: z.string(),
    availableEditions: z.number().int().nonnegative().optional(),
  }),
})

export const orderUpdatedEventSchema = z.object({
  eventId: z.string(),
  resourceId: z.string(),
  version: z.number().int().positive(),
  userId: z.string(),
  payload: orderSchema,
})

export type NftUpdatedEvent = z.infer<typeof nftUpdatedEventSchema>
export type OrderUpdatedEvent = z.infer<typeof orderUpdatedEventSchema>
