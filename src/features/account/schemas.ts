import { z } from 'zod'

export const ENS_SUFFIX_OPTIONS = ['.eth', '.xyz', '.crypto'] as const

export const collectorProfileSchema = z.object({
  id: z.string(),
  email: z.email(),
  username: z.string(),
  displayName: z.string(),
  ensName: z.string(),
  ensSuffix: z.string(),
  walletNickname: z.string(),
  avatarUrl: z.string().nullable(),
})

export const updateProfileSchema = z.object({
  displayName: z.string().trim().min(1, 'Informe o nome de exibição.'),
  username: z
    .string()
    .trim()
    .min(3, 'O nome de usuário deve ter pelo menos 3 caracteres.')
    .max(32, 'O nome de usuário deve ter no máximo 32 caracteres.')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Use apenas letras, números, ponto, hífen ou underscore.'),
  email: z.email('Informe um e-mail válido.'),
  ensName: z.string().trim().min(1, 'Informe o nome ENS.'),
  ensSuffix: z.string().trim().min(1, 'Selecione o sufixo ENS.'),
  walletNickname: z.string().trim().min(1, 'Informe o apelido da carteira.'),
  avatarUrl: z.string().nullable(),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, 'Informe a senha atual.'),
    newPassword: z.string().min(8, 'A nova senha deve ter pelo menos 8 caracteres.'),
    confirmPassword: z.string().min(8, 'Confirme a nova senha.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  })

export const profileFormFields = [
  'displayName',
  'username',
  'email',
  'ensName',
  'ensSuffix',
  'walletNickname',
  'avatarUrl',
  'currentPassword',
  'newPassword',
  'confirmPassword',
] as const

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
