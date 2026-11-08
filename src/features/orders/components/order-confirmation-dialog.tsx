import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ThankYouIcon } from '@/components/icons'
import { walletProviderLabel } from '@/features/checkout/schemas'
import type { Order } from '@/features/orders/types'
import { formatTokenNumber } from '@/mocks/fixtures/nfts'
import { formatEth } from '@/shared/formatters/eth'

function truncateTxHash(hash: string | null) {
  if (!hash) return '—'
  if (hash.length <= 12) return hash
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`
}

function formatOrderDate(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

export function OrderConfirmationDialog({
  order,
  open,
  onOpenChange,
}: {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!order || order.status !== 'confirmed') return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(100%-2rem,40rem)] max-w-none p-6 md:p-8">
        <div className="flex flex-col items-center text-center">
          <ThankYouIcon className="size-16 text-primary md:size-20" />
          <DialogTitle className="mt-4 text-lg font-bold text-foreground md:text-xl">
            Seus NFTs agora estão na sua carteira
          </DialogTitle>
          <DialogDescription className="sr-only">
            Confirmação do pedido {order.id}
          </DialogDescription>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-border py-4 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-foreground-soft">ID da transação</dt>
            <dd className="mt-1 font-medium tabular-nums text-foreground">
              {truncateTxHash(order.txHash)}
            </dd>
          </div>
          <div>
            <dt className="text-foreground-soft">Data</dt>
            <dd className="mt-1 font-medium text-foreground">{formatOrderDate(order.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-foreground-soft">Total</dt>
            <dd className="mt-1 font-medium tabular-nums text-foreground">
              {formatEth(order.totalEth)}
            </dd>
          </div>
          <div>
            <dt className="text-foreground-soft">Carteira</dt>
            <dd className="mt-1 font-medium text-foreground">
              {walletProviderLabel(order.walletProvider)}
            </dd>
          </div>
        </dl>

        <div className="mt-6">
          <h3 className="text-sm font-bold text-foreground">Detalhes da transação</h3>
          <div className="mt-3 hidden grid-cols-[minmax(0,1fr)_auto_auto] gap-4 border-b border-border pb-2 text-xs text-foreground-soft sm:grid">
            <span>NFTs</span>
            <span>Edições</span>
            <span>Subtotal</span>
          </div>
          <ul className="border-b border-border">
            {order.items.map((item) => (
              <li
                key={item.nftId}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="size-12 shrink-0 overflow-hidden rounded-md bg-card">
                    <img src={item.imageUrl} alt="" className="size-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-secondary">
                      ID do token: {formatTokenNumber(item.tokenNumber)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted">(x {item.quantity})</p>
                <p className="text-sm font-bold tabular-nums text-accent">
                  {formatEth(item.lineTotalEth)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <dl className="mt-4 space-y-2 border-b border-border pb-6 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-foreground-soft">Taxa de rede</dt>
            <dd className="tabular-nums text-foreground">{formatEth(order.networkFeeEth)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-semibold text-foreground">Total</dt>
            <dd className="text-base font-bold tabular-nums text-accent">
              {formatEth(order.totalEth)}
            </dd>
          </div>
        </dl>

        <p className="mt-6 text-center text-xs text-secondary md:text-sm">
          Transação confirmada na Ethereum. A propriedade foi transferida para sua carteira
          conectada e registrada na rede.
        </p>
        <div className="text-center">
          <Button asChild className="mt-6 tracking-wide">
            <a
              href={`https://etherscan.io/tx/${order.txHash ?? ''}`}
              target="_blank"
              rel="noreferrer"
            >
              Ver no Etherscan
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
