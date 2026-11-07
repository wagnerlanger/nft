import { createFileRoute } from '@tanstack/react-router'

import { AccountLayoutPage } from '@/features/account/pages'

export const Route = createFileRoute('/account')({
  component: AccountLayoutPage,
})
