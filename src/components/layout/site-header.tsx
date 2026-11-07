import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

import { BrandLogo } from '@/components/brand-logo'
import {
  CartIcon,
  CloseIcon,
  EnterIcon,
  FilterIcon,
  HeartSolidIcon,
  HomeIcon,
  SearchIcon,
  ShopSolidIcon,
  UserIcon,
  UserSolidIcon,
} from '@/components/icons'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { firstNameFromDisplay, useAuth } from '@/features/auth/hooks/use-auth'
import { useCart } from '@/features/cart/hooks/use-cart'
import { useCatalogFiltersUi } from '@/features/catalog/catalog-filters-ui-context'
import { revealItemVariants } from '@/shared/motion/variants'
import type { CatalogSearch } from '@/shared/utils/catalog-search'
import { cn } from '@/shared/utils/cn'

const quietLinks = ['Criadores', 'Aprenda']

export function CartCountBadge({ count }: { count: number }) {
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
  const isFavorito = pathname === '/account/wishlist'
  const isAccount = pathname.startsWith('/account')
  const { isAuthenticated, session, openAuth } = useAuth()
  const { filtersOpen, toggleFilters } = useCatalogFiltersUi()
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
      id="search-nft"
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      placeholder="Explorar coleções"
      aria-label="Buscar NFTs"
      className="h-10 md:h-9 pl-10 md:pl-3 rounded-xl bg-card md:bg-ink-soft md:rounded-md border-transparent md:border-border"
    />
  )

  const accountControl = isAuthenticated && session ? (
    <Button asChild variant="ghost" className="h-9 gap-2 px-2 text-base text-foreground-soft">
      <Link to="/account" aria-label={`Perfil de ${session.user.displayName}`}>
        <UserIcon className="size-6" />
        <span className="hidden lg:inline">{firstNameFromDisplay(session.user.displayName)}</span>
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
    <>
      <motion.header
        className={cn("sticky top-0 z-[60] mx-auto w-full max-w-[1440px] px-4 backdrop-blur-lg md:px-8 xl:px-[120px]", !isHome && 'hidden md:block')}
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="hidden md:flex items-center justify-between gap-4 border-border border-b">
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
          <div className="hidden items-center gap-2 md:flex">
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
        </div>
        <div className="py-3 md:hidden flex items-center gap-2">
          <div className="relative flex-1">
            <label htmlFor="search-nft" className="text-muted absolute left-3 top-1/2 -translate-y-1/2">
              <SearchIcon className="size-5" />
            </label>
            {searchField}
          </div>
          <Button
            className="h-10 w-10 p-0 rounded-xl"
            onClick={toggleFilters}
            aria-label={filtersOpen ? 'Fechar filtros' : 'Abrir filtros'}
            aria-expanded={filtersOpen}
          >
            {filtersOpen ? <CloseIcon className="size-5" /> : <FilterIcon className="size-5" />}
          </Button>
        </div>
      </motion.header>

      <div
        className={cn("md:hidden fixed bottom-0 left-0 right-0 z-[50] mx-auto w-full", (!isHome && !isAccount) && 'hidden')} >
        <div className="bottom-bar">
          <div className="lado esquerdo pl-5 flex items-center justify-around">
            <Button asChild variant="ghost" className={cn('h-9 gap-2 px-2 text-base text-secondary',
              isHome
                ? 'text-primary'
                : 'text-secondary'
            )}>
              <Link to="/">
                <HomeIcon className="size-5" />
              </Link>
            </Button>
            <Button asChild variant="ghost" className={cn('h-9 gap-2 px-2 text-base text-secondary',
              isFavorito
                ? 'text-primary'
                : 'text-secondary'
            )}>
              <Link to="/account/wishlist">
                <HeartSolidIcon className="size-5" />
              </Link>
            </Button>
          </div>
          <svg className="recorte" viewBox="131.15 40 151.7 94.95" aria-hidden="true">
            <path fill="currentColor"
              d="M131.15 40C144.9 40 157.13 48.2 162.98 60.65C170.74 77.18 187.54 88.62 207 88.62C226.46 88.62 243.26 77.17 251.02 60.65C256.87 48.2 269.09 40 282.85 40V134.95H131.15Z" />
          </svg>
          <div className="lado direito pr-5 flex items-center justify-around">
            <Button asChild variant="ghost" className={cn('h-9 gap-2 px-2 text-base text-secondary relative',
              isMercado
                ? 'text-primary'
                : 'text-secondary'
            )}>
              <Link to="/cart">
                <CartCountBadge count={itemCount} />
                <ShopSolidIcon className="size-5" />
              </Link>
            </Button>
            <Button variant="ghost" onClick={() => (isAuthenticated && session) ? navigate({ to: '/account' }) : openAuth('login')} className={cn('h-9 gap-2 px-2 text-base text-secondary',
              isAccount && !isFavorito
                ? 'text-primary'
                : 'text-secondary'
            )}>
                <UserSolidIcon className="size-5" />
            </Button>
          </div>
          <button className="fab">+</button>
        </div>
      </div>

    </>
  )
}
