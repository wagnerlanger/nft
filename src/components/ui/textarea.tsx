import type { TextareaHTMLAttributes } from 'react'

import { cn } from '@/shared/utils/cn'

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-24 w-full rounded-md border border-border-soft bg-ink-soft px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted',
        className,
      )}
      {...props}
    />
  )
}
