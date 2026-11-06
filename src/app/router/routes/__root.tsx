import { createRootRoute } from '@tanstack/react-router'

import { MainLayout, NotFoundPage } from '@/app/layouts/main-layout'

export const Route = createRootRoute({
  component: MainLayout,
  notFoundComponent: NotFoundPage,
})
