import Decimal from 'decimal.js'

import {
  cartGrandTotalEth,
  NETWORK_FEE_ETH,
  sumSubtotalEth,
} from '@/features/cart/utils/totals'
import type { PromoStatus, Quote } from '@/features/quote/types'
import { getCart, resolveCartOwner } from '@/mocks/database/cart'
import { COUPONS, normalizePromoCode } from '@/mocks/fixtures/coupons'

function promoStorageKey(owner: { type: 'user' | 'guest'; id: string }) {
  return `kurio:cart-promo:${owner.type}:${owner.id}`
}

function readStoredPromo(owner: { type: 'user' | 'guest'; id: string }) {
  try {
    return window.localStorage.getItem(promoStorageKey(owner))
  } catch {
    return null
  }
}

function writeStoredPromo(owner: { type: 'user' | 'guest'; id: string }, code: string | null) {
  const key = promoStorageKey(owner)
  if (!code) {
    window.localStorage.removeItem(key)
    return
  }
  window.localStorage.setItem(key, code)
}

function buildFingerprint(input: {
  items: Quote['items']
  subtotalEth: string
  discountEth: string
  networkFeeEth: string
  totalEth: string
  promoCode: string | null
}) {
  return [
    input.promoCode ?? '',
    input.subtotalEth,
    input.discountEth,
    input.networkFeeEth,
    input.totalEth,
    ...input.items.map(
      (item) => `${item.nftId}:${item.quantity}:${item.unitPriceEth}`,
    ),
  ].join('|')
}

export function computeQuote(
  request: Request,
  options: {
    promoCode?: string
    clearPromo?: boolean
    forcePromoStatus?: 'invalid' | 'expired' | null
  } = {},
) {
  const cartResult = getCart(request)
  if (!cartResult.ok) return cartResult

  const ownerResult = resolveCartOwner(request)
  if (!ownerResult.ok) return ownerResult

  if (options.clearPromo) {
    writeStoredPromo(ownerResult.owner, null)
  }

  const candidate =
    options.clearPromo
      ? null
      : options.promoCode !== undefined
        ? options.promoCode.trim()
          ? normalizePromoCode(options.promoCode)
          : null
        : readStoredPromo(ownerResult.owner)

  const items = cartResult.cart.items
  const subtotalEth = sumSubtotalEth(items)
  let promoStatus: PromoStatus = 'none'
  let promoCode: string | null = null
  let discountEth = '0'

  const forced = options.forcePromoStatus

  if (forced === 'invalid' && candidate) {
    promoStatus = 'invalid'
    promoCode = candidate
    writeStoredPromo(ownerResult.owner, null)
  } else if (forced === 'expired' && candidate) {
    promoStatus = 'expired'
    promoCode = candidate
    writeStoredPromo(ownerResult.owner, null)
  } else if (candidate) {
    const coupon = COUPONS[candidate]
    if (!coupon) {
      promoStatus = 'invalid'
      promoCode = candidate
      writeStoredPromo(ownerResult.owner, null)
    } else if (coupon.expired) {
      promoStatus = 'expired'
      promoCode = candidate
      writeStoredPromo(ownerResult.owner, null)
    } else {
      promoStatus = 'applied'
      promoCode = coupon.code
      discountEth = new Decimal(subtotalEth).times(coupon.percent).div(100).toFixed(3)
      writeStoredPromo(ownerResult.owner, coupon.code)
    }
  } else {
    writeStoredPromo(ownerResult.owner, null)
  }

  const networkFeeEth = NETWORK_FEE_ETH
  const totalEth = cartGrandTotalEth(subtotalEth, discountEth, networkFeeEth)

  const quote: Quote = {
    items,
    subtotalEth,
    discountEth,
    networkFeeEth,
    totalEth,
    promoCode,
    promoStatus,
    fingerprint: buildFingerprint({
      items,
      subtotalEth,
      discountEth,
      networkFeeEth,
      totalEth,
      promoCode,
    }),
  }

  return { ok: true as const, quote }
}

export function getStoredPromoForRequest(request: Request) {
  const ownerResult = resolveCartOwner(request)
  if (!ownerResult.ok) return null
  return readStoredPromo(ownerResult.owner)
}

export function clearPromoForRequest(request: Request) {
  const ownerResult = resolveCartOwner(request)
  if (!ownerResult.ok) return
  writeStoredPromo(ownerResult.owner, null)
}
