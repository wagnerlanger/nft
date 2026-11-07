import type { ChangeEvent } from 'react'

import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { FieldLabel } from '@/features/checkout/components/field-label'
import {
  ENS_SUFFIX_OPTIONS,
  NETWORK_OPTIONS,
  WALLET_TYPE_OPTIONS,
  type WalletFieldsValues,
} from '@/features/wallets/schemas'

type FieldErrors = Partial<Record<keyof WalletFieldsValues, string>>

export function WalletFieldsForm({
  idPrefix,
  values,
  errors,
  onChange,
}: {
  idPrefix: string
  values: WalletFieldsValues
  errors: FieldErrors
  onChange: <K extends keyof WalletFieldsValues>(key: K, value: WalletFieldsValues[K]) => void
}) {
  function handleText(
    key: keyof WalletFieldsValues,
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    onChange(key, event.target.value as WalletFieldsValues[typeof key])
  }

  return (
    <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
      <div>
        <FieldLabel htmlFor={`${idPrefix}-display-name`} required>
          Nome de exibição
        </FieldLabel>
        <Input
          id={`${idPrefix}-display-name`}
          value={values.displayName}
          onChange={(event) => handleText('displayName', event)}
          aria-invalid={Boolean(errors.displayName) || undefined}
          aria-describedby={errors.displayName ? `${idPrefix}-display-name-error` : undefined}
        />
        {errors.displayName ? (
          <p id={`${idPrefix}-display-name-error`} className="mt-1.5 text-xs text-destructive">
            {errors.displayName}
          </p>
        ) : null}
      </div>

      <div>
        <FieldLabel htmlFor={`${idPrefix}-wallet-alias`} required>
          Apelido da carteira
        </FieldLabel>
        <Input
          id={`${idPrefix}-wallet-alias`}
          value={values.walletAlias}
          onChange={(event) => handleText('walletAlias', event)}
          aria-invalid={Boolean(errors.walletAlias) || undefined}
          aria-describedby={errors.walletAlias ? `${idPrefix}-wallet-alias-error` : undefined}
        />
        {errors.walletAlias ? (
          <p id={`${idPrefix}-wallet-alias-error`} className="mt-1.5 text-xs text-destructive">
            {errors.walletAlias}
          </p>
        ) : null}
      </div>

      <div>
        <FieldLabel htmlFor={`${idPrefix}-network`} required>
          Rede
        </FieldLabel>
        <Select
          id={`${idPrefix}-network`}
          value={values.network}
          onChange={(event) => handleText('network', event)}
          aria-invalid={Boolean(errors.network) || undefined}
          aria-describedby={errors.network ? `${idPrefix}-network-error` : undefined}
        >
          <option value="">Selecione uma rede</option>
          {NETWORK_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        {errors.network ? (
          <p id={`${idPrefix}-network-error`} className="mt-1.5 text-xs text-destructive">
            {errors.network}
          </p>
        ) : null}
      </div>

      <div>
        <FieldLabel htmlFor={`${idPrefix}-profile-name`} required>
          Nome do perfil
        </FieldLabel>
        <Input
          id={`${idPrefix}-profile-name`}
          value={values.profileName}
          onChange={(event) => handleText('profileName', event)}
          aria-invalid={Boolean(errors.profileName) || undefined}
          aria-describedby={errors.profileName ? `${idPrefix}-profile-name-error` : undefined}
        />
        {errors.profileName ? (
          <p id={`${idPrefix}-profile-name-error`} className="mt-1.5 text-xs text-destructive">
            {errors.profileName}
          </p>
        ) : null}
      </div>

      <div>
        <FieldLabel htmlFor={`${idPrefix}-wallet-address`} required>
          Endereço da carteira
        </FieldLabel>
        <Input
          id={`${idPrefix}-wallet-address`}
          value={values.walletAddress}
          onChange={(event) => handleText('walletAddress', event)}
          placeholder="Endereço 0x da carteira"
          aria-invalid={Boolean(errors.walletAddress) || undefined}
          aria-describedby={errors.walletAddress ? `${idPrefix}-wallet-address-error` : undefined}
        />
        {errors.walletAddress ? (
          <p id={`${idPrefix}-wallet-address-error`} className="mt-1.5 text-xs text-destructive">
            {errors.walletAddress}
          </p>
        ) : null}
      </div>

      <div>
        <FieldLabel htmlFor={`${idPrefix}-ens-secondary`}>
          ENS ou carteira secundária (opcional)
        </FieldLabel>
        <Input
          id={`${idPrefix}-ens-secondary`}
          value={values.ensOrSecondary ?? ''}
          onChange={(event) => handleText('ensOrSecondary', event)}
        />
      </div>

      <div>
        <FieldLabel htmlFor={`${idPrefix}-wallet-type`} required>
          Tipo de carteira
        </FieldLabel>
        <Select
          id={`${idPrefix}-wallet-type`}
          value={values.walletType}
          onChange={(event) => handleText('walletType', event)}
          aria-invalid={Boolean(errors.walletType) || undefined}
          aria-describedby={errors.walletType ? `${idPrefix}-wallet-type-error` : undefined}
        >
          <option value="">Selecione uma carteira</option>
          {WALLET_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        {errors.walletType ? (
          <p id={`${idPrefix}-wallet-type-error`} className="mt-1.5 text-xs text-destructive">
            {errors.walletType}
          </p>
        ) : null}
      </div>

      <div>
        <FieldLabel htmlFor={`${idPrefix}-referral`} required>
          Código de indicação
        </FieldLabel>
        <Input
          id={`${idPrefix}-referral`}
          value={values.referralCode}
          onChange={(event) => handleText('referralCode', event)}
          aria-invalid={Boolean(errors.referralCode) || undefined}
          aria-describedby={errors.referralCode ? `${idPrefix}-referral-error` : undefined}
        />
        {errors.referralCode ? (
          <p id={`${idPrefix}-referral-error`} className="mt-1.5 text-xs text-destructive">
            {errors.referralCode}
          </p>
        ) : null}
      </div>

      <div>
        <FieldLabel htmlFor={`${idPrefix}-email`} required>
          E-mail
        </FieldLabel>
        <Input
          id={`${idPrefix}-email`}
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) => handleText('email', event)}
          aria-invalid={Boolean(errors.email) || undefined}
          aria-describedby={errors.email ? `${idPrefix}-email-error` : undefined}
        />
        {errors.email ? (
          <p id={`${idPrefix}-email-error`} className="mt-1.5 text-xs text-destructive">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <FieldLabel htmlFor={`${idPrefix}-ens-name`} required>
          Nome ENS
        </FieldLabel>
        <div className="flex gap-2">
          <Select
            id={`${idPrefix}-ens-suffix`}
            value={values.ensSuffix}
            onChange={(event) => handleText('ensSuffix', event)}
            className="w-24 shrink-0"
            aria-label="Sufixo ENS"
          >
            {ENS_SUFFIX_OPTIONS.map((suffix) => (
              <option key={suffix} value={suffix}>
                {suffix}
              </option>
            ))}
          </Select>
          <Input
            id={`${idPrefix}-ens-name`}
            value={values.ensName}
            onChange={(event) => handleText('ensName', event)}
            aria-invalid={Boolean(errors.ensName) || undefined}
            aria-describedby={errors.ensName ? `${idPrefix}-ens-name-error` : undefined}
          />
        </div>
        {errors.ensName ? (
          <p id={`${idPrefix}-ens-name-error`} className="mt-1.5 text-xs text-destructive">
            {errors.ensName}
          </p>
        ) : null}
      </div>
    </div>
  )
}
