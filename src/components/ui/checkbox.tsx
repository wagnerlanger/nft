import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import type { ComponentProps } from 'react'

import { cn } from '@/shared/utils/cn'

export function Checkbox({
  className,
  ...props
}: ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        'peer relative inline-flex h-4 w-4 min-h-4 min-w-4 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-border bg-transparent p-0 leading-none text-primary transition-colors',
        'hover:border-primary disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:border-primary',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="pointer-events-none absolute inset-0 flex items-center justify-center text-current">
        <Check className="size-3 shrink-0 stroke-[3]" aria-hidden="true" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}
