import axios from 'axios'

import { HttpError } from '@/infrastructure/http/errors'

const SCENARIO_HEADER = 'x-kurio-scenario'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: {
    Accept: 'application/json',
  },
})

http.interceptors.request.use((config) => {
  const scenario = window.localStorage.getItem('kurio:scenario')
  if (scenario && scenario !== 'success') {
    config.headers.set(SCENARIO_HEADER, scenario)
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isCancel(error)) return Promise.reject(error)

    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0
      const data = error.response?.data as { message?: string; code?: string } | undefined
      return Promise.reject(
        new HttpError(
          status,
          data?.message ?? 'Não foi possível concluir a requisição.',
          data?.code ?? 'http_error',
        ),
      )
    }

    return Promise.reject(error)
  },
)
