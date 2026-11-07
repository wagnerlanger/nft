import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  changePasswordRequest,
  fetchProfileRequest,
  updateProfileRequest,
} from '@/features/account/api/profile-api'
import type { ChangePasswordInput, UpdateProfileInput } from '@/features/account/schemas'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { isHttpError } from '@/infrastructure/http/errors'

export const profileKeys = {
  all: ['profile'] as const,
}

const SESSION_QUERY_KEY = ['auth', 'session'] as const

function retryQuery(failureCount: number, error: unknown) {
  if (isHttpError(error) && error.status >= 400 && error.status < 500) return false
  return failureCount < 1
}

export function useProfileQuery() {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: profileKeys.all,
    queryFn: ({ signal }) => fetchProfileRequest(signal),
    enabled: isAuthenticated,
    staleTime: 30_000,
    retry: retryQuery,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => updateProfileRequest(input),
    onSuccess: (profile) => {
      queryClient.setQueryData(profileKeys.all, profile)
      void queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY })
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => changePasswordRequest(input),
  })
}
