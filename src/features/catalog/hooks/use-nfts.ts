import { useQuery } from '@tanstack/react-query'

import { fetchNftById, fetchNftList } from '@/features/catalog/api/nft-api'
import type { NftListParams } from '@/features/catalog/types'
import { isHttpError } from '@/infrastructure/http/errors'

export const nftKeys = {
  all: ['nfts'] as const,
  list: (params: NftListParams) => ['nfts', 'list', params] as const,
  detail: (id: string) => ['nfts', 'detail', id] as const,
}

function retryQuery(failureCount: number, error: unknown) {
  if (isHttpError(error) && error.status >= 400 && error.status < 500) return false
  return failureCount < 1
}

export function useNftList(params: NftListParams) {
  return useQuery({
    queryKey: nftKeys.list(params),
    queryFn: ({ signal }) => fetchNftList(params, signal),
    staleTime: 30_000,
    retry: retryQuery,
    placeholderData: (previous) => previous,
  })
}

export function useNftDetail(id: string) {
  return useQuery({
    queryKey: nftKeys.detail(id),
    queryFn: ({ signal }) => fetchNftById(id, signal),
    staleTime: 30_000,
    retry: retryQuery,
  })
}
