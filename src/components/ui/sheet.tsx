import * as Dialog from '@radix-ui/react-dialog'

import { cn } from '@/shared/utils/cn'

export const Sheet = Dialog.Root
export const SheetTrigger = Dialog.Trigger
export const SheetClose = Dialog.Close
export const SheetTitle = Dialog.Title

export function SheetContent({
  className,
  children,
  ...props
}: Dialog.DialogContentProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/70" />
      <Dialog.Content
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[min(100%,22rem)] flex-col overflow-y-auto bg-background p-5 shadow-xl',
          className,
        )}
        {...props}
      >
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  )
}
