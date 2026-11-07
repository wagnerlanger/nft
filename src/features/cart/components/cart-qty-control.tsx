import { Button } from '@/components/ui/button'
import { cn } from '@/shared/utils/cn'

export function CartQtyControl({
  quantity,
  onDecrease,
  onIncrease,
  disabled,
  orientation = 'horizontal',
  className,
}: {
  quantity: number
  onDecrease: () => void
  onIncrease: () => void
  disabled?: boolean
  orientation?: 'horizontal' | 'vertical'
  className?: string
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center',
        orientation === 'vertical' ? 'flex-col gap-1' : 'h-10 gap-1',
        className,
      )}
      aria-label="Quantidade"
    >
      <Button
        type="button"
        className="grid place-items-center rounded-full px-2 text-xl font-normal"
        aria-label="Diminuir quantidade"
        disabled={disabled || quantity <= 1}
        onClick={onDecrease}
      >
        −
      </Button>
      <span className="min-w-8 text-center text-base font-medium tabular-nums text-foreground">
        {quantity}
      </span>
      <Button
        type="button"
        className="grid place-items-center rounded-full px-2 text-xl font-normal"
        aria-label="Aumentar quantidade"
        disabled={disabled}
        onClick={onIncrease}
      >
        +
      </Button>
    </div>
  )
}
