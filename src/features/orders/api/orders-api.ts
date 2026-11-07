import { orderSchema, ordersListSchema } from '@/features/orders/schemas'
import type { CreateOrderBody } from '@/features/orders/schemas'
import type { Order } from '@/features/orders/types'
import { http } from '@/infrastructure/http/axios'

export async function fetchOrdersRequest(signal?: AbortSignal) {
  const { data } = await http.get<unknown>('/orders', { signal })
  return ordersListSchema.parse(data).items satisfies Order[]
}

export async function createOrderRequest(body: CreateOrderBody, idempotencyKey: string) {
  const { data } = await http.post<unknown>('/orders', body, {
    headers: {
      'Idempotency-Key': idempotencyKey,
    },
  })
  return orderSchema.parse(data) satisfies Order
}
