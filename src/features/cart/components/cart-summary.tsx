import { Link } from '@tanstack/react-router'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  cartGrandTotalEth,
  NETWORK_FEE_ETH,
  sumSubtotalEth,
} from '@/features/cart/utils/totals'
import type { CartItem } from '@/features/cart/types'
import { formatEth } from '@/shared/formatters/eth'

export function CartSummary({ items }: { items: CartItem[] }) {
  const [promoCode, setPromoCode] = useState('')
  const subtotal = sumSubtotalEth(items)
  const discount = '00.00'
  const total = cartGrandTotalEth(subtotal, discount, NETWORK_FEE_ETH)

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
            className="flex-1 rounded-r-none"
          />
          <Button type="button" size="sm" className="shrink-0 h-10 px-4 rounded-l-none">
            Aplicar
          </Button>
        </div>
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
          <dt className="text-foreground-soft">
            Taxa de rede
          </dt>
          <dd className="tabular-nums text-foreground text-end">
            {formatEth(NETWORK_FEE_ETH)}
            <span className="mt-0.5 block text-xs text-muted">Taxa estimada</span>
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="font-semibold text-foreground">Total</dt>
          <dd className="text-lg font-bold tabular-nums text-accent">{formatEth(total)}</dd>
        </div>
      </dl>

      <Button asChild className="mt-6 w-full tracking-wide">
        <Link to="/checkout">Conectar e finalizar</Link>
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
