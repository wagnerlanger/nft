import type { WalletProvider } from '@/features/checkout/schemas'

export type OrderStatus = 'confirmed'

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
  txHash: string
  createdAt: string
  walletProvider: WalletProvider
  networkFeeEth: string
  discountEth: string
  subtotalEth: string
  totalEth: string
  items: OrderItem[]
}
