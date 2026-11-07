import { useEffect, useState, type FocusEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'motion/react'

import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { revealItemVariants } from '@/shared/motion/variants'
import { cn } from '@/shared/utils/cn'
import { ArrowRightIcon } from '@/components/icons'

const AUTOPLAY_INTERVAL_MS = 1231231231231236000
const STAGGER_DELAY_S = 0.06
const CHILD_DURATION_S = 0.32

type HeroSlide = {
  subtitle: string
  title: string
  titleSmall: string
  description: string
  descriptionSmall: string
  button: { text: string; variant: 'primary' | 'outline' | 'ghost'; href: string }
  image: { src: string; alt: string }
}

const slides: HeroSlide[] = [
  {
    subtitle: 'Bem-vindo à Kurio',
    title: 'SEJA DONO DO FUTURO\nDA ARTE DIGITAL',
    titleSmall: 'SEJA DONO DA CULTURA DIGITAL',
    description:
      'Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet.',
    descriptionSmall: 'Descubra NFTs selecionados de criadores do mundo todo.',
    button: { text: 'EXPLORAR', variant: 'primary', href: '#catalogo' },
    image: { src: '/images/nft.png', alt: 'Colecionável Kurio em destaque' },
  },
  {
    subtitle: 'Coleções em destaque',
    title: 'UMA PEÇA RARA\nPOR VEZ',
    titleSmall: 'UMA PEÇA RARA POR VEZ',
    description:
      'Explore coleções escolhidas à mão, com obras que misturam técnica, história e o agora da cultura digital.',
    descriptionSmall:  'Explore coleções escolhidas à mão.',
    button: { text: 'VER COLEÇÕES', variant: 'primary', href: '#catalogo' },
    image: { src: '/images/nft.png', alt: 'Coleção rara em destaque na Kurio' },
  },
  {
    subtitle: 'Criadores emergentes',
    title: 'APOIE QUEM\nESTÁ CRIANDO',
    titleSmall: 'APOIE QUEM ESTÁ CRIANDO',
    description:
      'Encontre artistas no começo da jornada e leve para a sua coleção o trabalho de quem ainda está escrevendo a próxima cena.',
    descriptionSmall: 'Encontre artistas no começo da jornada e leve para a sua coleção.',
    button: { text: 'CONHECER', variant: 'primary', href: '#catalogo' },
    image: { src: '/images/nft.png', alt: 'Obra de um criador emergente na Kurio' },
  },
]

export function HeroBanner() {
  const [api, setApi] = useState<CarouselApi>()
  const [activeIndex, setActiveIndex] = useState(0)
  const [pointerInside, setPointerInside] = useState(false)
  const [focusInside, setFocusInside] = useState(false)
  const [tabHidden, setTabHidden] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const count = slides.length
  const slide = slides[activeIndex]

  useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setActiveIndex(api.selectedScrollSnap())
    }

    api.on('select', onSelect)
    api.on('reInit', onSelect)
    const frame = requestAnimationFrame(onSelect)

    return () => {
      cancelAnimationFrame(frame)
      api.off('select', onSelect)
      api.off('reInit', onSelect)
    }
  }, [api])

  useEffect(() => {
    const onVisibility = () => {
      setTabHidden(document.visibilityState !== 'visible')
    }
    onVisibility()
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const autoplayPaused =
    prefersReducedMotion || tabHidden || pointerInside || focusInside

  useEffect(() => {
    if (!api || autoplayPaused) return

    const id = window.setInterval(() => {
      api.scrollNext()
    }, AUTOPLAY_INTERVAL_MS)

    return () => window.clearInterval(id)
  }, [api, activeIndex, autoplayPaused])

  const handleSectionFocusOut = (event: FocusEvent<HTMLElement>) => {
    const next = event.relatedTarget as Node | null
    const root = event.currentTarget
    if (!next || !root.contains(next)) {
      setFocusInside(false)
    }
  }

  const transitionImage = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }

  const textContainerVariants: Variants = prefersReducedMotion
    ? {
      hidden: {},
      visible: { transition: { staggerChildren: 0, delayChildren: 0 } },
      exit: { opacity: 0, transition: { duration: 0 } },
    }
    : {
      hidden: {},
      visible: {
        transition: { staggerChildren: STAGGER_DELAY_S, delayChildren: 0.05 },
      },
      exit: {
        opacity: 0,
        transition: { duration: 0.2 },
      },
    }

  const textChildVariants: Variants = prefersReducedMotion
    ? {
      hidden: { opacity: 1, y: 0 },
      visible: { opacity: 1, y: 0, transition: { duration: 0 } },
      exit: { opacity: 0, transition: { duration: 0 } },
    }
    : {
      hidden: { opacity: 0, y: 14 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: CHILD_DURATION_S, ease: [0.22, 1, 0.36, 1] },
      },
      exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
    }
  const heroContainerClass = "mx-auto w-full max-w-[1440px] px-4 pb-8 md:px-8 xl:px-[120px]";
  const heroRowClass = 'flex w-full min-h-[190px] md:min-h-[400px] items-center gap-4 md:gap-8 px-4 py-6 md:pl-6 lg:pl-10';
  const bannerRevealVariants = revealItemVariants('up', prefersReducedMotion)

  return (
    <motion.section
      className="relative"
      variants={bannerRevealVariants}
      initial="hidden"
      animate="visible"
      onPointerEnter={() => setPointerInside(true)}
      onPointerLeave={() => setPointerInside(false)}
      onFocusCapture={() => setFocusInside(true)}
      onBlurCapture={handleSectionFocusOut}
    >
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: 'start' }}
        className="relative z-0 w-full"
        aria-label="Destaques do hero"
      >
        <CarouselContent className="ml-0">
          {slides.map((slideItem, index) => {
            const isActive = index === activeIndex
            return (
              <CarouselItem key={slideItem.subtitle} className="pl-0">
                <div className={cn(heroContainerClass, 'h-full flex-1 flex flex-col')}>
                  <div className={cn(heroRowClass, 'flex-1 bg-primary-fade md:bg-none rounded-4xl overflow-hidden md:overflow-auto relative')}>
                    <div className="bg-primary-fade md:hidden rounded-full size-80 absolute top-1/2 -translate-y-1/2 -left-40 z-0"></div>
                    <div className="bg-primary-fade md:hidden rounded-full size-80 absolute top-1/2 -translate-y-1/2 left-20 z-0"></div>
                    <div
                      className="min-w-0 max-w-[600px] flex-1 relative z-2"
                      aria-hidden
                    >
                      <div className="md:hidden">
                        <div className="flex flex-col">
                          <p className="text-sm font-medium tracking-widest text-foreground-soft" >
                            {slideItem.subtitle}
                          </p>
                          <h1 className="mt-2 text-[18px] leading-tight font-bold text-foreground-soft md:text-[43px] lg:leading-[70px]">
                            {slideItem.titleSmall.split('\n').map((line, lineIndex) => (
                              <span key={line}>
                                {lineIndex > 0 && <br />}
                                {line}
                              </span>
                            ))}
                          </h1>
                          <p className="mt-2 max-w-[557px] text-sm leading-6 text-secondary">
                            {slideItem.descriptionSmall}
                          </p>
                          <div className="pointer-events-auto">
                            <Button
                              asChild
                              variant="ghost"
                              className="px-0 text-base text-primary after:absolute after:inset-0 after:z-0 after:content-['']"
                            >
                              <a href={slideItem.button.href}>{slideItem.button.text} <ArrowRightIcon className="size-4" /></a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-auto w-full max-w-[40%] md:max-w-[240px] lg:max-w-[450px] shrink-0 text-right relative z-2">
                      <motion.img
                        src={slideItem.image.src}
                        alt={slideItem.image.alt}
                        className="lg:w-full inline-block rounded-[24px] object-cover h-[40%] md:h-[240px] lg:h-[450px]"
                        animate={
                          prefersReducedMotion
                            ? { opacity: 1, scale: 1 }
                            : isActive
                              ? { opacity: 1, scale: 1 }
                              : { opacity: 0.88, scale: 0.985 }
                        }
                        transition={transitionImage}
                      />
                    </div>
                  </div>
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>
      <div
        className="absolute top-[80%] md:top-[90%] left-[50%] -translate-x-1/2 pointer-events-auto flex gap-2 self-end"
        role="tablist"
        aria-label="Destaques"
      >
        {Array.from({ length: count }).map((_, dotIndex) => (
          <button
            key={dotIndex}
            type="button"
            role="tab"
            aria-selected={dotIndex === activeIndex}
            aria-label={`Destaque ${dotIndex + 1}`}
            onClick={() => api?.scrollTo(dotIndex)}
            className={cn('h-2 cursor-pointer rounded-full transition-all duration-300', {
              'w-6 bg-primary': dotIndex === activeIndex,
              'w-2 bg-border-soft': dotIndex !== activeIndex,
            })}
          />
        ))}
      </div>
      <div
        className={cn(
          'pointer-events-none absolute inset-0 z-10 flex items-center gap-8',
          heroContainerClass,
        )}
      >
        <div className={heroRowClass}>
          <div className="hidden md:block min-w-0 max-w-[600px] flex-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeIndex}
                className="flex flex-col"
                variants={textContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.p
                  variants={textChildVariants}
                  className="text-sm font-medium tracking-widest text-foreground-soft"
                >
                  {slide.subtitle}
                </motion.p>
                <motion.h1
                  variants={textChildVariants}
                  className="mt-2 text-[32px] leading-tight font-bold text-foreground-soft md:text-[43px] lg:leading-[70px]"
                >
                  {slide.title.split('\n').map((line, lineIndex) => (
                    <span key={line}>
                      {lineIndex > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </motion.h1>
                <motion.p
                  variants={textChildVariants}
                  className="mt-2 max-w-[557px] text-sm leading-6 text-secondary"
                >
                  {slide.description}
                </motion.p>
                <motion.div variants={textChildVariants} className="pointer-events-auto mt-6 w-fit">
                  <Button
                    asChild
                    variant={slide.button.variant}
                    className="h-10 min-w-[140px] px-4 text-base"
                  >
                    <a href={slide.button.href}>{slide.button.text}</a>
                  </Button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="ml-auto w-full max-w-[140px] md:max-w-[240px] lg:max-w-[450px] shrink-0 text-right"></div>
        </div>
      </div>
    </motion.section>
  )
}
