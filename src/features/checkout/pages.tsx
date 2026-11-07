import { Link, Navigate } from '@tanstack/react-router'
import { useEffect, useRef, useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { CheckoutBreadcrumbs } from '@/features/checkout/components/checkout-breadcrumbs'
import { CheckoutOrderSummary } from '@/features/checkout/components/checkout-order-summary'
import { PrimaryWalletForm } from '@/features/checkout/components/primary-wallet-form'
import {
  checkoutWalletFormFields,
  checkoutWalletFormSchema,
  type CheckoutWalletFormValues,
  type WalletProvider,
} from '@/features/checkout/schemas'
import { useCart } from '@/features/cart/hooks/use-cart'
import { OrderConfirmationDialog } from '@/features/orders/components/order-confirmation-dialog'
import { useCreateOrder } from '@/features/orders/hooks/use-create-order'
import type { Order } from '@/features/orders/types'
import { useWalletsQuery } from '@/features/wallets/hooks/use-wallets'
import { isHttpError } from '@/infrastructure/http/errors'
import { zodFieldErrors } from '@/shared/utils/form-errors'
import { CartBreadcrumbs } from '../cart/components/cart-breadcrumbs'
import { ChevronRightIcon } from '@/components/icons'
import { useHandleBack } from '../account/hooks/use-handle-back'

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
  const { session, isAuthenticated, openAuth } = useAuth()
  const cartQuery = useCart()
  const handleBack = useHandleBack()
  const walletsQuery = useWalletsQuery()
  const createOrder = useCreateOrder()
  const items = cartQuery.data?.items ?? []

  const [values, setValues] = useState<CheckoutWalletFormValues>(() =>
    emptyFormValues({
      displayName: session?.user.displayName,
      email: session?.user.email,
    }),
  )
  const [errors, setErrors] = useState<FieldErrors>({})
  const [provider, setProvider] = useState<WalletProvider | null>(null)
  const [providerError, setProviderError] = useState<string>()
  const [submitError, setSubmitError] = useState<string>()
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const idempotencyKeyRef = useRef<string | null>(null)
  const sessionPrefilledRef = useRef(false)
  const walletPrefilledRef = useRef(false)

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

  if (!isAuthenticated) {
    return (
      <main className="mx-auto w-full max-w-[1440px] px-4 pb-8 md:px-8 md:py-10 xl:px-[120px] md:bg-transparent">
        <div className="flex items-center md:hidden sticky top-0 bg-background z-10 -mx-4 px-4 pt-8 pb-2 gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBack()}
            className="border-border rounded-full px-2 text-muted bg-card"
          >
            <ChevronRightIcon className="size-5 -scale-x-100" />
          </Button>
          <h2 className="text-lg font-bold text-foreground flex-1 text-center pr-12">
            Pagamento
          </h2>

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

  if (cartQuery.isSuccess && items.length === 0 && !dialogOpen) {
    return <Navigate to="/cart" />
  }

  function updateField<K extends keyof CheckoutWalletFormValues>(
    key: K,
    value: CheckoutWalletFormValues[K],
  ) {
    const next = { ...values, [key]: value }
    setValues(next)
    if (Object.keys(errors).length > 0) {
      const parsed = checkoutWalletFormSchema.safeParse(next)
      if (parsed.success) {
        setErrors({})
      } else {
        setErrors(zodFieldErrors(parsed.error, checkoutWalletFormFields))
      }
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError(undefined)

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

    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = crypto.randomUUID()
    }

    createOrder.mutate(
      {
        idempotencyKey: idempotencyKeyRef.current,
        body: {
          ...parsed.data,
          ensOrSecondary: parsed.data.ensOrSecondary || undefined,
          collectorNote: parsed.data.collectorNote || undefined,
          walletProvider: provider,
        },
      },
      {
        onSuccess: (order) => {
          idempotencyKeyRef.current = null
          setConfirmedOrder(order)
          setDialogOpen(true)
        },
        onError: (error) => {
          setSubmitError(
            isHttpError(error)
              ? error.message
              : 'Não foi possível confirmar a compra. Tente novamente.',
          )
        },
      },
    )
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 pb-8 md:px-8 md:py-10 xl:px-[120px] md:bg-transparent">
      <div className="hidden md:block">
        <CheckoutBreadcrumbs />
      </div>

      <div className="flex items-center md:hidden sticky top-0 bg-background z-10 -mx-4 px-4 pt-8 pb-2 gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleBack()}
          className="border-border rounded-full px-2 text-muted bg-card"
        >
          <ChevronRightIcon className="size-5 -scale-x-100" />
        </Button>
        <h2 className="text-lg font-bold text-foreground flex-1 text-center pr-12">Checkout</h2>

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

      {cartQuery.data && items.length > 0 ? (
        <form
          className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16"
          onSubmit={onSubmit}
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
            submitting={createOrder.isPending}
            submitError={submitError}
          />
        </form>
      ) : null}

      <OrderConfirmationDialog
        order={confirmedOrder}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) {
            setConfirmedOrder(null)
          }
        }}
      />
    </main>
  )
}
