import { useState, type FormEvent } from 'react'

import { SocialAuthButtons } from '@/features/auth/components/social-auth-buttons'
import { useAuth } from '@/features/auth/auth-context'
import { registerSchema } from '@/features/auth/schemas'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { SubmitButton } from '@/components/ui/submit-button'
import { isHttpError } from '@/infrastructure/http/errors'
import { zodFieldErrors } from '@/shared/utils/form-errors'

const registerFields = ['username', 'email', 'password', 'confirmPassword'] as const

type FieldErrors = Partial<Record<(typeof registerFields)[number] | 'form', string>>

type RegisterValues = {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export function RegisterForm() {
  const { register, isRegistering } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [attempted, setAttempted] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})

  function validate(values: RegisterValues) {
    const parsed = registerSchema.safeParse(values)
    if (parsed.success) {
      setErrors({})
      return true
    }
    setErrors(zodFieldErrors(parsed.error, registerFields))
    return false
  }

  function updateField<K extends keyof RegisterValues>(key: K, value: string) {
    const values: RegisterValues = {
      username,
      email,
      password,
      confirmPassword,
      [key]: value,
    }

    if (key === 'username') setUsername(value)
    if (key === 'email') setEmail(value)
    if (key === 'password') setPassword(value)
    if (key === 'confirmPassword') setConfirmPassword(value)

    if (attempted) validate(values)
    else if (errors.form) setErrors((current) => ({ ...current, form: undefined }))
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAttempted(true)

    const values = { username, email, password, confirmPassword }
    if (!validate(values)) return

    try {
      await register(values)
    } catch (error) {
      setErrors({
        form: isHttpError(error)
          ? error.message
          : 'Não foi possível criar a conta. Tente novamente.',
      })
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <div>
        <label className="sr-only" htmlFor="register-username">
          Nome de usuário
        </label>
        <Input
          id="register-username"
          autoComplete="username"
          placeholder="Nome de usuário"
          value={username}
          onChange={(event) => updateField('username', event.target.value)}
          aria-invalid={Boolean(errors.username)}
          aria-describedby={errors.username ? 'register-username-error' : undefined}
        />
        {errors.username ? (
          <p id="register-username-error" className="mt-1.5 text-xs text-destructive">
            {errors.username}
          </p>
        ) : null}
      </div>

      <div>
        <label className="sr-only" htmlFor="register-email">
          E-mail
        </label>
        <Input
          id="register-email"
          type="email"
          autoComplete="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(event) => updateField('email', event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'register-email-error' : undefined}
        />
        {errors.email ? (
          <p id="register-email-error" className="mt-1.5 text-xs text-destructive">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label className="sr-only" htmlFor="register-password">
          Senha
        </label>
        <PasswordInput
          id="register-password"
          autoComplete="new-password"
          placeholder="Senha"
          value={password}
          onChange={(event) => updateField('password', event.target.value)}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'register-password-error' : undefined}
        />
        {errors.password ? (
          <p id="register-password-error" className="mt-1.5 text-xs text-destructive">
            {errors.password}
          </p>
        ) : null}
      </div>

      <div>
        <label className="sr-only" htmlFor="register-confirm">
          Confirmar senha
        </label>
        <PasswordInput
          id="register-confirm"
          autoComplete="new-password"
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChange={(event) => updateField('confirmPassword', event.target.value)}
          aria-invalid={Boolean(errors.confirmPassword)}
          aria-describedby={errors.confirmPassword ? 'register-confirm-error' : undefined}
        />
        {errors.confirmPassword ? (
          <p id="register-confirm-error" className="mt-1.5 text-xs text-destructive">
            {errors.confirmPassword}
          </p>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-sm text-destructive" role="alert">
          {errors.form}
        </p>
      ) : null}

      <SubmitButton loading={isRegistering} className="h-11 w-full">
        Criar conta
      </SubmitButton>

      <SocialAuthButtons />
    </form>
  )
}
