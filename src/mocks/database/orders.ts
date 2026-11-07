import { getSessionByToken, readBearerToken } from '@/mocks/database/auth'
import { clearCart, getCart } from '@/mocks/database/cart'
import {
  cartGrandTotalEth,
  lineTotalEth,
  NETWORK_FEE_ETH,
  sumSubtotalEth,
} from '@/features/cart/utils/totals'
import type { CreateOrderBody } from '@/features/orders/schemas'
import type { Order } from '@/features/orders/types'

type IdempotencyRecord = {
  fingerprint: string
  orderId: string
}

const ORDERS_KEY = 'kurio:orders'
const IDEMPOTENCY_KEY = 'kurio:orders-idempotency'

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
  })
}

function simulateTxHash() {
  const bytes = crypto.getRandomValues(new Uint8Array(20))
  return `0x${Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')}`
}

export function createOrder(request: Request, body: CreateOrderBody, idempotencyKey: string) {
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

  const items = cartResult.cart.items.map((item) => ({
    nftId: item.nftId,
    name: item.name,
    imageUrl: item.imageUrl,
    tokenNumber: item.tokenNumber,
    quantity: item.quantity,
    unitPriceEth: item.unitPriceEth,
    lineTotalEth: lineTotalEth(item.unitPriceEth, item.quantity),
  }))

  const subtotalEth = sumSubtotalEth(items)
  const discountEth = '0'
  const networkFeeEth = NETWORK_FEE_ETH
  const totalEth = cartGrandTotalEth(subtotalEth, discountEth, networkFeeEth)

  const order: Order = {
    id: `order-${crypto.randomUUID()}`,
    userId: session.user.id,
    status: 'confirmed',
    txHash: simulateTxHash(),
    createdAt: new Date().toISOString(),
    walletProvider: body.walletProvider,
    networkFeeEth,
    discountEth,
    subtotalEth,
    totalEth,
    items,
  }

  const orders = readOrders()
  orders.unshift(order)
  writeOrders(orders)

  idempotencyMap[storageKey] = { fingerprint, orderId: order.id }
  writeIdempotency(idempotencyMap)

  const cleared = clearCart(request)
  if (!cleared.ok) return cleared

  return { ok: true as const, order, reused: false as const }
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
