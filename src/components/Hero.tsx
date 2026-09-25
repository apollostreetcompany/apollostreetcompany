import { useEffect, useRef } from 'react'
import { ArrowDownRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { hero } from '@/content'
import { useT } from '@/lib/i18n'
import { prefersReducedMotion, useScrollProgress } from '@/lib/motion'
import { cn } from '@/lib/utils'

export function Hero() {
  const t = useT()
  const sectionRef = useScrollProgress<HTMLElement>('exit')
  const videoRef = useRef<HTMLVideoElement>(null)

  // Respect reduced-motion: keep the poster frame instead of looping video.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (prefersReducedMotion()) {
      video.pause()
      video.removeAttribute('autoplay')
    }
  }, [])

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* Video layer drifts down and slowly scales as the hero scrolls away. */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 will-change-transform"
        style={{
          transform:
            'translate3d(0, calc(var(--p, 0) * 18%), 0) scale(calc(1 + var(--p, 0) * 0.08))',
        }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/hero-loop.mp4"
          poster="/images/hero-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
      </div>
      {/* Legibility: the artwork's sun sits behind the headline, so a light navy veil
          plus a soft pool of shade under the type keep it readable. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[hsl(201_100%_8%/0.34)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_62%_46%_at_50%_50%,hsl(201_100%_7%/0.62),transparent_78%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-48 bg-gradient-to-b from-transparent to-background"
      />

      <div
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pt-36 pb-40 text-center"
        style={{
          opacity: 'calc(1 - var(--p, 0) * 1.4)',
          transform: 'translate3d(0, calc(var(--p, 0) * -60px), 0)',
        }}
      >
        <p className="animate-fade-rise mb-8 text-xs tracking-[0.28em] text-foreground/90 uppercase [text-shadow:0_1px_14px_hsl(201_100%_6%/0.9)]">
          {t(hero.eyebrow)}
        </p>
        <h1
          className="animate-fade-rise max-w-7xl text-6xl leading-[0.95] font-normal tracking-[-2.46px] text-balance [text-shadow:0_2px_30px_hsl(201_100%_6%/0.55)] sm:text-8xl md:text-9xl"
          style={{ fontFamily: "'Instrument Serif', 'Noto Serif JP', serif" }}
        >
          {t(hero.titleLead)}{' '}
          <em className="text-foreground/70 not-italic">{t(hero.titleEm)}</em>
        </h1>
        <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-relaxed text-foreground/80 [text-shadow:0_1px_18px_hsl(201_100%_6%/0.7)] sm:text-lg">
          {t(hero.lede)}
        </p>
        <div className="animate-fade-rise-delay-2 mt-12 flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
          <a
            href="#work-with-us"
            className={cn(buttonVariants({ variant: 'glass', size: 'pill-lg' }), 'cursor-pointer')}
          >
            {t(hero.primaryCta)}
          </a>
          <a
            href="#works"
            className="group inline-flex items-center gap-2 text-sm text-foreground/80 transition-colors hover:text-foreground"
          >
            {t(hero.secondaryCta)}
            <ArrowDownRight
              aria-hidden
              className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
            />
          </a>
        </div>
      </div>

      <div className="animate-fade-rise-delay-3 relative z-10 mx-auto flex w-full max-w-7xl items-end justify-between px-6 pb-8 md:px-8">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] tracking-[0.22em] text-foreground/70 uppercase" aria-label="Focus areas">
          {hero.rail.map((item) => (
            <li key={item.en}>{t(item)}</li>
          ))}
        </ul>
        <a
          href="#learn"
          className="hidden flex-col items-center gap-3 text-[11px] tracking-[0.22em] text-foreground/70 transition-colors hover:text-foreground sm:flex"
        >
          <span>{t(hero.scroll)}</span>
          <span className="block h-12 w-px overflow-hidden bg-foreground/20">
            <span className="animate-scroll-cue block h-full w-full bg-foreground" />
          </span>
        </a>
      </div>
    </section>
  )
}
