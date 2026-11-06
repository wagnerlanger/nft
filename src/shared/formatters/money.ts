import Decimal from 'decimal.js'

export function toCents(value: string) {
  return new Decimal(value).mul(100).toNumber()
}

export function fromCents(value: number) {
  return new Decimal(value).div(100).toFixed(2)
}
