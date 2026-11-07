import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { BrandLogo } from '@/components/brand-logo'
import { CartIcon, CloseIcon, EnterIcon, SearchIcon } from '@/components/icons'
import { Input } from '@/components/ui/input'
import type { CatalogSearch } from '@/shared/utils/catalog-search'
import { Button } from '../ui/button'

const quietLinks = ['Criadores', 'Aprenda']

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
  const [draft, setDraft] = useState(urlQuery)
  const [syncedQuery, setSyncedQuery] = useState(urlQuery)
  const [searchOpen, setSearchOpen] = useState(false)

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

  return (
    <header className="sticky top-0 z-50 mx-auto w-full max-w-[1440px] px-4 md:px-8 xl:px-[120px] backdrop-blur-lg">
      <div className="flex items-center justify-between gap-4 border-border border-b">
        <BrandLogo className="text-sm" />
        <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="border-b-2 border-primary py-5 text-base font-bold text-accent"
            activeOptions={{ exact: true }}
          >
            Início
          </Link>
          <a href="#catalogo" className="border-b-2 border-transparent py-5 text-base text-foreground-soft hover:text-primary">
            Mercado
          </a>
          {quietLinks.map((label) => (
            <span key={label} className="border-b-2 cursor-pointer border-transparent py-5 text-base text-foreground-soft hover:text-primary">
              {label}
            </span>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          {searchOpen || urlQuery ? (
            <div className="relative z-2">
              <div className="w-56 absolute right-8">{searchField}</div>
              <Button
                onClick={() => { setDraft(""); setSearchOpen(false); }}
                variant="ghost" className="h-9 px-2 text-base" aria-label="Fechar busca">
                <CloseIcon className="size-5" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setSearchOpen(true)}
              variant="ghost" className="h-9 px-2 text-base" aria-label="Abrir busca">
              <SearchIcon className="size-5" />
            </Button>
          )}
          <Button variant="ghost" className="h-9 px-2 text-base" aria-label="Carrinho">
            <CartIcon className="size-6" />
          </Button>
          <Button size="sm" className="ml-3 inline-flex items-center gap-2">
            <EnterIcon className="size-4" />
            Entrar
          </Button>
        </div>
        <div className="flex items-center gap-3 lg:hidden">
          <button type="button" className="text-foreground-soft" aria-label="Carrinho">
            <CartIcon className="size-6" />
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-ink"
          >
            Entrar
          </button>
        </div>
      </div>
      <div className="py-3 lg:hidden">{searchField}</div>
      <nav aria-label="Principal mobile" className="flex gap-4 overflow-x-auto pb-3 md:hidden">
        <Link to="/" className="text-sm font-bold text-accent">
          Início
        </Link>
        <a href="#catalogo" className="text-sm text-foreground-soft">
          Mercado
        </a>
        {quietLinks.map((label) => (
          <span key={label} className="text-sm text-foreground-soft">
            {label}
          </span>
        ))}
      </nav>
    </header>
  )
}
