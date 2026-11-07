import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { useState, type FormEvent, type SVGProps } from 'react'

import { BrandLogo } from '@/components/brand-logo'
import {
  CloseIcon,
  FacebookIcon,
  ImageIcon,
  InstagramIcon,
  LinkedInIcon,
  MessageIcon,
  TwitterIcon,
  UserIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import { SubmitButton } from '@/components/ui/submit-button'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { newsletterEmailSchema } from '@/features/auth/schemas'
import { CATEGORIES } from '@/shared/constants/catalog'
import { revealItemVariants } from '@/shared/motion/variants'

type FooterLink = { name: string; url: string; profile?: boolean }
type SocialLink = {
  name: string
  url: string
  icon: (props: SVGProps<SVGSVGElement>) => React.ReactNode
}

const profileLinks: FooterLink[] = [
  { name: 'Meu perfil', url: '/account', profile: true },
  { name: 'Minha coleção', url: '/account/wallets', profile: true },
  { name: 'Atividade', url: '/account/activity', profile: true },
  { name: 'Estúdio do criador', url: '/account', profile: true },
  { name: 'Lista de interesse', url: '/account/wishlist', profile: true },
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

function QuietList({
  title,
  items,
  onProfileClick,
  isAuthenticated,
}: {
  title: string
  items: FooterLink[]
  onProfileClick?: () => void
  isAuthenticated?: boolean
}) {
  return (
    <div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm text-secondary">
        {items.map((item) => (
          <li key={item.name}>
            {item.profile && !isAuthenticated ? (
              <button
                type="button"
                className="hover:text-accent"
                onClick={onProfileClick}
              >
                {item.name}
              </button>
            ) : (
              <Link to={item.url} className="hover:text-accent">
                {item.name}
              </Link>
            )}
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

function NewsletterBlock() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [attempted, setAttempted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function validateEmail(value: string) {
    const parsed = newsletterEmailSchema.safeParse({ email: value })
    if (parsed.success) {
      setError(null)
      return true
    }
    setError(parsed.error.issues[0]?.message ?? 'Informe um e-mail válido.')
    return false
  }

  function updateEmail(value: string) {
    setEmail(value)
    if (attempted) validateEmail(value)
  }

  async function onNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAttempted(true)
    if (!validateEmail(email)) return

    setLoading(true)
    await new Promise((resolve) => window.setTimeout(resolve, 1000))
    setLoading(false)
    setSuccess(true)
    setAttempted(false)
    setEmail('')
  }

  function resetNewsletter() {
    setSuccess(false)
    setError(null)
    setAttempted(false)
    setEmail('')
  }

  return (
    <div className="border-t border-border pt-6 lg:border-t-0 lg:pt-0">
      <h2 className="text-lg font-bold">Antecipe-se ao próximo lançamento</h2>
      {success ? (
        <div className="mt-4 space-y-4" role="status">
          <p className="text-sm leading-6 text-secondary">
            Pronto! Você receberá lançamentos selecionados neste e-mail.
          </p>
          <Button type="button" variant="outline" size="sm" className="gap-2" onClick={resetNewsletter}>
            <CloseIcon className="size-4" />
            Fechar
          </Button>
        </div>
      ) : (
        <form onSubmit={onNewsletterSubmit}>
          <div className="mt-4 flex items-center gap-3">
            <label className="sr-only" htmlFor="newsletter-email">
              E-mail
            </label>
            <div className="flex flex-nowrap items-center rounded-md bg-surface-dark">
              <input
                id="newsletter-email"
                type="email"
                name="email"
                value={email}
                onChange={(event) => updateEmail(event.target.value)}
                placeholder="digite seu e-mail..."
                className="h-10 w-full border-none bg-transparent pl-4 text-sm outline-none placeholder:text-muted"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'newsletter-email-error' : undefined}
              />
              <SubmitButton size="sm" loading={loading} className="h-10 rounded-l-none">
                Enviar
              </SubmitButton>
            </div>
          </div>
          {error ? (
            <p id="newsletter-email-error" className="mt-2 text-xs text-destructive">
              {error}
            </p>
          ) : null}
          <p className="mt-3 text-[13px] leading-5 text-secondary">
            Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
          </p>
        </form>
      )}
    </div>
  )
}

export function SiteFooter() {
  const { isAuthenticated, openAuth } = useAuth()
  const prefersReducedMotion = useReducedMotion()
  const footerVariants = revealItemVariants('up', prefersReducedMotion)

  return (
    <motion.footer
      className="mx-auto mt-24 w-full max-w-[1440px] px-4 pb-8 md:px-8 xl:px-[120px]"
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      <section className="grid gap-6 rounded-md bg-card p-8 sm:grid-cols-2 lg:grid-cols-4">
        <article className="flex flex-col gap-4 border-border lg:border-r pr-6">
          <Mark>
            <ImageIcon className="size-6" />
          </Mark>
          <div>
            <h2 className="text-[17px] font-bold">Segurança da carteira</h2>
            <p className="mt-2 text-sm leading-6 text-secondary">
              Proteja sua carteira e colecione arte digital verificada com confiança.
            </p>
          </div>
        </article>
        <article className="flex flex-col gap-4  border-t pt-6 sm:pt-0 sm:border-t-0 border-border lg:border-r lg:pr-6">
          <Mark>
            <UserIcon className="size-6" />
          </Mark>
          <div>
            <h2 className="text-[17px] font-bold">Criadores em destaque</h2>
            <p className="mt-2 text-sm leading-6 text-secondary">
              Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.
            </p>
          </div>
        </article>
        <article className="flex flex-col gap-4 border-t pt-6 lg:pt-0 lg:border-t-0 border-border lg:border-r pr-6">
          <Mark>
            <MessageIcon className="size-6" />
          </Mark>
          <div>
            <h2 className="text-[17px] font-bold">Alertas de lançamentos</h2>
            <p className="mt-2 text-sm leading-6 text-secondary">
              Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.
            </p>
          </div>
        </article>
        <NewsletterBlock />
      </section>

      <div className="grid items-center gap-6 bg-surface-dark px-8 py-6 text-sm text-foreground-soft sm:grid-cols-2 lg:grid-cols-4">
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

      <div className="grid gap-6 bg-card p-8 sm:grid-cols-2 lg:grid-cols-4">
        <QuietList
          title="Meu perfil"
          items={profileLinks}
          isAuthenticated={isAuthenticated}
          onProfileClick={() => openAuth('login')}
        />
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
      <p className="mt-6 text-center text-sm text-secondary">© 2026 Kurio. Propriedade digital para todos.</p>
    </motion.footer>
  )
}
