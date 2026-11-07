import type { ChainId, CategoryId } from '@/shared/constants/catalog'
import { CATEGORIES, CHAINS } from '@/shared/constants/catalog'
import type { Nft, NftDetailBlock } from '@/features/catalog/types'

interface NftSeed {
  name: string
  tokenNumber: number
  priceEth: string
  compareAtPriceEth?: string
  category: CategoryId
  chain: ChainId
  isNew?: boolean
  isTrending?: boolean
  trendingScore: number
  limitedOffer?: boolean
  isRare?: boolean
  attributes: string[]
}

const DEFAULT_ATTRIBUTES: Record<CategoryId, string[]> = {
  'arte-digital': ['Óculos', 'Esmeralda', 'Raro'],
  fotografia: ['Filme', 'Nocturno', 'Limitado'],
  musica: ['Loop', 'Analógico', 'Exclusivo'],
  'arte-3d': ['Wireframe', 'Neon', 'Raro'],
  colecionaveis: ['Metal', 'Edição', 'Numerado'],
  generativa: ['Seed', 'Paleta', 'Único'],
  jogos: ['Skin', 'Boost', 'Raro'],
  assinaturas: ['Autógrafo', 'Série', 'Verificado'],
  utilidade: ['Acesso', 'Pass', 'Vitalício'],
}

function categoryLabel(category: CategoryId) {
  return CATEGORIES.find((item) => item.id === category)?.label ?? category
}

function chainLabel(chain: ChainId) {
  return CHAINS.find((item) => item.id === chain)?.label ?? chain
}

function shortDescriptionFor(name: string, category: CategoryId) {
  return `${name} integra a categoria ${categoryLabel(category)}: peça digital com traço autoral, metadados on-chain e prontidão para carteiras compatíveis.`
}

function detailsFor(name: string, category: CategoryId, chain: ChainId): NftDetailBlock[] {
  return [
    {
      body: `${name} foi cunhado para colecionadores que buscam presença visual forte e proveniência clara. Cada edição preserva a intenção do artista e a tipografia Kurio no marketplace.`,
    },
    {
      title: 'Rede',
      body: `Cunhado na ${chainLabel(chain)}, com metadados e mídia referenciados via IPFS. A listagem na Kurio espelha o token e as taxas de rede vigentes no momento da compra.`,
    },
    {
      title: 'Contrato',
      body: 'Royalties do criador de 5% em transferências secundárias.',
    },
    {
      title: 'Direitos autorais',
      body: 'Carteira do criador 0x7A42…19E8. Contrato inteligente ERC-721 verificado.',
    },
    {
      title: `Categoria ${categoryLabel(category)}`,
      body: 'Atributos on-chain e off-chain sincronizados para filtros do catálogo e para a galeria de detalhes.',
    },
  ]
}

const seeds: NftSeed[] = [
  { name: 'Emerald Ape', tokenNumber: 42, priceEth: '1.19', category: 'arte-digital', chain: 'ethereum', isNew: true, isTrending: true, trendingScore: 98, attributes: DEFAULT_ATTRIBUTES['arte-digital'] },
  { name: 'Sage Nomad', tokenNumber: 9, priceEth: '1.69', category: 'fotografia', chain: 'polygon', isNew: true, isTrending: true, trendingScore: 91, attributes: DEFAULT_ATTRIBUTES.fotografia },
  { name: 'Neon Vessel', tokenNumber: 552, priceEth: '1.99', compareAtPriceEth: '2.29', category: 'musica', chain: 'solana', isNew: true, trendingScore: 74, isRare: true, attributes: DEFAULT_ATTRIBUTES.musica },
  { name: 'Cosmic Bloom', tokenNumber: 118, priceEth: '1.29', category: 'arte-3d', chain: 'ethereum', isNew: true, isTrending: true, trendingScore: 88, attributes: DEFAULT_ATTRIBUTES['arte-3d'] },
  { name: 'Violet Nomad', tokenNumber: 314, priceEth: '1.39', category: 'colecionaveis', chain: 'polygon', isNew: true, trendingScore: 63, attributes: DEFAULT_ATTRIBUTES.colecionaveis },
  { name: 'Ivory Baron', tokenNumber: 88, priceEth: '1.79', category: 'generativa', chain: 'solana', isNew: true, isTrending: true, trendingScore: 84, attributes: DEFAULT_ATTRIBUTES.generativa },
  { name: 'Golden Beat', tokenNumber: 207, priceEth: '0.99', category: 'jogos', chain: 'ethereum', isNew: true, limitedOffer: true, trendingScore: 79, attributes: DEFAULT_ATTRIBUTES.jogos },
  { name: 'Golden Signal', tokenNumber: 160, priceEth: '0.39', category: 'assinaturas', chain: 'polygon', isNew: true, trendingScore: 57, attributes: DEFAULT_ATTRIBUTES.assinaturas },
  { name: 'Amber Scout', tokenNumber: 21, priceEth: '2.49', category: 'utilidade', chain: 'solana', isNew: true, isTrending: true, trendingScore: 86, attributes: DEFAULT_ATTRIBUTES.utilidade },
  { name: 'Copper Monk', tokenNumber: 11, priceEth: '0.02', category: 'arte-digital', chain: 'ethereum', isNew: true, trendingScore: 41, attributes: ['Cobre', 'Monge', 'Comum'] },
  { name: 'Lunar Piper', tokenNumber: 77, priceEth: '3.40', category: 'fotografia', chain: 'polygon', isNew: true, isTrending: true, trendingScore: 93, attributes: DEFAULT_ATTRIBUTES.fotografia },
  { name: 'Moss Captain', tokenNumber: 6, priceEth: '0.75', category: 'musica', chain: 'solana', isNew: true, trendingScore: 52, attributes: DEFAULT_ATTRIBUTES.musica },
  { name: 'Indigo Drift', tokenNumber: 430, priceEth: '4.20', category: 'arte-3d', chain: 'ethereum', isNew: true, trendingScore: 66, attributes: DEFAULT_ATTRIBUTES['arte-3d'] },
  { name: 'Pearl Warden', tokenNumber: 18, priceEth: '5.50', category: 'colecionaveis', chain: 'polygon', isNew: true, isTrending: true, trendingScore: 90, attributes: DEFAULT_ATTRIBUTES.colecionaveis },
  { name: 'Rust Pilot', tokenNumber: 301, priceEth: '0.55', category: 'generativa', chain: 'solana', isNew: true, trendingScore: 48, attributes: DEFAULT_ATTRIBUTES.generativa },
  { name: 'Opal Dancer', tokenNumber: 64, priceEth: '6.80', category: 'jogos', chain: 'ethereum', trendingScore: 71, attributes: DEFAULT_ATTRIBUTES.jogos },
  { name: 'Cedar Oracle', tokenNumber: 12, priceEth: '2.10', category: 'assinaturas', chain: 'polygon', isTrending: true, trendingScore: 82, attributes: DEFAULT_ATTRIBUTES.assinaturas },
  { name: 'Flint Herald', tokenNumber: 90, priceEth: '7.25', category: 'utilidade', chain: 'solana', trendingScore: 44, attributes: DEFAULT_ATTRIBUTES.utilidade },
  { name: 'Jade Courier', tokenNumber: 233, priceEth: '1.05', category: 'arte-digital', chain: 'ethereum', trendingScore: 61, attributes: ['Jade', 'Mensageiro', 'Raro'] },
  { name: 'Sable Poet', tokenNumber: 8, priceEth: '8.90', category: 'fotografia', chain: 'polygon', isTrending: true, trendingScore: 95, attributes: DEFAULT_ATTRIBUTES.fotografia },
  { name: 'Honey Smith', tokenNumber: 144, priceEth: '0.28', category: 'musica', chain: 'solana', trendingScore: 39, attributes: DEFAULT_ATTRIBUTES.musica },
  { name: 'Plum Archer', tokenNumber: 57, priceEth: '9.40', category: 'arte-3d', chain: 'ethereum', trendingScore: 68, attributes: DEFAULT_ATTRIBUTES['arte-3d'] },
  { name: 'Olive Keeper', tokenNumber: 3, priceEth: '1.55', category: 'colecionaveis', chain: 'polygon', isTrending: true, trendingScore: 87, attributes: DEFAULT_ATTRIBUTES.colecionaveis },
  { name: 'Bronze Herald', tokenNumber: 410, priceEth: '10.00', category: 'generativa', chain: 'solana', trendingScore: 54, attributes: DEFAULT_ATTRIBUTES.generativa },
  { name: 'Maple Voyager', tokenNumber: 26, priceEth: '2.80', category: 'jogos', chain: 'ethereum', trendingScore: 73, attributes: DEFAULT_ATTRIBUTES.jogos },
  { name: 'Quartz Miner', tokenNumber: 199, priceEth: '11.20', category: 'assinaturas', chain: 'polygon', trendingScore: 46, attributes: DEFAULT_ATTRIBUTES.assinaturas },
  { name: 'Cobalt Singer', tokenNumber: 71, priceEth: '0.64', category: 'utilidade', chain: 'solana', isTrending: true, trendingScore: 81, attributes: DEFAULT_ATTRIBUTES.utilidade },
  { name: 'Linen Scholar', tokenNumber: 15, priceEth: '3.15', category: 'arte-digital', chain: 'ethereum', trendingScore: 59, attributes: ['Linho', 'Sábio', 'Comum'] },
  { name: 'Marigold Thief', tokenNumber: 508, priceEth: '12.30', category: 'fotografia', chain: 'polygon', trendingScore: 77, attributes: DEFAULT_ATTRIBUTES.fotografia },
  { name: 'Pebble Knight', tokenNumber: 34, priceEth: '1.08', category: 'musica', chain: 'solana', trendingScore: 50, attributes: DEFAULT_ATTRIBUTES.musica },
  { name: 'Cinder Baker', tokenNumber: 122, priceEth: '4.75', category: 'arte-3d', chain: 'ethereum', isTrending: true, trendingScore: 89, attributes: DEFAULT_ATTRIBUTES['arte-3d'] },
  { name: 'Willow Ranger', tokenNumber: 2, priceEth: '0.18', category: 'colecionaveis', chain: 'polygon', trendingScore: 36, attributes: DEFAULT_ATTRIBUTES.colecionaveis },
  { name: 'Topaz Fisher', tokenNumber: 276, priceEth: '6.10', category: 'generativa', chain: 'solana', trendingScore: 64, attributes: DEFAULT_ATTRIBUTES.generativa },
  { name: 'Garnet Juggler', tokenNumber: 83, priceEth: '2.02', category: 'jogos', chain: 'ethereum', trendingScore: 70, attributes: DEFAULT_ATTRIBUTES.jogos },
  { name: 'Spruce Alchemist', tokenNumber: 19, priceEth: '7.80', category: 'assinaturas', chain: 'polygon', isTrending: true, trendingScore: 92, attributes: DEFAULT_ATTRIBUTES.assinaturas },
  { name: 'Nimbus Tailor', tokenNumber: 361, priceEth: '0.91', category: 'utilidade', chain: 'solana', trendingScore: 43, attributes: DEFAULT_ATTRIBUTES.utilidade },
  { name: 'Ochre Captain', tokenNumber: 47, priceEth: '5.05', category: 'arte-digital', chain: 'ethereum', trendingScore: 76, attributes: ['Ocre', 'Capitão', 'Raro'] },
  { name: 'Saffron Monk', tokenNumber: 128, priceEth: '1.44', category: 'fotografia', chain: 'polygon', trendingScore: 58, attributes: DEFAULT_ATTRIBUTES.fotografia },
  { name: 'Basil Herald', tokenNumber: 5, priceEth: '8.15', category: 'musica', chain: 'solana', trendingScore: 67, attributes: DEFAULT_ATTRIBUTES.musica },
  { name: 'Clove Rider', tokenNumber: 240, priceEth: '3.33', category: 'arte-3d', chain: 'ethereum', isTrending: true, trendingScore: 85, attributes: DEFAULT_ATTRIBUTES['arte-3d'] },
  { name: 'Juniper Sage', tokenNumber: 99, priceEth: '0.47', category: 'colecionaveis', chain: 'polygon', trendingScore: 49, attributes: DEFAULT_ATTRIBUTES.colecionaveis },
  { name: 'Pollen Duke', tokenNumber: 14, priceEth: '9.99', category: 'generativa', chain: 'solana', trendingScore: 72, attributes: DEFAULT_ATTRIBUTES.generativa },
  { name: 'Thistle Bard', tokenNumber: 333, priceEth: '2.22', category: 'jogos', chain: 'ethereum', trendingScore: 55, attributes: DEFAULT_ATTRIBUTES.jogos },
  { name: 'Yarrow Pilot', tokenNumber: 60, priceEth: '4.04', category: 'assinaturas', chain: 'polygon', isTrending: true, trendingScore: 80, attributes: DEFAULT_ATTRIBUTES.assinaturas },
  { name: 'Kelp Nomad', tokenNumber: 27, priceEth: '1.11', category: 'utilidade', chain: 'solana', trendingScore: 62, attributes: DEFAULT_ATTRIBUTES.utilidade },
]

const newestListing = Date.parse('2026-11-06T12:00:00.000Z')
const day = 86_400_000

function slugify(name: string, tokenNumber: number) {
  const slug = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return `${slug}-${String(tokenNumber).padStart(3, '0')}`
}

export const nftFixtures: Nft[] = seeds.map((seed, index) => ({
  id: slugify(seed.name, seed.tokenNumber),
  name: seed.name,
  tokenNumber: seed.tokenNumber,
  imageUrl: '/images/nft.png',
  priceEth: seed.priceEth,
  compareAtPriceEth: seed.compareAtPriceEth ?? null,
  category: seed.category,
  chain: seed.chain,
  listedAt: new Date(newestListing - index * day).toISOString(),
  isNew: seed.isNew ?? false,
  isTrending: seed.isTrending ?? false,
  trendingScore: seed.trendingScore,
  limitedOffer: seed.limitedOffer ?? false,
  isRare: seed.isRare ?? false,
  shortDescription: shortDescriptionFor(seed.name, seed.category),
  details: detailsFor(seed.name, seed.category, seed.chain),
  attributes: seed.attributes,
}))

export function formatTokenNumber(tokenNumber: number) {
  return `#${String(tokenNumber).padStart(3, '0')}`
}

export function nftDisplayName(nft: Pick<Nft, 'name' | 'tokenNumber'>) {
  return `${nft.name} ${formatTokenNumber(nft.tokenNumber)}`
}
