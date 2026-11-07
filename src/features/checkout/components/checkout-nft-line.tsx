import type { CartItem } from '@/features/cart/types'
import { lineTotalEth } from '@/features/cart/utils/totals'
import { formatTokenNumber } from '@/mocks/fixtures/nfts'
import { formatEth } from '@/shared/formatters/eth'

export function CheckoutNftLine({ item }: { item: CartItem }) {
  const lineTotal = lineTotalEth(item.unitPriceEth, item.quantity)
  const tokenLabel = formatTokenNumber(item.tokenNumber)

  return (
    <article className="flex items-center gap-3 bg-card pr-3">
      <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-card">
        <img src={item.imageUrl} alt="" className="size-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-foreground">{item.name}</p>
        <p className="mt-0.5 text-sm text-secondary">ID do token: {tokenLabel}</p>
      </div>
      <p className="shrink-0 text-sm text-muted">(x {item.quantity})</p>
      <p className="shrink-0 text-sm font-bold tabular-nums text-accent">{formatEth(lineTotal)}</p>
    </article>
  )
}
