import { buttonVariants } from '@/components/ui/button'
import { contact, contactEmail } from '@/content'
import { useT } from '@/lib/i18n'
import { Reveal, useScrollProgress } from '@/lib/motion'
import { cn } from '@/lib/utils'

export function Contact() {
  const t = useT()
  const sectionRef = useScrollProgress<HTMLElement>('through')

  return (
    <section id="work-with-us" ref={sectionRef} className="relative isolate overflow-hidden py-32 md:py-48">
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src="/images/contact-wave.jpg"
          alt=""
          loading="lazy"
          className="animate-slow-zoom h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/55 to-background" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-6 left-0 -z-10 font-display text-[clamp(7rem,24vw,22rem)] leading-none whitespace-nowrap text-foreground/[0.05] select-none"
        style={{ transform: 'translate3d(calc(var(--p, 0.5) * 16% - 4%), 0, 0)' }}
      >
        {t(contact.watermark)}
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-12 md:px-8">
        <div className="md:col-span-7">
          <Reveal as="p" className="text-xs tracking-[0.28em] text-gold">
            {t(contact.eyebrow)}
          </Reveal>
          <Reveal as="h2" delay={100} className="mt-6 text-5xl leading-[1] tracking-[-1.5px] text-balance md:text-7xl">
            {t(contact.title)}
          </Reveal>
        </div>
        <div className="flex flex-col justify-end md:col-span-4 md:col-start-9">
          <Reveal as="p" delay={200} className="text-base leading-relaxed text-foreground/75 md:text-lg">
            {t(contact.body)}
          </Reveal>
          <Reveal delay={300} className="mt-10">
            <a
              href={`mailto:${contactEmail}`}
              className={cn(buttonVariants({ variant: 'glass', size: 'pill-lg' }), 'bg-foreground/[0.04]')}
            >
              {t(contact.cta)}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
