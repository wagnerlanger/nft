import { useEffect, useRef, useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { SubmitButton } from '@/components/ui/submit-button'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { WalletFieldsForm } from '@/features/wallets/components/wallet-fields-form'
import {
  useSavePrimaryWallet,
  useSaveSecondaryWallet,
  useSetSameAsPrimary,
  useWalletsQuery,
} from '@/features/wallets/hooks/use-wallets'
import {
  emptyWalletFields,
  walletFieldsKeys,
  walletFieldsSchema,
  type WalletFieldsValues,
} from '@/features/wallets/schemas'
import { isHttpError } from '@/infrastructure/http/errors'
import { zodFieldErrors } from '@/shared/utils/form-errors'

type FieldErrors = Partial<Record<(typeof walletFieldsKeys)[number], string>>

export function WalletsPage() {
  const { session } = useAuth()
  const walletsQuery = useWalletsQuery()
  const savePrimary = useSavePrimaryWallet()
  const saveSecondary = useSaveSecondaryWallet()
  const setSameAsPrimary = useSetSameAsPrimary()

  const [primary, setPrimary] = useState<WalletFieldsValues>(() =>
    emptyWalletFields({
      displayName: session?.user.displayName,
      email: session?.user.email,
    }),
  )
  const [secondary, setSecondary] = useState<WalletFieldsValues>(() =>
    emptyWalletFields({
      displayName: session?.user.displayName,
      email: session?.user.email,
    }),
  )
  const [primaryErrors, setPrimaryErrors] = useState<FieldErrors>({})
  const [secondaryErrors, setSecondaryErrors] = useState<FieldErrors>({})
  const [showSecondaryForm, setShowSecondaryForm] = useState(false)
  const [sameAsPrimary, setSameAsPrimaryLocal] = useState(false)
  const [primaryMessage, setPrimaryMessage] = useState<string>()
  const [secondaryMessage, setSecondaryMessage] = useState<string>()
  const [formError, setFormError] = useState<string>()
  const hydratedRef = useRef(false)

  useEffect(() => {
    if (!walletsQuery.data || hydratedRef.current) return
    const data = walletsQuery.data
    if (data.primary) setPrimary(data.primary)
    if (data.secondary) {
      setSecondary(data.secondary)
      setShowSecondaryForm(true)
    }
    setSameAsPrimaryLocal(data.sameAsPrimary)
    if (data.sameAsPrimary) setShowSecondaryForm(false)
    hydratedRef.current = true
  }, [walletsQuery.data])

  function updatePrimary<K extends keyof WalletFieldsValues>(key: K, value: WalletFieldsValues[K]) {
    setPrimary((current) => ({ ...current, [key]: value }))
    setPrimaryMessage(undefined)
    setFormError(undefined)
    if (primaryErrors[key]) {
      setPrimaryErrors((current) => {
        const next = { ...current }
        delete next[key]
        return next
      })
    }
  }

  function updateSecondary<K extends keyof WalletFieldsValues>(
    key: K,
    value: WalletFieldsValues[K],
  ) {
    setSecondary((current) => ({ ...current, [key]: value }))
    setSecondaryMessage(undefined)
    setFormError(undefined)
    if (secondaryErrors[key]) {
      setSecondaryErrors((current) => {
        const next = { ...current }
        delete next[key]
        return next
      })
    }
  }

  async function handleSavePrimary(event: FormEvent) {
    event.preventDefault()
    const parsed = walletFieldsSchema.safeParse(primary)
    if (!parsed.success) {
      setPrimaryErrors(zodFieldErrors(parsed.error, walletFieldsKeys))
      return
    }
    setPrimaryErrors({})
    try {
      await savePrimary.mutateAsync(parsed.data)
      setPrimaryMessage('Carteira principal salva.')
    } catch (error) {
      setFormError(isHttpError(error) ? error.message : 'Não foi possível salvar a carteira.')
    }
  }

  async function handleSaveSecondary(event: FormEvent) {
    event.preventDefault()
    const parsed = walletFieldsSchema.safeParse(secondary)
    if (!parsed.success) {
      setSecondaryErrors(zodFieldErrors(parsed.error, walletFieldsKeys))
      return
    }
    setSecondaryErrors({})
    try {
      await saveSecondary.mutateAsync(parsed.data)
      setSameAsPrimaryLocal(false)
      setSecondaryMessage('Carteira secundária salva.')
    } catch (error) {
      setFormError(isHttpError(error) ? error.message : 'Não foi possível salvar a carteira.')
    }
  }

  async function handleSameAsPrimary(checked: boolean) {
    setSameAsPrimaryLocal(checked)
    setFormError(undefined)
    if (checked) {
      setShowSecondaryForm(false)
      setSecondaryMessage(undefined)
    }
    try {
      await setSameAsPrimary.mutateAsync(checked)
    } catch (error) {
      setFormError(isHttpError(error) ? error.message : 'Não foi possível atualizar a preferência.')
    }
  }

  function handleAddSecondary() {
    setSameAsPrimaryLocal(false)
    setShowSecondaryForm(true)
    void setSameAsPrimary.mutateAsync(false)
  }

  if (walletsQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (walletsQuery.isError) {
    return (
      <p className="text-sm text-destructive">
        {isHttpError(walletsQuery.error)
          ? walletsQuery.error.message
          : 'Não foi possível carregar as carteiras.'}
      </p>
    )
  }

  const hasSecondary = Boolean(walletsQuery.data?.secondary) || showSecondaryForm

  return (
    <div className="space-y-12">
      <section>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-wide text-foreground md:text-3xl">
              Carteira principal
            </h1>
            <p className="mt-2 max-w-xl text-sm text-secondary">
              Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados.
            </p>
          </div>
        </div>

        <form onSubmit={(event) => void handleSavePrimary(event)} className="mt-6">
          <WalletFieldsForm
            idPrefix="primary-wallet"
            values={primary}
            errors={primaryErrors}
            onChange={updatePrimary}
          />
          {primaryMessage ? <p className="mt-3 text-sm text-accent">{primaryMessage}</p> : null}
          <SubmitButton type="submit" className="mt-6" loading={savePrimary.isPending}>
            Salvar carteira
          </SubmitButton>
        </form>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold tracking-wide text-foreground md:text-2xl">
            Carteira secundária
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <label
              htmlFor="same-as-primary"
              className="inline-flex cursor-pointer items-center gap-2 text-sm text-foreground-soft"
            >
              <Checkbox
                id="same-as-primary"
                checked={sameAsPrimary}
                onCheckedChange={(checked) => void handleSameAsPrimary(checked === true)}
              />
              Igual à carteira principal
            </label>
            {!sameAsPrimary && !showSecondaryForm ? (
              <Button type="button" variant="ghost" className="h-auto p-0 text-accent" onClick={handleAddSecondary}>
                Adicionar
              </Button>
            ) : null}
          </div>
        </div>

        {sameAsPrimary || !hasSecondary ? (
          <p className="mt-4 text-sm text-secondary">
            {sameAsPrimary
              ? 'A carteira secundária usará os mesmos dados da carteira principal.'
              : 'Você ainda não adicionou uma carteira secundária.'}
          </p>
        ) : (
          <form onSubmit={(event) => void handleSaveSecondary(event)} className="mt-6">
            <WalletFieldsForm
              idPrefix="secondary-wallet"
              values={secondary}
              errors={secondaryErrors}
              onChange={updateSecondary}
            />
            {secondaryMessage ? (
              <p className="mt-3 text-sm text-accent">{secondaryMessage}</p>
            ) : null}
            <SubmitButton type="submit" className="mt-6" loading={saveSecondary.isPending}>
              Salvar carteira
            </SubmitButton>
          </form>
        )}
      </section>

      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
    </div>
  )
}
