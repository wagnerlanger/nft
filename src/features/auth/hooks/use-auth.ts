export { useAuth } from '@/features/auth/auth-context'

export function firstNameFromDisplay(displayName: string) {
  const [first] = displayName.trim().split(/\s+/)
  return first || displayName
}
