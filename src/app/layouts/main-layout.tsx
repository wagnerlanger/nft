import { Link, Outlet } from '@tanstack/react-router'

import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthModal } from '@/features/auth/components/auth-modal'
import { AuthProvider } from '@/features/auth/auth-context'
import { CatalogFiltersUiProvider } from '@/features/catalog/catalog-filters-ui-context'

export function MainLayout() {
  return (
    <AuthProvider>
      <CatalogFiltersUiProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background text-foreground pb-[100px] md:pb-0">
            <a
              href="#content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:px-3 focus:py-2 focus:text-ink"
            >
              Ir para o conteúdo
            </a>
            <SiteHeader />
            <div id="content">
              <Outlet />
            </div>
            <SiteFooter />
            <AuthModal />
          </div>
        </TooltipProvider>
      </CatalogFiltersUiProvider>
    </AuthProvider>
  )
}

export function NotFoundPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Página não encontrada</h1>
      <p className="mt-3 text-sm text-secondary">Esse endereço não faz parte do marketplace.</p>
      <Link to="/" className="mt-6 inline-block text-accent">
        Voltar ao início
      </Link>
    </main>
  )
}
