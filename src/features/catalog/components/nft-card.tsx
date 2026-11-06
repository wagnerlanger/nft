import { Link } from '@tanstack/react-router'
import type { MouseEvent } from 'react'

import { CartIcon, HeartIcon, SearchIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Nft } from '@/features/catalog/types'
import { nftDisplayName } from '@/mocks/fixtures/nfts'
import { formatEth } from '@/shared/formatters/eth'

function stopCardNavigation(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
}

export function NftCard({ nft }: { nft: Nft }) {
  const label = nftDisplayName(nft)
  return (
    <article>
      <Link
        to="/nfts/$nftId"
        params={{ nftId: nft.id }}
        className="group block"
        aria-label={`${label}, ${formatEth(nft.priceEth)}`}
      >
        <div className="relative flex aspect-[258/300] items-center justify-center bg-card p-1 transition-all duration-300 ease-out border-t border-transparent group-hover:border-primary">
          <img
            src={nft.imageUrl}
            alt=""
            className="h-[86%] w-full object-cover rounded-3xl transition-transform duration-300 ease-out group-hover:-translate-y-2"
          />
          {nft.isRare ? (
            <span className="pointer-events-none absolute left-0 top-[14px] grid h-[29px] w-20 place-items-center bg-primary text-sm font-medium text-ink">
              RARO
            </span>
          ) : null}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center opacity-0 transition-all duration-300 group-hover:bottom-5 group-hover:pointer-events-auto group-hover:opacity-100">
            <div className="flex gap-[10px]">
              <Button
                variant="dark"
                size="sm"
                className="px-2"
                aria-label="Adicionar ao carrinho"
                onClick={stopCardNavigation}
              >
                <CartIcon className="size-5" />
              </Button>
              <Button
                variant="dark"
                size="sm"
                className="px-2"
                aria-label="Favoritar"
                onClick={stopCardNavigation}
              >
                <HeartIcon className="size-5" />
              </Button>
              <Button
                variant="dark"
                size="sm"
                className="px-2"
                aria-label="Ver detalhes"
                onClick={stopCardNavigation}
              >
                <SearchIcon className="size-5" />
              </Button>
            </div>
          </div>
        </div>
        <h3 className="mt-3 text-base text-foreground-soft">{label}</h3>
        <p className="mt-1 text-lg font-bold text-accent">
          {formatEth(nft.priceEth)}
          {nft.compareAtPriceEth ? (
            <span className="ml-2 text-base font-normal text-secondary line-through">
              {formatEth(nft.compareAtPriceEth)}
            </span>
          ) : null}
        </p>
      </Link>
    </article>
  )
}

export function NftCardSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className="aspect-[258/300] w-full" />
      <Skeleton className="mt-3 h-4 w-3/4" />
      <Skeleton className="mt-2 h-5 w-1/3" />
    </div>
  )
}
