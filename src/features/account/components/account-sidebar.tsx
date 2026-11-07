import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import type { SVGProps } from 'react'

import {
  CartIcon,
  DangerTriangleIcon,
  DownloadIcon,
  HeartIcon,
  LocationIcon,
  LogoutIcon,
  OffersIcon,
  UserIcon,
} from '@/components/icons'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { cn } from '@/shared/utils/cn'

type NavItem = {
  label: string
  to:
  | '/account'
  | '/account/wallets'
  | '/account/activity'
  | '/account/wishlist'
  | '/account/offers'
  | '/account/downloads'
  | '/account/support'
  icon: (props: SVGProps<SVGSVGElement>) => React.ReactNode
  exact?: boolean
}

const navItems: NavItem[] = [
  { label: 'Dados do perfil', to: '/account', icon: UserIcon, exact: true },
  { label: 'Carteiras', to: '/account/wallets', icon: LocationIcon },
  { label: 'Atividade', to: '/account/activity', icon: CartIcon },
  { label: 'Lista de interesse', to: '/account/wishlist', icon: HeartIcon },
  { label: 'Ofertas', to: '/account/offers', icon: OffersIcon },
  { label: 'Arquivos baixados', to: '/account/downloads', icon: DownloadIcon },
  { label: 'Suporte', to: '/account/support', icon: DangerTriangleIcon },
]

function isActivePath(pathname: string, to: NavItem['to'], exact?: boolean) {
  if (exact) return pathname === to
  return pathname === to || pathname.startsWith(`${to}/`)
}

export function AccountSidebar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const navigate = useNavigate()
  const { logout } = useAuth()

  async function handleLogout() {
    await logout()
    void navigate({ to: '/' })
  }

  return (
    <aside className="bg-card pt-4 min-w-[240px] lg:min-w-[310px]">
      <h2 className="pl-2 text-sm font-bold tracking-wide text-foreground">Meu perfil</h2>
      <nav aria-label="Menu do perfil" className="mt-4 space-y-0.5">
        {navItems.map((item) => {
          const active = isActivePath(pathname, item.to, item.exact)
          const Icon = item.icon
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'relative flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors text-primary',
                active
                  ? 'font-bold'
                  : 'hover:text-foreground',
              )}
              aria-current={active ? 'page' : undefined}
            >
              {active ? (
                <span
                  aria-hidden
                  className="absolute top-0 bottom-0 left-0 w-1 bg-primary"
                />
              ) : null}
              <Icon className={cn("size-4 shrink-0 text-muted", active ? 'text-primary' : '')} />
              <span>{item.label}</span>
            </Link>
          )
        })}
        <div className="border-t border-border">
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="cursor-pointer relative flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-primary transition-colors hover:text-foreground"
          >
            <LogoutIcon className="size-4 shrink-0 text-muted" />
            <span>Sair</span>
          </button>
        </div>

      </nav>
    </aside>
  )
}
