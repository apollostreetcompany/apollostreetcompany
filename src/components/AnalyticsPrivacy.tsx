import { useSyncExternalStore } from 'react'
import { analyticsPrivacy } from '@/content'
import { useT } from '@/lib/i18n'
import { getAnalyticsState, subscribeAnalytics, turnAnalyticsOff } from '@/lib/analytics'

export function AnalyticsPrivacy() {
  const t = useT()
  const state = useSyncExternalStore(subscribeAnalytics, getAnalyticsState)
  const allowed = state.preference === 'on' && state.production && !state.browserSignal
  const choice = state.preference === 'on' && !state.production
    ? analyticsPrivacy.productionOnly
    : state.browserSignal && state.preference === 'on'
      ? analyticsPrivacy.signalOff
      : analyticsPrivacy.choice[state.preference]

  return (
    <section className="mx-auto max-w-7xl px-6 pb-12 md:px-8" aria-label={t(analyticsPrivacy.title)}>
      <div className="max-w-2xl border-t border-foreground/10 pt-6 text-sm leading-relaxed text-foreground/80">
        <details>
          <summary className="cursor-pointer py-2 text-foreground underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4">
            {t(analyticsPrivacy.title)}
          </summary>
          <div className="space-y-3 py-3">
            <p>{t(analyticsPrivacy.disclosure)}</p>
            <p>{t(analyticsPrivacy.terms)}</p>
          </div>
        </details>
        <div className="mt-3 flex flex-col items-start gap-3">
          <button
            type="button"
            onClick={turnAnalyticsOff}
            disabled={state.preference === 'saved-off'}
            aria-describedby="analytics-choice"
            className="min-h-11 rounded-md border border-foreground/30 px-4 py-2 text-left text-foreground hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-default disabled:opacity-75"
          >
            {t(state.preference === 'saved-off' ? analyticsPrivacy.offSaved : analyticsPrivacy.turnOff)}
          </button>
          <p id="analytics-choice" role="status">{t(choice)}</p>
          {allowed && (
            <div className="space-y-1">
              <p>{t(analyticsPrivacy.posthog[state.posthog])}</p>
              <p>{t(analyticsPrivacy.datafast[state.datafast])}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
