import { ArrowRightIcon } from '@/components/icons'

const promos = [
  {
    title: 'Lançamentos gênesis\nde edição limitada',
    body: 'Colecione edições escassas diretamente dos criadores antes da revelação pública.',
  },
  {
    title: 'Arte digital selecionada\ne muito mais',
    body: 'Explore novos artistas, coleções verificadas e obras digitais que definem a cultura.',
  },
]

const posts = [
  {
    date: '12 de setembro  |  Leitura de 6 min',
    title: 'Como funciona a propriedade de NFTs',
    body: 'Aprenda a colecionar, negociar e verificar ativos digitais.',
  },
  {
    date: '13 de setembro  |  Leitura de 2 min',
    title: '10 artistas digitais para acompanhar',
    body: 'Conheça criadores que moldam a cultura digital.',
  },
  {
    date: '15 de setembro  |  Leitura de 3 min',
    title: 'Raridade, atributos e procedência',
    body: 'Entenda raridade, procedência, direitos autorais e utilidade.',
  },
  {
    date: '15 de setembro  |  Leitura de 2 min',
    title: 'Como proteger sua carteira',
    body: 'Proteja sua carteira, seus ativos e sua identidade.',
  },
]

export function PromoBand() {
  return (
    <section aria-label="Chamadas" className="mt-16 grid gap-7 lg:grid-cols-2">
      {promos.map((promo) => (
        <article key={promo.title} className="relative min-h-[250px] overflow-hidden bg-card">
          <img src="/images/nft.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
          <div className="relative flex h-full flex-col justify-end bg-gradient-to-r from-ink/90 to-ink/20 p-6">
            <h2 className="max-w-[18ch] text-lg font-bold whitespace-pre-line">{promo.title}</h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-secondary">{promo.body}</p>
            <a href="#catalogo" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent">
              Explorar
              <ArrowRightIcon className="size-4" />
            </a>
          </div>
        </article>
      ))}
    </section>
  )
}

export function JournalSection() {
  return (
    <section className="mt-16" aria-labelledby="journal-title">
      <h2 id="journal-title" className="text-[28px] font-bold">
        Diário da Cunhagem
      </h2>
      <p className="mt-2 text-sm text-secondary">
        Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {posts.map((post) => (
          <article key={post.title} className="bg-card">
            <img src="/images/nft.png" alt="" className="h-[180px] w-full object-cover" />
            <div className="p-4">
              <p className="text-xs font-medium text-muted">{post.date}</p>
              <h3 className="mt-3 text-base font-bold">{post.title}</h3>
              <p className="mt-2 text-xs leading-5 font-medium text-secondary">{post.body}</p>
              <p className="mt-4 text-xs font-bold text-accent">Ler mais</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
