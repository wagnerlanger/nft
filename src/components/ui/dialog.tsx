import * as DialogPrimitive from '@radix-ui/react-dialog'
import type { ComponentProps } from 'react'

import { CloseIcon } from '@/components/icons'
import { cn } from '@/shared/utils/cn'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close
export const DialogTitle = DialogPrimitive.Title
export const DialogDescription = DialogPrimitive.Description

export function DialogOverlay({ className, ...props }: ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn('fixed inset-0 z-50 bg-black/70 backdrop-blur-sm', className)}
      {...props}
    />
  )
}

export function DialogContent({
  className,
  children,
  showClose = true,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content> & { showClose?: boolean }) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          'fixed top-1/2 left-1/2 z-50 max-h-[min(100vh-2rem,44rem)] w-[min(100%-2rem,26.5rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-md border border-border bg-card p-6 shadow-xl focus:outline-none',
          className,
        )}
        {...props}
      >
        {children}
        {showClose ? (
          <DialogPrimitive.Close
            className="absolute top-4 right-4 text-primary transition-colors hover:text-accent"
            aria-label="Fechar"
          >
            <CloseIcon className="size-5" />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}
