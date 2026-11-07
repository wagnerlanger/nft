import { z } from 'zod'

export const favoritesResponseSchema = z.object({
  items: z.array(z.string()),
})
