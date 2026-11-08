import type { WalletProvider } from '@/features/checkout/schemas'

export type OrderStatus = 'pending' | 'confirmed' | 'refused'

export interface OrderItem {
  nftId: string
  name: string
  imageUrl: string
  tokenNumber: number
  quantity: number
  unitPriceEth: string
  lineTotalEth: string
}

export interface Order {
  id: string
  userId: string
  status: OrderStatus
  version: number
  txHash: string | null
  createdAt: string
  updatedAt: string
  walletProvider: WalletProvider
  networkFeeEth: string
  discountEth: string
  subtotalEth: string
  totalEth: string
  quoteFingerprint: string
  promoCode: string | null
  items: OrderItem[]
  refuseReason?: string
}
