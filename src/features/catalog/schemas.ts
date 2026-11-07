import { z } from 'zod'

import { CATEGORIES, CHAINS } from '@/shared/constants/catalog'

const categoryIds = CATEGORIES.map((item) => item.id) as [
  (typeof CATEGORIES)[number]['id'],
  ...(typeof CATEGORIES)[number]['id'][],
]
const chainIds = CHAINS.map((item) => item.id) as [
  (typeof CHAINS)[number]['id'],
  ...(typeof CHAINS)[number]['id'][],
]

export const nftSchema = z.object({
  id: z.string(),
  name: z.string(),
  tokenNumber: z.number().int(),
  imageUrl: z.string(),
  priceEth: z.string(),
  compareAtPriceEth: z.string().nullable(),
  category: z.enum(categoryIds),
  chain: z.enum(chainIds),
  listedAt: z.string(),
  isNew: z.boolean(),
  isTrending: z.boolean(),
  trendingScore: z.number(),
  limitedOffer: z.boolean(),
  isRare: z.boolean(),
  shortDescription: z.string(),
  details: z.array(
    z.object({
      title: z.string().optional(),
      body: z.string(),
    }),
  ),
  attributes: z.array(z.string()),
})

export const facetSchema = z.object({
  id: z.string(),
  label: z.string(),
  count: z.number(),
})

export const nftListResponseSchema = z.object({
  items: z.array(nftSchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  facets: z.object({
    categories: z.array(facetSchema),
    chains: z.array(facetSchema),
    price: z.object({
      min: z.string(),
      max: z.string(),
    }),
  }),
  highlight: nftSchema.nullable(),
})

export const apiErrorSchema = z.object({
  message: z.string(),
  code: z.string(),
})
