import { useState, type FormEvent } from 'react'

import { SocialAuthButtons } from '@/features/auth/components/social-auth-buttons'
import { useAuth } from '@/features/auth/auth-context'
import { loginSchema } from '@/features/auth/schemas'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { SubmitButton } from '@/components/ui/submit-button'
import { isHttpError } from '@/infrastructure/http/errors'
import { zodFieldErrors } from '@/shared/utils/form-errors'

const loginFields = ['email', 'password'] as const

type FieldErrors = Partial<
  Record<(typeof loginFields)[number] | 'form', string>
>

export function LoginForm() {
  const { login, isLoggingIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [attempted, setAttempted] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [notice, setNotice] = useState<string | null>(null)

  function validate(values: { email: string; password: string }) {
    const parsed = loginSchema.safeParse(values)
    setNotice(null)

    if (parsed.success) {
      setErrors({})
      return true
    }
    setErrors(zodFieldErrors(parsed.error, loginFields))
    return false
  }

  function clearNotices() {
    if (!errors.form) return
    setErrors((current) => ({ ...current, form: undefined }))
    setNotice(null)
  }

  function updateEmail(value: string) {
    setEmail(value)
    if (attempted) validate({ email: value, password })
    else clearNotices()
  }

  function updatePassword(value: string) {
    setPassword(value)
    if (attempted) validate({ email, password: value })
    else clearNotices()
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAttempted(true)

    const values = { email, password }
    if (!validate(values)) return

    try {
      await login(values)
    } catch (error) {
      setErrors({
        form: isHttpError(error)
          ? error.message
          : 'Não foi possível entrar. Tente novamente.',
      })
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <div>
        <label className="sr-only" htmlFor="login-email">
          E-mail
        </label>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="contato@email.com"
          value={email}
          onChange={(event) => updateEmail(event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'login-email-error' : undefined}
        />
        {errors.email ? (
          <p id="login-email-error" className="mt-1.5 text-xs text-destructive">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label className="sr-only" htmlFor="login-password">
          Senha
        </label>
        <PasswordInput
          id="login-password"
          autoComplete="current-password"
          placeholder="***********"
          value={password}
          onChange={(event) => updatePassword(event.target.value)}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'login-password-error' : undefined}
        />
        {errors.password ? (
          <p id="login-password-error" className="mt-1.5 text-xs text-destructive">
            {errors.password}
          </p>
        ) : null}
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            className="text-sm text-primary hover:text-accent"
            onClick={() =>
              setNotice('A recuperação de senha ainda não está disponível nesta demonstração.')
            }
          >
            Esqueceu a senha?
          </button>
        </div>
      </div>

      {notice ? (
        <p className="text-center text-xs text-secondary" role="alert">
          {notice}
        </p>
      ) : null}

      {errors.form ? (
        <p className="text-center text-sm text-destructive" role="alert">
          {errors.form}
        </p>
      ) : null}

      <SubmitButton loading={isLoggingIn} className="h-11 w-full">
        Entrar
      </SubmitButton>

      <SocialAuthButtons />
    </form>
  )
}
