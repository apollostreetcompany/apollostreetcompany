import { useEffect, useRef } from 'react'
import { howWeWork } from '@/content'
import { useT } from '@/lib/i18n'
import { Reveal, prefersReducedMotion } from '@/lib/motion'

export function HowWeWork() {
  const t = useT()
  const videoRef = useRef<HTMLVideoElement>(null)

  // Play the background only while the section is on screen.
  useEffect(() => {
    const video = videoRef.current
    if (!video || prefersReducedMotion() || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void video.play().catch(() => {})
      else video.pause()
    })
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className="relative isolate overflow-hidden py-28 md:py-44">
      <div aria-hidden className="absolute inset-0 -z-10">
        <video
          ref={videoRef}
          className="h-full w-full object-cover opacity-35"
          src="/videos/how-we-work-bg.mp4"
          poster="/images/how-we-work-poster.jpg"
          loop
          muted
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/40 to-background" />
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <Reveal as="p" className="text-xs tracking-[0.28em] text-gold">
          {t(howWeWork.eyebrow)}
        </Reveal>
        <Reveal as="h2" delay={100} className="mt-6 text-5xl leading-[1] tracking-[-1.5px] md:text-7xl">
          {t(howWeWork.title)}
        </Reveal>

        <div className="mt-16 md:mt-24">
          {howWeWork.rows.map((row, index) => (
            <Reveal
              key={row.number}
              as="article"
              delay={index * 120}
              className="relative grid gap-6 py-10 md:grid-cols-12 md:gap-10 md:py-14"
            >
              <span aria-hidden className="reveal-line absolute inset-x-0 top-0 h-px bg-foreground/20" />
              <div className="font-display text-2xl text-gold/80 md:col-span-1">{row.number}</div>
              <h3 className="text-4xl leading-none md:col-span-4 lg:text-5xl">{t(row.title)}</h3>
              <p className="text-base leading-relaxed text-foreground/75 md:col-span-4 md:text-lg">
                {t(row.body)}
              </p>
              <ul className="flex flex-wrap content-start gap-2 md:col-span-3 md:justify-end">
                {row.tags.map((tag) => (
                  <li
                    key={tag.en}
                    className="liquid-glass rounded-full bg-foreground/[0.03] px-4 py-1.5 text-xs text-foreground/85"
                  >
                    {t(tag)}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
