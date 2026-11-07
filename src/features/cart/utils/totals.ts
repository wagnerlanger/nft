import Decimal from 'decimal.js'

import type { CartItem } from '@/features/cart/types'

export const NETWORK_FEE_ETH = '0.016'

export function lineTotalEth(unitPriceEth: string, quantity: number) {
  return new Decimal(unitPriceEth).times(quantity).toFixed()
}

export function sumSubtotalEth(items: Pick<CartItem, 'unitPriceEth' | 'quantity'>[]) {
  return items
    .reduce(
      (sum, item) => sum.plus(new Decimal(item.unitPriceEth).times(item.quantity)),
      new Decimal(0),
    )
    .toFixed()
}

export function cartGrandTotalEth(subtotalEth: string, discountEth = '0', networkFeeEth = NETWORK_FEE_ETH) {
  return new Decimal(subtotalEth).minus(discountEth).plus(networkFeeEth).toFixed()
}
