import { getRouteApi } from '@tanstack/react-router'
import { useRef } from 'react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useNftDetail } from '@/features/catalog/hooks/use-nfts'
import { NftBreadcrumbs } from '@/features/nft-details/components/breadcrumbs'
import { NftDetailTabs } from '@/features/nft-details/components/nft-detail-tabs'
import { NftGallery } from '@/features/nft-details/components/nft-gallery'
import { NftPurchasePanel } from '@/features/nft-details/components/nft-purchase-panel'
import { RelatedCarousel } from '@/features/nft-details/components/related-carousel'
import { isHttpError } from '@/infrastructure/http/errors'
import { nftDisplayName } from '@/mocks/fixtures/nfts'

const nftRoute = getRouteApi('/nfts/$nftId')

export function NftDetailPage() {
  const { nftId } = nftRoute.useParams()
  const query = useNftDetail(nftId)
  const galleryImageRef = useRef<HTMLImageElement>(null)

  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-8 md:px-8 md:py-10 xl:px-[120px]">
      <NftBreadcrumbs />

      {query.isPending ? (
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]" aria-busy="true">
          <div className="flex gap-4">
            <div className="flex w-[72px] flex-col gap-3 md:w-[88px]">
              {Array.from({ length: 4 }, (_, index) => (
                <Skeleton key={index} className="aspect-square w-full" />
              ))}
            </div>
            <Skeleton className="aspect-square flex-1" />
          </div>
          <div>
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="mt-4 h-8 w-1/3" />
            <Skeleton className="mt-6 h-4 w-1/2" />
            <Skeleton className="mt-8 h-20 w-full" />
            <Skeleton className="mt-8 h-10 w-2/3" />
          </div>
        </div>
      ) : null}

      {query.isError && isHttpError(query.error) && query.error.status === 404 ? (
        <div className="mt-10 max-w-lg" role="alert">
          <h1 className="text-2xl font-bold">NFT não encontrado</h1>
          <p className="mt-3 text-sm text-secondary">
            Esse identificador não existe no catálogo.
          </p>
        </div>
      ) : null}

      {query.isError && !(isHttpError(query.error) && query.error.status === 404) ? (
        <div className="mt-10" role="alert">
          <p>Não foi possível carregar este NFT.</p>
          <Button className="mt-4" onClick={() => void query.refetch()}>
            Tentar novamente
          </Button>
        </div>
      ) : null}

      {query.data ? (
        <>
          <article className="mt-8 flex gap-8 items-start">
            <NftGallery
              imageUrl={query.data.imageUrl}
              alt={nftDisplayName(query.data)}
              imageRef={galleryImageRef}
              isRare={query.data.isRare}
            />
            <NftPurchasePanel nft={query.data} imageRef={galleryImageRef} />
          </article>
          <NftDetailTabs nft={query.data} />
          <RelatedCarousel nft={query.data} />
        </>
      ) : null}
    </main>
  )
}
