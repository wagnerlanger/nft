export type AuthTab = 'login' | 'register'

export type AuthUser = {
  id: string
  email: string
  username: string
  displayName: string
}

export type AuthSession = {
  token: string
  user: AuthUser
}
