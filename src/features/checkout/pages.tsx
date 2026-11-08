import { Link, Navigate, useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronRightIcon } from '@/components/icons'
import { useHandleBack } from '@/features/account/hooks/use-handle-back'
import { useAuth } from '@/features/auth/hooks/use-auth'
import {
  clearCheckoutDraft,
  readCheckoutDraft,
  writeCheckoutDraft,
} from '@/features/auth/return-to'
import { CartBreadcrumbs } from '@/features/cart/components/cart-breadcrumbs'
import { useCart } from '@/features/cart/hooks/use-cart'
import { CheckoutBreadcrumbs } from '@/features/checkout/components/checkout-breadcrumbs'
import { CheckoutOrderSummary } from '@/features/checkout/components/checkout-order-summary'
import { PrimaryWalletForm } from '@/features/checkout/components/primary-wallet-form'
import {
  checkoutWalletFormFields,
  checkoutWalletFormSchema,
  type CheckoutWalletFormValues,
  type WalletProvider,
} from '@/features/checkout/schemas'
import { OrderConfirmationDialog } from '@/features/orders/components/order-confirmation-dialog'
import { useCreateOrder } from '@/features/orders/hooks/use-create-order'
import { useOrderQuery } from '@/features/orders/hooks/use-orders'
import {
  clearPendingOrderSnapshot,
  readPendingOrderSnapshot,
  writePendingOrderSnapshot,
} from '@/features/orders/pending-order-storage'
import type { Order } from '@/features/orders/types'
import { fetchQuoteRequest } from '@/features/quote/api/quote-api'
import type { Quote } from '@/features/quote/types'
import { useWalletsQuery } from '@/features/wallets/hooks/use-wallets'
import { isHttpError } from '@/infrastructure/http/errors'
import { zodFieldErrors } from '@/shared/utils/form-errors'

type FieldErrors = Partial<Record<(typeof checkoutWalletFormFields)[number], string>>

function emptyFormValues(prefill?: { displayName?: string; email?: string }): CheckoutWalletFormValues {
  return {
    displayName: prefill?.displayName ?? '',
    walletAlias: '',
    network: '',
    profileName: '',
    walletAddress: '',
    ensOrSecondary: '',
    walletType: '',
    referralCode: '',
    email: prefill?.email ?? '',
    ensSuffix: '.eth',
    ensName: '',
    useOtherWallet: false,
    collectorNote: '',
  }
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const { session, isAuthenticated, openAuth } = useAuth()
  const cartQuery = useCart()
  const handleBack = useHandleBack()
  const walletsQuery = useWalletsQuery()
  const createOrder = useCreateOrder()
  const items = cartQuery.data?.items ?? []

  const [values, setValues] = useState<CheckoutWalletFormValues>(() => {
    const draft = readCheckoutDraft<CheckoutWalletFormValues>()
    if (draft) return draft
    return emptyFormValues({
      displayName: session?.user.displayName,
      email: session?.user.email,
    })
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [provider, setProvider] = useState<WalletProvider | null>(null)
  const [providerError, setProviderError] = useState<string>()
  const [submitError, setSubmitError] = useState<string>()
  const [quoteStaleMessage, setQuoteStaleMessage] = useState<string>()
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null)
  const [refusedOrder, setRefusedOrder] = useState<Order | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(
    () => readPendingOrderSnapshot()?.orderId ?? null,
  )
  const [latestQuote, setLatestQuote] = useState<Quote | undefined>()
  const idempotencyKeyRef = useRef<string | null>(
    readPendingOrderSnapshot()?.idempotencyKey ?? null,
  )
  const sessionPrefilledRef = useRef(false)
  const walletPrefilledRef = useRef(false)
  const submittingRef = useRef(false)

  const pendingOrderQuery = useOrderQuery(pendingOrderId, {
    refetchInterval: pendingOrderId ? 1500 : false,
  })

  const handleQuoteChange = useCallback((quote: Quote | undefined) => {
    setLatestQuote(quote)
  }, [])

  useEffect(() => {
    if (!session || sessionPrefilledRef.current) return
    setValues((current) => ({
      ...current,
      displayName: current.displayName || session.user.displayName,
      email: current.email || session.user.email,
    }))
    sessionPrefilledRef.current = true
  }, [session])

  useEffect(() => {
    if (!walletsQuery.isSuccess || walletPrefilledRef.current) return
    const primary = walletsQuery.data.primary
    if (primary) {
      setValues((current) => ({
        ...current,
        ...primary,
        useOtherWallet: current.useOtherWallet,
        collectorNote: current.collectorNote,
      }))
    }
    walletPrefilledRef.current = true
  }, [walletsQuery.isSuccess, walletsQuery.data])

  useEffect(() => {
    const order = pendingOrderQuery.data
    if (!order) return

    if (order.status === 'confirmed') {
      clearPendingOrderSnapshot()
      setPendingOrderId(null)
      idempotencyKeyRef.current = null
      setConfirmedOrder(order)
      setDialogOpen(true)
      setRefusedOrder(null)
      void cartQuery.refetch()
    } else if (order.status === 'refused') {
      clearPendingOrderSnapshot()
      setPendingOrderId(null)
      idempotencyKeyRef.current = null
      setRefusedOrder(order)
      setSubmitError(order.refuseReason ?? 'Pagamento recusado pela rede.')
    }
  }, [pendingOrderQuery.data, cartQuery])

  if (!isAuthenticated) {
    return (
      <main className="mx-auto w-full max-w-[1440px] px-4 pb-8 md:bg-transparent md:px-8 md:py-10 xl:px-[120px]">
        <div className="sticky top-0 z-10 -mx-4 flex items-center gap-4 bg-background px-4 pt-8 pb-2 md:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBack()}
            className="rounded-full border-border bg-card px-2 text-muted"
          >
            <ChevronRightIcon className="size-5 -scale-x-100" />
          </Button>
          <h2 className="flex-1 pr-12 text-center text-lg font-bold text-foreground">Pagamento</h2>
        </div>
        <div className="py-24 text-center">
          <p className="mt-3 text-sm text-secondary">
            Entre na sua conta para confirmar a compra e conectar sua carteira.
          </p>
          <button
            type="button"
            className="mt-6 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-bold text-ink"
            onClick={() => openAuth('login')}
          >
            Entrar
          </button>
        </div>
      </main>
    )
  }

  if (cartQuery.isSuccess && items.length === 0 && !dialogOpen && !pendingOrderId) {
    return <Navigate to="/cart" />
  }

  function updateField<K extends keyof CheckoutWalletFormValues>(
    key: K,
    value: CheckoutWalletFormValues[K],
  ) {
    const next = { ...values, [key]: value }
    setValues(next)
    writeCheckoutDraft(next)
    if (Object.keys(errors).length > 0) {
      const parsed = checkoutWalletFormSchema.safeParse(next)
      if (parsed.success) {
        setErrors({})
      } else {
        setErrors(zodFieldErrors(parsed.error, checkoutWalletFormFields))
      }
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submittingRef.current || createOrder.isPending || pendingOrderId) return

    setSubmitError(undefined)
    setQuoteStaleMessage(undefined)
    setRefusedOrder(null)

    const parsed = checkoutWalletFormSchema.safeParse(values)
    if (!parsed.success) {
      setErrors(zodFieldErrors(parsed.error, checkoutWalletFormFields))
      return
    }
    setErrors({})

    if (!provider) {
      setProviderError('Selecione uma carteira para continuar.')
      return
    }
    setProviderError(undefined)

    submittingRef.current = true
    try {
      const freshQuote = await fetchQuoteRequest({})
      if (latestQuote && freshQuote.fingerprint !== latestQuote.fingerprint) {
        setLatestQuote(freshQuote)
        setQuoteStaleMessage(
          'Preço, disponibilidade ou cupom mudaram. Revise o resumo e confirme novamente.',
        )
        return
      }

      if (!idempotencyKeyRef.current) {
        idempotencyKeyRef.current = crypto.randomUUID()
      }

      const order = await createOrder.mutateAsync({
        idempotencyKey: idempotencyKeyRef.current,
        body: {
          ...parsed.data,
          ensOrSecondary: parsed.data.ensOrSecondary || undefined,
          collectorNote: parsed.data.collectorNote || undefined,
          walletProvider: provider,
          promoCode: freshQuote.promoCode ?? undefined,
          quoteFingerprint: freshQuote.fingerprint,
        },
      })

      if (order.status === 'confirmed') {
        clearPendingOrderSnapshot()
        clearCheckoutDraft()
        idempotencyKeyRef.current = null
        setConfirmedOrder(order)
        setDialogOpen(true)
        return
      }

      if (order.status === 'refused') {
        clearPendingOrderSnapshot()
        idempotencyKeyRef.current = null
        setRefusedOrder(order)
        setSubmitError(order.refuseReason ?? 'Pagamento recusado pela rede.')
        return
      }

      writePendingOrderSnapshot({
        orderId: order.id,
        idempotencyKey: idempotencyKeyRef.current,
      })
      setPendingOrderId(order.id)
    } catch (error) {
      setSubmitError(
        isHttpError(error)
          ? error.message
          : 'Não foi possível confirmar a compra. Tente novamente.',
      )
      if (isHttpError(error) && error.code === 'quote_stale') {
        setQuoteStaleMessage(error.message)
      }
    } finally {
      submittingRef.current = false
    }
  }

  const processing = Boolean(pendingOrderId) || createOrder.isPending

  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 pb-8 md:bg-transparent md:px-8 md:py-10 xl:px-[120px]">
      <div className="hidden md:block">
        <CheckoutBreadcrumbs />
      </div>

      <div className="sticky top-0 z-10 -mx-4 flex items-center gap-4 bg-background px-4 pt-8 pb-2 md:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleBack()}
          className="rounded-full border-border bg-card px-2 text-muted"
        >
          <ChevronRightIcon className="size-5 -scale-x-100" />
        </Button>
        <h2 className="flex-1 pr-12 text-center text-lg font-bold text-foreground">Checkout</h2>
      </div>

      {cartQuery.isPending ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]" aria-busy="true">
          <Skeleton className="h-[32rem] w-full rounded-xl" />
          <Skeleton className="h-[28rem] w-full rounded-xl" />
        </div>
      ) : null}

      {cartQuery.isError ? (
        <div className="mt-10" role="alert">
          <p>Não foi possível carregar o carrinho.</p>
          <Button className="mt-4" onClick={() => void cartQuery.refetch()}>
            Tentar novamente
          </Button>
          <Button asChild variant="outline" className="mt-4 ml-3">
            <Link to="/cart">Voltar ao carrinho</Link>
          </Button>
        </div>
      ) : null}

      {pendingOrderId ? (
        <div
          className="mt-8 rounded-xl border border-border bg-card/50 p-6 text-center"
          role="status"
          aria-live="polite"
        >
          <p className="text-lg font-bold text-foreground">Processando pagamento…</p>
          <p className="mt-2 text-sm text-secondary">
            Aguarde a confirmação da rede. Você pode atualizar a página sem criar outro pedido.
          </p>
        </div>
      ) : null}

      {refusedOrder ? (
        <div className="mt-6 rounded-xl border border-destructive/40 bg-card/50 p-4" role="alert">
          <p className="text-sm font-bold text-destructive">Pagamento recusado</p>
          <p className="mt-1 text-sm text-secondary">
            {refusedOrder.refuseReason ?? 'A rede recusou a transação. Seu carrinho foi preservado.'}
          </p>
        </div>
      ) : null}

      {cartQuery.data && items.length > 0 && !pendingOrderId ? (
        <form
          className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16"
          onSubmit={(event) => void onSubmit(event)}
          noValidate
        >
          <PrimaryWalletForm values={values} errors={errors} onChange={updateField} />
          <CheckoutOrderSummary
            items={items}
            provider={provider}
            onProviderChange={(next) => {
              setProvider(next)
              setProviderError(undefined)
            }}
            providerError={providerError}
            submitting={processing}
            submitError={submitError}
            quoteStaleMessage={quoteStaleMessage}
            onQuoteChange={handleQuoteChange}
          />
        </form>
      ) : null}

      {!pendingOrderId && items.length === 0 ? (
        <div className="mt-8">
          <CartBreadcrumbs />
          <Button className="mt-4" onClick={() => void navigate({ to: '/cart' })}>
            Ir ao carrinho
          </Button>
        </div>
      ) : null}

      <OrderConfirmationDialog
        order={confirmedOrder}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) {
            setConfirmedOrder(null)
            void navigate({ to: '/' })
          }
        }}
      />
    </main>
  )
}
