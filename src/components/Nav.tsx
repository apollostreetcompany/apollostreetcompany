import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { nav, type Lang } from '@/content'
import { useLang, useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (!sections.length || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}

const sectionIds = nav.links.map((link) => link.href.slice(1))

function LangToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLang()
  const options: { value: Lang; label: string; htmlLang: string }[] = [
    { value: 'en', label: 'EN', htmlLang: 'en' },
    { value: 'jp', label: 'JP', htmlLang: 'ja' },
  ]
  return (
    <div className={cn('flex items-center gap-1 text-xs tracking-[0.2em]', className)} aria-label="Language">
      {options.map((option, index) => (
        <span key={option.value} className="flex items-center gap-1">
          {index > 0 && <span className="text-muted-foreground/50">/</span>}
          <button
            type="button"
            lang={option.htmlLang}
            aria-pressed={lang === option.value}
            onClick={() => setLang(option.value)}
            className={cn(
              'cursor-pointer px-1 py-1 transition-colors hover:text-foreground',
              lang === option.value ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            {option.label}
          </button>
        </span>
      ))}
    </div>
  )
}

export function Nav() {
  const t = useT()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useActiveSection(sectionIds)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6">
      <nav
        aria-label="Primary navigation"
        className={cn(
          'relative z-10 mx-auto flex max-w-7xl items-center justify-between rounded-full transition-all duration-500',
          scrolled
            ? 'liquid-glass bg-[hsl(201_100%_9%/0.82)] py-2 pr-3 pl-4 md:pr-4 md:pl-5'
            : 'px-2 py-3 md:px-4',
        )}
        // Stronger blur than the base glass so page text never reads through the bar.
        style={scrolled ? { backdropFilter: 'blur(18px) saturate(1.2)', WebkitBackdropFilter: 'blur(18px) saturate(1.2)' } : undefined}
      >
        <a href="#top" aria-label={nav.homeLabel} className="shrink-0">
          <img
            src="/images/logo.png"
            alt={nav.logoAlt}
            width={400}
            height={326}
            className={cn('w-auto transition-all duration-500', scrolled ? 'h-10' : 'h-14 md:h-16')}
          />
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {nav.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={active === link.href.slice(1) ? 'true' : undefined}
                className={cn(
                  'text-xs tracking-[0.2em] transition-colors hover:text-foreground',
                  active === link.href.slice(1)
                    ? 'text-foreground'
                    : scrolled
                      ? 'text-muted-foreground'
                      : 'text-foreground/80 [text-shadow:0_1px_12px_hsl(201_100%_6%/0.9)]',
                )}
              >
                {t(link.label)}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3 md:gap-5">
          <LangToggle />
          <a
            href="#work-with-us"
            className={cn(buttonVariants({ variant: 'glass', size: 'pill' }), 'hidden lg:inline-flex')}
          >
            {t(nav.cta)}
          </a>
          <Button
            variant="glass"
            size="pill"
            className="px-4 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="text-xs tracking-[0.2em]">{t(nav.menu)}</span>
            {open ? <X aria-hidden /> : <Menu aria-hidden />}
          </Button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-0 z-0 bg-[hsl(201_100%_8%/0.92)] backdrop-blur-xl lg:hidden"
      >
        <div className="flex h-full flex-col justify-center px-8">
          <ul className="space-y-6">
            {nav.links.map((link, index) => (
              <li
                key={link.href}
                className="animate-fade-rise"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-4xl text-foreground sm:text-5xl"
                >
                  {t(link.label)}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#work-with-us"
            onClick={() => setOpen(false)}
            className={cn(buttonVariants({ variant: 'glass', size: 'pill-lg' }), 'animate-fade-rise-delay-2 mt-14 self-start')}
          >
            {t(nav.cta)}
          </a>
        </div>
      </div>
    </header>
  )
}
