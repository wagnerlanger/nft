import { Link } from '@tanstack/react-router'

import { useAuth } from '@/features/auth/hooks/use-auth'

export function AccountPage() {
  const { session, isAuthenticated, openAuth } = useAuth()

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
    <main className="mx-auto w-full max-w-[1440px] px-4 py-12 md:px-8 xl:px-[120px]">
      <h1 className="text-3xl font-bold">Perfil do colecionador</h1>
      <p className="mt-3 max-w-xl text-sm text-secondary">
        Olá, {session?.user.displayName}. A edição completa do perfil chega na próxima etapa.
        Por enquanto esta página confirma a sessão autenticada.
      </p>
      <dl className="mt-8 max-w-md space-y-3 text-sm">
        <div className="flex justify-between gap-4 border-b border-border py-2">
          <dt className="text-secondary">Nome de usuário</dt>
          <dd className="font-bold">{session?.user.username}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-border py-2">
          <dt className="text-secondary">E-mail</dt>
          <dd className="font-bold">{session?.user.email}</dd>
        </div>
      </dl>
      <Link to="/" className="mt-8 inline-block text-accent hover:text-primary">
        Voltar ao início
      </Link>
    </main>
  )
}
