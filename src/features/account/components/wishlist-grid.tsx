import { useQueries } from '@tanstack/react-query'

import { Skeleton } from '@/components/ui/skeleton'
import { fetchNftById } from '@/features/catalog/api/nft-api'
import { NftCard } from '@/features/catalog/components/nft-card'
import { nftKeys } from '@/features/catalog/hooks/use-nfts'
import { useFavoritesQuery } from '@/features/favorites/hooks/use-favorites'
import { isHttpError } from '@/infrastructure/http/errors'

export function WishlistGrid() {
  const favoritesQuery = useFavoritesQuery()
  const ids = favoritesQuery.data?.items ?? []

  const nftQueries = useQueries({
    queries: ids.map((id) => ({
      queryKey: nftKeys.detail(id),
      queryFn: ({ signal }: { signal?: AbortSignal }) => fetchNftById(id, signal),
      staleTime: 30_000,
      enabled: favoritesQuery.isSuccess,
    })),
  })

  if (favoritesQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-56" />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="aspect-[258/360] w-full" />
          <Skeleton className="aspect-[258/360] w-full" />
          <Skeleton className="aspect-[258/360] w-full" />
        </div>
      </div>
    )
  }

  if (favoritesQuery.isError) {
    return (
      <p className="text-sm text-destructive">
        {isHttpError(favoritesQuery.error)
          ? favoritesQuery.error.message
          : 'Não foi possível carregar a lista de interesse.'}
      </p>
    )
  }

  const nfts = nftQueries
    .map((query) => query.data)
    .filter((nft): nft is NonNullable<typeof nft> => Boolean(nft))

  const loadingNfts = nftQueries.some((query) => query.isLoading)

  return (
    <section>
      <h1 className="text-2xl font-bold tracking-wide text-foreground md:text-3xl">
        Lista de interesse
      </h1>

      {ids.length === 0 ? (
        <p className="mt-6 text-sm text-secondary">
          Você ainda não favoritou nenhum NFT. Clique no coração nos cards do catálogo.
        </p>
      ) : loadingNfts && nfts.length === 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="aspect-[258/360] w-full" />
          <Skeleton className="aspect-[258/360] w-full" />
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {nfts.map((nft) => (
            <NftCard key={nft.id} nft={nft} />
          ))}
        </div>
      )}
    </section>
  )
}
