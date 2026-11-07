import { createFileRoute } from '@tanstack/react-router'

import { WishlistGrid } from '@/features/account/components/wishlist-grid'

export const Route = createFileRoute('/account/wishlist')({
  component: WishlistGrid,
})
