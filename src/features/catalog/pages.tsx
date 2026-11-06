import { getRouteApi, Link } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CatalogSection } from '@/features/catalog/components/catalog-section'
import { HeroBanner } from '@/features/catalog/components/hero-banner'
import { JournalSection, PromoBand } from '@/features/catalog/components/editorial'
import { useNftDetail, useNftList } from '@/features/catalog/hooks/use-nfts'
import { nftDisplayName } from '@/mocks/fixtures/nfts'
import { isHttpError } from '@/infrastructure/http/errors'
import { formatEth } from '@/shared/formatters/eth'
const homeRoute = getRouteApi('/')
const nftRoute = getRouteApi('/nfts/$nftId')

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

export function NftInterimPage() {
  const { nftId } = nftRoute.useParams()
  const query = useNftDetail(nftId)

  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-10 md:px-8 xl:px-[120px]">
      <Link to="/" className="text-sm text-accent">
        Voltar ao catálogo
      </Link>
      {query.isPending ? (
        <div className="mt-8 max-w-md" aria-busy="true">
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="mt-4 h-6 w-2/3" />
          <Skeleton className="mt-2 h-6 w-1/3" />
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
        <article className="mt-8 grid max-w-3xl gap-8 md:grid-cols-[280px_1fr]">
          <img
            src={query.data.imageUrl}
            alt={nftDisplayName(query.data)}
            className="w-full bg-card object-contain"
          />
          <div>
            <h1 className="text-2xl font-bold">{nftDisplayName(query.data)}</h1>
            <p className="mt-3 text-xl font-bold text-accent">{formatEth(query.data.priceEth)}</p>
            <p className="mt-6 text-sm text-secondary">
              A página completa de detalhes entra na próxima etapa.
            </p>
          </div>
        </article>
      ) : null}
    </main>
  )
}
