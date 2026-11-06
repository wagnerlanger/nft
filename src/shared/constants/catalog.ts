export const CATEGORIES = [
  { id: 'arte-digital', label: 'Arte digital' },
  { id: 'fotografia', label: 'Fotografia' },
  { id: 'musica', label: 'Música' },
  { id: 'arte-3d', label: 'Arte 3D' },
  { id: 'colecionaveis', label: 'Colecionáveis' },
  { id: 'generativa', label: 'Generativa' },
  { id: 'jogos', label: 'Jogos' },
  { id: 'assinaturas', label: 'Assinaturas' },
  { id: 'utilidade', label: 'Utilidade' },
] as const

export const CHAINS = [
  { id: 'ethereum', label: 'Ethereum' },
  { id: 'polygon', label: 'Polygon' },
  { id: 'solana', label: 'Solana' },
] as const

export const SORT_OPTIONS = [
  { id: 'recent', label: 'Listados recentemente' },
  { id: 'price_asc', label: 'Menor preço' },
  { id: 'price_desc', label: 'Maior preço' },
  { id: 'trending', label: 'Em alta' },
] as const

export const CATALOG_TABS = [
  { id: 'all', label: 'Todos os NFTs' },
  { id: 'new', label: 'Novos lançamentos' },
  { id: 'trending', label: 'Em alta' },
] as const

export const PAGE_SIZE = 9

export type CategoryId = (typeof CATEGORIES)[number]['id']
export type ChainId = (typeof CHAINS)[number]['id']
export type SortId = (typeof SORT_OPTIONS)[number]['id']
export type CatalogTabId = (typeof CATALOG_TABS)[number]['id']

const categoryIds = new Set<string>(CATEGORIES.map((item) => item.id))
const chainIds = new Set<string>(CHAINS.map((item) => item.id))

export function isCategoryId(value: string): value is CategoryId {
  return categoryIds.has(value)
}

export function isChainId(value: string): value is ChainId {
  return chainIds.has(value)
}
