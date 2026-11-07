import {
  WALLET_PROVIDER_OPTIONS,
  type WalletProvider,
} from '@/features/checkout/schemas'
import { cn } from '@/shared/utils/cn'

export function WalletProviderList({
  value,
  onChange,
  error,
}: {
  value: WalletProvider | null
  onChange: (provider: WalletProvider) => void
  error?: string
}) {
  return (
    <section aria-labelledby="wallet-provider-heading" className="mt-8">
      <h2 id="wallet-provider-heading" className="text-base font-bold text-foreground">
        Carteira e rede
      </h2>

      <div
        role="radiogroup"
        aria-labelledby="wallet-provider-heading"
        aria-describedby={error ? 'wallet-provider-error' : undefined}
        className="mt-4 space-y-3"
      >
        {WALLET_PROVIDER_OPTIONS.map((option) => {
          const selected = value === option.value
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.value)}
              className={cn(
                'flex w-full items-center gap-3 rounded border px-4 py-3 text-left text-sm transition-colors',
                selected
                  ? 'border-primary text-accent'
                  : 'border-border-soft text-foreground-soft hover:border-primary hover:text-primary',
              )}
            >
              <span
                className={cn(
                  'grid size-4 place-items-center rounded-full border',
                  selected ? 'border-primary' : 'border-border-soft',
                )}
                aria-hidden="true"
              >
                {selected ? <span className="size-2 rounded-full bg-primary" /> : null}
              </span>
              <span className="font-medium">{option.label}</span>
            </button>
          )
        })}
      </div>

      {error ? (
        <p id="wallet-provider-error" className="mt-2 text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  )
}
