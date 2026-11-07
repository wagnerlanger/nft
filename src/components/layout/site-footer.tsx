import { Link } from '@tanstack/react-router'
import type { FormEvent, SVGProps } from 'react'

import { BrandLogo } from '@/components/brand-logo'
import { CATEGORIES } from '@/shared/constants/catalog'
import {
  FacebookIcon,
  ImageIcon,
  InstagramIcon,
  LinkedInIcon,
  MessageIcon,
  TwitterIcon,
  UserIcon,
} from '../icons'
import { Button } from '../ui/button'

type FooterLink = { name: string; url: string }
type SocialLink = {
  name: string
  url: string
  icon: (props: SVGProps<SVGSVGElement>) => React.ReactNode
}

const profileLinks: FooterLink[] = [
  { name: 'Meu perfil', url: '/' },
  { name: 'Minha coleção', url: '/' },
  { name: 'Atividade', url: '/' },
  { name: 'Estúdio do criador', url: '/' },
  { name: 'Lista de interesse', url: '/' },
]
const helpLinks: FooterLink[] = [
  { name: 'Central de ajuda', url: '/' },
  { name: 'Como comprar NFTs', url: '/' },
  { name: 'Carteira e segurança', url: '/' },
  { name: 'Política do mercado', url: '/' },
  { name: 'Denunciar item', url: '/' },
]
const socials: SocialLink[] = [
  { name: 'Facebook', url: 'https://facebook.com', icon: FacebookIcon },
  { name: 'Instagram', url: 'https://instagram.com', icon: InstagramIcon },
  { name: 'X', url: 'https://x.com', icon: TwitterIcon },
  { name: 'LinkedIn', url: 'https://linkedin.com', icon: LinkedInIcon },
]
const wallets = ['METAMASK', 'WALLETCONNECT', 'COINBASE']

function QuietList({ title, items }: { title: string; items: FooterLink[] }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm text-secondary">
        {items.map((item) => (
          <li key={item.name}>
            <Link to={item.url} className="hover:text-accent">
              {item.name}
            </Link>
          </li>
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
          <ul className="mt-4 flex flex-wrap gap-3">
            {socials.map((social) => {
              const Icon = social.icon
              return (
                <li key={social.name}>
                  <Button asChild variant="outline" size="sm" className="px-2 text-primary">
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                    >
                      <Icon className="size-4" />
                    </a>
                  </Button>
                </li>
              )
            })}
          </ul>
          <h3 className="mt-6 text-lg font-bold">Carteiras compatíveis</h3>
          <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-soft bg-surface-dark px-4 py-2 text-[9px] font-bold tracking-wide text-primary">
            {wallets.map((wallet, index) => (
              <span key={wallet} className="contents">
                {index > 0 ? <span aria-hidden="true">•</span> : null}
                <span>{wallet}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="text-center text-sm text-secondary mt-6">© 2026 Kurio. Propriedade digital para todos.</p>
    </footer>
  )
}
