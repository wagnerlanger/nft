import { z } from 'zod'

import {
  ENS_SUFFIX_OPTIONS,
  NETWORK_OPTIONS,
  WALLET_TYPE_OPTIONS,
  walletFieldsSchema,
} from '@/features/wallets/schemas'

export { ENS_SUFFIX_OPTIONS, NETWORK_OPTIONS, WALLET_TYPE_OPTIONS }

export const walletProviderSchema = z.enum(['walletconnect', 'metamask', 'coinbase'])

export type WalletProvider = z.infer<typeof walletProviderSchema>

export const checkoutWalletFormSchema = walletFieldsSchema.extend({
  useOtherWallet: z.boolean(),
  collectorNote: z.string().trim().optional(),
})

export type CheckoutWalletFormValues = z.infer<typeof checkoutWalletFormSchema>

export const checkoutWalletFormFields = [
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
  'useOtherWallet',
  'collectorNote',
] as const

export const WALLET_PROVIDER_OPTIONS = [
  { value: 'walletconnect' as const, label: 'WalletConnect' },
  { value: 'metamask' as const, label: 'MetaMask' },
  { value: 'coinbase' as const, label: 'Coinbase Wallet' },
]

export function walletProviderLabel(provider: WalletProvider) {
  return WALLET_PROVIDER_OPTIONS.find((option) => option.value === provider)?.label ?? provider
}
