export interface NftReview {
  id: string
  author: string
  rating: number
  body: string
  createdAt: string
}

export const collectorReviews: NftReview[] = [
  {
    id: 'rev-1',
    author: 'Ana Colecionadora',
    rating: 5,
    body: 'Entrega visual impecável e metadados claros. A peça ficou ótima na vitrine da carteira.',
    createdAt: '2026-10-28T14:20:00.000Z',
  },
  {
    id: 'rev-2',
    author: 'Bruno Curator',
    rating: 5,
    body: 'Royalties e contrato transparentes. Comprei a edição aberta sem atrito no fluxo da Kurio.',
    createdAt: '2026-10-22T09:05:00.000Z',
  },
  {
    id: 'rev-3',
    author: 'Clara Mint',
    rating: 4,
    body: 'Adorei a tipografia e o contraste. Só senti falta de mais ângulos na galeria — mas a arte principal já vende sozinha.',
    createdAt: '2026-10-18T18:40:00.000Z',
  },
  {
    id: 'rev-4',
    author: 'Diego Vault',
    rating: 5,
    body: 'Atributos raros batem com o que estava listado. Experiência de compra rápida e previsível.',
    createdAt: '2026-10-12T11:15:00.000Z',
  },
  {
    id: 'rev-5',
    author: 'Elena Drop',
    rating: 4,
    body: 'Boa relação preço/presença. O detalhe on-chain e o IPFS passaram confiança na verificação.',
    createdAt: '2026-10-05T16:50:00.000Z',
  },
  {
    id: 'rev-6',
    author: 'Felipe Chain',
    rating: 5,
    body: 'Coleção coerente e peça com personalidade. Voltaria a comprar outra edição desta série.',
    createdAt: '2026-09-29T08:30:00.000Z',
  },
  {
    id: 'rev-7',
    author: 'Gina Ledger',
    rating: 5,
    body: 'Favoritei no catálogo e finalizei no detalhe. O fluxo de autenticação e carrinho funcionou de primeira.',
    createdAt: '2026-09-21T20:10:00.000Z',
  },
  {
    id: 'rev-8',
    author: 'Hugo Node',
    rating: 4,
    body: 'Estrelas altas pelo acabamento e pela clareza do texto técnico. Recomendo para quem entra no mercado agora.',
    createdAt: '2026-09-14T13:00:00.000Z',
  },
  {
    id: 'rev-9',
    author: 'Iris Token',
    rating: 5,
    body: 'A edição 1/50 estava aberta e o checkout simulado foi direto. Visual fiel ao que eu esperava do print.',
    createdAt: '2026-09-08T10:45:00.000Z',
  },
  {
    id: 'rev-10',
    author: 'João Gas',
    rating: 5,
    body: 'Cinco estrelas pela curadoria Kurio. A peça se destaca na grade e no detalhe ampliado.',
    createdAt: '2026-09-01T19:25:00.000Z',
  },
  {
    id: 'rev-11',
    author: 'Karina Block',
    rating: 4,
    body: 'Descrição rica e atributos úteis. Avalio bem a transparência de rede e royalties.',
    createdAt: '2026-08-24T15:35:00.000Z',
  },
  {
    id: 'rev-12',
    author: 'Leo Sparse',
    rating: 5,
    body: 'Compartilhei com a galera do Discord — todo mundo pediu o link. Arte forte e preço justo.',
    createdAt: '2026-08-16T12:00:00.000Z',
  },
  {
    id: 'rev-13',
    author: 'Maya Orbit',
    rating: 5,
    body: 'Galeria com zoom ajuda a conferir textura. Experiência de detalhe no nível do Figma.',
    createdAt: '2026-08-09T17:20:00.000Z',
  },
  {
    id: 'rev-14',
    author: 'Nico Frame',
    rating: 4,
    body: 'Quatro estrelas sólidas. Gostaria de ver histórico de ofertas no futuro, mas o essencial está aqui.',
    createdAt: '2026-08-02T09:55:00.000Z',
  },
  {
    id: 'rev-15',
    author: 'Olívia Seed',
    rating: 5,
    body: 'A coleção faz sentido como conjunto. Este token foi o primeiro que adicionei aos favoritos.',
    createdAt: '2026-07-26T21:05:00.000Z',
  },
  {
    id: 'rev-16',
    author: 'Paulo Render',
    rating: 5,
    body: 'Compra sem surpresa de taxa na simulação. Texto de detalhes bem escrito e útil.',
    createdAt: '2026-07-18T14:40:00.000Z',
  },
  {
    id: 'rev-17',
    author: 'Queila Mint',
    rating: 4,
    body: 'Bom equilíbrio entre raridade e acessibilidade. As estrelas refletem a confiança na listagem.',
    createdAt: '2026-07-11T11:25:00.000Z',
  },
  {
    id: 'rev-18',
    author: 'Rafael Hash',
    rating: 5,
    body: 'Perfeito para quem quer um ape com presença. Metadados e atributos batem 100%.',
    createdAt: '2026-07-03T16:15:00.000Z',
  },
  {
    id: 'rev-19',
    author: 'Sofia Curve',
    rating: 5,
    body: 'Avaliação máxima: UI clara, arte forte e fluxo de favoritar/carrinho confiável.',
    createdAt: '2026-06-27T08:50:00.000Z',
  },
]

export function averageReviewRating(reviews: NftReview[]) {
  if (reviews.length === 0) return 0
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
  return Math.round(sum / reviews.length)
}
