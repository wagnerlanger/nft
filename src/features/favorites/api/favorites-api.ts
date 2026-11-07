import { favoritesResponseSchema } from '@/features/favorites/schemas'
import type { FavoritesResponse } from '@/features/favorites/types'
import { http } from '@/infrastructure/http/axios'

export async function fetchFavorites(signal?: AbortSignal) {
  const { data } = await http.get<unknown>('/favorites', { signal })
  return favoritesResponseSchema.parse(data) satisfies FavoritesResponse
}

export async function addFavoriteRequest(nftId: string) {
  const { data } = await http.post<unknown>('/favorites', { nftId })
  return favoritesResponseSchema.parse(data) satisfies FavoritesResponse
}

export async function removeFavoriteRequest(nftId: string) {
  await http.delete(`/favorites/${nftId}`)
}
