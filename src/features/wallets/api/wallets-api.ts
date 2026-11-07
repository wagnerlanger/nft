import {
  walletFieldsSchema,
  walletsResponseSchema,
  type WalletFieldsValues,
  type WalletsResponse,
} from '@/features/wallets/schemas'
import { http } from '@/infrastructure/http/axios'

export async function fetchWalletsRequest(signal?: AbortSignal) {
  const { data } = await http.get<unknown>('/wallets', { signal })
  return walletsResponseSchema.parse(data) satisfies WalletsResponse
}

export async function savePrimaryWalletRequest(input: WalletFieldsValues) {
  const body = walletFieldsSchema.parse(input)
  const { data } = await http.put<unknown>('/wallets/primary', body)
  return walletsResponseSchema.parse(data) satisfies WalletsResponse
}

export async function saveSecondaryWalletRequest(input: WalletFieldsValues) {
  const body = walletFieldsSchema.parse(input)
  const { data } = await http.put<unknown>('/wallets/secondary', body)
  return walletsResponseSchema.parse(data) satisfies WalletsResponse
}

export async function setSameAsPrimaryRequest(sameAsPrimary: boolean) {
  const { data } = await http.patch<unknown>('/wallets/same-as-primary', { sameAsPrimary })
  return walletsResponseSchema.parse(data) satisfies WalletsResponse
}
