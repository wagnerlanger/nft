import { createFileRoute } from '@tanstack/react-router'

import { SectionTitlePage } from '@/features/account/components/section-title-page'

export const Route = createFileRoute('/account/offers')({
  component: OffersPage,
})

function OffersPage() {
  return <SectionTitlePage title="Ofertas" />
}
