import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SubmitButton } from '@/components/ui/submit-button'
import { CheckoutNftLine } from '@/features/checkout/components/checkout-nft-line'
import { WalletProviderList } from '@/features/checkout/components/wallet-provider-list'
import type { WalletProvider } from '@/features/checkout/schemas'
import type { CartItem } from '@/features/cart/types'
import {
  cartGrandTotalEth,
  NETWORK_FEE_ETH,
  sumSubtotalEth,
} from '@/features/cart/utils/totals'
import { formatEth } from '@/shared/formatters/eth'
import { CloseIcon } from '@/components/icons'

export function CheckoutOrderSummary({
  items,
  provider,
  onProviderChange,
  providerError,
  submitting,
  submitError,
}: {
  items: CartItem[]
  provider: WalletProvider | null
  onProviderChange: (provider: WalletProvider) => void
  providerError?: string
  submitting?: boolean
  submitError?: string
}) {
  const [promoOpen, setPromoOpen] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const subtotal = sumSubtotalEth(items)
  const discount = '00.00'
  const total = cartGrandTotalEth(subtotal, discount, NETWORK_FEE_ETH)

  return (
    <aside>
      <div className="border-b border-border pb-1">
        <h2 className="text-lg font-bold tracking-wide text-foreground">Seus NFTs</h2>
        <div className="flex items-center justify-between">
          <span>NFTs</span>
          <span>Subtotal</span>
        </div>
      </div>

      <ul className="space-y-3 pt-3">
        {items.map((item) => (
          <li key={item.nftId}>
            <CheckoutNftLine item={item} />
          </li>
        ))}
      </ul>

      <div className="mt-4">
        {promoOpen ? (
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="checkout-promo" className="text-sm text-foreground-soft">
                Código promocional
              </label>
              <button
                type="button"
                className="cursor-pointer text-muted hover:text-primary underline-offset-4 hover:underline"
                onClick={() => setPromoOpen(false)}
              >
                <CloseIcon className="size-4" />
              </button>
            </div>
            <div className="mt-2 flex">
              <Input
                id="checkout-promo"
                value={promoCode}
                onChange={(event) => setPromoCode(event.target.value)}
                placeholder="Digite o código..."
                className="flex-1 rounded-r-none"
              />
              <Button type="button" size="sm" className="h-10 shrink-0 rounded-l-none px-4">
                Aplicar
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-center text-foreground-soft">
            Tem um código promocional?{' '}
            <button
              type="button"
              className="cursor-pointer text-muted hover:text-primary underline-offset-4 hover:underline"
              onClick={() => setPromoOpen(true)}
            >
              Aplique aqui
            </button>
          </p>
        )}
      </div>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-foreground-soft">Subtotal</dt>
          <dd className="tabular-nums text-foreground">{formatEth(subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-foreground-soft">Desconto do lançamento</dt>
          <dd className="tabular-nums text-foreground">(-) {discount}</dd>
        </div>
        <div className="flex items-start justify-between gap-3">
          <dt className="text-foreground-soft">Taxa de rede</dt>
          <dd className="text-end tabular-nums text-foreground">
            {formatEth(NETWORK_FEE_ETH)}
            <span className="mt-0.5 block text-xs text-muted">Taxa estimada</span>
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="font-semibold text-foreground">Total</dt>
          <dd className="text-lg font-bold tabular-nums text-accent">{formatEth(total)}</dd>
        </div>
      </dl>

      <WalletProviderList value={provider} onChange={onProviderChange} error={providerError} />

      {submitError ? (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {submitError}
        </p>
      ) : null}
      <SubmitButton loading={submitting} className="mt-6 w-full tracking-wide rounded-full md:rounded-md py-8 md:py-0">
        Confirmar compra
      </SubmitButton>
    </aside>
  )
}
