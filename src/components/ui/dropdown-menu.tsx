import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'

import { cn } from '@/shared/utils/cn'

export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

export function DropdownMenuContent({
  className,
  ...props
}: DropdownMenuPrimitive.DropdownMenuContentProps) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={8}
        className={cn(
          'z-50 min-w-56 rounded-md border border-border bg-card p-1 text-foreground shadow-lg',
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

export function DropdownMenuItem({
  className,
  ...props
}: DropdownMenuPrimitive.DropdownMenuItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        'cursor-pointer rounded-sm px-3 py-2 text-sm outline-none data-[highlighted]:bg-surface-raised data-[highlighted]:text-accent',
        className,
      )}
      {...props}
    />
  )
}
