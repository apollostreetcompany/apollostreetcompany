import { approach } from '@/content'
import { useT } from '@/lib/i18n'
import { Reveal, useScrollProgress } from '@/lib/motion'

export function Approach() {
  const t = useT()
  const sectionRef = useScrollProgress<HTMLElement>('through')

  return (
    <section id="learn" ref={sectionRef} className="relative isolate overflow-hidden py-28 md:py-44">
      <div
        aria-hidden
        className="pointer-events-none absolute top-10 left-0 -z-10 font-display text-[clamp(7rem,24vw,22rem)] leading-none whitespace-nowrap text-foreground/[0.04] select-none"
        style={{ transform: 'translate3d(calc(var(--p, 0.5) * -18% + 6%), 0, 0)' }}
      >
        {t(approach.watermark)}
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <Reveal as="p" className="text-xs tracking-[0.28em] text-gold">
          {t(approach.eyebrow)}
        </Reveal>
        <Reveal as="h2" delay={100} className="mt-6 max-w-4xl text-5xl leading-[1] tracking-[-1.5px] text-balance md:text-7xl">
          {t(approach.title)}
        </Reveal>

        <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12">
          <Reveal as="p" delay={150} className="font-display text-3xl leading-tight text-foreground/75 md:col-span-5 md:text-4xl">
            {t(approach.statement)}
          </Reveal>
          <div className="space-y-6 md:col-span-6 md:col-start-7">
            {approach.body.map((paragraph, index) => (
              <Reveal key={paragraph.en} as="p" delay={200 + index * 100} className="text-base leading-relaxed text-muted-foreground md:text-lg">
                {t(paragraph)}
              </Reveal>
            ))}
            <ul className="pt-6">
              {approach.list.map((item, index) => (
                <Reveal key={item.en} as="li" delay={300 + index * 120} className="relative py-5 text-lg text-foreground">
                  <span aria-hidden className="reveal-line absolute inset-x-0 top-0 h-px bg-foreground/15" />
                  {t(item)}
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
