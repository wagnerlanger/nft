import { Link } from '@tanstack/react-router'
import type { FormEvent } from 'react'

import { BrandLogo } from '@/components/brand-logo'
import { CATEGORIES } from '@/shared/constants/catalog'

const profileLinks = ['Meu perfil', 'Minha coleção', 'Atividade', 'Estúdio do criador', 'Lista de interesse']
const helpLinks = ['Central de ajuda', 'Como comprar NFTs', 'Carteira e segurança', 'Política do mercado', 'Denunciar item']
const socials = ['Instagram', 'Facebook', 'X', 'LinkedIn', 'YouTube']

function QuietList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm text-secondary">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

function Mark({ children }: { children: string }) {
  return (
    <span className="grid size-10 place-items-center rounded-full bg-primary text-2xl font-bold text-ink">
      {children}
    </span>
  )
}

export function SiteFooter() {
  function onNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <footer className="mx-auto mt-16 w-full max-w-[1440px] px-4 pb-8 md:px-8 xl:px-[120px]">
      <section className="grid gap-8 rounded-md bg-card p-6 lg:grid-cols-[1fr_1fr_1fr_1.1fr] lg:p-8">
        <article className="flex gap-4">
          <Mark>W</Mark>
          <div>
            <h2 className="text-[17px] font-bold">Segurança da carteira</h2>
            <p className="mt-2 text-sm leading-6 text-secondary">
              Proteja sua carteira e colecione arte digital verificada com confiança.
            </p>
          </div>
        </article>
        <article className="flex gap-4">
          <Mark>C</Mark>
          <div>
            <h2 className="text-[17px] font-bold">Criadores em destaque</h2>
            <p className="mt-2 text-sm leading-6 text-secondary">
              Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.
            </p>
          </div>
        </article>
        <article className="flex gap-4">
          <Mark>D</Mark>
          <div>
            <h2 className="text-[17px] font-bold">Alertas de lançamentos</h2>
            <p className="mt-2 text-sm leading-6 text-secondary">
              Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.
            </p>
          </div>
        </article>
        <form onSubmit={onNewsletterSubmit} className="border-t border-border pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
          <h2 className="text-lg font-bold">Antecipe-se ao próximo lançamento</h2>
          <div className="mt-4 flex items-center gap-3 border-b border-border-soft">
            <label className="sr-only" htmlFor="newsletter-email">
              E-mail
            </label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              placeholder="digite seu e-mail..."
              className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted"
            />
            <button type="submit" className="text-lg font-bold text-accent">
              Enviar
            </button>
          </div>
          <p className="mt-3 text-[13px] leading-5 text-secondary">
            Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
          </p>
        </form>
      </section>

      <div className="mt-8 flex flex-col gap-3 border-b border-border pb-6 text-sm text-secondary md:flex-row md:items-center md:justify-between">
        <BrandLogo />
        <p>
          Feito para colecionadores,
          <br className="md:hidden" /> criadores e cultura
        </p>
        <a href="mailto:contato@email.com" className="hover:text-accent">
          contato@email.com
        </a>
        <a href="tel:+551140028922" className="hover:text-accent">
          +55 11 4002 8922
        </a>
      </div>

      <div className="grid gap-8 py-8 sm:grid-cols-2 lg:grid-cols-4">
        <QuietList title="Meu perfil" items={profileLinks} />
        <QuietList title="Central de ajuda" items={helpLinks} />
        <div>
          <h3 className="text-lg font-bold">Coleções</h3>
          <ul className="mt-4 space-y-2 text-sm text-secondary">
            {CATEGORIES.filter((category) =>
              ['arte-digital', 'fotografia', 'musica', 'arte-3d', 'utilidade'].includes(category.id),
            ).map((category) => (
              <li key={category.id}>
                <Link
                  to="/"
                  search={{ category: category.id }}
                  hash="catalogo"
                  className="hover:text-accent"
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold">Redes sociais</h3>
          <ul className="mt-4 flex flex-wrap gap-3 text-sm text-secondary">
            {socials.map((social) => (
              <li key={social}>{social}</li>
            ))}
          </ul>
          <h3 className="mt-6 text-lg font-bold">Carteiras compatíveis</h3>
          <p className="mt-3 text-[9px] font-bold tracking-wide text-secondary">
            METAMASK • WALLETCONNECT • COINBASE
          </p>
        </div>
      </div>
      <p className="text-center text-sm text-secondary">© 2026 Kurio. Propriedade digital para todos.</p>
    </footer>
  )
}
