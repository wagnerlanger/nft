import { createFileRoute } from '@tanstack/react-router'

import { CheckoutPage } from '@/features/checkout/pages'

export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
})
