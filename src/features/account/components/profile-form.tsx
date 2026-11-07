import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'

import { ImageIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { SubmitButton } from '@/components/ui/submit-button'
import {
  useChangePassword,
  useProfileQuery,
  useUpdateProfile,
} from '@/features/account/hooks/use-profile'
import {
  ENS_SUFFIX_OPTIONS,
  changePasswordSchema,
  profileFormFields,
  updateProfileSchema,
  type UpdateProfileInput,
} from '@/features/account/schemas'
import { FieldLabel } from '@/features/checkout/components/field-label'
import { isHttpError } from '@/infrastructure/http/errors'
import { zodFieldErrors } from '@/shared/utils/form-errors'

type FormValues = UpdateProfileInput & {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

type FieldErrors = Partial<Record<(typeof profileFormFields)[number] | 'form', string>>

function emptyValues(): FormValues {
  return {
    displayName: '',
    username: '',
    email: '',
    ensName: '',
    ensSuffix: '.eth',
    walletNickname: '',
    avatarUrl: null,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
}

export function ProfileForm() {
  const profileQuery = useProfileQuery()
  const updateProfile = useUpdateProfile()
  const changePassword = useChangePassword()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const hydratedRef = useRef(false)

  const [values, setValues] = useState<FormValues>(emptyValues)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [successMessage, setSuccessMessage] = useState<string>()

  useEffect(() => {
    if (!profileQuery.data || hydratedRef.current) return
    setValues({
      displayName: profileQuery.data.displayName,
      username: profileQuery.data.username,
      email: profileQuery.data.email,
      ensName: profileQuery.data.ensName,
      ensSuffix: profileQuery.data.ensSuffix || '.eth',
      walletNickname: profileQuery.data.walletNickname,
      avatarUrl: profileQuery.data.avatarUrl,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    hydratedRef.current = true
  }, [profileQuery.data])

  function updateField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }))
    setSuccessMessage(undefined)
    if (errors[key as keyof FieldErrors] || errors.form) {
      setErrors((current) => {
        const next = { ...current }
        delete next[key as keyof FieldErrors]
        delete next.form
        return next
      })
    }
  }

  async function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setErrors((current) => ({ ...current, form: 'Selecione um arquivo de imagem.' }))
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      updateField('avatarUrl', typeof reader.result === 'string' ? reader.result : null)
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSuccessMessage(undefined)

    const profilePayload: UpdateProfileInput = {
      displayName: values.displayName,
      username: values.username,
      email: values.email,
      ensName: values.ensName,
      ensSuffix: values.ensSuffix,
      walletNickname: values.walletNickname,
      avatarUrl: values.avatarUrl,
    }

    const profileParsed = updateProfileSchema.safeParse(profilePayload)
    if (!profileParsed.success) {
      setErrors(zodFieldErrors(profileParsed.error, profileFormFields))
      return
    }

    const wantsPasswordChange = Boolean(
      values.currentPassword || values.newPassword || values.confirmPassword,
    )

    if (wantsPasswordChange) {
      const passwordParsed = changePasswordSchema.safeParse({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      })
      if (!passwordParsed.success) {
        setErrors(zodFieldErrors(passwordParsed.error, profileFormFields))
        return
      }
    }

    setErrors({})

    try {
      await updateProfile.mutateAsync(profileParsed.data)
      if (wantsPasswordChange) {
        await changePassword.mutateAsync({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        })
        setValues((current) => ({
          ...current,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }))
      }
      setSuccessMessage('Perfil salvo com sucesso.')
    } catch (error) {
      if (isHttpError(error)) {
        setErrors({ form: error.message })
        return
      }
      setErrors({ form: 'Não foi possível salvar o perfil.' })
    }
  }

  if (profileQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (profileQuery.isError) {
    return (
      <p className="text-sm text-destructive">
        {isHttpError(profileQuery.error)
          ? profileQuery.error.message
          : 'Não foi possível carregar o perfil.'}
      </p>
    )
  }

  const saving = updateProfile.isPending || changePassword.isPending

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="max-w-3xl">
      <h1 className="text-2xl font-bold tracking-wide text-foreground md:text-3xl">
        Perfil do colecionador
      </h1>

      <div className="mt-8 grid gap-x-6 gap-y-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="profile-display-name" required>
            Nome de exibição
          </FieldLabel>
          <Input
            id="profile-display-name"
            value={values.displayName}
            onChange={(event) => updateField('displayName', event.target.value)}
            aria-invalid={Boolean(errors.displayName) || undefined}
          />
          {errors.displayName ? (
            <p className="mt-1.5 text-xs text-destructive">{errors.displayName}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel htmlFor="profile-username" required>
            Nome de usuário
          </FieldLabel>
          <Input
            id="profile-username"
            value={values.username}
            onChange={(event) => updateField('username', event.target.value)}
            aria-invalid={Boolean(errors.username) || undefined}
          />
          {errors.username ? (
            <p className="mt-1.5 text-xs text-destructive">{errors.username}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel htmlFor="profile-email" required>
            E-mail
          </FieldLabel>
          <Input
            id="profile-email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => updateField('email', event.target.value)}
            aria-invalid={Boolean(errors.email) || undefined}
          />
          {errors.email ? <p className="mt-1.5 text-xs text-destructive">{errors.email}</p> : null}
        </div>

        <div>
          <FieldLabel htmlFor="profile-ens-name" required>
            Nome ENS
          </FieldLabel>
          <div className="flex gap-2">
            <Select
              id="profile-ens-suffix"
              value={values.ensSuffix}
              onChange={(event) => updateField('ensSuffix', event.target.value)}
              className="w-24 shrink-0"
              aria-label="Sufixo ENS"
            >
              {ENS_SUFFIX_OPTIONS.map((suffix) => (
                <option key={suffix} value={suffix}>
                  {suffix}
                </option>
              ))}
            </Select>
            <Input
              id="profile-ens-name"
              value={values.ensName}
              onChange={(event) => updateField('ensName', event.target.value)}
              aria-invalid={Boolean(errors.ensName) || undefined}
            />
          </div>
          {errors.ensName ? (
            <p className="mt-1.5 text-xs text-destructive">{errors.ensName}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel htmlFor="profile-wallet-nickname" required>
            Apelido da carteira
          </FieldLabel>
          <Input
            id="profile-wallet-nickname"
            value={values.walletNickname}
            onChange={(event) => updateField('walletNickname', event.target.value)}
            aria-invalid={Boolean(errors.walletNickname) || undefined}
          />
          {errors.walletNickname ? (
            <p className="mt-1.5 text-xs text-destructive">{errors.walletNickname}</p>
          ) : null}
        </div>
        <div>
          <p className="mb-2 text-sm text-foreground-soft">Avatar</p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="grid size-10 place-items-center overflow-hidden rounded-full border border-border bg-card">
              {values.avatarUrl ? (
                <img src={values.avatarUrl} alt="" className="size-full object-cover" />
              ) : (
                <ImageIcon className="size-5 text-muted" />
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button size="sm" type="button" onClick={() => fileInputRef.current?.click()}>
                Alterar
              </Button>
              <Button
                size="sm"
                variant="ghost"
                type="button"
                className="text-sm text-foreground-soft hover:text-accent"
                onClick={() => updateField('avatarUrl', null)}
              >
                Remover
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => void handleAvatarChange(event)}
            />
          </div>
        </div>
      </div>


      <div className="mt-10">
        <h2 className="text-xl font-bold tracking-wide text-foreground">Alterar senha</h2>
        <div className="mt-4 max-w-md space-y-4">
          <div>
            <FieldLabel htmlFor="profile-current-password">Senha atual</FieldLabel>
            <PasswordInput
              id="profile-current-password"
              autoComplete="current-password"
              value={values.currentPassword}
              onChange={(event) => updateField('currentPassword', event.target.value)}
              aria-invalid={Boolean(errors.currentPassword) || undefined}
            />
            {errors.currentPassword ? (
              <p className="mt-1.5 text-xs text-destructive">{errors.currentPassword}</p>
            ) : null}
          </div>
          <div>
            <FieldLabel htmlFor="profile-new-password">Nova senha</FieldLabel>
            <PasswordInput
              id="profile-new-password"
              autoComplete="new-password"
              value={values.newPassword}
              onChange={(event) => updateField('newPassword', event.target.value)}
              aria-invalid={Boolean(errors.newPassword) || undefined}
            />
            {errors.newPassword ? (
              <p className="mt-1.5 text-xs text-destructive">{errors.newPassword}</p>
            ) : null}
          </div>
          <div>
            <FieldLabel htmlFor="profile-confirm-password">Confirmar nova senha</FieldLabel>
            <PasswordInput
              id="profile-confirm-password"
              autoComplete="new-password"
              value={values.confirmPassword}
              onChange={(event) => updateField('confirmPassword', event.target.value)}
              aria-invalid={Boolean(errors.confirmPassword) || undefined}
            />
            {errors.confirmPassword ? (
              <p className="mt-1.5 text-xs text-destructive">{errors.confirmPassword}</p>
            ) : null}
          </div>
        </div>
      </div>

      {errors.form ? <p className="mt-4 text-sm text-destructive">{errors.form}</p> : null}
      {successMessage ? <p className="mt-4 text-sm text-accent">{successMessage}</p> : null}

      <SubmitButton type="submit" className="mt-8 min-w-40" loading={saving}>
        Salvar
      </SubmitButton>
    </form>
  )
}
