export const SCENARIO_HEADER = 'x-kurio-scenario'

export type MockScenario =
  | 'success'
  | 'empty'
  | 'slow'
  | 'error'
  | 'session_expired'
  | 'coupon_invalid'
  | 'coupon_expired'
  | 'price_change'
  | 'order_timeout'
  | 'payment_refused'
  | 'out_of_order'

const KNOWN_SCENARIOS: MockScenario[] = [
  'success',
  'empty',
  'slow',
  'error',
  'session_expired',
  'coupon_invalid',
  'coupon_expired',
  'price_change',
  'order_timeout',
  'payment_refused',
  'out_of_order',
]

export function readScenario(request: Request): MockScenario {
  const value = request.headers.get(SCENARIO_HEADER)
  if (value && (KNOWN_SCENARIOS as string[]).includes(value)) {
    return value as MockScenario
  }
  return 'success'
}

export function scenarioDelay(scenario: MockScenario) {
  if (scenario === 'slow') return 1600
  if (scenario === 'order_timeout') return 8000
  if (scenario === 'out_of_order') return 200 + Math.floor(Math.random() * 1800)
  if (scenario === 'error') return 300
  return 400
}
