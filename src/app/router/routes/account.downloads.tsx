import { createFileRoute } from '@tanstack/react-router'

import { SectionTitlePage } from '@/features/account/components/section-title-page'

export const Route = createFileRoute('/account/downloads')({
  component: DownloadsPage,
})

function DownloadsPage() {
  return <SectionTitlePage title="Arquivos baixados" />
}
