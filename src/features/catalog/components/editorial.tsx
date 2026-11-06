import { ArrowRightIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

const promos = [
  {
    title: 'Lançamentos gênesis de edição limitada',
    body: 'Colecione edições escassas diretamente dos criadores antes da revelação pública.',
  },
  {
    title: 'Arte digital selecionada e muito mais',
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
    <section aria-label="Chamadas" className="mt-24 grid gap-7 lg:grid-cols-2">
      {promos.map((promo) => (
        <article
          key={promo.title}
          className="relative group flex flex-col rounded-r-lg rounded-l-3xl items-stretch gap-5 bg-card p-5 sm:py-0 sm:pl-0 sm:flex-row sm:items-center"
        >
          <div className="overflow-hidden relative max-w-[50%] transition-transform duration-300 ease-out group-hover:-translate-y-2">
            <div className="absolute border rounded-full border-primary size-60 right-[70%] top-[60%]"></div>
            <div className="absolute border rounded-full border-primary size-60 right-[72%] top-[59%]"></div>
            <img
              src="/images/nft.png"
              alt=""
              className="aspect-square w-full shrink-0 rounded-3xl object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col space-y-3 sm:items-end justify-center sm:text-right py-5">
            <h2 className="text-lg font-bold whitespace-pre-line">{promo.title}</h2>
            <p className="max-w-sm text-sm leading-6 text-secondary">{promo.body}</p>
            <Button asChild size="sm">
              <Link to="/" className="flex gap-2 items-center gap-2 self-end after:absolute after:inset-0 after:z-0 after:content-['']">
              Explorar
              <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
          </div>
        </article>
      ))}
    </section>
  )
}

export function JournalSection() {
  return (
    <section className="mt-24" aria-labelledby="journal-title">
      <h2 id="journal-title" className="text-[28px] font-bold text-center">
        Diário da Cunhagem
      </h2>
      <p className="mt-2 text-sm text-secondary text-center">
        Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {posts.map((post) => (
          <article key={post.title} className="group relative bg-card rounded-lg flex flex-col">
            <div className="overflow-hidden rounded-t-lg">
              <img src="/images/nft.png" alt="" className="h-[195px] rounded-t-lg w-full object-cover group-hover:scale-105 transition-all duration-300 ease-out" />
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <p className="text-xs font-medium text-muted">{post.date}</p>
              <h3 className="mt-3 text-base font-bold">{post.title}</h3>
              <p className="mt-2 text-xs leading-5 font-medium text-secondary">{post.body}</p>
              <Link to="/" className="flex gap-2 pt-4 mt-auto text-xs font-bold text-accent after:absolute after:inset-0 after:z-0 after:content-['']">
                Ler mais
                <ArrowRightIcon className="size-4 group-hover:translate-x-1 transition-all duration-300 ease-out" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
