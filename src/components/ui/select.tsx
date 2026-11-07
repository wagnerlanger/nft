import type { SelectHTMLAttributes } from 'react'

import { ChevronDownIcon } from '@/components/icons'
import { cn } from '@/shared/utils/cn'

export function Select({
  className,
  children,
  value,
  defaultValue,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  const current = value ?? defaultValue ?? ''
  const isEmpty = current === ''

  return (
    <div className={cn('relative w-full', className)}>
      <select
        className={cn(
          'h-10 w-full appearance-none rounded-md border border-border-soft bg-ink-soft pl-3 pr-10 text-sm outline-none',
          '[&>option]:bg-ink-soft [&>option]:text-foreground',
          isEmpty ? 'text-muted' : 'text-foreground',
        )}
        value={value}
        defaultValue={defaultValue}
        {...props}
      >
        {children}
      </select>
      <ChevronDownIcon
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted"
      />
    </div>
  )
}
