import {
  changePasswordSchema,
  collectorProfileSchema,
  updateProfileSchema,
  type ChangePasswordInput,
  type UpdateProfileInput,
} from '@/features/account/schemas'
import type { CollectorProfile } from '@/features/account/types'
import { http } from '@/infrastructure/http/axios'

export async function fetchProfileRequest(signal?: AbortSignal) {
  const { data } = await http.get<unknown>('/profile', { signal })
  return collectorProfileSchema.parse(data) satisfies CollectorProfile
}

export async function updateProfileRequest(input: UpdateProfileInput) {
  const body = updateProfileSchema.parse(input)
  const { data } = await http.patch<unknown>('/profile', body)
  return collectorProfileSchema.parse(data) satisfies CollectorProfile
}

export async function changePasswordRequest(input: ChangePasswordInput) {
  const body = changePasswordSchema.parse(input)
  await http.post('/profile/password', body)
}
