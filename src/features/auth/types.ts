export type AuthTab = 'login' | 'register'

export type AuthUser = {
  id: string
  email: string
  username: string
  displayName: string
  ensName?: string
  ensSuffix?: string
  walletNickname?: string
  avatarUrl?: string | null
}

export type AuthSession = {
  token: string
  user: AuthUser
}
