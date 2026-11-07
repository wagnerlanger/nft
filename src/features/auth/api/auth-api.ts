import { authSessionSchema, type LoginInput, type RegisterInput } from '@/features/auth/schemas'
import type { AuthSession } from '@/features/auth/types'
import { http } from '@/infrastructure/http/axios'

export async function loginRequest(payload: LoginInput) {
  const { data } = await http.post('/auth/login', payload)
  return authSessionSchema.parse(data)
}

export async function registerRequest(payload: Omit<RegisterInput, 'confirmPassword'>) {
  const { data } = await http.post('/auth/register', payload)
  return authSessionSchema.parse(data)
}

export async function fetchSessionRequest() {
  const { data } = await http.get('/auth/session')
  return authSessionSchema.parse(data) as AuthSession
}

export async function logoutRequest() {
  await http.post('/auth/logout')
}
