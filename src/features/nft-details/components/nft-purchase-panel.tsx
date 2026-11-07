import { useReducedMotion } from 'motion/react'
import { useState, type RefObject } from 'react'

import {
  HeartIcon,
  HeartSolidIcon,
  LinkedInIcon,
  MailIcon,
  StarIcon,
  TwitterIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import { flyImageToCart } from '@/features/cart/fly-to-cart'
import { useAddToCart } from '@/features/cart/hooks/use-cart'
import type { Nft } from '@/features/catalog/types'
import { useIsFavorite, useToggleFavorite } from '@/features/favorites/hooks/use-favorites'
import {
  averageReviewRating,
  collectorReviews,
} from '@/features/nft-details/mocks/reviews'
import { formatTokenNumber, nftDisplayName } from '@/mocks/fixtures/nfts'
import { CATEGORIES } from '@/shared/constants/catalog'
import { formatEth } from '@/shared/formatters/eth'
import { cn } from '@/shared/utils/cn'

const EDITIONS = [
  { id: '1-1', label: '1/1' },
  { id: '1-10', label: '1/10' },
  { id: '1-50', label: '1/50' },
  { id: 'aberta', label: 'aberta' },
] as const

export function NftPurchasePanel({
  nft,
  imageRef,
}: {
  nft: Nft
  imageRef?: RefObject<HTMLImageElement | null>
}) {
  const label = nftDisplayName(nft)
  const [editionId, setEditionId] = useState<(typeof EDITIONS)[number]['id']>('1-50')
  const [quantity, setQuantity] = useState(1)
  const prefersReducedMotion = useReducedMotion()
  const addToCart = useAddToCart()
  const isFavorite = useIsFavorite(nft.id)
  const { toggleFavorite } = useToggleFavorite()
  const reviewCount = collectorReviews.length
  const rating = averageReviewRating(collectorReviews)
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = encodeURIComponent(label)
  const categoryLabel =
    CATEGORIES.find((item) => item.id === nft.category)?.label ?? nft.category

  async function handleBuy() {
    if (!prefersReducedMotion && imageRef?.current) {
      await flyImageToCart(imageRef.current, nft.imageUrl)
    }
    addToCart.mutate({ nftId: nft.id, quantity })
  }

  return (
    <div className='flex-1'>
      <h1 className="text-3xl font-bold text-foreground md:text-4xl">{label}</h1>
      <div className="flex justify-between border-b border-border pb-3">
        <p className="mt-3 text-2xl text-nowrap font-bold text-accent">{formatEth(nft.priceEth)}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-foreground-soft">
          <div className="flex items-center gap-0.5 text-amber" aria-label={`${rating} de 5 estrelas`}>
            {Array.from({ length: 5 }, (_, index) => (
              <StarIcon
                key={index}
                className={cn('size-4', index < rating ? 'text-amber' : 'text-border-soft')}
              />
            ))}
          </div>
          <span>{reviewCount} avaliações de colecionadores</span>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-foreground">Sobre este NFT:</p>
        <p className="mt-2 text-sm leading-relaxed text-secondary">{nft.shortDescription}</p>
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-foreground">Edição:</p>
        <div className="mt-3 flex flex-wrap gap-3" role="radiogroup" aria-label="Edição">
          {EDITIONS.map((edition) => {
            const selected = edition.id === editionId
            return (
              <button
                key={edition.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setEditionId(edition.id)}
                className={cn(
                  'relative min-w-[72px] rounded-4xl border px-4 py-1 text-sm font-medium transition-colors uppercase',
                  selected
                    ? 'border-primary text-accent'
                    : 'border-border-soft text-foreground-soft hover:border-primary hover:text-primary',
                )}
              >
                {edition.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap justify-between items-center gap-3">
        <div
          className="inline-flex h-10 items-center"
          aria-label="Quantidade"
        >
          <Button
            type="button"
            className="grid h-full w-5 text-2xl font-normal rounded-full place-items-center disabled:opacity-40"
            aria-label="Diminuir quantidade"
            disabled={quantity <= 1}
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          >
            −
          </Button>
          <span className="min-w-8 text-center text-base font-medium tabular-nums">{quantity}</span>
          <Button
            type="button"
            className="grid h-full w-5 text-2xl font-normal rounded-full place-items-center disabled:opacity-40"
            aria-label="Aumentar quantidade"
            onClick={() => setQuantity((value) => value + 1)}
          >
            +
          </Button>
        </div>

        <div className='flex items-center gap-3'>
          <Button
            className="min-w-[140px] uppercase tracking-wide"
            disabled={addToCart.isPending}
            onClick={() => void handleBuy()}
          >
            Comprar
          </Button>
          <Button
            variant="outline"
            className={cn('gap-2 text-primary', isFavorite && 'bg-primary/10')}
            aria-pressed={isFavorite}
            onClick={() => toggleFavorite(nft.id)}
          >
            {isFavorite ? (
              <HeartSolidIcon className="size-5 text-primary" />
            ) : (
              <HeartIcon className="size-5" />
            )}
            Favoritar
          </Button>
        </div>

      </div>

      <dl className="mt-8 space-y-1 text-sm text-secondary">
        <div className="flex flex-wrap gap-x-2">
          <dt>ID do token:</dt>
          <dd>{formatTokenNumber(nft.tokenNumber)}</dd>
        </div>
        <div className="flex flex-wrap gap-x-2">
          <dt>Coleção:</dt>
          <dd>{categoryLabel}</dd>
        </div>
        <div className="flex flex-wrap gap-x-2">
          <dt>Atributos:</dt>
          <dd>{nft.attributes.join(', ')}</dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <p className="text-sm text-foreground-soft">Compartilhar este NFT:</p>
        <div className="flex items-center gap-3">
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="text-foreground-soft hover:text-primary"
            aria-label="Compartilhar no LinkedIn"
          >
            <LinkedInIcon className="size-4" />
          </a>
          <a
            href={`mailto:?subject=${shareTitle}&body=${encodeURIComponent(shareUrl)}`}
            className="text-foreground-soft hover:text-primary"
            aria-label="Compartilhar por e-mail"
          >
            <MailIcon className="size-4" />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareTitle}`}
            target="_blank"
            rel="noreferrer"
            className="text-foreground-soft hover:text-primary"
            aria-label="Compartilhar no X"
          >
            <TwitterIcon className="size-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
