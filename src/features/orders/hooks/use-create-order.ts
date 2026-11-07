import { useMutation, useQueryClient } from '@tanstack/react-query'

import { cartKeys } from '@/features/cart/hooks/use-cart'
import { createOrderRequest } from '@/features/orders/api/orders-api'
import { ordersKeys } from '@/features/orders/hooks/use-orders'
import type { CreateOrderBody } from '@/features/orders/schemas'
import { isHttpError } from '@/infrastructure/http/errors'

export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      body,
      idempotencyKey,
    }: {
      body: CreateOrderBody
      idempotencyKey: string
    }) => createOrderRequest(body, idempotencyKey),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: cartKeys.all })
      await queryClient.invalidateQueries({ queryKey: ordersKeys.all })
    },
    retry: (failureCount, error) => {
      if (isHttpError(error) && error.status >= 400 && error.status < 500) return false
      return failureCount < 1
    },
  })
}
