import { seedUsers, type UserRecord } from '@/mocks/fixtures/users'
import { sha256 } from '@/shared/utils/hash'

const USERS_KEY = 'kurio:auth:users'
const SESSIONS_KEY = 'kurio:auth:sessions'

type SessionRecord = {
  token: string
  userId: string
  createdAt: string
}

function readUsers(): UserRecord[] {
  try {
    const raw = window.localStorage.getItem(USERS_KEY)
    if (!raw) return structuredClone(seedUsers)
    const parsed = JSON.parse(raw) as UserRecord[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : structuredClone(seedUsers)
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
  }
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

export function logoutSession(token: string | null) {
  if (!token) return
  writeSessions(readSessions().filter((session) => session.token !== token))
}

export function readBearerToken(request: Request) {
  const header = request.headers.get('Authorization')
  if (!header?.startsWith('Bearer ')) return null
  return header.slice('Bearer '.length).trim() || null
}
