import type { Ref } from 'react'

import { StarIcon } from '@/components/icons'
import type { Nft } from '@/features/catalog/types'
import {
  averageReviewRating,
  collectorReviews,
} from '@/features/nft-details/mocks/reviews'
import { cn } from '@/shared/utils/cn'

export type NftDetailTabId = 'details' | 'reviews'

function formatReviewDate(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

export function NftDetailTabs({
  nft,
  tab,
  onTabChange,
  ref,
}: {
  nft: Nft
  tab: NftDetailTabId
  onTabChange: (tab: NftDetailTabId) => void
  ref?: Ref<HTMLElement>
}) {
  const reviewCount = collectorReviews.length
  const rating = averageReviewRating(collectorReviews)
  const detailBlocks = nft.details.filter((block) => block.body.trim())

  return (
    <section ref={ref} id="nft-details-tabs" className="mt-16 scroll-mt-24">
      <div role="tablist" aria-label="Informações do NFT" className="border-b border-border flex flex-wrap gap-x-8 gap-y-2">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'details'}
          className={cn(
            'border-b-2 pb-2 text-[15px] font-medium cursor-pointer',
            tab === 'details'
              ? 'border-primary text-accent'
              : 'border-transparent text-foreground-soft hover:text-primary',
          )}
          onClick={() => onTabChange('details')}
        >
          Detalhes do NFT
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'reviews'}
          className={cn(
            'border-b-2 pb-2 text-[15px] font-medium cursor-pointer',
            tab === 'reviews'
              ? 'border-primary text-accent'
              : 'border-transparent text-foreground-soft hover:text-primary',
          )}
          onClick={() => onTabChange('reviews')}
        >
          Avaliações de colecionadores ({reviewCount})
        </button>
      </div>

      {tab === 'details' ? (
        <div role="tabpanel" className="mt-6 max-w-4xl space-y-4 text-sm leading-relaxed text-secondary">
          {detailBlocks.map((block) => (
            <div key={block.title ?? block.body.slice(0, 2)}>
              {block.title ? (
                <h6 className="font-medium text-foreground">{block.title}: </h6>
              ) : null}
              <p>{block.body}</p>
            </div>
          ))}
        </div>
      ) : (
        <div role="tabpanel" className="mt-6">
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-foreground-soft">
            <div className="flex items-center gap-0.5" aria-label={`Média ${rating} de 5`}>
              {Array.from({ length: 5 }, (_, index) => (
                <StarIcon
                  key={index}
                  className={cn('size-4', index < rating ? 'text-amber' : 'text-border-soft')}
                />
              ))}
            </div>
            <span>
              Média {rating}/5 · {reviewCount} avaliações
            </span>
          </div>
          <ul className="space-y-5 max-h-[50vh] overflow-y-auto">
            {collectorReviews.map((review) => (
              <li key={review.id} className="border-b border-border/60 pb-5 last:border-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{review.author}</p>
                  <time className="text-xs text-muted" dateTime={review.createdAt}>
                    {formatReviewDate(review.createdAt)}
                  </time>
                </div>
                <div className="mt-1 flex items-center gap-0.5" aria-label={`${review.rating} estrelas`}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <StarIcon
                      key={index}
                      className={cn(
                        'size-3.5',
                        index < review.rating ? 'text-amber' : 'text-border-soft',
                      )}
                    />
                  ))}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-secondary">{review.body}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
