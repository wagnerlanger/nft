import Decimal from 'decimal.js'

import type { Nft, NftListResponse } from '@/features/catalog/types'
import { nftFixtures } from '@/mocks/fixtures/nfts'
import { CATEGORIES, CHAINS, PAGE_SIZE } from '@/shared/constants/catalog'
import { parseCategoryList, parseChainList } from '@/shared/utils/catalog-search'
import type { CatalogSearch } from '@/shared/utils/catalog-search'
import { compareEth } from '@/shared/formatters/eth'

export interface CatalogQuery extends CatalogSearch {
  sort: NonNullable<CatalogSearch['sort']> | 'recent'
  tab: NonNullable<CatalogSearch['tab']> | 'all'
  page: number
}

function matches(
  nft: Nft,
  query: CatalogQuery,
  options: { ignoreCategory?: boolean; ignoreChain?: boolean } = {},
) {
  if (query.q) {
    const haystack = `${nft.name} ${nft.tokenNumber}`.toLowerCase()
    if (!haystack.includes(query.q.toLowerCase())) return false
  }

  const categories = parseCategoryList(query.category)
  if (!options.ignoreCategory && categories.length > 0 && !categories.includes(nft.category)) {
    return false
  }

  const chains = parseChainList(query.chain)
  if (!options.ignoreChain && chains.length > 0 && !chains.includes(nft.chain)) return false

  if (query.minPrice && compareEth(nft.priceEth, query.minPrice) < 0) return false
  if (query.maxPrice && compareEth(nft.priceEth, query.maxPrice) > 0) return false
  if (query.tab === 'new' && !nft.isNew) return false
  if (query.tab === 'trending' && !nft.isTrending) return false

  return true
}

function sortNfts(items: Nft[], sort: CatalogQuery['sort']) {
  const next = [...items]
  next.sort((left, right) => {
    if (sort === 'price_asc') return compareEth(left.priceEth, right.priceEth)
    if (sort === 'price_desc') return compareEth(right.priceEth, left.priceEth)
    if (sort === 'trending') return right.trendingScore - left.trendingScore
    return right.listedAt.localeCompare(left.listedAt)
  })
  return next
}

function priceBounds() {
  const prices = nftFixtures.map((nft) => new Decimal(nft.priceEth))
  const min = Decimal.min(...prices)
  const max = Decimal.max(...prices)
  return { min: min.toFixed(2), max: max.toFixed(2) }
}

export function queryCatalog(query: CatalogQuery): NftListResponse {
  const filtered = sortNfts(
    nftFixtures.filter((nft) => matches(nft, query)),
    query.sort ?? 'recent',
  )
  const start = (query.page - 1) * PAGE_SIZE
  const categories = CATEGORIES.map((category) => ({
    id: category.id,
    label: category.label,
    count: nftFixtures.filter(
      (nft) => nft.category === category.id && matches(nft, query, { ignoreCategory: true }),
    ).length,
  }))
  const chains = CHAINS.map((chain) => ({
    id: chain.id,
    label: chain.label,
    count: nftFixtures.filter(
      (nft) => nft.chain === chain.id && matches(nft, query, { ignoreChain: true }),
    ).length,
  }))
  const highlight =
    nftFixtures.find((nft) => nft.limitedOffer && matches(nft, query)) ?? null

  return {
    items: filtered.slice(start, start + PAGE_SIZE),
    page: query.page,
    pageSize: PAGE_SIZE,
    total: filtered.length,
    facets: {
      categories,
      chains,
      price: priceBounds(),
    },
    highlight,
  }
}

export function findNft(id: string) {
  return nftFixtures.find((nft) => nft.id === id) ?? null
}

export function emptyCatalog(query: CatalogQuery): NftListResponse {
  const result = queryCatalog({ ...query, page: 1 })
  return {
    ...result,
    items: [],
    total: 0,
    highlight: null,
    facets: {
      categories: result.facets.categories.map((facet) => ({ ...facet, count: 0 })),
      chains: result.facets.chains.map((facet) => ({ ...facet, count: 0 })),
      price: result.facets.price,
    },
  }
}
