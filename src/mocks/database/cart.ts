import { getSessionByToken, readBearerToken } from '@/mocks/database/auth'
import { findNft } from '@/mocks/database/catalog'
import { nftDisplayName } from '@/mocks/fixtures/nfts'

const GUEST_HEADER = 'x-guest-id'

type CartRecordItem = {
  nftId: string
  quantity: number
}

function cartKey(owner: { type: 'user' | 'guest'; id: string }) {
  return `kurio:cart:${owner.type}:${owner.id}`
}

function readItems(owner: { type: 'user' | 'guest'; id: string }): CartRecordItem[] {
  try {
    const raw = window.localStorage.getItem(cartKey(owner))
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is CartRecordItem =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as CartRecordItem).nftId === 'string' &&
        typeof (item as CartRecordItem).quantity === 'number',
    )
  } catch {
    return []
  }
}

function writeItems(owner: { type: 'user' | 'guest'; id: string }, items: CartRecordItem[]) {
  window.localStorage.setItem(cartKey(owner), JSON.stringify(items))
}

function toCartResponse(items: CartRecordItem[]) {
  const hydrated = items.flatMap((item) => {
    const nft = findNft(item.nftId)
    if (!nft) return []
    return [
      {
        nftId: item.nftId,
        quantity: item.quantity,
        unitPriceEth: nft.priceEth,
        name: nftDisplayName(nft),
        imageUrl: nft.imageUrl,
        tokenNumber: nft.tokenNumber,
      },
    ]
  })

  return {
    items: hydrated,
    itemCount: hydrated.reduce((sum, item) => sum + item.quantity, 0),
  }
}

export function resolveCartOwner(request: Request) {
  const session = getSessionByToken(readBearerToken(request))
  if (session) {
    return { ok: true as const, owner: { type: 'user' as const, id: session.user.id } }
  }

  const guestId = request.headers.get(GUEST_HEADER)?.trim()
  if (!guestId) {
    return {
      ok: false as const,
      response: Response.json(
        { message: 'Identidade do carrinho ausente.', code: 'guest_required' },
        { status: 400 },
      ),
    }
  }

  return { ok: true as const, owner: { type: 'guest' as const, id: guestId } }
}

export function getCart(request: Request) {
  const resolved = resolveCartOwner(request)
  if (!resolved.ok) return resolved
  return { ok: true as const, cart: toCartResponse(readItems(resolved.owner)) }
}

export function addCartItem(request: Request, nftId: string, quantity = 1) {
  const resolved = resolveCartOwner(request)
  if (!resolved.ok) return resolved

  const nft = findNft(nftId)
  if (!nft) {
    return {
      ok: false as const,
      response: Response.json(
        { message: 'NFT não encontrado.', code: 'nft_not_found' },
        { status: 404 },
      ),
    }
  }

  const qty = Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1
  const items = readItems(resolved.owner)
  const existing = items.find((item) => item.nftId === nftId)
  if (existing) {
    existing.quantity += qty
  } else {
    items.push({ nftId, quantity: qty })
  }
  writeItems(resolved.owner, items)

  return { ok: true as const, cart: toCartResponse(items) }
}

export function updateCartItem(request: Request, nftId: string, quantity: number) {
  const resolved = resolveCartOwner(request)
  if (!resolved.ok) return resolved

  const items = readItems(resolved.owner)
  const index = items.findIndex((item) => item.nftId === nftId)
  if (index < 0) {
    return {
      ok: false as const,
      response: Response.json(
        { message: 'Item não encontrado no carrinho.', code: 'cart_item_not_found' },
        { status: 404 },
      ),
    }
  }

  if (!Number.isFinite(quantity) || quantity < 1) {
    items.splice(index, 1)
  } else {
    items[index] = { nftId, quantity: Math.floor(quantity) }
  }

  writeItems(resolved.owner, items)
  return { ok: true as const, cart: toCartResponse(items) }
}

export function removeCartItem(request: Request, nftId: string) {
  const resolved = resolveCartOwner(request)
  if (!resolved.ok) return resolved

  const items = readItems(resolved.owner)
  const next = items.filter((item) => item.nftId !== nftId)
  if (next.length === items.length) {
    return {
      ok: false as const,
      response: Response.json(
        { message: 'Item não encontrado no carrinho.', code: 'cart_item_not_found' },
        { status: 404 },
      ),
    }
  }

  writeItems(resolved.owner, next)
  return { ok: true as const, cart: toCartResponse(next) }
}

export function clearCart(request: Request) {
  const resolved = resolveCartOwner(request)
  if (!resolved.ok) return resolved
  writeItems(resolved.owner, [])
  return { ok: true as const, cart: toCartResponse([]) }
}

export function mergeGuestCart(request: Request) {
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

  const guestId = request.headers.get(GUEST_HEADER)?.trim()
  if (!guestId) {
    return {
      ok: true as const,
      cart: toCartResponse(readItems({ type: 'user', id: session.user.id })),
    }
  }

  const userOwner = { type: 'user' as const, id: session.user.id }
  const guestOwner = { type: 'guest' as const, id: guestId }
  const userItems = readItems(userOwner)
  const guestItems = readItems(guestOwner)

  for (const guestItem of guestItems) {
    const existing = userItems.find((item) => item.nftId === guestItem.nftId)
    if (existing) {
      existing.quantity += guestItem.quantity
    } else {
      userItems.push({ ...guestItem })
    }
  }

  writeItems(userOwner, userItems)
  writeItems(guestOwner, [])

  return { ok: true as const, cart: toCartResponse(userItems) }
}
