import { Link, useNavigate } from '@tanstack/react-router'
import { useReducedMotion } from 'motion/react'
import { useRef, type MouseEvent } from 'react'

import { CartIcon, HeartIcon, HeartSolidIcon, SearchIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { flyImageToCart } from '@/features/cart/fly-to-cart'
import { useAddToCart } from '@/features/cart/hooks/use-cart'
import type { Nft } from '@/features/catalog/types'
import { useIsFavorite, useToggleFavorite } from '@/features/favorites/hooks/use-favorites'
import { nftDisplayName } from '@/mocks/fixtures/nfts'
import { formatEth } from '@/shared/formatters/eth'
import { Reveal } from '@/shared/motion/reveal'
import { cn } from '@/shared/utils/cn'

function stopCardNavigation(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
}

export function NftCard({ nft }: { nft: Nft }) {
  const label = nftDisplayName(nft)
  const navigate = useNavigate()
  const imageRef = useRef<HTMLImageElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const addToCart = useAddToCart()
  const isFavorite = useIsFavorite(nft.id)
  const { toggleFavorite } = useToggleFavorite()

  async function handleAddToCart(event: MouseEvent) {
    stopCardNavigation(event)
    if (!prefersReducedMotion && imageRef.current) {
      await flyImageToCart(imageRef.current, nft.imageUrl)
    }
    addToCart.mutate(nft.id)
  }

  function handleFavorite(event: MouseEvent) {
    stopCardNavigation(event)
    toggleFavorite(nft.id)
  }

  function handleDetails(event: MouseEvent) {
    stopCardNavigation(event)
    void navigate({ to: '/nfts/$nftId', params: { nftId: nft.id } })
  }

  return (
    <Reveal direction="up" className="even:pt-8 md:even:pt-0">
      <article>
        <Link
          to="/nfts/$nftId"
          params={{ nftId: nft.id }}
          className="group block"
          aria-label={`${label}, ${formatEth(nft.priceEth)}`}
        >
          <div className="relative flex aspect-[258/300] rounded-3xl md:rounded-none items-center justify-center bg-card p-1 transition-all duration-300 ease-out border-t border-transparent group-hover:border-primary">
            <img
              ref={imageRef}
              src={nft.imageUrl}
              alt=""
              className="h-[86%] w-full object-cover rounded-3xl transition-transform duration-300 ease-out group-hover:-translate-y-2"
            />
            {nft.isRare ? (
              <span className="pointer-events-none absolute left-0 top-[14px] grid h-[29px] w-20 place-items-center bg-primary text-sm font-medium text-ink">
                RARO
              </span>
            ) : null}
            <div className="pointer-events-auto md:pointer-events-none absolute inset-x-0 top-7 pr-3 md:pr-0 md:top-auto md:bottom-0 flex justify-end md:justify-center md:opacity-0 transition-all duration-300 md:group-hover:bottom-5 group-hover:pointer-events-auto group-hover:opacity-100">
              <div className="flex gap-[10px]">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="dark"
                      size="sm"
                      className="px-2 hidden md:block "
                      aria-label="Adicionar ao Carrinho"
                      onClick={handleAddToCart}
                    >
                      <CartIcon className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Adicionar ao Carrinho</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="dark"
                      size="sm"
                      className={cn('px-2 rounded-full md:rounded-md', isFavorite && 'text-primary hover:text-primary')}
                      aria-label="Favoritar"
                      aria-pressed={isFavorite}
                      onClick={handleFavorite}
                    >
                      {isFavorite ? (
                        <HeartSolidIcon className="size-5 text-primary" />
                      ) : (
                        <HeartIcon className="size-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Favoritar</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="dark"
                      size="sm"
                      className="px-2 hidden md:block "
                      aria-label="Ver detalhes"
                      onClick={handleDetails}
                    >
                      <SearchIcon className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Ver detalhes</TooltipContent>
                </Tooltip>
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
    </Reveal>
  )
}

export function NftCardSkeleton() {
  return (
    <Reveal direction="up">
      <div aria-hidden="true">
        <Skeleton className="aspect-[258/300] w-full" />
        <Skeleton className="mt-3 h-4 w-3/4" />
        <Skeleton className="mt-2 h-5 w-1/3" />
      </div>
    </Reveal>
  )
}
