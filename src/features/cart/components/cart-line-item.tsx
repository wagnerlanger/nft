import { Link } from '@tanstack/react-router'

import { TrashIcon } from '@/components/icons'
import { CartQtyControl } from '@/features/cart/components/cart-qty-control'
import type { CartItem } from '@/features/cart/types'
import { lineTotalEth } from '@/features/cart/utils/totals'
import { formatTokenNumber } from '@/mocks/fixtures/nfts'
import { formatEth } from '@/shared/formatters/eth'
import { Button } from '@/components/ui/button'

export function CartLineItem({
  item,
  busy,
  onQuantityChange,
  onRemove,
}: {
  item: CartItem
  busy?: boolean
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
}) {
  const lineTotal = lineTotalEth(item.unitPriceEth, item.quantity)
  const tokenLabel = formatTokenNumber(item.tokenNumber)

  function handleDecrease() {
    if (item.quantity <= 1) {
      onRemove()
      return
    }
    onQuantityChange(item.quantity - 1)
  }

  return (
    <>
      {/* Desktop row */}
      <article className="hidden items-center gap-4 bg-card pr-4 md:grid md:grid-cols-[minmax(0,1.6fr)_0.7fr_0.9fr_0.7fr_auto]">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/nfts/$nftId"
            params={{ nftId: item.nftId }}
            className="size-17 -my-3 mx-n3 shrink-0 overflow-hidden rounded-lg"
          >
            <img src={item.imageUrl} alt="" className="size-full object-cover" />
          </Link>
          <div className="min-w-0 py-3">
            <Link
              to="/nfts/$nftId"
              params={{ nftId: item.nftId }}
              className="block truncate font-semibold text-foreground hover:text-primary"
            >
              {item.name}
            </Link>
            <p className="mt-0.5 text-sm text-secondary">ID do token: {tokenLabel}</p>
          </div>
        </div>

        <p className="text-sm font-medium tabular-nums text-muted">{formatEth(item.unitPriceEth)}</p>

        <CartQtyControl
          quantity={item.quantity}
          disabled={busy}
          onDecrease={handleDecrease}
          onIncrease={() => onQuantityChange(item.quantity + 1)}
        />

        <p className="text-sm font-bold tabular-nums text-accent">{formatEth(lineTotal)}</p>

        <Button
          variant="ghost"
          className="text-secondary hover:text-destructive disabled:opacity-40"
          aria-label={`Remover ${item.name}`}
          disabled={busy}
          onClick={onRemove}
        >
          <TrashIcon className="size-5" />
        </Button>
      </article>

      {/* Mobile card */}
      <article className="flex items-stretch gap-3 rounded-xl bg-card p-3 md:hidden">
        <Link
          to="/nfts/$nftId"
          params={{ nftId: item.nftId }}
          className="size-[88px] shrink-0 overflow-hidden rounded-lg"
        >
          <img src={item.imageUrl} alt="" className="size-full object-cover" />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          <div>
            <Link
              to="/nfts/$nftId"
              params={{ nftId: item.nftId }}
              className="block truncate font-semibold text-foreground hover:text-primary"
            >
              {item.name}
            </Link>
            <p className="mt-1 text-sm text-secondary">Edição: 1/50</p>
          </div>
          <p className="text-lg font-bold tabular-nums text-accent">{formatEth(item.unitPriceEth)}</p>
        </div>

        <div className="flex shrink-0 flex-col items-center justify-center gap-1">
          <button
            type="button"
            className="grid size-8 place-items-center rounded-full border border-border-soft text-lg text-foreground-soft disabled:opacity-40"
            aria-label={item.quantity <= 1 ? `Remover ${item.name}` : 'Diminuir quantidade'}
            disabled={busy}
            onClick={handleDecrease}
          >
            {item.quantity <= 1 ? <TrashIcon className="size-4 text-accent" /> : '−'}
          </button>
          <span className="min-w-6 text-center text-base font-medium tabular-nums">{item.quantity}</span>
          <button
            type="button"
            className="grid size-8 place-items-center rounded-full border border-border-soft text-lg text-foreground-soft disabled:opacity-40"
            aria-label="Aumentar quantidade"
            disabled={busy}
            onClick={() => onQuantityChange(item.quantity + 1)}
          >
            +
          </button>
        </div>
      </article>
    </>
  )
}
