import { useQuery } from '@tanstack/react-query'

import { useAuth } from '@/features/auth/hooks/use-auth'
import { fetchOrderByIdRequest, fetchOrdersRequest } from '@/features/orders/api/orders-api'
import { isHttpError } from '@/infrastructure/http/errors'

export const ordersKeys = {
  all: ['orders'] as const,
  detail: (orderId: string) => ['orders', orderId] as const,
}

function retryQuery(failureCount: number, error: unknown) {
  if (isHttpError(error) && error.status >= 400 && error.status < 500) return false
  return failureCount < 1
}

export function useOrdersQuery() {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ordersKeys.all,
    queryFn: ({ signal }) => fetchOrdersRequest(signal),
    enabled: isAuthenticated,
    staleTime: 30_000,
    retry: retryQuery,
  })
}

export function useOrderQuery(orderId: string | null, options?: { refetchInterval?: number | false }) {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: orderId ? ordersKeys.detail(orderId) : ['orders', 'none'],
    queryFn: ({ signal }) => fetchOrderByIdRequest(orderId!, signal),
    enabled: isAuthenticated && Boolean(orderId),
    staleTime: 5_000,
    retry: retryQuery,
    refetchInterval: options?.refetchInterval,
  })
}
