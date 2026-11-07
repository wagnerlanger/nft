import { createFileRoute } from '@tanstack/react-router'

import { ActivityList } from '@/features/account/components/activity-list'

export const Route = createFileRoute('/account/activity')({
  component: ActivityList,
})
