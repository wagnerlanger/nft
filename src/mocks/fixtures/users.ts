/** Demo password for seed users: Kurio123! (stored only as SHA-256). */
export const DEMO_PASSWORD_HASH =
  '5967c16c2022d4e40c36c348638237f3846e004c5f74dcde8aa0373f383aa8d4'

export type UserRecord = {
  id: string
  email: string
  username: string
  displayName: string
  passwordHash: string
  ensName: string
  ensSuffix: string
  walletNickname: string
  avatarUrl: string | null
}

export const seedUsers: UserRecord[] = [
  {
    id: 'user-ana',
    email: 'colecionador@kurio.dev',
    username: 'ana.colecionadora',
    displayName: 'Ana Colecionadora',
    passwordHash: DEMO_PASSWORD_HASH,
    ensName: 'ana',
    ensSuffix: '.eth',
    walletNickname: 'Carteira principal',
    avatarUrl: null,
  },
  {
    id: 'user-bruno',
    email: 'curator@kurio.dev',
    username: 'bruno.curator',
    displayName: 'Bruno Curator',
    passwordHash: DEMO_PASSWORD_HASH,
    ensName: 'bruno',
    ensSuffix: '.eth',
    walletNickname: 'Curator wallet',
    avatarUrl: null,
  },
]
