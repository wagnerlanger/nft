import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion, type Variants } from 'motion/react'

import { cn } from '@/shared/utils/cn'

const LOGO_LETTERS = ['K', 'U', 'R', 'I', 'O'] as const

const logoContainerVariants: Variants = {
  rest: {},
  hover: {
    transition: { staggerChildren: 0.05 },
  },
}

const logoLetterVariants: Variants = {
  rest: { y: 0 },
  hover: {
    y: [0, -6, 0],
    transition: { duration: 0.35, ease: 'easeOut' },
  },
}

export function BrandLogo({ className }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <Link
      to="/"
      className={cn('font-bold tracking-[0.18em] text-foreground hover:text-primary', className)}
    >
      {prefersReducedMotion ? (
        'KURIO'
      ) : (
        <motion.span
          className="inline-flex"
          aria-label="Kurio"
          initial="rest"
          whileHover="hover"
          variants={logoContainerVariants}
        >
          {LOGO_LETTERS.map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              className="inline-block"
              aria-hidden="true"
              variants={logoLetterVariants}
            >
              {letter}
            </motion.span>
          ))}
        </motion.span>
      )}
    </Link>
  )
}
