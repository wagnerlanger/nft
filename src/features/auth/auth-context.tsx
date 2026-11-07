import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  fetchSessionRequest,
  loginRequest,
  logoutRequest,
  registerRequest,
} from '@/features/auth/api/auth-api'
import type { LoginInput, RegisterInput } from '@/features/auth/schemas'
import type { AuthSession, AuthTab } from '@/features/auth/types'
import { profileKeys } from '@/features/account/hooks/use-profile'
import { cartKeys, mergeGuestCart } from '@/features/cart/hooks/use-cart'
import { favoritesKeys } from '@/features/favorites/hooks/use-favorites'
import { ordersKeys } from '@/features/orders/hooks/use-orders'
import { walletsKeys } from '@/features/wallets/hooks/use-wallets'
import { getStoredSessionToken, setStoredSessionToken } from '@/infrastructure/http/axios'
import { isHttpError } from '@/infrastructure/http/errors'

type AuthContextValue = {
  session: AuthSession | null
  isLoadingSession: boolean
  isAuthenticated: boolean
  authOpen: boolean
  authTab: AuthTab
  openAuth: (tab?: AuthTab) => void
  closeAuth: () => void
  setAuthTab: (tab: AuthTab) => void
  login: (input: LoginInput) => Promise<AuthSession>
  register: (input: RegisterInput) => Promise<AuthSession>
  logout: () => Promise<void>
  isLoggingIn: boolean
  isRegistering: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const SESSION_QUERY_KEY = ['auth', 'session'] as const

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [authOpen, setAuthOpen] = useState(false)
  const [authTab, setAuthTab] = useState<AuthTab>('login')
  const [hasToken, setHasToken] = useState(() => Boolean(getStoredSessionToken()))

  const sessionQuery = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: async () => {
      try {
        return await fetchSessionRequest()
      } catch (error) {
        if (isHttpError(error) && error.status === 401) {
          setStoredSessionToken(null)
        }
        throw error
      }
    },
    enabled: hasToken,
    retry: false,
    staleTime: 60_000,
  })

  if (
    hasToken &&
    sessionQuery.isError &&
    isHttpError(sessionQuery.error) &&
    sessionQuery.error.status === 401
  ) {
    setHasToken(false)
    queryClient.setQueryData(SESSION_QUERY_KEY, null)
  }

  const persistSession = useCallback(
    async (session: AuthSession) => {
      setStoredSessionToken(session.token)
      setHasToken(true)
      queryClient.setQueryData(SESSION_QUERY_KEY, session)
      setAuthOpen(false)
      try {
        await mergeGuestCart(queryClient)
      } catch {
        void queryClient.invalidateQueries({ queryKey: cartKeys.all })
      }
      void queryClient.invalidateQueries({ queryKey: favoritesKeys.all })
      return session
    },
    [queryClient],
  )

  const loginMutation = useMutation({
    mutationFn: async (input: LoginInput) => persistSession(await loginRequest(input)),
  })

  const registerMutation = useMutation({
    mutationFn: async (input: RegisterInput) =>
      persistSession(
        await registerRequest({
          username: input.username,
          email: input.email,
          password: input.password,
        }),
      ),
  })

  const logoutMutation = useMutation({
    mutationFn: logoutRequest,
    onSettled: () => {
      setStoredSessionToken(null)
      setHasToken(false)
      queryClient.setQueryData(SESSION_QUERY_KEY, null)
      queryClient.removeQueries({ queryKey: favoritesKeys.all })
      queryClient.removeQueries({ queryKey: profileKeys.all })
      queryClient.removeQueries({ queryKey: walletsKeys.all })
      queryClient.removeQueries({ queryKey: ordersKeys.all })
      void queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY })
      void queryClient.invalidateQueries({ queryKey: cartKeys.all })
    },
  })

  const openAuth = useCallback((tab: AuthTab = 'login') => {
    setAuthTab(tab)
    setAuthOpen(true)
  }, [])

  const closeAuth = useCallback(() => setAuthOpen(false), [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session: hasToken ? (sessionQuery.data ?? null) : null,
      isLoadingSession: hasToken && sessionQuery.isLoading,
      isAuthenticated: Boolean(hasToken && sessionQuery.data),
      authOpen,
      authTab,
      openAuth,
      closeAuth,
      setAuthTab,
      login: (input) => loginMutation.mutateAsync(input),
      register: (input) => registerMutation.mutateAsync(input),
      logout: () => logoutMutation.mutateAsync(),
      isLoggingIn: loginMutation.isPending,
      isRegistering: registerMutation.isPending,
    }),
    [
      authOpen,
      authTab,
      closeAuth,
      hasToken,
      loginMutation,
      logoutMutation,
      openAuth,
      registerMutation,
      sessionQuery.data,
      sessionQuery.isLoading,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
