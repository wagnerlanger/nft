import { createFileRoute } from '@tanstack/react-router'

import { MessageIcon } from '@/components/icons'
import { AccountPlaceholder } from '@/features/account/components/account-placeholder'

export const Route = createFileRoute('/account/support')({
  component: SupportPage,
})

function SupportPage() {
  return (
    <AccountPlaceholder
      title="Suporte"
      description="A central de ajuda está em construção. Em breve você poderá abrir chamados por aqui."
      icon={MessageIcon}
    />
  )
}
