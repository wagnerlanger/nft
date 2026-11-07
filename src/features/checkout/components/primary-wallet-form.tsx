import type { ChangeEvent } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { FieldLabel } from '@/features/checkout/components/field-label'
import type { CheckoutWalletFormValues } from '@/features/checkout/schemas'
import { WalletFieldsForm } from '@/features/wallets/components/wallet-fields-form'
import type { WalletFieldsValues } from '@/features/wallets/schemas'

type FieldErrors = Partial<Record<keyof CheckoutWalletFormValues, string>>

export function PrimaryWalletForm({
  values,
  errors,
  onChange,
}: {
  values: CheckoutWalletFormValues
  errors: FieldErrors
  onChange: <K extends keyof CheckoutWalletFormValues>(
    key: K,
    value: CheckoutWalletFormValues[K],
  ) => void
}) {
  function handleWalletFieldChange<K extends keyof WalletFieldsValues>(
    key: K,
    value: WalletFieldsValues[K],
  ) {
    onChange(key, value as CheckoutWalletFormValues[K])
  }

  return (
    <section aria-labelledby="primary-wallet-heading">
      <h1 id="primary-wallet-heading" className="text-xl font-bold tracking-wide text-foreground md:text-2xl">
        Carteira principal
      </h1>

      <div className="mt-6">
        <WalletFieldsForm
          idPrefix="checkout"
          values={values}
          errors={errors}
          onChange={handleWalletFieldChange}
        />

        <div className="mt-4 grid gap-y-4">
          <div>
            <label
              htmlFor="checkout-use-other-wallet"
              className="inline-flex cursor-pointer items-center gap-2 text-sm text-foreground-soft"
            >
              <Checkbox
                id="checkout-use-other-wallet"
                checked={values.useOtherWallet}
                onCheckedChange={(checked) => onChange('useOtherWallet', checked === true)}
              />
              Usar outra carteira?
            </label>
          </div>

          <div>
            <FieldLabel htmlFor="checkout-note">Observação do colecionador (opcional)</FieldLabel>
            <Textarea
              id="checkout-note"
              value={values.collectorNote ?? ''}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                onChange('collectorNote', event.target.value)
              }
              rows={4}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
