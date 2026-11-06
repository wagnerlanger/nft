import type { CatalogTabId, ChainId, CategoryId, SortId } from '@/shared/constants/catalog'

export interface Nft {
  id: string
  name: string
  tokenNumber: number
  imageUrl: string
  priceEth: string
  compareAtPriceEth: string | null
  category: CategoryId
  chain: ChainId
  listedAt: string
  isNew: boolean
  isTrending: boolean
  trendingScore: number
  limitedOffer: boolean
  isRare: boolean
}

export interface CatalogFacet {
  id: string
  label: string
  count: number
}

export interface NftListParams {
  q?: string
  category?: string
  chain?: string
  minPrice?: string
  maxPrice?: string
  sort: SortId
  tab: CatalogTabId
  page: number
}

export interface NftListResponse {
  items: Nft[]
  page: number
  pageSize: number
  total: number
  facets: {
    categories: CatalogFacet[]
    chains: CatalogFacet[]
    price: {
      min: string
      max: string
    }
  }
  highlight: Nft | null
}

export interface ApiErrorBody {
  message: string
  code: string
}
