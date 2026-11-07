import { seedUsers, type UserRecord } from '@/mocks/fixtures/users'
import { sha256 } from '@/shared/utils/hash'

const USERS_KEY = 'kurio:auth:users'
const SESSIONS_KEY = 'kurio:auth:sessions'

type SessionRecord = {
  token: string
  userId: string
  createdAt: string
}

function normalizeUser(raw: Partial<UserRecord> & Pick<UserRecord, 'id' | 'email' | 'username' | 'displayName' | 'passwordHash'>): UserRecord {
  return {
    id: raw.id,
    email: raw.email,
    username: raw.username,
    displayName: raw.displayName,
    passwordHash: raw.passwordHash,
    ensName: raw.ensName ?? '',
    ensSuffix: raw.ensSuffix ?? '.eth',
    walletNickname: raw.walletNickname ?? '',
    avatarUrl: raw.avatarUrl ?? null,
  }
}

function readUsers(): UserRecord[] {
  try {
    const raw = window.localStorage.getItem(USERS_KEY)
    if (!raw) return structuredClone(seedUsers)
    const parsed = JSON.parse(raw) as Array<Partial<UserRecord>>
    if (!Array.isArray(parsed) || parsed.length === 0) return structuredClone(seedUsers)
    return parsed
      .filter(
        (item): item is Partial<UserRecord> & Pick<UserRecord, 'id' | 'email' | 'username' | 'displayName' | 'passwordHash'> =>
          Boolean(item?.id && item.email && item.username && item.displayName && item.passwordHash),
      )
      .map(normalizeUser)
  } catch {
    return structuredClone(seedUsers)
  }
}

function writeUsers(users: UserRecord[]) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function readSessions(): SessionRecord[] {
  try {
    const raw = window.localStorage.getItem(SESSIONS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SessionRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeSessions(sessions: SessionRecord[]) {
  window.localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
}

function publicUser(user: UserRecord) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    ensName: user.ensName,
    ensSuffix: user.ensSuffix,
    walletNickname: user.walletNickname,
    avatarUrl: user.avatarUrl,
  }
}

export function toCollectorProfile(user: UserRecord) {
  return publicUser(user)
}

export function resetAuthDatabase() {
  writeUsers(structuredClone(seedUsers))
  writeSessions([])
}

export async function registerUser(input: {
  username: string
  email: string
  password: string
}) {
  const users = readUsers()
  const email = input.email.trim().toLowerCase()
  const username = input.username.trim()

  if (users.some((user) => user.email === email)) {
    return { ok: false as const, code: 'email_taken', message: 'Este e-mail já está em uso.' }
  }
  if (users.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
    return {
      ok: false as const,
      code: 'username_taken',
      message: 'Este nome de usuário já está em uso.',
    }
  }

  const user: UserRecord = {
    id: `user-${crypto.randomUUID()}`,
    email,
    username,
    displayName: username,
    passwordHash: await sha256(input.password),
    ensName: '',
    ensSuffix: '.eth',
    walletNickname: '',
    avatarUrl: null,
  }
  users.push(user)
  writeUsers(users)
  const session = createSession(user.id)
  return { ok: true as const, session: { token: session.token, user: publicUser(user) } }
}

export async function loginUser(input: { email: string; password: string }) {
  const users = readUsers()
  const email = input.email.trim().toLowerCase()
  const user = users.find((item) => item.email === email)
  const passwordHash = await sha256(input.password)

  if (!user || user.passwordHash !== passwordHash) {
    return {
      ok: false as const,
      code: 'invalid_credentials',
      message: 'E-mail ou senha incorretos.',
    }
  }

  const session = createSession(user.id)
  return { ok: true as const, session: { token: session.token, user: publicUser(user) } }
}

function createSession(userId: string) {
  const sessions = readSessions().filter((session) => session.userId !== userId)
  const session: SessionRecord = {
    token: crypto.randomUUID(),
    userId,
    createdAt: new Date().toISOString(),
  }
  sessions.push(session)
  writeSessions(sessions)
  return session
}

export function getSessionByToken(token: string | null) {
  if (!token) return null
  const session = readSessions().find((item) => item.token === token)
  if (!session) return null
  const user = readUsers().find((item) => item.id === session.userId)
  if (!user) return null
  return { token: session.token, user: publicUser(user) }
}

export function getUserByToken(token: string | null) {
  if (!token) return null
  const session = readSessions().find((item) => item.token === token)
  if (!session) return null
  return readUsers().find((item) => item.id === session.userId) ?? null
}

export function updateUserProfile(
  token: string | null,
  input: {
    displayName: string
    username: string
    email: string
    ensName: string
    ensSuffix: string
    walletNickname: string
    avatarUrl: string | null
  },
) {
  const user = getUserByToken(token)
  if (!user) {
    return {
      ok: false as const,
      response: Response.json(
        { message: 'Sessão expirada. Entre novamente.', code: 'session_expired' },
        { status: 401 },
      ),
    }
  }

  const users = readUsers()
  const email = input.email.trim().toLowerCase()
  const username = input.username.trim()

  if (users.some((item) => item.id !== user.id && item.email === email)) {
    return {
      ok: false as const,
      response: Response.json(
        { message: 'Este e-mail já está em uso.', code: 'email_taken' },
        { status: 409 },
      ),
    }
  }

  if (
    users.some(
      (item) => item.id !== user.id && item.username.toLowerCase() === username.toLowerCase(),
    )
  ) {
    return {
      ok: false as const,
      response: Response.json(
        { message: 'Este nome de usuário já está em uso.', code: 'username_taken' },
        { status: 409 },
      ),
    }
  }

  const next: UserRecord = {
    ...user,
    displayName: input.displayName.trim(),
    username,
    email,
    ensName: input.ensName.trim(),
    ensSuffix: input.ensSuffix.trim(),
    walletNickname: input.walletNickname.trim(),
    avatarUrl: input.avatarUrl,
  }

  writeUsers(users.map((item) => (item.id === user.id ? next : item)))
  return { ok: true as const, profile: toCollectorProfile(next) }
}

export async function changeUserPassword(
  token: string | null,
  input: { currentPassword: string; newPassword: string },
) {
  const user = getUserByToken(token)
  if (!user) {
    return {
      ok: false as const,
      response: Response.json(
        { message: 'Sessão expirada. Entre novamente.', code: 'session_expired' },
        { status: 401 },
      ),
    }
  }

  const currentHash = await sha256(input.currentPassword)
  if (user.passwordHash !== currentHash) {
    return {
      ok: false as const,
      response: Response.json(
        { message: 'Senha atual incorreta.', code: 'invalid_password' },
        { status: 400 },
      ),
    }
  }

  const next: UserRecord = {
    ...user,
    passwordHash: await sha256(input.newPassword),
  }
  writeUsers(readUsers().map((item) => (item.id === user.id ? next : item)))
  return { ok: true as const }
}

export function logoutSession(token: string | null) {
  if (!token) return
  writeSessions(readSessions().filter((session) => session.token !== token))
}

export function readBearerToken(request: Request) {
  const header = request.headers.get('Authorization')
  if (!header?.startsWith('Bearer ')) return null
  return header.slice('Bearer '.length).trim() || null
}
