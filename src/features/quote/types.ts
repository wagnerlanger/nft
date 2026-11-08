import type { CartItem } from '@/features/cart/types'

export type PromoStatus = 'none' | 'applied' | 'invalid' | 'expired'

export interface Quote {
  items: CartItem[]
  subtotalEth: string
  discountEth: string
  networkFeeEth: string
  totalEth: string
  promoCode: string | null
  promoStatus: PromoStatus
  fingerprint: string
}
