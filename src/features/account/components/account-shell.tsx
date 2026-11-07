import { useState, type ReactNode } from 'react'

import { AccountSidebar } from '@/features/account/components/account-sidebar'
import { Button } from '@/components/ui/button'
import { CartBreadcrumbs } from '@/features/cart/components/cart-breadcrumbs'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { ChevronRightIcon, CloseIcon, MenuIcon } from '@/components/icons'
import { useHandleBack } from '../hooks/use-handle-back'

export function AccountShell({ children }: { children: ReactNode }) {
  const handleBack = useHandleBack()
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 pb-8 md:px-8 md:py-10 xl:px-[120px] md:bg-transparent">
      <div className="hidden md:block">
        <CartBreadcrumbs />
      </div>

      <div className="flex items-center md:hidden sticky top-0 bg-background z-50 -mx-4 px-4 pt-8 pb-2 gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleBack()}
          className="border-border rounded-full px-2 text-muted bg-card"
        >
          <ChevronRightIcon className="size-5 -scale-x-100" />
        </Button>
        <h2 className="text-lg font-bold text-foreground flex-1 text-center">Meu Perfil</h2>
        <Button
            className="h-10 w-10 p-0 rounded-xl"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </Button>
      </div>
      <div className="flex gap-8 items-start">
        <AccountSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent aria-describedby={undefined} className="z-[100] w-full max-w-[calc(100%-4rem)]">
          <SheetTitle className="text-lg font-bold">
            <div className="flex justify-between pb-3">
              <h2 className="text-lg font-bold">Meu Perfil</h2>
            </div>
          </SheetTitle>
          <AccountSidebar onlyMenu onNavigate={() => setMenuOpen(false)} />
        </SheetContent>
      </Sheet>
    </main>
  )
}
