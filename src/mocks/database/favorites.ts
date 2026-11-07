import { getSessionByToken, readBearerToken } from '@/mocks/database/auth'
import { findNft } from '@/mocks/database/catalog'

const favoritesKey = (userId: string) => `kurio:favorites:${userId}`

function readFavoriteIds(userId: string): string[] {
  try {
    const raw = window.localStorage.getItem(favoritesKey(userId))
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []
  } catch {
    return []
  }
}

function writeFavoriteIds(userId: string, ids: string[]) {
  window.localStorage.setItem(favoritesKey(userId), JSON.stringify(ids))
}

export function requireSessionUser(request: Request) {
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
  return { ok: true as const, userId: session.user.id, session }
}

export function listFavorites(userId: string) {
  return { items: readFavoriteIds(userId) }
}

export function addFavorite(userId: string, nftId: string) {
  const nft = findNft(nftId)
  if (!nft) {
    return {
      ok: false as const,
      code: 'nft_not_found' as const,
      message: 'NFT não encontrado.',
      status: 404 as const,
    }
  }

  const items = readFavoriteIds(userId)
  if (items.includes(nftId)) {
    return {
      ok: false as const,
      code: 'favorite_exists' as const,
      message: 'Este NFT já está nos favoritos.',
      status: 409 as const,
    }
  }

  writeFavoriteIds(userId, [...items, nftId])
  return { ok: true as const, items: [...items, nftId] }
}

export function removeFavorite(userId: string, nftId: string) {
  const items = readFavoriteIds(userId)
  if (!items.includes(nftId)) {
    return {
      ok: false as const,
      code: 'favorite_not_found' as const,
      message: 'Favorito não encontrado.',
      status: 404 as const,
    }
  }

  const next = items.filter((id) => id !== nftId)
  writeFavoriteIds(userId, next)
  return { ok: true as const, items: next }
}
