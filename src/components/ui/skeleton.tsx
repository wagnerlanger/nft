import { cn } from '@/shared/utils/cn'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-card via-surface-raised to-card motion-reduce:animate-none',
        className,
      )}
    />
  )
}
