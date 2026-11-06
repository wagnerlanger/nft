import {
  CATALOG_TABS,
  CHAINS,
  CATEGORIES,
  SORT_OPTIONS,
  type CatalogTabId,
  type ChainId,
  type CategoryId,
  type SortId,
  isCategoryId,
  isChainId,
} from '@/shared/constants/catalog'
import { isDecimalString } from '@/shared/formatters/eth'

export interface CatalogSearch {
  q?: string
  category?: string
  chain?: string
  minPrice?: string
  maxPrice?: string
  sort?: SortId
  tab?: CatalogTabId
  page?: number
}

const sortIds = new Set<string>(SORT_OPTIONS.map((item) => item.id))
const tabIds = new Set<string>(CATALOG_TABS.map((item) => item.id))

function readString(search: Record<string, unknown>, key: string) {
  const value = search[key]
  if (typeof value === 'string') return value
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return undefined
}

function cleanIdList(value: string | undefined, allowed: (value: string) => boolean) {
  if (!value) return undefined
  const ids = value
    .split(',')
    .map((item) => item.trim())
    .filter(allowed)
  return ids.length > 0 ? ids.join(',') : undefined
}

export function parseIdList(value: string | undefined) {
  if (!value) return []
  return value.split(',').filter(Boolean)
}

export function parseCategoryList(value: string | undefined): CategoryId[] {
  return parseIdList(value).filter(isCategoryId)
}

export function parseChainList(value: string | undefined): ChainId[] {
  return parseIdList(value).filter(isChainId)
}

export function toggleCsv(current: string | undefined, id: string) {
  const values = parseIdList(current)
  const next = values.includes(id) ? values.filter((item) => item !== id) : [...values, id]
  return next.length > 0 ? next.join(',') : undefined
}

export function parseCatalogSearch(search: Record<string, unknown>): CatalogSearch {
  const query = readString(search, 'q')?.trim()
  const sort = readString(search, 'sort')
  const tab = readString(search, 'tab')
  const pageRaw = readString(search, 'page')
  const page = pageRaw ? Number(pageRaw) : undefined
  const minPrice = readString(search, 'minPrice')
  const maxPrice = readString(search, 'maxPrice')

  return {
    q: query || undefined,
    category: cleanIdList(readString(search, 'category'), (value) =>
      CATEGORIES.some((item) => item.id === value),
    ),
    chain: cleanIdList(readString(search, 'chain'), (value) =>
      CHAINS.some((item) => item.id === value),
    ),
    minPrice: minPrice && isDecimalString(minPrice) ? minPrice : undefined,
    maxPrice: maxPrice && isDecimalString(maxPrice) ? maxPrice : undefined,
    sort: sort && sortIds.has(sort) ? (sort as SortId) : undefined,
    tab: tab && tabIds.has(tab) ? (tab as CatalogTabId) : undefined,
    page: page && Number.isInteger(page) && page > 1 ? page : undefined,
  }
}

export function parseRouterSearch(searchStr: string): Record<string, string> {
  const normalized = searchStr.startsWith('?') ? searchStr.slice(1) : searchStr
  return Object.fromEntries(new URLSearchParams(normalized))
}

export function stringifyRouterSearch(search: Record<string, unknown>) {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(search)) {
    if (value === undefined || value === null || value === '') continue
    params.set(key, String(value))
  }

  const query = params.toString()
  return query ? `?${query}` : ''
}
