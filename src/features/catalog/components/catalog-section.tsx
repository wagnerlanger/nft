import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { CatalogFilters } from '@/features/catalog/components/catalog-filters'
import { CatalogPagination } from '@/features/catalog/components/catalog-pagination'
import {
  CatalogError,
  EmptyCatalog,
  FilterSkeleton,
  GridSkeleton,
} from '@/features/catalog/components/catalog-states'
import { CatalogToolbar } from '@/features/catalog/components/catalog-toolbar'
import { FeaturedBanner } from '@/features/catalog/components/featured-banner'
import { NftCard } from '@/features/catalog/components/nft-card'
import type { useNftList } from '@/features/catalog/hooks/use-nfts'
import type { CatalogTabId, SortId } from '@/shared/constants/catalog'
import type { CatalogSearch } from '@/shared/utils/catalog-search'

type ListQuery = ReturnType<typeof useNftList>

interface CatalogSectionProps {
  search: CatalogSearch
  query: ListQuery
  onSearchChange: (patch: Partial<CatalogSearch>) => void
}

export function CatalogSection({ search, query, onSearchChange }: CatalogSectionProps) {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const tab = search.tab ?? 'all'
  const sort = search.sort ?? 'recent'
  const page = search.page ?? 1
  const data = query.data

  return (
    <section id="catalogo" className="scroll-mt-6 pt-16" aria-busy={query.isFetching}>
      <h2 className="sr-only">Catálogo de NFTs</h2>
      <div className="lg:grid lg:grid-cols-[310px_minmax(0,1fr)] lg:gap-12">
        <aside className="hidden lg:flex flex-col gap-6">
          {data ? (
            <>
              <CatalogFilters
                idPrefix="desktop"
                search={search}
                facets={data.facets}
                onSearchChange={onSearchChange}
              />
              {data.highlight ? <FeaturedBanner nftId={data.highlight.id} /> : null}
            </>
          ) : (
            <FilterSkeleton />
          )}
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <Button variant="outline" onClick={() => setFiltersOpen(true)}>
              Filtros
            </Button>
          </div>
          {data?.highlight ? (
            <div className="mb-8 lg:hidden">
              <FeaturedBanner nftId={data.highlight.id} />
            </div>
          ) : null}
          <CatalogToolbar
            tab={tab}
            sort={sort}
            onTabChange={(nextTab) =>
              onSearchChange({
                tab: nextTab === 'all' ? undefined : (nextTab as CatalogTabId),
                page: undefined,
              })
            }
            onSortChange={(nextSort) =>
              onSearchChange({
                sort: nextSort === 'recent' ? undefined : (nextSort as SortId),
                page: undefined,
              })
            }
          />

          <div className="mt-8">
            {query.isPending ? <GridSkeleton /> : null}
            {query.isError ? (
              <CatalogError onRetry={() => void query.refetch()} />
            ) : null}
            {data && !query.isError && data.items.length === 0 ? (
              <EmptyCatalog onClear={() => onSearchChange({
                q: undefined,
                category: undefined,
                chain: undefined,
                minPrice: undefined,
                maxPrice: undefined,
                sort: undefined,
                tab: undefined,
                page: undefined,
              })} />
            ) : null}
            {data && !query.isError && data.items.length > 0 ? (
              <>
                <p className="sr-only" aria-live="polite">
                  {data.total} NFTs encontrados
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3 lg:gap-x-[34px] lg:gap-y-[72px]">
                  {data.items.map((nft) => (
                    <NftCard key={nft.id} nft={nft} />
                  ))}
                </div>
                <CatalogPagination
                  page={page}
                  pageSize={data.pageSize}
                  total={data.total}
                  onPageChange={(nextPage) =>
                    onSearchChange({ page: nextPage <= 1 ? undefined : nextPage })
                  }
                />
              </>
            ) : null}
          </div>
        </div>
      </div>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent aria-describedby={undefined}>
          <SheetTitle className="text-lg font-bold">Filtros</SheetTitle>
          {data ? (
            <div className="mt-6">
              <CatalogFilters
                idPrefix="mobile"
                search={search}
                facets={data.facets}
                onSearchChange={onSearchChange}
              />
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </section>
  )
}
