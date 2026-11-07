import type { Variants } from 'motion/react'

export const MOTION_EASE = [0.22, 1, 0.36, 1] as const
export const REVEAL_DURATION_S = 0.45
export const REVEAL_OFFSET_PX = 28

export type RevealDirection = 'up' | 'down' | 'left'

const hiddenOffset: Record<RevealDirection, { x?: number; y?: number }> = {
  up: { y: REVEAL_OFFSET_PX },
  down: { y: -REVEAL_OFFSET_PX },
  left: { x: -REVEAL_OFFSET_PX },
}

export function revealItemVariants(
  direction: RevealDirection,
  reduced: boolean | null,
): Variants {
  if (reduced) {
    return {
      hidden: { opacity: 1, x: 0, y: 0 },
      visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0 } },
    }
  }

  return {
    hidden: { opacity: 0, ...hiddenOffset[direction] },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: REVEAL_DURATION_S, ease: MOTION_EASE },
    },
  }
}

export function revealStaggerContainerVariants(
  reduced: boolean | null,
  staggerChildren = 0.1,
  delayChildren = 0.05,
): Variants {
  if (reduced) {
    return {
      hidden: {},
      visible: { transition: { staggerChildren: 0, delayChildren: 0 } },
    }
  }

  return {
    hidden: {},
    visible: {
      transition: { staggerChildren, delayChildren },
    },
  }
}
