import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuth } from '@/features/auth/hooks/use-auth'
import {
  fetchWalletsRequest,
  savePrimaryWalletRequest,
  saveSecondaryWalletRequest,
  setSameAsPrimaryRequest,
} from '@/features/wallets/api/wallets-api'
import type { WalletFieldsValues } from '@/features/wallets/schemas'
import { isHttpError } from '@/infrastructure/http/errors'

export const walletsKeys = {
  all: ['wallets'] as const,
}

function retryQuery(failureCount: number, error: unknown) {
  if (isHttpError(error) && error.status >= 400 && error.status < 500) return false
  return failureCount < 1
}

export function useWalletsQuery() {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: walletsKeys.all,
    queryFn: ({ signal }) => fetchWalletsRequest(signal),
    enabled: isAuthenticated,
    staleTime: 30_000,
    retry: retryQuery,
  })
}

export function useSavePrimaryWallet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: WalletFieldsValues) => savePrimaryWalletRequest(input),
    onSuccess: (data) => {
      queryClient.setQueryData(walletsKeys.all, data)
    },
  })
}

export function useSaveSecondaryWallet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: WalletFieldsValues) => saveSecondaryWalletRequest(input),
    onSuccess: (data) => {
      queryClient.setQueryData(walletsKeys.all, data)
    },
  })
}

export function useSetSameAsPrimary() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (sameAsPrimary: boolean) => setSameAsPrimaryRequest(sameAsPrimary),
    onSuccess: (data) => {
      queryClient.setQueryData(walletsKeys.all, data)
    },
  })
}
