import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/shared/utils/cn'

export function Slider({
  className,
  ...props
}: SliderPrimitive.SliderProps) {
  return (
    <SliderPrimitive.Root
      className={cn('relative flex w-full touch-none items-center select-none', className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1 grow rounded-full bg-border-soft">
        <SliderPrimitive.Range className="absolute h-full rounded-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        aria-label="Preço mínimo"
        className="block size-4 rounded-full border-2 border-ink bg-primary"
      />
      <SliderPrimitive.Thumb
        aria-label="Preço máximo"
        className="block size-4 rounded-full border-2 border-ink bg-primary"
      />
    </SliderPrimitive.Root>
  )
}
