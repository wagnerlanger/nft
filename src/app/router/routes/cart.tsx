import { createFileRoute } from '@tanstack/react-router'

import { CartPage } from '@/features/cart/pages'

export const Route = createFileRoute('/cart')({
  component: CartPage,
})
