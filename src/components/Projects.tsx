import { ArrowUpRight } from 'lucide-react'
import { works, type Project } from '@/content'
import { useT } from '@/lib/i18n'
import { Reveal } from '@/lib/motion'
import { cn } from '@/lib/utils'

// Bento layout on large screens: two wide cards, then three.
const spans = ['lg:col-span-3', 'lg:col-span-3', 'lg:col-span-2', 'lg:col-span-2', 'lg:col-span-2']

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const t = useT()
  const wide = index < 2
  return (
    <Reveal
      as="article"
      delay={(index % 3) * 120}
      className={cn('group', spans[index], index === 4 && 'md:col-span-2 lg:col-span-2')}
    >
      <a
        href={project.href}
        target="_blank"
        rel="noreferrer"
        className="liquid-glass flex h-full flex-col rounded-3xl bg-foreground/[0.02] p-3 transition-[transform,background-color] duration-500 hover:-translate-y-1 hover:bg-foreground/[0.05]"
      >
        <div
          className={cn('overflow-hidden rounded-2xl', wide ? 'aspect-[16/10]' : 'aspect-[4/3]')}
          style={{ backgroundColor: project.ground }}
        >
          <img
            src={project.image}
            alt={project.alt}
            loading="lazy"
            decoding="async"
            className={cn(
              'h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]',
              // Logos on white blend into their ground colour instead of showing a white box.
              project.fit === 'logo' && 'object-contain p-6 mix-blend-multiply md:p-10',
              project.fit === 'contain' && 'object-contain',
              project.fit === 'cover' && 'object-cover object-top',
            )}
          />
        </div>
        <div className="flex flex-1 flex-col px-4 pt-7 pb-5 md:px-5">
          <p className="text-xs tracking-[0.22em] text-gold uppercase">{t(project.eyebrow)}</p>
          <h3 className={cn('mt-3 leading-none', wide ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl')}>
            {t(project.name)}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-foreground/70 md:text-base">{t(project.body)}</p>
          <span className="mt-auto inline-flex items-center gap-2 pt-7 text-sm text-foreground/85 transition-colors group-hover:text-foreground">
            {t(works.visit)}
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </a>
    </Reveal>
  )
}

export function Projects() {
  const t = useT()
  return (
    <section id="works" className="relative py-28 md:py-44">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <Reveal as="p" className="text-xs tracking-[0.28em] text-gold">
          {t(works.eyebrow)}
        </Reveal>
        <Reveal as="h2" delay={100} className="mt-6 max-w-4xl text-5xl leading-[1] tracking-[-1.5px] text-balance md:text-7xl">
          {t(works.title)}
        </Reveal>

        <div className="mt-16 grid gap-5 md:mt-24 md:grid-cols-2 lg:grid-cols-6">
          {works.projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
