import { nftListResponseSchema, nftSchema } from '@/features/catalog/schemas'
import type { Nft, NftListParams } from '@/features/catalog/types'
import { http } from '@/infrastructure/http/axios'

export async function fetchNftList(params: NftListParams, signal?: AbortSignal) {
  const { data } = await http.get<unknown>('/nfts', {
    params,
    signal,
  })

  return nftListResponseSchema.parse(data)
}

export async function fetchNftById(id: string, signal?: AbortSignal) {
  const { data } = await http.get<unknown>(`/nfts/${id}`, { signal })
  return nftSchema.parse(data) satisfies Nft
}
