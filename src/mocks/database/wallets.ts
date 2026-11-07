import { getSessionByToken, readBearerToken } from '@/mocks/database/auth'
import type { WalletFieldsValues, WalletsResponse } from '@/features/wallets/schemas'

const WALLETS_KEY = 'kurio:wallets'

type WalletsStore = Record<string, WalletsResponse>

function emptyState(): WalletsResponse {
  return { primary: null, secondary: null, sameAsPrimary: false }
}

function readStore(): WalletsStore {
  try {
    const raw = window.localStorage.getItem(WALLETS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as WalletsStore
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeStore(store: WalletsStore) {
  window.localStorage.setItem(WALLETS_KEY, JSON.stringify(store))
}

function requireUser(request: Request) {
  const session = getSessionByToken(readBearerToken(request))
  if (!session) {
    return {
      ok: false as const,
      response: Response.json(
        { message: 'Sessão expirada. Entre novamente.', code: 'session_expired' },
        { status: 401 },
      ),
    }
  }
  return { ok: true as const, userId: session.user.id }
}

export function getWallets(request: Request) {
  const auth = requireUser(request)
  if (!auth.ok) return auth
  const store = readStore()
  return { ok: true as const, wallets: store[auth.userId] ?? emptyState() }
}

export function savePrimaryWallet(request: Request, primary: WalletFieldsValues) {
  const auth = requireUser(request)
  if (!auth.ok) return auth
  const store = readStore()
  const current = store[auth.userId] ?? emptyState()
  const next: WalletsResponse = {
    ...current,
    primary,
  }
  store[auth.userId] = next
  writeStore(store)
  return { ok: true as const, wallets: next }
}

export function saveSecondaryWallet(request: Request, secondary: WalletFieldsValues) {
  const auth = requireUser(request)
  if (!auth.ok) return auth
  const store = readStore()
  const current = store[auth.userId] ?? emptyState()
  const next: WalletsResponse = {
    ...current,
    secondary,
    sameAsPrimary: false,
  }
  store[auth.userId] = next
  writeStore(store)
  return { ok: true as const, wallets: next }
}

export function setSameAsPrimary(request: Request, sameAsPrimary: boolean) {
  const auth = requireUser(request)
  if (!auth.ok) return auth
  const store = readStore()
  const current = store[auth.userId] ?? emptyState()
  const next: WalletsResponse = {
    ...current,
    sameAsPrimary,
    secondary: sameAsPrimary ? null : current.secondary,
  }
  store[auth.userId] = next
  writeStore(store)
  return { ok: true as const, wallets: next }
}

export function resetWalletsDatabase() {
  window.localStorage.removeItem(WALLETS_KEY)
}
