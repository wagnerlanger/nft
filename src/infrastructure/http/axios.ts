import axios from 'axios'

import { HttpError } from '@/infrastructure/http/errors'
import { notifySessionExpired } from '@/infrastructure/http/session-events'

const SCENARIO_HEADER = 'x-kurio-scenario'
const GUEST_HEADER = 'x-guest-id'
const SESSION_TOKEN_KEY = 'kurio:session-token'
const GUEST_ID_KEY = 'kurio:guest-id'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: {
    Accept: 'application/json',
  },
})

export function getStoredSessionToken() {
  return window.localStorage.getItem(SESSION_TOKEN_KEY)
}

export function setStoredSessionToken(token: string | null) {
  if (!token) {
    window.localStorage.removeItem(SESSION_TOKEN_KEY)
    return
  }
  window.localStorage.setItem(SESSION_TOKEN_KEY, token)
}

export function getOrCreateGuestId() {
  const existing = window.localStorage.getItem(GUEST_ID_KEY)
  if (existing) return existing
  const guestId = crypto.randomUUID()
  window.localStorage.setItem(GUEST_ID_KEY, guestId)
  return guestId
}

http.interceptors.request.use((config) => {
  const scenario = window.localStorage.getItem('kurio:scenario')
  if (scenario && scenario !== 'success') {
    config.headers.set(SCENARIO_HEADER, scenario)
  }
  const token = getStoredSessionToken()
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  config.headers.set(GUEST_HEADER, getOrCreateGuestId())
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isCancel(error)) return Promise.reject(error)

    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0
      const data = error.response?.data as { message?: string; code?: string } | undefined
      const code = data?.code ?? 'http_error'

      if (
        status === 401 &&
        code === 'session_expired' &&
        !String(error.config?.url ?? '').includes('/auth/login')
      ) {
        setStoredSessionToken(null)
        notifySessionExpired()
      }

      return Promise.reject(
        new HttpError(
          status,
          data?.message ?? 'Não foi possível concluir a requisição.',
          code,
        ),
      )
    }

    return Promise.reject(error)
  },
)
