import Decimal from 'decimal.js'

export function formatEth(value: string) {
  return `${value} ETH`
}

export function compareEth(left: string, right: string) {
  return new Decimal(left).cmp(new Decimal(right))
}

export function isDecimalString(value: string) {
  try {
    const decimal = new Decimal(value)
    return decimal.isFinite() && !decimal.isNegative()
  } catch {
    return false
  }
}
