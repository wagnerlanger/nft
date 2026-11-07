import { createFileRoute } from '@tanstack/react-router'

import { OffersIcon } from '@/components/icons'
import { AccountPlaceholder } from '@/features/account/components/account-placeholder'

export const Route = createFileRoute('/account/offers')({
  component: OffersPage,
})

function OffersPage() {
  return (
    <AccountPlaceholder
      title="Ofertas"
      description="Em breve você poderá acompanhar propostas recebidas e enviadas por aqui."
      icon={OffersIcon}
    />
  )
}
