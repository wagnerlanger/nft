import { z } from 'zod'

import { walletProviderSchema } from '@/features/checkout/schemas'

export const orderItemSchema = z.object({
  nftId: z.string(),
  name: z.string(),
  imageUrl: z.string(),
  tokenNumber: z.number().int().nonnegative(),
  quantity: z.number().int().positive(),
  unitPriceEth: z.string(),
  lineTotalEth: z.string(),
})

export const orderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  status: z.literal('confirmed'),
  txHash: z.string(),
  createdAt: z.string(),
  walletProvider: walletProviderSchema,
  networkFeeEth: z.string(),
  discountEth: z.string(),
  subtotalEth: z.string(),
  totalEth: z.string(),
  items: z.array(orderItemSchema),
})

export const ordersListSchema = z.object({
  items: z.array(orderSchema),
})

export const createOrderBodySchema = z.object({
  walletProvider: walletProviderSchema,
  displayName: z.string().trim().min(1),
  walletAlias: z.string().trim().min(1),
  network: z.string().trim().min(1),
  profileName: z.string().trim().min(1),
  walletAddress: z.string().trim().min(1),
  ensOrSecondary: z.string().trim().optional(),
  walletType: z.string().trim().min(1),
  referralCode: z.string().trim().min(1),
  email: z.email(),
  ensSuffix: z.string().trim().min(1),
  ensName: z.string().trim().min(1),
  useOtherWallet: z.boolean(),
  collectorNote: z.string().trim().optional(),
  promoCode: z.string().trim().optional(),
})

export type CreateOrderBody = z.infer<typeof createOrderBodySchema>
