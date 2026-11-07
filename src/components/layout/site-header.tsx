import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

import { BrandLogo } from '@/components/brand-logo'
import { CartIcon, CloseIcon, EnterIcon, SearchIcon, UserIcon } from '@/components/icons'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { firstNameFromDisplay, useAuth } from '@/features/auth/hooks/use-auth'
import { useCart } from '@/features/cart/hooks/use-cart'
import { revealItemVariants } from '@/shared/motion/variants'
import type { CatalogSearch } from '@/shared/utils/catalog-search'

const quietLinks = ['Criadores', 'Aprenda']

function CartCountBadge({ count }: { count: number }) {
  if (count <= 0) return null
  return (
    <span className="absolute -right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-ink">
      {count > 99 ? '99+' : count}
    </span>
  )
}

function useCatalogQuery() {
  return useRouterState({
    select: (state) => {
      const search = state.location.search as CatalogSearch
      return typeof search.q === 'string' ? search.q : ''
    },
  })
}

export function SiteHeader() {
  const navigate = useNavigate()
  const urlQuery = useCatalogQuery()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const isHome = pathname === '/'
  const isMercado = pathname.startsWith('/nfts/') || pathname === '/cart' || pathname === '/checkout'
  const { isAuthenticated, session, openAuth } = useAuth()
  const cartQuery = useCart()
  const itemCount = cartQuery.data?.itemCount ?? 0
  const prefersReducedMotion = useReducedMotion()
  const [draft, setDraft] = useState(urlQuery)
  const [syncedQuery, setSyncedQuery] = useState(urlQuery)
  const [searchOpen, setSearchOpen] = useState(false)
  const headerVariants = revealItemVariants('down', prefersReducedMotion)

  if (urlQuery !== syncedQuery) {
    setSyncedQuery(urlQuery)
    setDraft(urlQuery)
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const next = draft.trim()
      if (next === urlQuery) return
      void navigate({
        to: '/',
        search: (previous) => ({
          ...previous,
          q: next || undefined,
          page: undefined,
        }),
        replace: true,
        resetScroll: false,
      })
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [draft, navigate, urlQuery])

  const searchField = (
    <Input
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      placeholder="Explorar coleções"
      aria-label="Buscar NFTs"
      className="h-9"
    />
  )

  const accountControl = isAuthenticated && session ? (
    <Button asChild variant="ghost" className="h-9 gap-2 px-2 text-base text-foreground-soft">
      <Link to="/account" aria-label={`Perfil de ${session.user.displayName}`}>
        <UserIcon className="size-6" />
        <span className="hidden sm:inline">{firstNameFromDisplay(session.user.displayName)}</span>
      </Link>
    </Button>
  ) : (
    <Button
      size="sm"
      className="ml-0 inline-flex items-center gap-2 lg:ml-3"
      onClick={() => openAuth('login')}
    >
      <EnterIcon className="size-4" />
      Entrar
    </Button>
  )

  return (
    <motion.header
      className="sticky top-0 z-50 mx-auto w-full max-w-[1440px] px-4 backdrop-blur-lg md:px-8 xl:px-[120px]"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between gap-4 border-border border-b">
        <BrandLogo className="text-sm" />
        <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className={
              isHome
                ? 'border-b-2 border-primary py-5 text-base font-bold text-accent'
                : 'border-b-2 border-transparent py-5 text-base text-foreground-soft hover:text-primary'
            }
            activeOptions={{ exact: true }}
          >
            Início
          </Link>
          <Link
            to="/"
            hash="catalogo"
            className={
              isMercado
                ? 'border-b-2 border-primary py-5 text-base font-bold text-accent'
                : 'border-b-2 border-transparent py-5 text-base text-foreground-soft hover:text-primary'
            }
          >
            Mercado
          </Link>
          {quietLinks.map((label) => (
            <span
              key={label}
              className="cursor-pointer border-b-2 border-transparent py-5 text-base text-foreground-soft hover:text-primary"
            >
              {label}
            </span>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          {searchOpen || urlQuery ? (
            <div className="relative z-2">
              <div className="absolute right-8 w-56">{searchField}</div>
              <Button
                onClick={() => {
                  setDraft('')
                  setSearchOpen(false)
                }}
                variant="ghost"
                className="h-9 px-2 text-base"
                aria-label="Fechar busca"
              >
                <CloseIcon className="size-5" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setSearchOpen(true)}
              variant="ghost"
              className="h-9 px-2 text-base"
              aria-label="Abrir busca"
            >
              <SearchIcon className="size-5" />
            </Button>
          )}
          <Button
            asChild
            variant="ghost"
            className="relative h-9 px-2 text-base"
            data-cart-target
          >
            <Link
              to="/cart"
              aria-label={itemCount > 0 ? `Carrinho, ${itemCount} itens` : 'Carrinho'}
            >
              <CartIcon className="size-6" />
              <CartCountBadge count={itemCount} />
            </Link>
          </Button>
          {accountControl}
        </div>
        <div className="flex items-center gap-3 lg:hidden">
          <Link
            to="/cart"
            className="relative text-foreground-soft"
            aria-label={itemCount > 0 ? `Carrinho, ${itemCount} itens` : 'Carrinho'}
            data-cart-target
          >
            <CartIcon className="size-6" />
            <CartCountBadge count={itemCount} />
          </Link>
          {isAuthenticated && session ? (
            <Link
              to="/account"
              className="inline-flex h-9 items-center gap-2 px-1 text-sm text-foreground-soft"
              aria-label={`Perfil de ${session.user.displayName}`}
            >
              <UserIcon className="size-5" />
              <span>{firstNameFromDisplay(session.user.displayName)}</span>
            </Link>
          ) : (
            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-ink"
              onClick={() => openAuth('login')}
            >
              Entrar
            </button>
          )}
        </div>
      </div>
      <div className="py-3 lg:hidden">{searchField}</div>
      <nav aria-label="Principal mobile" className="flex gap-4 overflow-x-auto pb-3 md:hidden">
        <Link
          to="/"
          className={isHome ? 'text-sm font-bold text-accent' : 'text-sm text-foreground-soft'}
        >
          Início
        </Link>
        <Link
          to="/"
          hash="catalogo"
          className={isMercado ? 'text-sm font-bold text-accent' : 'text-sm text-foreground-soft'}
        >
          Mercado
        </Link>
        {quietLinks.map((label) => (
          <span key={label} className="text-sm text-foreground-soft">
            {label}
          </span>
        ))}
      </nav>
    </motion.header>
  )
}
