const RETURN_TO_KEY = 'kurio:auth-return-to'
const CHECKOUT_DRAFT_KEY = 'kurio:checkout-draft'

export type AuthReturnTo = {
  pathname: string
  search?: string
  hash?: string
}

export function writeAuthReturnTo(target: AuthReturnTo) {
  window.sessionStorage.setItem(RETURN_TO_KEY, JSON.stringify(target))
}

export function readAuthReturnTo(): AuthReturnTo | null {
  try {
    const raw = window.sessionStorage.getItem(RETURN_TO_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthReturnTo
    if (!parsed.pathname) return null
    return parsed
  } catch {
    return null
  }
}

export function clearAuthReturnTo() {
  window.sessionStorage.removeItem(RETURN_TO_KEY)
}

export function writeCheckoutDraft(draft: unknown) {
  window.sessionStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(draft))
}

export function readCheckoutDraft<T>(): T | null {
  try {
    const raw = window.sessionStorage.getItem(CHECKOUT_DRAFT_KEY)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function clearCheckoutDraft() {
  window.sessionStorage.removeItem(CHECKOUT_DRAFT_KEY)
}
