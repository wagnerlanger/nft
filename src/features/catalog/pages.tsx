import { getRouteApi } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

import { CatalogSection } from '@/features/catalog/components/catalog-section'
import { HeroBanner } from '@/features/catalog/components/hero-banner'
import { JournalSection, PromoBand } from '@/features/catalog/components/editorial'
import { useNftList } from '@/features/catalog/hooks/use-nfts'

const homeRoute = getRouteApi('/')

export function HomePage() {
  const search = homeRoute.useSearch()
  const isFirstRender = useRef(true)

  const navigate = homeRoute.useNavigate()
  const query = useNftList({
    q: search.q,
    category: search.category,
    chain: search.chain,
    minPrice: search.minPrice,
    maxPrice: search.maxPrice,
    sort: search.sort ?? 'recent',
    tab: search.tab ?? 'all',
    page: search.page ?? 1,
  })

  useEffect(() => {
    const hasActiveFilter = Boolean(
      search.q ||
      search.category ||
      search.chain ||
      search.minPrice ||
      search.maxPrice ||
      search.sort ||
      search.tab ||
      search.page,
    )
    if (isFirstRender.current) {
      isFirstRender.current = false
      if (!hasActiveFilter) return
    }
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
  }, [search])

  return (
    <main>
      <HeroBanner />
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 xl:px-[120px]">
        <CatalogSection
          search={search}
          query={query}
          onSearchChange={(patch) => {
            void navigate({
              search: (previous) => ({ ...previous, ...patch }),
              resetScroll: false,
            })
          }}
        />
        <PromoBand />
        <JournalSection />
      </div>
    </main>
  )
}
