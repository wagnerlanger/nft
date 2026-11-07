import { z } from 'zod'

export const cartItemSchema = z.object({
  nftId: z.string(),
  quantity: z.number().int().positive(),
  unitPriceEth: z.string(),
  name: z.string(),
  imageUrl: z.string(),
  tokenNumber: z.number().int().nonnegative(),
})

export const cartResponseSchema = z.object({
  items: z.array(cartItemSchema),
  itemCount: z.number().int().nonnegative(),
})
