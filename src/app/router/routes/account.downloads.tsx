import { createFileRoute } from '@tanstack/react-router'

import { DownloadIcon } from '@/components/icons'
import { AccountPlaceholder } from '@/features/account/components/account-placeholder'

export const Route = createFileRoute('/account/downloads')({
  component: DownloadsPage,
})

function DownloadsPage() {
  return (
    <AccountPlaceholder
      title="Arquivos baixados"
      description="Seus downloads de NFTs aparecerão aqui quando estiverem disponíveis."
      icon={DownloadIcon}
    />
  )
}
