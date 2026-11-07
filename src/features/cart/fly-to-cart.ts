import { animate } from 'motion/react'

import { MOTION_EASE } from '@/shared/motion/variants'

function visibleCartTarget() {
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-cart-target]'))
  return targets.find((node) => {
    const rect = node.getBoundingClientRect()
    return rect.width > 0 && rect.height > 0
  })
}

export async function flyImageToCart(source: HTMLElement, imageUrl: string) {
  const target = visibleCartTarget()
  if (!target) return

  const from = source.getBoundingClientRect()
  const to = target.getBoundingClientRect()
  const clone = document.createElement('img')
  clone.src = imageUrl
  clone.alt = ''
  clone.setAttribute('aria-hidden', 'true')
  Object.assign(clone.style, {
    position: 'fixed',
    left: `${from.left}px`,
    top: `${from.top}px`,
    width: `${from.width}px`,
    height: `${from.height}px`,
    objectFit: 'cover',
    borderRadius: '1.5rem',
    zIndex: '9999',
    pointerEvents: 'none',
    margin: '0',
  })
  document.body.appendChild(clone)

  const deltaX = to.left + to.width / 2 - (from.left + from.width / 2)
  const deltaY = to.top + to.height / 2 - (from.top + from.height / 2)

  try {
    await animate(
      clone,
      {
        x: deltaX,
        y: deltaY,
        scale: 0.18,
        opacity: 0.35,
        borderRadius: '999px',
      },
      { duration: 0.7, ease: MOTION_EASE },
    ).finished
  } finally {
    clone.remove()
  }
}
