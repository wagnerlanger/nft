import { createFileRoute } from '@tanstack/react-router'

import { WalletsPage } from '@/features/account/components/wallets-page'

export const Route = createFileRoute('/account/wallets')({
  component: WalletsPage,
})
