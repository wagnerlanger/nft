import { Outlet } from '@tanstack/react-router'

import { AccountShell } from '@/features/account/components/account-shell'
import { useAuth } from '@/features/auth/hooks/use-auth'

export function AccountLayoutPage() {
  const { isAuthenticated, openAuth } = useAuth()

  if (!isAuthenticated) {
    return (
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Perfil do colecionador</h1>
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
      </main>
    )
  }

  return (
    <AccountShell>
      <Outlet />
    </AccountShell>
  )
}
