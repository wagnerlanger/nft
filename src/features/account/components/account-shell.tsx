import type { ReactNode } from 'react'

import { AccountSidebar } from '@/features/account/components/account-sidebar'

export function AccountShell({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-10 md:px-8 xl:px-[120px]">
      <div className="flex gap-8 items-start">
        <AccountSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </main>
  )
}
