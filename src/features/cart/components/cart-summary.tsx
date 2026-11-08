import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/features/auth/auth-context'
import { NETWORK_FEE_ETH } from '@/features/cart/utils/totals'
import {
  useApplyPromo,
  useClearPromo,
  useQuote,
} from '@/features/quote/hooks/use-quote'
import { formatEth } from '@/shared/formatters/eth'

export function CartSummary({ itemCount }: { itemCount: number }) {
  const navigate = useNavigate()
  const { isAuthenticated, session, openAuth } = useAuth()
  const quoteQuery = useQuote(itemCount > 0)
  const applyPromo = useApplyPromo()
  const clearPromo = useClearPromo()

  const [promoCode, setPromoCode] = useState('')
  const [promoMessage, setPromoMessage] = useState<string>()

  useEffect(() => {
    if (quoteQuery.data?.promoStatus === 'applied' && quoteQuery.data.promoCode) {
      setPromoCode(quoteQuery.data.promoCode)
    }
  }, [quoteQuery.data?.promoCode, quoteQuery.data?.promoStatus])

  const quote = quoteQuery.data
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
        <h2 className="text-lg font-bold tracking-wide text-foreground">Resumo da carteira</h2>
      </div>
      <div className="mt-5">
        <label htmlFor="cart-promo" className="text-sm text-foreground-soft">
          Código promocional
        </label>
        <div className="mt-2 flex">
          <Input
            id="cart-promo"
            value={promoCode}
            onChange={(event) => setPromoCode(event.target.value)}
            placeholder="Digite o código..."
            className="h-14 flex-1 rounded-r-none rounded-l-full md:h-10 md:rounded-l-md"
            disabled={quote?.promoStatus === 'applied'}
          />
          {quote?.promoStatus === 'applied' ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-14 shrink-0 rounded-full rounded-l-none px-4 md:h-10"
              onClick={() => void handleClearPromo()}
              disabled={clearPromo.isPending}
            >
              Remover
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              className="h-14 shrink-0 rounded-full md:rounded-r-md rounded-l-none px-4 md:h-10"
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

      <Button
        onClick={() =>
          isAuthenticated && session ? navigate({ to: '/checkout' }) : openAuth('login')
        }
        className="mt-6 w-full rounded-full py-8 tracking-wide md:rounded-md md:py-0"
      >
        Conectar e finalizar
      </Button>

      <Link
        to="/"
        hash="catalogo"
        className="mt-4 block text-center text-sm text-primary underline-offset-4 hover:text-primary hover:underline"
      >
        Continuar explorando
      </Link>
    </aside>
  )
}
