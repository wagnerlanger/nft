import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SubmitButton } from '@/components/ui/submit-button'
import { CloseIcon } from '@/components/icons'
import { CheckoutNftLine } from '@/features/checkout/components/checkout-nft-line'
import { WalletProviderList } from '@/features/checkout/components/wallet-provider-list'
import type { WalletProvider } from '@/features/checkout/schemas'
import type { CartItem } from '@/features/cart/types'
import { NETWORK_FEE_ETH } from '@/features/cart/utils/totals'
import {
  useApplyPromo,
  useClearPromo,
  useQuote,
} from '@/features/quote/hooks/use-quote'
import type { Quote } from '@/features/quote/types'
import { formatEth } from '@/shared/formatters/eth'

export function CheckoutOrderSummary({
  items,
  provider,
  onProviderChange,
  providerError,
  submitting,
  submitError,
  quoteStaleMessage,
  onQuoteChange,
}: {
  items: CartItem[]
  provider: WalletProvider | null
  onProviderChange: (provider: WalletProvider) => void
  providerError?: string
  submitting?: boolean
  submitError?: string
  quoteStaleMessage?: string
  onQuoteChange?: (quote: Quote | undefined) => void
}) {
  const [promoOpen, setPromoOpen] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoMessage, setPromoMessage] = useState<string>()
  const quoteQuery = useQuote(items.length > 0)
  const applyPromo = useApplyPromo()
  const clearPromo = useClearPromo()

  const quote = quoteQuery.data

  useEffect(() => {
    onQuoteChange?.(quote)
  }, [quote, onQuoteChange])

  useEffect(() => {
    if (quote?.promoStatus === 'applied' && quote.promoCode) {
      setPromoCode(quote.promoCode)
      setPromoOpen(true)
    }
  }, [quote?.promoCode, quote?.promoStatus])

  const subtotal = quote?.subtotalEth ?? '0'
  const discount = quote?.discountEth ?? '0'
  const networkFee = quote?.networkFeeEth ?? NETWORK_FEE_ETH
  const total = quote?.totalEth ?? '0'

  async function handleApplyPromo() {
    setPromoMessage(undefined)
    try {
      const next = await applyPromo.mutateAsync(promoCode)
      if (next.promoStatus === 'applied') {
        setPromoMessage(`Cupom ${next.promoCode} aplicado.`)
      } else if (next.promoStatus === 'expired') {
        setPromoMessage('Este cupom está expirado.')
      } else if (next.promoStatus === 'invalid') {
        setPromoMessage('Cupom inválido.')
      }
    } catch {
      setPromoMessage('Não foi possível validar o cupom.')
    }
  }

  async function handleClearPromo() {
    setPromoMessage(undefined)
    setPromoCode('')
    try {
      await clearPromo.mutateAsync()
    } catch {
      setPromoMessage('Não foi possível remover o cupom.')
    }
  }

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
        {(quote?.items ?? items).map((item) => (
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
                className="cursor-pointer text-muted underline-offset-4 hover:text-primary hover:underline"
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
                disabled={quote?.promoStatus === 'applied'}
              />
              {quote?.promoStatus === 'applied' ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-10 shrink-0 rounded-l-none px-4"
                  onClick={() => void handleClearPromo()}
                  disabled={clearPromo.isPending}
                >
                  Remover
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  className="h-10 shrink-0 rounded-l-none px-4"
                  onClick={() => void handleApplyPromo()}
                  disabled={applyPromo.isPending || !promoCode.trim()}
                >
                  Aplicar
                </Button>
              )}
            </div>
            {promoMessage ? (
              <p
                className={`mt-2 text-xs ${quote?.promoStatus === 'applied' ? 'text-accent' : 'text-destructive'}`}
                role="status"
              >
                {promoMessage}
              </p>
            ) : null}
          </div>
        ) : (
          <p className="text-center text-sm text-foreground-soft">
            Tem um código promocional?{' '}
            <button
              type="button"
              className="cursor-pointer text-muted underline-offset-4 hover:text-primary hover:underline"
              onClick={() => setPromoOpen(true)}
            >
              Aplique aqui
            </button>
          </p>
        )}
      </div>

      <dl className="mt-6 space-y-3 text-sm" aria-busy={quoteQuery.isFetching}>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-foreground-soft">Subtotal</dt>
          <dd className="tabular-nums text-foreground">{formatEth(subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-foreground-soft">Desconto do lançamento</dt>
          <dd className="tabular-nums text-foreground">(-) {formatEth(discount)}</dd>
        </div>
        <div className="flex items-start justify-between gap-3">
          <dt className="text-foreground-soft">Taxa de rede</dt>
          <dd className="text-end tabular-nums text-foreground">
            {formatEth(networkFee)}
            <span className="mt-0.5 block text-xs text-muted">Taxa estimada</span>
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="font-semibold text-foreground">Total</dt>
          <dd className="text-lg font-bold tabular-nums text-accent">{formatEth(total)}</dd>
        </div>
      </dl>

      {quoteStaleMessage ? (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {quoteStaleMessage}
        </p>
      ) : null}

      <WalletProviderList value={provider} onChange={onProviderChange} error={providerError} />

      {submitError ? (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {submitError}
        </p>
      ) : null}
      <SubmitButton
        loading={submitting}
        className="mt-6 w-full rounded-full py-8 tracking-wide md:rounded-md md:py-0"
      >
        Confirmar compra
      </SubmitButton>
    </aside>
  )
}
