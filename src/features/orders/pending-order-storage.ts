const PENDING_ORDER_KEY = 'kurio:pending-order'

export type PendingOrderSnapshot = {
  orderId: string
  idempotencyKey: string
}

export function readPendingOrderSnapshot(): PendingOrderSnapshot | null {
  try {
    const raw = window.sessionStorage.getItem(PENDING_ORDER_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PendingOrderSnapshot
    if (!parsed.orderId || !parsed.idempotencyKey) return null
    return parsed
  } catch {
    return null
  }
}

export function writePendingOrderSnapshot(snapshot: PendingOrderSnapshot) {
  window.sessionStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(snapshot))
}

export function clearPendingOrderSnapshot() {
  window.sessionStorage.removeItem(PENDING_ORDER_KEY)
}
