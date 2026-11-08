export type CouponDefinition = {
  code: string
  kind: 'percent'
  percent: number
  expired?: boolean
}

export const COUPONS: Record<string, CouponDefinition> = {
  KURIO10: {
    code: 'KURIO10',
    kind: 'percent',
    percent: 10,
  },
  EXPIRED10: {
    code: 'EXPIRED10',
    kind: 'percent',
    percent: 10,
    expired: true,
  },
}

export function normalizePromoCode(code: string) {
  return code.trim().toUpperCase()
}
