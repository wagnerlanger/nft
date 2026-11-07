import { useState, type InputHTMLAttributes } from 'react'

import { HidePasswordIcon, ShowPasswordIcon } from '@/components/icons'
import { Input } from '@/components/ui/input'
import { cn } from '@/shared/utils/cn'

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input
        type={visible ? 'text' : 'password'}
        className={cn('pr-11', className)}
        {...props}
      />
      <button
        type="button"
        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted transition-colors hover:text-accent"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
      >
        {visible ? (
          <ShowPasswordIcon className="size-5" />
        ) : (
          <HidePasswordIcon className="size-5" />
        )}
      </button>
    </div>
  )
}
