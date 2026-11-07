import { Skeleton } from '@/components/ui/skeleton'
import { useOrdersQuery } from '@/features/orders/hooks/use-orders'
import { formatEth } from '@/shared/formatters/eth'
import { isHttpError } from '@/infrastructure/http/errors'

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function shortHash(hash: string) {
  if (hash.length < 12) return hash
  return `${hash.slice(0, 6)}…${hash.slice(-4)}`
}

export function ActivityList() {
  const ordersQuery = useOrdersQuery()

  if (ordersQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (ordersQuery.isError) {
    return (
      <p className="text-sm text-destructive">
        {isHttpError(ordersQuery.error)
          ? ordersQuery.error.message
          : 'Não foi possível carregar a atividade.'}
      </p>
    )
  }

  const orders = ordersQuery.data ?? []

  return (
    <section>
      <h1 className="text-2xl font-bold tracking-wide text-foreground md:text-3xl">Atividade</h1>

      {orders.length === 0 ? (
        <p className="mt-6 text-sm text-secondary">Você ainda não realizou compras.</p>
      ) : (
        <ul className="mt-8 space-y-6">
          {orders.map((order) => (
            <li key={order.id} className="border border-border bg-card/40 p-4 md:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-secondary">{formatDate(order.createdAt)}</p>
                  <p className="mt-1 text-sm font-bold text-foreground">
                    Pedido confirmado · {shortHash(order.txHash)}
                  </p>
                </div>
                <p className="text-sm font-bold text-primary">{formatEth(order.totalEth)}</p>
              </div>

              <ul className="mt-4 space-y-3">
                {order.items.map((item) => (
                  <li key={`${order.id}-${item.nftId}`} className="flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="size-12 rounded-md object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-foreground">{item.name}</p>
                      <p className="text-xs text-secondary">
                        Qtd. {item.quantity} · <span className="text-primary">{formatEth(item.lineTotalEth)}</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
