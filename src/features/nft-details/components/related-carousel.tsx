import { useEffect, useState } from 'react'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { NftCard, NftCardSkeleton } from '@/features/catalog/components/nft-card'
import { useNftList } from '@/features/catalog/hooks/use-nfts'
import type { Nft } from '@/features/catalog/types'
import { cn } from '@/shared/utils/cn'

export function RelatedCarousel({ nft }: { nft: Nft }) {
  const query = useNftList({
    category: nft.category,
    sort: 'recent',
    tab: 'all',
    page: 1,
  })
  const related = query.data?.items.filter((item) => item.id !== nft.id) ?? []

  const [api, setApi] = useState<CarouselApi>()
  const [activeIndex, setActiveIndex] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) return
    const sync = () => {
      setActiveIndex(api.selectedScrollSnap())
      setCount(api.scrollSnapList().length)
    }
    sync()
    api.on('select', sync)
    api.on('reInit', sync)
    return () => {
      api.off('select', sync)
      api.off('reInit', sync)
    }
  }, [api])

  if (query.isPending) {
    return (
      <section className="mt-14">
        <h2 className="text-xl font-bold text-accent md:text-2xl">Mais desta coleção</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 5 }, (_, index) => (
            <NftCardSkeleton key={index} />
          ))}
        </div>
      </section>
    )
  }

  if (related.length === 0) return null

  return (
    <section className="mt-14">
      <h2 className="text-xl font-bold text-accent md:text-2xl">Mais desta coleção</h2>
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: 'start' }}
        className="mt-6 w-full"
        aria-label="NFTs da mesma coleção"
      >
        <CarouselContent className="-ml-4">
          {related.map((item) => (
            <CarouselItem
              key={item.id}
              className="basis-[70%] pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <NftCard nft={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {count > 1 ? (
        <div
          className="mt-6 flex justify-center gap-2"
          role="tablist"
          aria-label="Páginas do carrossel"
        >
          {Array.from({ length: count }).map((_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              role="tab"
              aria-selected={dotIndex === activeIndex}
              aria-label={`Grupo ${dotIndex + 1}`}
              onClick={() => api?.scrollTo(dotIndex)}
              className={cn('h-2 cursor-pointer rounded-full transition-all duration-300', {
                'w-6 bg-primary': dotIndex === activeIndex,
                'w-2 bg-border-soft': dotIndex !== activeIndex,
              })}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}
