import { getSessionByToken, readBearerToken } from '@/mocks/database/auth'
import { clearCart, getCart } from '@/mocks/database/cart'
import { clearPromoForRequest, computeQuote } from '@/mocks/database/quote'
import {
  cartGrandTotalEth,
  lineTotalEth,
  NETWORK_FEE_ETH,
  sumSubtotalEth,
} from '@/features/cart/utils/totals'
import type { CreateOrderBody } from '@/features/orders/schemas'
import type { Order, OrderStatus } from '@/features/orders/types'
import type { MockScenario } from '@/mocks/scenarios'

type IdempotencyRecord = {
  fingerprint: string
  orderId: string
}

const ORDERS_KEY = 'kurio:orders'
const IDEMPOTENCY_KEY = 'kurio:orders-idempotency'

type OrderListener = (order: Order) => void
const orderListeners = new Set<OrderListener>()

export function subscribeOrderUpdates(listener: OrderListener) {
  orderListeners.add(listener)
  return () => {
    orderListeners.delete(listener)
  }
}

function emitOrderUpdate(order: Order) {
  for (const listener of orderListeners) {
    listener(order)
  }
}

function readOrders(): Order[] {
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as Order[]) : []
  } catch {
    return []
  }
}

function writeOrders(orders: Order[]) {
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

function readIdempotency(): Record<string, IdempotencyRecord> {
  try {
    const raw = window.localStorage.getItem(IDEMPOTENCY_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return {}
    return parsed as Record<string, IdempotencyRecord>
  } catch {
    return {}
  }
}

function writeIdempotency(map: Record<string, IdempotencyRecord>) {
  window.localStorage.setItem(IDEMPOTENCY_KEY, JSON.stringify(map))
}

function idempotencyStorageKey(userId: string, key: string) {
  return `${userId}:${key}`
}

export function fingerprintCreateOrderBody(body: CreateOrderBody) {
  return JSON.stringify({
    walletProvider: body.walletProvider,
    displayName: body.displayName,
    walletAlias: body.walletAlias,
    network: body.network,
    profileName: body.profileName,
    walletAddress: body.walletAddress,
    ensOrSecondary: body.ensOrSecondary ?? '',
    walletType: body.walletType,
    referralCode: body.referralCode,
    email: body.email,
    ensSuffix: body.ensSuffix,
    ensName: body.ensName,
    useOtherWallet: body.useOtherWallet,
    collectorNote: body.collectorNote ?? '',
    promoCode: body.promoCode ?? '',
    quoteFingerprint: body.quoteFingerprint,
  })
}

function simulateTxHash() {
  const bytes = crypto.getRandomValues(new Uint8Array(20))
  return `0x${Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')}`
}

function updateOrderInStore(orderId: string, patch: Partial<Order>) {
  const orders = readOrders()
  const index = orders.findIndex((item) => item.id === orderId)
  if (index < 0) return null
  const next: Order = {
    ...orders[index],
    ...patch,
    version: orders[index].version + 1,
    updatedAt: new Date().toISOString(),
  }
  orders[index] = next
  writeOrders(orders)
  emitOrderUpdate(next)
  return next
}

export function finalizeOrder(
  orderId: string,
  status: Extract<OrderStatus, 'confirmed' | 'refused'>,
  refuseReason?: string,
) {
  const orders = readOrders()
  const current = orders.find((item) => item.id === orderId)
  if (!current || current.status !== 'pending') return current ?? null

  if (status === 'confirmed') {
    // Clear purchased items from the user cart bucket via a synthetic request is not available;
    // cart clearing is handled in createOrder path with request. Here we mark confirmed and
    // rely on createOrder having deferred clear — call clear via stored user id is done below.
    const next = updateOrderInStore(orderId, {
      status: 'confirmed',
      txHash: simulateTxHash(),
      refuseReason: undefined,
    })
    return next
  }

  return updateOrderInStore(orderId, {
    status: 'refused',
    txHash: null,
    refuseReason: refuseReason ?? 'Pagamento recusado pela rede.',
  })
}

const pendingTimers = new Map<string, number>()

export function scheduleOrderSettlement(
  orderId: string,
  scenario: MockScenario,
  onSettled?: (order: Order) => void,
) {
  const existing = pendingTimers.get(orderId)
  if (existing) window.clearTimeout(existing)

  const delayMs = scenario === 'order_timeout' ? 2500 : 1200
  const timer = window.setTimeout(() => {
    pendingTimers.delete(orderId)
    const status = scenario === 'payment_refused' || scenario === 'error' ? 'refused' : 'confirmed'
    const order = finalizeOrder(
      orderId,
      status,
      status === 'refused' ? 'Pagamento recusado pela rede.' : undefined,
    )
    if (order && status === 'confirmed') {
      // Cart was already snapshotted; clear user cart items matching order after confirm
      try {
        const raw = window.localStorage.getItem(`kurio:pending-cart-clear:${orderId}`)
        if (raw) {
          const { ownerKey } = JSON.parse(raw) as { ownerKey: string }
          window.localStorage.setItem(ownerKey, JSON.stringify([]))
          window.localStorage.removeItem(`kurio:pending-cart-clear:${orderId}`)
        }
      } catch {
        // ignore
      }
    }
    if (order) onSettled?.(order)
  }, delayMs)

  pendingTimers.set(orderId, timer)
}

export function createOrder(
  request: Request,
  body: CreateOrderBody,
  idempotencyKey: string,
  scenario: MockScenario = 'success',
) {
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

  const fingerprint = fingerprintCreateOrderBody(body)
  const storageKey = idempotencyStorageKey(session.user.id, idempotencyKey)
  const idempotencyMap = readIdempotency()
  const existing = idempotencyMap[storageKey]

  if (existing) {
    if (existing.fingerprint !== fingerprint) {
      return {
        ok: false as const,
        response: Response.json(
          {
            message: 'Chave de idempotência reutilizada com conteúdo diferente.',
            code: 'idempotency_conflict',
          },
          { status: 409 },
        ),
      }
    }

    const orders = readOrders()
    const order = orders.find((item) => item.id === existing.orderId)
    if (order) {
      return { ok: true as const, order, reused: true as const }
    }
  }

  const quoteResult = computeQuote(request, {
    promoCode: body.promoCode,
  })
  if (!quoteResult.ok) return quoteResult

  if (quoteResult.quote.fingerprint !== body.quoteFingerprint) {
    return {
      ok: false as const,
      response: Response.json(
        {
          message: 'A cotação mudou. Revise os valores e confirme novamente.',
          code: 'quote_stale',
        },
        { status: 409 },
      ),
    }
  }

  if (
    quoteResult.quote.promoStatus === 'invalid' ||
    quoteResult.quote.promoStatus === 'expired'
  ) {
    return {
      ok: false as const,
      response: Response.json(
        {
          message:
            quoteResult.quote.promoStatus === 'expired'
              ? 'O cupom informado está expirado.'
              : 'O cupom informado é inválido.',
          code: 'promo_invalid',
        },
        { status: 400 },
      ),
    }
  }

  const cartResult = getCart(request)
  if (!cartResult.ok) return cartResult

  if (cartResult.cart.items.length === 0) {
    return {
      ok: false as const,
      response: Response.json(
        { message: 'Seu carrinho está vazio.', code: 'cart_empty' },
        { status: 400 },
      ),
    }
  }

  const items = quoteResult.quote.items.map((item) => ({
    nftId: item.nftId,
    name: item.name,
    imageUrl: item.imageUrl,
    tokenNumber: item.tokenNumber,
    quantity: item.quantity,
    unitPriceEth: item.unitPriceEth,
    lineTotalEth: lineTotalEth(item.unitPriceEth, item.quantity),
  }))

  const now = new Date().toISOString()
  const order: Order = {
    id: `order-${crypto.randomUUID()}`,
    userId: session.user.id,
    status: 'pending',
    version: 1,
    txHash: null,
    createdAt: now,
    updatedAt: now,
    walletProvider: body.walletProvider,
    networkFeeEth: quoteResult.quote.networkFeeEth || NETWORK_FEE_ETH,
    discountEth: quoteResult.quote.discountEth,
    subtotalEth: quoteResult.quote.subtotalEth || sumSubtotalEth(items),
    totalEth:
      quoteResult.quote.totalEth ||
      cartGrandTotalEth(
        quoteResult.quote.subtotalEth,
        quoteResult.quote.discountEth,
        quoteResult.quote.networkFeeEth,
      ),
    quoteFingerprint: quoteResult.quote.fingerprint,
    promoCode: quoteResult.quote.promoCode,
    items,
  }

  const orders = readOrders()
  orders.unshift(order)
  writeOrders(orders)

  idempotencyMap[storageKey] = { fingerprint, orderId: order.id }
  writeIdempotency(idempotencyMap)

  // Defer cart clear until confirmation; stash owner key for settlement
  try {
    const ownerKey = `kurio:cart:user:${session.user.id}`
    window.localStorage.setItem(
      `kurio:pending-cart-clear:${order.id}`,
      JSON.stringify({ ownerKey }),
    )
  } catch {
    // ignore
  }

  scheduleOrderSettlement(order.id, scenario)

  return { ok: true as const, order, reused: false as const }
}

export function getOrderById(request: Request, orderId: string) {
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

  const order = readOrders().find((item) => item.id === orderId && item.userId === session.user.id)
  if (!order) {
    return {
      ok: false as const,
      response: Response.json(
        { message: 'Pedido não encontrado.', code: 'order_not_found' },
        { status: 404 },
      ),
    }
  }

  return { ok: true as const, order }
}

export function listOrdersForUser(request: Request) {
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

  const orders = readOrders().filter((order) => order.userId === session.user.id)
  return { ok: true as const, orders }
}

export function clearCartAfterConfirm(request: Request) {
  clearPromoForRequest(request)
  return clearCart(request)
}
