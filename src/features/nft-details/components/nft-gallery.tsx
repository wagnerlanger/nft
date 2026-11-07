import { useMemo, useState, type RefObject } from 'react'
import { PhotoSlider } from 'react-photo-view'

import { SearchIcon } from '@/components/icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/shared/utils/cn'

const GALLERY_COUNT = 10

export function NftGallery({
  imageUrl,
  alt,
  imageRef,
  isRare = false,
}: {
  imageUrl: string
  alt: string
  imageRef?: RefObject<HTMLImageElement | null>
  isRare?: boolean
}) {
  const images = useMemo(
    () => Array.from({ length: GALLERY_COUNT }, (_, index) => ({ key: `gallery-${index}`, src: imageUrl })),
    [imageUrl],
  )
  const [activeIndex, setActiveIndex] = useState(0)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerIndex, setViewerIndex] = useState(0)
  const active = images[activeIndex] ?? images[0]

  function openViewer(index: number) {
    setViewerIndex(index)
    setViewerOpen(true)
  }

  return (
    <>
      <div className="flex flex-col md:flex-row lg:flex-1 gap-8 sticky top-18">
        <div className="order-1 md:order-0 h-[72px] w-full md:h-auto md:w-[72px] relative shrink-0 md:w-[88px]">
          <ul className="absolute top-0 left-0 right-0 bottom-0 flex md:flex-col gap-3 h-full overflow-x-auto md:overflow-y-auto">
            {images.map((image, index) => (
              <li key={image.key}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Miniatura ${index + 1}`}
                  aria-pressed={index === activeIndex}
                  className={cn(
                    'block aspect-square w-[72px] md:w-full overflow-hidden rounded-md border-2 bg-card transition-colors',
                    index === activeIndex
                      ? 'border-primary'
                      : 'border-transparent hover:border-border-soft',
                  )}
                >
                  <img src={image.src} alt="" className="size-full object-cover" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="order-0 md:order-1 relative min-w-0 flex-1">
          <button
            type="button"
            onClick={() => openViewer(activeIndex)}
            className="group cursor-pointer relative aspect-square w-full overflow-hidden rounded-lg bg-card p-4"
            aria-label={`Ampliar ${alt}`}
          >
            <img
              ref={imageRef}
              src={active.src}
              alt={alt}
              className="size-full object-cover rounded-2xl"
            />
            {isRare ? (
              <span className="pointer-events-none absolute left-0 top-[14px] grid h-[29px] w-20 place-items-center bg-primary text-sm font-medium text-ink">
                RARO
              </span>
            ) : null}
          </button>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => openViewer(activeIndex)}
                className="absolute cursor-pointer rounded-full right-2 top-2 grid size-9 place-items-center bg-card border border-border text-foreground-soft transition-colors hover:text-primary"
                aria-label="Ampliar"
              >
                <SearchIcon className="size-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Ampliar</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <PhotoSlider
        images={images}
        visible={viewerOpen}
        index={viewerIndex}
        onIndexChange={setViewerIndex}
        onClose={() => setViewerOpen(false)}
        maskOpacity={0.7}
        bannerVisible
        photoClosable
      />
    </>
  )
}
