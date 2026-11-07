import type { ZodError } from 'zod'

export function zodFieldErrors<T extends string>(
  error: ZodError,
  keys: readonly T[],
): Partial<Record<T, string>> {
  const allowed = new Set<string>(keys)
  const next: Partial<Record<T, string>> = {}

  for (const issue of error.issues) {
    const key = issue.path[0]
    if (typeof key !== 'string' || !allowed.has(key) || next[key as T]) continue
    next[key as T] = issue.message
  }

  return next
}
