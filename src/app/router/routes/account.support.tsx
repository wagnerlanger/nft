import { createFileRoute } from '@tanstack/react-router'

import { SectionTitlePage } from '@/features/account/components/section-title-page'

export const Route = createFileRoute('/account/support')({
  component: SupportPage,
})

function SupportPage() {
  return <SectionTitlePage title="Suporte" />
}
