import { z } from 'zod'

export const walletFieldsSchema = z.object({
  displayName: z.string().trim().min(1, 'Informe o nome de exibição.'),
  walletAlias: z.string().trim().min(1, 'Informe o apelido da carteira.'),
  network: z.string().trim().min(1, 'Selecione uma rede.'),
  profileName: z.string().trim().min(1, 'Informe o nome do perfil.'),
  walletAddress: z
    .string()
    .trim()
    .min(1, 'Informe o endereço da carteira.')
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Informe um endereço 0x válido.'),
  ensOrSecondary: z.string().trim().optional(),
  walletType: z.string().trim().min(1, 'Selecione um tipo de carteira.'),
  referralCode: z.string().trim().min(1, 'Informe o código de indicação.'),
  email: z.email('Informe um e-mail válido.'),
  ensSuffix: z.string().trim().min(1, 'Selecione o sufixo ENS.'),
  ensName: z.string().trim().min(1, 'Informe o nome ENS.'),
})

export type WalletFieldsValues = z.infer<typeof walletFieldsSchema>

export const walletFieldsKeys = [
  'displayName',
  'walletAlias',
  'network',
  'profileName',
  'walletAddress',
  'ensOrSecondary',
  'walletType',
  'referralCode',
  'email',
  'ensSuffix',
  'ensName',
] as const

export const NETWORK_OPTIONS = [
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'polygon', label: 'Polygon' },
  { value: 'base', label: 'Base' },
] as const

export const WALLET_TYPE_OPTIONS = [
  { value: 'metamask', label: 'MetaMask' },
  { value: 'walletconnect', label: 'WalletConnect' },
  { value: 'coinbase', label: 'Coinbase Wallet' },
  { value: 'hardware', label: 'Hardware wallet' },
] as const

export const ENS_SUFFIX_OPTIONS = ['.eth', '.xyz', '.crypto'] as const

export const walletsResponseSchema = z.object({
  primary: walletFieldsSchema.nullable(),
  secondary: walletFieldsSchema.nullable(),
  sameAsPrimary: z.boolean(),
})

export type WalletsResponse = z.infer<typeof walletsResponseSchema>

export function emptyWalletFields(prefill?: {
  displayName?: string
  email?: string
}): WalletFieldsValues {
  return {
    displayName: prefill?.displayName ?? '',
    walletAlias: '',
    network: '',
    profileName: '',
    walletAddress: '',
    ensOrSecondary: '',
    walletType: '',
    referralCode: '',
    email: prefill?.email ?? '',
    ensSuffix: '.eth',
    ensName: '',
  }
}
