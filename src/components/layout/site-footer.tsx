import { Link } from '@tanstack/react-router'
import type { FormEvent } from 'react'

import { BrandLogo } from '@/components/brand-logo'
import { CATEGORIES } from '@/shared/constants/catalog'
import { ImageIcon, MessageIcon, UserIcon } from '../icons'
import { Button } from '../ui/button'

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

function Mark({ children }: { children: React.ReactNode }) {
  return (
    <span className="grid size-16 place-items-center rounded-full bg-primary text-2xl font-bold text-ink">
      {children}
    </span>
  )
}

export function SiteFooter() {
  function onNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <footer className="mx-auto mt-24 w-full max-w-[1440px] px-4 pb-8 md:px-8 xl:px-[120px]">
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 rounded-md bg-card p-8">
        <article className="flex flex-col gap-4 border-r pr-6 border-border">
          <Mark><ImageIcon className="size-6" /></Mark>
          <div>
            <h2 className="text-[17px] font-bold">Segurança da carteira</h2>
            <p className="mt-2 text-sm leading-6 text-secondary">
              Proteja sua carteira e colecione arte digital verificada com confiança.
            </p>
          </div>
        </article>
        <article className="flex flex-col gap-4 border-r pr-6 border-border">
          <Mark><UserIcon className="size-6" /></Mark>
          <div>
            <h2 className="text-[17px] font-bold">Criadores em destaque</h2>
            <p className="mt-2 text-sm leading-6 text-secondary">
              Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.
            </p>
          </div>
        </article>
        <article className="flex flex-col gap-4 border-r pr-6  border-border">
          <Mark><MessageIcon className="size-6" /></Mark>
          <div>
            <h2 className="text-[17px] font-bold">Alertas de lançamentos</h2>
            <p className="mt-2 text-sm leading-6 text-secondary">
              Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.
            </p>
          </div>
        </article>
        <form onSubmit={onNewsletterSubmit} className="border-t border-border pt-6 lg:border-t-0 lg:pt-0">
          <h2 className="text-lg font-bold">Antecipe-se ao próximo lançamento</h2>
          <div className="mt-4 flex items-center gap-3">
            <label className="sr-only" htmlFor="newsletter-email">
              E-mail
            </label>
            <div className="bg-surface-dark rounded-md flex items-center flex-nowrap">
              <input
                id="newsletter-email"
                type="email"
                name="email"
                placeholder="digite seu e-mail..."
                className="h-10 w-full pl-4 bg-transparent text-sm outline-none border-none placeholder:text-muted"
              />
              <Button size="sm" type="submit" className="rounded-l-none h-10">
                Enviar
              </Button>
            </div>

          </div>
          <p className="mt-3 text-[13px] leading-5 text-secondary">
            Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
          </p>
        </form>
      </section>

      <div className="bg-surface-dark grid gap-6 sm:grid-cols-2 lg:grid-cols-4 py-6 px-8 text-sm text-foreground-soft items-center">
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

      <div className="bg-card grid gap-6 p-8 sm:grid-cols-2 lg:grid-cols-4">
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
      <p className="text-center text-sm text-secondary mt-6">© 2026 Kurio. Propriedade digital para todos.</p>
    </footer>
  )
}
