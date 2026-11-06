import type { ChainId, CategoryId } from '@/shared/constants/catalog'
import type { Nft } from '@/features/catalog/types'

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
}

const seeds: NftSeed[] = [
  { name: 'Emerald Ape', tokenNumber: 42, priceEth: '1.19', category: 'arte-digital', chain: 'ethereum', isNew: true, isTrending: true, trendingScore: 98 },
  { name: 'Sage Nomad', tokenNumber: 9, priceEth: '1.69', category: 'fotografia', chain: 'polygon', isNew: true, isTrending: true, trendingScore: 91 },
  { name: 'Neon Vessel', tokenNumber: 552, priceEth: '1.99', compareAtPriceEth: '2.29', category: 'musica', chain: 'solana', isNew: true, trendingScore: 74, isRare: true },
  { name: 'Cosmic Bloom', tokenNumber: 118, priceEth: '1.29', category: 'arte-3d', chain: 'ethereum', isNew: true, isTrending: true, trendingScore: 88 },
  { name: 'Violet Nomad', tokenNumber: 314, priceEth: '1.39', category: 'colecionaveis', chain: 'polygon', isNew: true, trendingScore: 63 },
  { name: 'Ivory Baron', tokenNumber: 88, priceEth: '1.79', category: 'generativa', chain: 'solana', isNew: true, isTrending: true, trendingScore: 84 },
  { name: 'Golden Beat', tokenNumber: 207, priceEth: '0.99', category: 'jogos', chain: 'ethereum', isNew: true, limitedOffer: true, trendingScore: 79 },
  { name: 'Golden Signal', tokenNumber: 160, priceEth: '0.39', category: 'assinaturas', chain: 'polygon', isNew: true, trendingScore: 57 },
  { name: 'Amber Scout', tokenNumber: 21, priceEth: '2.49', category: 'utilidade', chain: 'solana', isNew: true, isTrending: true, trendingScore: 86 },
  { name: 'Copper Monk', tokenNumber: 11, priceEth: '0.02', category: 'arte-digital', chain: 'ethereum', isNew: true, trendingScore: 41 },
  { name: 'Lunar Piper', tokenNumber: 77, priceEth: '3.40', category: 'fotografia', chain: 'polygon', isNew: true, isTrending: true, trendingScore: 93 },
  { name: 'Moss Captain', tokenNumber: 6, priceEth: '0.75', category: 'musica', chain: 'solana', isNew: true, trendingScore: 52 },
  { name: 'Indigo Drift', tokenNumber: 430, priceEth: '4.20', category: 'arte-3d', chain: 'ethereum', isNew: true, trendingScore: 66 },
  { name: 'Pearl Warden', tokenNumber: 18, priceEth: '5.50', category: 'colecionaveis', chain: 'polygon', isNew: true, isTrending: true, trendingScore: 90 },
  { name: 'Rust Pilot', tokenNumber: 301, priceEth: '0.55', category: 'generativa', chain: 'solana', isNew: true, trendingScore: 48 },
  { name: 'Opal Dancer', tokenNumber: 64, priceEth: '6.80', category: 'jogos', chain: 'ethereum', trendingScore: 71 },
  { name: 'Cedar Oracle', tokenNumber: 12, priceEth: '2.10', category: 'assinaturas', chain: 'polygon', isTrending: true, trendingScore: 82 },
  { name: 'Flint Herald', tokenNumber: 90, priceEth: '7.25', category: 'utilidade', chain: 'solana', trendingScore: 44 },
  { name: 'Jade Courier', tokenNumber: 233, priceEth: '1.05', category: 'arte-digital', chain: 'ethereum', trendingScore: 61 },
  { name: 'Sable Poet', tokenNumber: 8, priceEth: '8.90', category: 'fotografia', chain: 'polygon', isTrending: true, trendingScore: 95 },
  { name: 'Honey Smith', tokenNumber: 144, priceEth: '0.28', category: 'musica', chain: 'solana', trendingScore: 39 },
  { name: 'Plum Archer', tokenNumber: 57, priceEth: '9.40', category: 'arte-3d', chain: 'ethereum', trendingScore: 68 },
  { name: 'Olive Keeper', tokenNumber: 3, priceEth: '1.55', category: 'colecionaveis', chain: 'polygon', isTrending: true, trendingScore: 87 },
  { name: 'Bronze Herald', tokenNumber: 410, priceEth: '10.00', category: 'generativa', chain: 'solana', trendingScore: 54 },
  { name: 'Maple Voyager', tokenNumber: 26, priceEth: '2.80', category: 'jogos', chain: 'ethereum', trendingScore: 73 },
  { name: 'Quartz Miner', tokenNumber: 199, priceEth: '11.20', category: 'assinaturas', chain: 'polygon', trendingScore: 46 },
  { name: 'Cobalt Singer', tokenNumber: 71, priceEth: '0.64', category: 'utilidade', chain: 'solana', isTrending: true, trendingScore: 81 },
  { name: 'Linen Scholar', tokenNumber: 15, priceEth: '3.15', category: 'arte-digital', chain: 'ethereum', trendingScore: 59 },
  { name: 'Marigold Thief', tokenNumber: 508, priceEth: '12.30', category: 'fotografia', chain: 'polygon', trendingScore: 77 },
  { name: 'Pebble Knight', tokenNumber: 34, priceEth: '1.08', category: 'musica', chain: 'solana', trendingScore: 50 },
  { name: 'Cinder Baker', tokenNumber: 122, priceEth: '4.75', category: 'arte-3d', chain: 'ethereum', isTrending: true, trendingScore: 89 },
  { name: 'Willow Ranger', tokenNumber: 2, priceEth: '0.18', category: 'colecionaveis', chain: 'polygon', trendingScore: 36 },
  { name: 'Topaz Fisher', tokenNumber: 276, priceEth: '6.10', category: 'generativa', chain: 'solana', trendingScore: 64 },
  { name: 'Garnet Juggler', tokenNumber: 83, priceEth: '2.02', category: 'jogos', chain: 'ethereum', trendingScore: 70 },
  { name: 'Spruce Alchemist', tokenNumber: 19, priceEth: '7.80', category: 'assinaturas', chain: 'polygon', isTrending: true, trendingScore: 92 },
  { name: 'Nimbus Tailor', tokenNumber: 361, priceEth: '0.91', category: 'utilidade', chain: 'solana', trendingScore: 43 },
  { name: 'Ochre Captain', tokenNumber: 47, priceEth: '5.05', category: 'arte-digital', chain: 'ethereum', trendingScore: 76 },
  { name: 'Saffron Monk', tokenNumber: 128, priceEth: '1.44', category: 'fotografia', chain: 'polygon', trendingScore: 58 },
  { name: 'Basil Herald', tokenNumber: 5, priceEth: '8.15', category: 'musica', chain: 'solana', trendingScore: 67 },
  { name: 'Clove Rider', tokenNumber: 240, priceEth: '3.33', category: 'arte-3d', chain: 'ethereum', isTrending: true, trendingScore: 85 },
  { name: 'Juniper Sage', tokenNumber: 99, priceEth: '0.47', category: 'colecionaveis', chain: 'polygon', trendingScore: 49 },
  { name: 'Pollen Duke', tokenNumber: 14, priceEth: '9.99', category: 'generativa', chain: 'solana', trendingScore: 72 },
  { name: 'Thistle Bard', tokenNumber: 333, priceEth: '2.22', category: 'jogos', chain: 'ethereum', trendingScore: 55 },
  { name: 'Yarrow Pilot', tokenNumber: 60, priceEth: '4.04', category: 'assinaturas', chain: 'polygon', isTrending: true, trendingScore: 80 },
  { name: 'Kelp Nomad', tokenNumber: 27, priceEth: '1.11', category: 'utilidade', chain: 'solana', trendingScore: 62 },
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
}))

export function formatTokenNumber(tokenNumber: number) {
  return `#${String(tokenNumber).padStart(3, '0')}`
}

export function nftDisplayName(nft: Pick<Nft, 'name' | 'tokenNumber'>) {
  return `${nft.name} ${formatTokenNumber(nft.tokenNumber)}`
}
