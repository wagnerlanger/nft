import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Informe um e-mail válido.'),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
})

export const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, 'O nome de usuário deve ter pelo menos 3 caracteres.')
      .max(32, 'O nome de usuário deve ter no máximo 32 caracteres.')
      .regex(/^[a-zA-Z0-9._-]+$/, 'Use apenas letras, números, ponto, hífen ou underscore.'),
    email: z.email('Informe um e-mail válido.'),
    password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
    confirmPassword: z.string().min(8, 'Confirme a senha.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  })

export const newsletterEmailSchema = z.object({
  email: z.email('Informe um e-mail válido.'),
})

export const authUserSchema = z.object({
  id: z.string(),
  email: z.email(),
  username: z.string(),
  displayName: z.string(),
  ensName: z.string().optional(),
  ensSuffix: z.string().optional(),
  walletNickname: z.string().optional(),
  avatarUrl: z.string().nullable().optional(),
})

export const authSessionSchema = z.object({
  token: z.string(),
  user: authUserSchema,
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
