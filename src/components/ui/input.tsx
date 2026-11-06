import type { InputHTMLAttributes } from 'react'

import { cn } from '@/shared/utils/cn'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-md border border-border-soft bg-ink-soft px-3 text-sm text-foreground outline-none placeholder:text-muted',
        className,
      )}
      {...props}
    />
  )
}
