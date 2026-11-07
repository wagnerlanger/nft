import { Link, Outlet } from '@tanstack/react-router'

import { AccountShell } from '@/features/account/components/account-shell'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { ChevronRightIcon } from '@/components/icons'
import { useHandleBack } from './hooks/use-handle-back'

export function AccountLayoutPage() {
  const { isAuthenticated, openAuth } = useAuth()
  const handleBack = useHandleBack()

  if (!isAuthenticated) {
    return (
      <main className="mx-auto w-full max-w-[1440px] px-4 pb-8 md:px-8 md:py-10 xl:px-[120px] md:bg-transparent">
        <div className="flex items-center md:hidden sticky top-0 bg-background z-10 -mx-4 px-4 pt-8 pb-2 gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBack()}
            className="border-border rounded-full px-2 text-muted bg-card"
          >
            <ChevronRightIcon className="size-5 -scale-x-100" />
          </Button>
          <h2 className="text-lg font-bold text-foreground flex-1 text-center pr-12">
            Perfil do colecionador
          </h2>

        </div>
        <div className="py-24 text-center">
          <p className="mt-3 text-sm text-secondary">
            Entre na sua conta para gerenciar dados, carteiras e preferências.
          </p>
          <button
            type="button"
            className="mt-6 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-bold text-ink"
            onClick={() => openAuth('login')}
          >
            Entrar
          </button>
        </div>
      </main>
    )
  }

  return (
    <AccountShell>
      <Outlet />
    </AccountShell>
  )
}
