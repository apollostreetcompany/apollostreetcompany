import { contactEmail, footer, nav } from '@/content'

export function Footer() {
  return (
    <footer className="border-t border-foreground/10">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-12 sm:flex-row sm:items-center md:px-8">
        <a href="#top" aria-label={nav.homeLabel}>
          <img src="/images/logo.png" alt={footer.logoAlt} width={400} height={326} loading="lazy" className="h-20 w-auto" />
        </a>
        <address className="not-italic">
          <a
            href={`mailto:${contactEmail}`}
            className="text-sm text-foreground/75 underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            {contactEmail}
          </a>
        </address>
      </div>
    </footer>
  )
}
