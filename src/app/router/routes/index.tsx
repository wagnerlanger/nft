import { createFileRoute } from '@tanstack/react-router'

import { HomePage } from '@/features/catalog/pages'
import { parseCatalogSearch } from '@/shared/utils/catalog-search'

export const Route = createFileRoute('/')({
  validateSearch: (search) => parseCatalogSearch(search),
  component: HomePage,
})
