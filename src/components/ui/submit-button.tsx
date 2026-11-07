import type { ButtonHTMLAttributes } from 'react'

import { SpinnerIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { cn } from '@/shared/utils/cn'

type SubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
  variant?: 'primary' | 'outline' | 'ghost' | 'dark'
  size?: 'default' | 'sm'
}

export function SubmitButton({
  loading = false,
  children,
  className,
  disabled,
  variant = 'primary',
  size = 'default',
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      className={cn('relative', className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      <span className={cn(loading && 'invisible')}>{children}</span>
      {loading ? (
        <SpinnerIcon className="absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 animate-spin" />
      ) : null}
    </Button>
  )
}
