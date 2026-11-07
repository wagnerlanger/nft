import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuth } from '@/features/auth/hooks/use-auth'
import {
  addFavoriteRequest,
  fetchFavorites,
  removeFavoriteRequest,
} from '@/features/favorites/api/favorites-api'
import type { FavoritesResponse } from '@/features/favorites/types'
import { isHttpError } from '@/infrastructure/http/errors'

export const favoritesKeys = {
  all: ['favorites'] as const,
}

function retryQuery(failureCount: number, error: unknown) {
  if (isHttpError(error) && error.status >= 400 && error.status < 500) return false
  return failureCount < 1
}

export function useFavoritesQuery() {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: favoritesKeys.all,
    queryFn: ({ signal }) => fetchFavorites(signal),
    enabled: isAuthenticated,
    staleTime: 30_000,
    retry: retryQuery,
  })
}

export function useIsFavorite(nftId: string) {
  const query = useFavoritesQuery()
  return Boolean(query.data?.items.includes(nftId))
}

export function useToggleFavorite() {
  const { isAuthenticated, openAuth } = useAuth()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ nftId, favorite }: { nftId: string; favorite: boolean }) => {
      if (favorite) {
        return removeFavoriteRequest(nftId)
      }
      return addFavoriteRequest(nftId)
    },
    onMutate: async ({ nftId, favorite }) => {
      await queryClient.cancelQueries({ queryKey: favoritesKeys.all })
      const previous = queryClient.getQueryData<FavoritesResponse>(favoritesKeys.all)
      const currentItems = previous?.items ?? []
      const nextItems = favorite
        ? currentItems.filter((id) => id !== nftId)
        : currentItems.includes(nftId)
          ? currentItems
          : [...currentItems, nftId]
      queryClient.setQueryData<FavoritesResponse>(favoritesKeys.all, { items: nextItems })
      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(favoritesKeys.all, context.previous)
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: favoritesKeys.all })
    },
  })

  return {
    toggleFavorite: (nftId: string) => {
      if (!isAuthenticated) {
        openAuth('login')
        return
      }
      const items = queryClient.getQueryData<FavoritesResponse>(favoritesKeys.all)?.items ?? []
      const favorite = items.includes(nftId)
      mutation.mutate({ nftId, favorite })
    },
    isPending: mutation.isPending,
  }
}
