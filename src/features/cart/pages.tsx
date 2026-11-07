import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CartBreadcrumbs } from '@/features/cart/components/cart-breadcrumbs'
import { CartLineItem } from '@/features/cart/components/cart-line-item'
import { CartSummary } from '@/features/cart/components/cart-summary'
import { CollectorsCarousel } from '@/features/cart/components/collectors-carousel'
import {
  useCart,
  useRemoveCartItem,
  useUpdateCartItem,
} from '@/features/cart/hooks/use-cart'

export function CartPage() {
  const cartQuery = useCart()
  const updateItem = useUpdateCartItem()
  const removeItem = useRemoveCartItem()
  const items = cartQuery.data?.items ?? []
  const busyNftId =
    updateItem.isPending && updateItem.variables
      ? updateItem.variables.nftId
      : removeItem.isPending && removeItem.variables
        ? removeItem.variables
        : null

  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-8 md:px-8 md:py-10 xl:px-[120px]">
      <CartBreadcrumbs />

      {cartQuery.isPending ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]" aria-busy="true">
          <div className="space-y-3">
            <div className="mb-4 hidden grid-cols-[minmax(0,1.6fr)_0.7fr_0.9fr_0.7fr_auto] gap-4 md:grid">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
              <span />
            </div>
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} className="h-24 w-full rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      ) : null}

      {cartQuery.isError ? (
        <div className="mt-10" role="alert">
          <p>Não foi possível carregar o carrinho.</p>
          <Button className="mt-4" onClick={() => void cartQuery.refetch()}>
            Tentar novamente
          </Button>
        </div>
      ) : null}

      {cartQuery.data && items.length === 0 ? (
        <>
          <div className="mt-10 max-w-lg">
            <h1 className="text-2xl font-bold">Seu carrinho está vazio</h1>
            <p className="mt-3 text-sm text-secondary">
              Explore o mercado e adicione NFTs para continuar a compra.
            </p>
            <Button asChild className="mt-6">
              <Link to="/" hash="catalogo">
                Continuar explorando
              </Link>
            </Button>
          </div>
          <CollectorsCarousel />
        </>
      ) : null}

      {cartQuery.data && items.length > 0 ? (
        <>
          <div className="mt-8 grid items-start gap-8 lg:gap-16 lg:grid-cols-[minmax(0,1fr)_320px]">
            <section aria-label="Itens do carrinho">
              <div className="mb-3 hidden border-b border-border pb-3 grid-cols-[minmax(0,1.6fr)_0.7fr_0.9fr_0.9fr_auto] gap-4 pr-4 text-sm text-foreground-soft md:grid">
                <span>NFTs</span>
                <span>Preço</span>
                <span>Edições</span>
                <span>Total</span>
                <span className="sr-only">Remover</span>
              </div>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.nftId}>
                    <CartLineItem
                      item={item}
                      busy={busyNftId === item.nftId}
                      onQuantityChange={(quantity) =>
                        updateItem.mutate({ nftId: item.nftId, quantity })
                      }
                      onRemove={() => removeItem.mutate(item.nftId)}
                    />
                  </li>
                ))}
              </ul>
            </section>

            <CartSummary items={items} />
          </div>

          <CollectorsCarousel />
        </>
      ) : null}
    </main>
  )
}
