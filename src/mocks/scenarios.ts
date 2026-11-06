export const SCENARIO_HEADER = 'x-kurio-scenario'

export type MockScenario = 'success' | 'empty' | 'slow' | 'error'

export function readScenario(request: Request): MockScenario {
  const value = request.headers.get(SCENARIO_HEADER)
  if (value === 'empty' || value === 'slow' || value === 'error') return value
  return 'success'
}

export function scenarioDelay(scenario: MockScenario) {
  if (scenario === 'slow') return 1600
  if (scenario === 'error') return 300
  return 400
}
