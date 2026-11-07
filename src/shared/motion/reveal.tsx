import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

import {
  revealItemVariants,
  type RevealDirection,
} from '@/shared/motion/variants'

export type { RevealDirection }

type RevealProps = {
  children: ReactNode
  direction?: RevealDirection
  mode?: 'mount' | 'inView'
  delay?: number
  className?: string
  amount?: number
}

export function Reveal({
  children,
  direction = 'up',
  mode = 'inView',
  delay = 0,
  className,
  amount = 0.2,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion()
  const variants = revealItemVariants(direction, prefersReducedMotion)

  const shared = {
    className,
    variants,
    initial: 'hidden' as const,
    viewport: { once: true, amount },
    ...(delay > 0 && !prefersReducedMotion ? { transition: { delay } } : {}),
  }

  if (mode === 'mount') {
    return (
      <motion.div {...shared} animate="visible">
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div {...shared} whileInView="visible">
      {children}
    </motion.div>
  )
}
