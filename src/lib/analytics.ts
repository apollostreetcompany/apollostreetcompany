const POSTHOG_TOKEN = 'phc_A3jp2cuP6qTXg627mtsrzMjgdhDGzZudciWkf3g8u457'
const POSTHOG_HOST = 'https://us.i.posthog.com'
const PREFERENCE_KEY = 'asc-analytics-off'
const productionHosts = new Set(['apollostreetcompany.com', 'www.apollostreetcompany.com'])
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const datafastProperty = Object.freeze({
  websiteId: '6ac0f66c65d875aa9cccb2fb',
  trackingId: 'dfid_Iv3lSSfGtZs0RyiunPS8J',
  script: 'https://datafa.st/js/script.cookieless.js',
  cookieless: true,
})

type Preference = 'checking' | 'on' | 'saved-off' | 'storage-unavailable' | 'storage-invalid' | 'off-unsaved'
type ProviderState = 'idle' | 'loading' | 'loaded' | 'failed' | 'stopped'

type AnalyticsState = {
  preference: Preference
  production: boolean
  browserSignal: boolean
  posthog: ProviderState
  datafast: ProviderState
}

type PostHogClient = {
  capture: (event: '$pageview', properties: Record<string, unknown>) => unknown
  opt_out_capturing?: () => void
}

type PostHogConfiguration = Record<string, unknown> & {
  loaded: (client: PostHogClient) => void
  before_send: (event: unknown) => Record<string, unknown> | null
}

type PostHogQueue = unknown[] & {
  _i: [string, PostHogConfiguration, string][]
  __SV: number
  init: (token: string, config: PostHogConfiguration) => void
}

declare global {
  interface Window {
    posthog?: PostHogClient | PostHogQueue
    doNotTrack?: string
  }
}

let state: AnalyticsState = {
  preference: 'checking',
  production: false,
  browserSignal: false,
  posthog: 'idle',
  datafast: 'idle',
}
const listeners = new Set<() => void>()
let initialized = false
let offInMemory = false
let pageviewCaptured = false
let script: HTMLScriptElement | undefined
let loadTimer: number | undefined
let controller: AbortController | undefined
let datafastController: AbortController | undefined
let datafastTimer: number | undefined

export function getAnalyticsState() {
  return state
}

export function subscribeAnalytics(listener: () => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

function update(patch: Partial<AnalyticsState>) {
  state = { ...state, ...patch }
  listeners.forEach((listener) => listener())
}

function isPublicProductionPage() {
  return import.meta.env.PROD && window.location.protocol === 'https:' &&
    productionHosts.has(window.location.host) && window.location.pathname === '/'
}

function browserOptOut() {
  return ('globalPrivacyControl' in navigator && navigator.globalPrivacyControl === true) ||
    [navigator.doNotTrack, window.doNotTrack, 'msDoNotTrack' in navigator ? navigator.msDoNotTrack : undefined]
      .some((value) => value === '1' || value === 'yes')
}

function readPreference(): Preference {
  if (offInMemory) return state.preference === 'saved-off' ? 'saved-off' : 'off-unsaved'
  try {
    const stored = localStorage.getItem(PREFERENCE_KEY)
    if (stored === '1') return 'saved-off'
    if (stored !== null) return 'storage-invalid'
    const checkKey = `${PREFERENCE_KEY}-storage-check`
    const sentinel = `${Date.now()}-${Math.random()}`
    localStorage.setItem(checkKey, sentinel)
    const writable = localStorage.getItem(checkKey) === sentinel
    localStorage.removeItem(checkKey)
    return writable && localStorage.getItem(checkKey) === null ? 'on' : 'storage-unavailable'
  } catch {
    return 'storage-unavailable'
  }
}

function permitted() {
  const production = isPublicProductionPage()
  const browserSignal = browserOptOut()
  const preference = readPreference()
  if (state.production !== production || state.browserSignal !== browserSignal || state.preference !== preference) {
    update({ production, browserSignal, preference })
  }
  return !offInMemory && production && !browserSignal && preference === 'on'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function sanitizePostHogEvent(event: unknown): Record<string, unknown> | null {
  if (state.posthog !== 'loaded' || !permitted() || !isRecord(event) || event.event !== '$pageview') return null
  const properties = event.properties
  if (!isRecord(properties) || typeof properties.distinct_id !== 'string' ||
    !uuidPattern.test(properties.distinct_id) || properties.distinct_id !== properties.$device_id) return null

  const safeProperties: Record<string, unknown> = {
    token: POSTHOG_TOKEN,
    distinct_id: properties.distinct_id,
    $device_id: properties.distinct_id,
    $geoip_disable: true,
    $process_person_profile: false,
    $host: window.location.hostname,
    $pathname: '/',
    $current_url: `https://${window.location.hostname}/`,
    $lib: 'web',
  }
  if (typeof properties.$lib_version === 'string' && /^\d{1,4}\.\d{1,4}\.\d{1,4}$/.test(properties.$lib_version)) {
    safeProperties.$lib_version = properties.$lib_version
  }
  const safeEvent: Record<string, unknown> = { event: '$pageview', properties: safeProperties }
  if (typeof event.uuid === 'string' && uuidPattern.test(event.uuid)) {
    safeEvent.uuid = event.uuid
    safeProperties.$insert_id = event.uuid
  }
  if (event.timestamp instanceof Date && Number.isFinite(event.timestamp.getTime())) {
    safeEvent.timestamp = event.timestamp
  } else if (typeof event.timestamp === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(event.timestamp) &&
    Number.isFinite(Date.parse(event.timestamp))) {
    safeEvent.timestamp = event.timestamp
  }
  return safeEvent
}

function stopPostHog() {
  controller?.abort()
  window.clearTimeout(loadTimer)
  script?.remove()
  if (Array.isArray(window.posthog)) {
    window.posthog.length = 0
    window.posthog._i.length = 0
  } else {
    try { window.posthog?.opt_out_capturing?.() } catch {}
  }
}

function stopDatafast() {
  datafastController?.abort()
  window.clearTimeout(datafastTimer)
}

export function datafastPageviewPayload() {
  return {
    type: 'pageview',
    websiteId: datafastProperty.trackingId,
    domain: 'www.apollostreetcompany.com',
    href: `https://${window.location.hostname}/`,
    referrer: null,
    visitorId: window.crypto.randomUUID(),
    sessionId: `s${window.crypto.randomUUID()}`,
    cookieless: true,
  }
}

async function sendDatafastPageview() {
  if (!permitted() || state.datafast !== 'idle') return
  if (navigator.webdriver) {
    update({ datafast: 'stopped' })
    return
  }
  datafastController = new AbortController()
  update({ datafast: 'loading' })
  datafastTimer = window.setTimeout(() => {
    if (state.datafast !== 'loading') return
    stopDatafast()
    update({ datafast: 'failed' })
  }, 8000)
  try {
    const payload = datafastPageviewPayload()
    if (!permitted()) {
      stopDatafast()
      update({ datafast: 'stopped' })
      return
    }
    const response = await window.fetch('https://datafa.st/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      keepalive: false,
      signal: datafastController.signal,
      body: JSON.stringify(payload),
    })
    if (getAnalyticsState().datafast !== 'loading' || !permitted()) return
    update({ datafast: response.ok ? 'loaded' : 'failed' })
  } catch {
    if (getAnalyticsState().datafast === 'loading') update({ datafast: 'failed' })
  } finally {
    window.clearTimeout(datafastTimer)
  }
}

export function turnAnalyticsOff() {
  offInMemory = true
  stopPostHog()
  stopDatafast()
  let preference: Preference = 'off-unsaved'
  try {
    localStorage.setItem(PREFERENCE_KEY, '1')
    if (localStorage.getItem(PREFERENCE_KEY) === '1') preference = 'saved-off'
  } catch {}
  update({ preference, posthog: 'stopped', datafast: 'stopped' })
}

export function initializeAnalytics() {
  if (initialized) return
  initialized = true
  update({
    preference: readPreference(),
    production: isPublicProductionPage(),
    browserSignal: browserOptOut(),
  })
  window.addEventListener('storage', (event) => {
    if (event.key !== PREFERENCE_KEY && event.key !== null) return
    const preference = readPreference()
    update({ preference, browserSignal: browserOptOut() })
    if (!permitted()) {
      stopPostHog()
      stopDatafast()
      update({ posthog: 'stopped', datafast: 'stopped' })
    }
  })
  if (!permitted()) return
  if (typeof window.fetch !== 'function' || typeof window.AbortController !== 'function') {
    update({ posthog: 'failed', datafast: 'failed' })
    return
  }
  void sendDatafastPageview()
  if (window.posthog) {
    update({ posthog: 'failed' })
    return
  }

  controller = new AbortController()
  update({ posthog: 'loading' })
  const pending: unknown[] = []
  const initializations: [string, PostHogConfiguration, string][] = []
  const queue: PostHogQueue = Object.assign(pending, {
    _i: initializations,
    __SV: 1,
    init: (token: string, config: PostHogConfiguration) => { initializations.push([token, config, 'posthog']) },
  })
  window.posthog = queue
  queue.init(POSTHOG_TOKEN, {
    api_host: POSTHOG_HOST,
    api_transport: 'fetch',
    fetch_options: { credentials: 'omit', referrerPolicy: 'no-referrer', keepalive: false, signal: controller.signal },
    disable_beacon: true,
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: false,
    capture_dead_clicks: false,
    capture_performance: false,
    capture_exceptions: false,
    disable_session_recording: true,
    disable_surveys: true,
    disable_web_experiments: true,
    disable_conversations: true,
    disable_product_tours: true,
    advanced_disable_flags: true,
    advanced_disable_decide: true,
    advanced_disable_feature_flags: true,
    advanced_disable_toolbar_metrics: true,
    disable_external_dependency_loading: true,
    persistence: 'memory',
    disable_persistence: true,
    cross_subdomain_cookie: false,
    person_profiles: 'never',
    save_campaign_params: false,
    save_referrer: false,
    respect_dnt: true,
    debug: false,
    ip: false,
    disable_geoip: true,
    request_batching: false,
    before_send: sanitizePostHogEvent,
    loaded: (client) => {
      if (state.posthog !== 'loading') return
      window.clearTimeout(loadTimer)
      if (!permitted()) {
        stopPostHog()
        update({ posthog: 'stopped', preference: readPreference(), browserSignal: browserOptOut() })
        return
      }
      if (pageviewCaptured) return
      update({ posthog: 'loaded' })
      pageviewCaptured = true
      try {
        client.capture('$pageview', {
          $host: window.location.hostname,
          $pathname: '/',
          $current_url: `https://${window.location.hostname}/`,
        })
      } catch {
        stopPostHog()
        update({ posthog: 'failed' })
      }
    },
  })
  script = document.createElement('script')
  script.async = true
  script.crossOrigin = 'anonymous'
  script.referrerPolicy = 'no-referrer'
  script.src = 'https://us-assets.i.posthog.com/static/array.js'
  const failLoad = () => {
    if (state.posthog !== 'loading') return
    stopPostHog()
    update({ posthog: 'failed' })
  }
  script.onerror = failLoad
  loadTimer = window.setTimeout(failLoad, 8000)
  document.head.append(script)
}
