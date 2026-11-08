import { resetAuthDatabase } from '@/mocks/database/auth'
import { resetNftOverrides } from '@/mocks/database/catalog'

const KURIO_PREFIX = 'kurio:'

export function resetDemoState() {
  const keys: string[] = []
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index)
    if (key?.startsWith(KURIO_PREFIX)) keys.push(key)
  }
  for (const key of keys) {
    window.localStorage.removeItem(key)
  }

  const sessionKeys: string[] = []
  for (let index = 0; index < window.sessionStorage.length; index += 1) {
    const key = window.sessionStorage.key(index)
    if (key?.startsWith(KURIO_PREFIX)) sessionKeys.push(key)
  }
  for (const key of sessionKeys) {
    window.sessionStorage.removeItem(key)
  }

  resetAuthDatabase()
  resetNftOverrides()
}

export function setDemoScenario(scenario: string) {
  if (!scenario || scenario === 'success') {
    window.localStorage.removeItem('kurio:scenario')
    return
  }
  window.localStorage.setItem('kurio:scenario', scenario)
}

declare global {
  interface Window {
    kurioResetDemoState?: typeof resetDemoState
    kurioSetScenario?: typeof setDemoScenario
  }
}

export function exposeDemoHelpers() {
  window.kurioResetDemoState = resetDemoState
  window.kurioSetScenario = setDemoScenario
}
