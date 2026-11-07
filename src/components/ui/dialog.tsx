import * as DialogPrimitive from '@radix-ui/react-dialog'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  createContext,
  useContext,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react'

import { CloseIcon } from '@/components/icons'
import { MOTION_EASE } from '@/shared/motion/variants'
import { cn } from '@/shared/utils/cn'

const DialogOpenContext = createContext(false)

export function Dialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
  ...props
}: ComponentProps<typeof DialogPrimitive.Root>) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const isControlled = openProp !== undefined
  const open = isControlled ? openProp : uncontrolledOpen

  return (
    <DialogOpenContext.Provider value={Boolean(open)}>
      <DialogPrimitive.Root
        open={openProp}
        defaultOpen={defaultOpen}
        onOpenChange={(next) => {
          if (!isControlled) setUncontrolledOpen(next)
          onOpenChange?.(next)
        }}
        {...props}
      >
        {children}
      </DialogPrimitive.Root>
    </DialogOpenContext.Provider>
  )
}

export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close
export const DialogTitle = DialogPrimitive.Title
export const DialogDescription = DialogPrimitive.Description

export function DialogContent({
  className,
  children,
  showClose = true,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content> & { showClose?: boolean }) {
  const open = useContext(DialogOpenContext)
  const prefersReducedMotion = useReducedMotion()

  const overlayTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.22, ease: MOTION_EASE }

  const contentTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.35, ease: MOTION_EASE }

  return (
    <DialogPrimitive.Portal forceMount>
      <AnimatePresence>
        {open ? (
          <DialogPrimitive.Overlay key="dialog-overlay" asChild forceMount>
            <motion.div
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={overlayTransition}
            />
          </DialogPrimitive.Overlay>
        ) : null}
        {open ? (
          <DialogPrimitive.Content key="dialog-content" asChild forceMount {...props}>
            <motion.div
              className={cn(
                'fixed top-1/2 left-1/2 z-50 max-h-[min(100vh-2rem,44rem)] w-[min(100%-2rem,500px)] overflow-y-auto border-b-10 border-primary bg-card p-6 shadow-xl focus:outline-none',
                className,
              )}
              initial={
                prefersReducedMotion
                  ? { opacity: 0, x: '-50%', y: '-50%' }
                  : { opacity: 0, x: '-50%', y: 'calc(-50% + 16px)' }
              }
              animate={{ opacity: 1, x: '-50%', y: '-50%' }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0, x: '-50%', y: '-50%' }
                  : { opacity: 0, x: '-50%', y: 'calc(-50% + 16px)' }
              }
              transition={contentTransition}
            >
              {children as ReactNode}
              {showClose ? (
                <DialogPrimitive.Close
                  className="absolute top-4 right-4 text-primary transition-colors hover:text-accent"
                  aria-label="Fechar"
                >
                  <CloseIcon className="size-5" />
                </DialogPrimitive.Close>
              ) : null}
            </motion.div>
          </DialogPrimitive.Content>
        ) : null}
      </AnimatePresence>
    </DialogPrimitive.Portal>
  )
}
