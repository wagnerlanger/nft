import { createRouter } from '@tanstack/react-router'

import { routeTree } from '@/app/router/routeTree.gen'
import { parseRouterSearch, stringifyRouterSearch } from '@/shared/utils/catalog-search'

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  parseSearch: parseRouterSearch,
  stringifySearch: stringifyRouterSearch,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
