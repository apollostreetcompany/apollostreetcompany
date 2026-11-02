import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

// Load the installed SDK unchanged in a browser-like VM with a local-only fetch.
// The production client ID is never sent to a provider by these tests.
const [source, webSource, sdkSource] = await Promise.all([
  readFile(new URL('../src/lib/analytics.ts', import.meta.url), 'utf8'),
  readFile(new URL('../node_modules/@openpanel/web/dist/index.js', import.meta.url), 'utf8'),
  readFile(new URL('../node_modules/@openpanel/sdk/dist/index.js', import.meta.url), 'utf8'),
])
const appSource = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText

async function fixture(options = {}) {
  const entries = new Map(options.storage ?? [])
  const localStorage = {
    getItem(key) {
      if (options.storageUnavailable) throw new Error('storage unavailable')
      return entries.get(key) ?? null
    },
    setItem(key, value) {
      if (options.storageUnavailable) throw new Error('storage unavailable')
      entries.set(key, value)
    },
    removeItem(key) { entries.delete(key) },
  }
  const windowListeners = new Map()
  const documentListeners = new Map()
  const listen = (listeners, type, handler) => {
    const group = listeners.get(type) ?? []
    group.push(handler)
    listeners.set(type, group)
  }
  const scripts = []
  const requests = []
  const instances = []
  const timers = new Map()
  let now = 0
  let timerId = 0
  let resolvePending
  const setTimer = (callback, delay = 0) => {
    timers.set(++timerId, { callback, due: now + delay })
    return timerId
  }
  const clearTimer = (id) => { timers.delete(id) }
  const fetch = (url, init) => {
    requests.push({ url, init, payload: JSON.parse(init.body) })
    if (options.pending) return new Promise((resolve) => { resolvePending = resolve })
    return Promise.resolve({ status: 200, text: async () => '{"deviceId":"device","sessionId":"session"}' })
  }
  const document = {
    currentScript: null,
    title: 'Private form text',
    referrer: 'https://referrer.example/?email=private@example.com#secret',
    head: { append: (script) => scripts.push(script) },
    createElement: () => ({ remove() {} }),
    addEventListener: (type, handler) => listen(documentListeners, type, handler),
  }
  const window = {
    location: new URL(options.url ?? 'https://www.apollostreetcompany.com/?email=private@example.com#secret'),
    fetch,
    AbortController,
    setTimeout: setTimer,
    clearTimeout: clearTimer,
    addEventListener: (type, handler) => listen(windowListeners, type, handler),
    dispatchEvent: (event) => (windowListeners.get(event.type) ?? []).forEach((handler) => handler(event)),
    ...options.window,
  }
  const history = {
    pushState(_state, _unused, url) { window.location = new URL(url, window.location.href) },
    replaceState(_state, _unused, url) { window.location = new URL(url, window.location.href) },
  }
  const navigator = { ...options.navigator }
  const context = vm.createContext({
    window, document, navigator, localStorage, history, fetch, AbortController, URL,
    sessionStorage: { getItem: () => null, removeItem() {}, setItem() {} },
    Event: class { constructor(type) { this.type = type } },
    setTimeout: setTimer, clearTimeout: clearTimer, console,
  })
  const sdk = new vm.SourceTextModule(sdkSource, { context })
  const web = new vm.SourceTextModule(webSource, { context })
  await web.link((specifier) => {
    assert.equal(specifier, '@openpanel/sdk')
    return sdk
  })
  await web.evaluate()
  class ObservedOpenPanel extends web.namespace.OpenPanel {
    constructor(config) {
      super(config)
      instances.push(this)
    }
  }
  const sdkExport = new vm.SyntheticModule(['OpenPanel'], function () {
    this.setExport('OpenPanel', ObservedOpenPanel)
  }, { context })
  const app = new vm.SourceTextModule(appSource, {
    context,
    initializeImportMeta(meta) { meta.env = { PROD: options.production !== false } },
  })
  await app.link((specifier) => {
    assert.equal(specifier, '@openpanel/web')
    return sdkExport
  })
  await app.evaluate()
  const settle = async () => { for (let i = 0; i < 20; i++) await Promise.resolve() }
  const advance = async (milliseconds = 0) => {
    now += milliseconds
    while (true) {
      const due = [...timers.entries()].filter(([, timer]) => timer.due <= now)
        .sort((a, b) => a[1].due - b[1].due)[0]
      if (!due) break
      timers.delete(due[0])
      due[1].callback()
      await settle()
    }
    await settle()
  }
  return {
    analytics: app.namespace, documentListeners, entries, history, instances, requests, scripts, window,
    advance, settle,
    resolvePending: () => resolvePending({ status: 200, text: async () => '{"deviceId":"device","sessionId":"session"}' }),
    storageEvent: (key = 'asc-analytics-off') => (windowListeners.get('storage') ?? []).forEach((fn) => fn({ key })),
  }
}

test('one SDK instance sends only a minimized automatic root pageview', async () => {
  for (const host of ['www.apollostreetcompany.com', 'apollostreetcompany.com']) {
    const f = await fixture({ url: `https://${host}/?email=private@example.com#secret` })
    f.analytics.initializeAnalytics()
    f.analytics.initializeAnalytics()
    await f.advance()

    assert.equal(f.instances.length, 1)
    assert.equal(f.scripts.length, 1) // Existing PostHog loader remains single-init.
    const config = f.instances[0].options
    assert.equal(config.clientId, 'b7c2b5a9-dc9c-4eb4-bb03-7a3abb7e8595')
    assert.equal(config.trackScreenViews, true)
    assert.equal(config.trackOutgoingLinks, false)
    assert.equal(config.trackAttributes, false)
    assert.equal(config.trackHashChanges, false)
    assert.equal(config.sessionReplay.enabled, false)
    assert.equal((f.documentListeners.get('click') ?? []).length, 0)
    assert.equal(f.requests.length, 1)
    const { url, init, payload } = f.requests[0]
    assert.equal(url, 'https://api.openpanel.dev/track')
    assert.equal(init.method, 'POST')
    assert.equal(init.credentials, 'omit')
    assert.equal(init.referrerPolicy, 'no-referrer')
    assert.equal(init.keepalive, false)
    assert.equal(init.signal.aborted, false)
    assert.equal(init.headers['openpanel-client-id'], config.clientId)
    assert.equal(init.headers['openpanel-sdk-name'], 'web')
    assert.equal('openpanel-client-secret' in init.headers, false)
    assert.deepEqual(JSON.parse(JSON.stringify(payload)), {
      type: 'track', payload: { name: 'screen_view', properties: { __path: `https://${host}/` } },
    })
    assert.doesNotMatch(init.body, /private|email|secret|referrer|title|\?|#/i)
    assert.equal(f.analytics.getAnalyticsState().openpanel, 'loaded')
  }
})

test('saved choice, browser signals, unsafe storage and non-production pages prevent initialization', async () => {
  const cases = [
    { storage: [['asc-analytics-off', '1']] },
    { storage: [['asc-analytics-off', 'invalid']] },
    { storageUnavailable: true },
    { navigator: { globalPrivacyControl: true } },
    { navigator: { doNotTrack: '1' } },
    { navigator: { msDoNotTrack: '1' } },
    { window: { doNotTrack: 'yes' } },
    { url: 'http://apollostreetcompany.com/' },
    { url: 'https://apollostreetcompany.com/private?value=secret' },
    { url: 'https://other.example/' },
    { url: 'https://apollostreetcompany.com:8443/' },
    { production: false },
  ]
  for (const options of cases) {
    const f = await fixture(options)
    f.analytics.initializeAnalytics()
    await f.advance()
    assert.equal(f.instances.length, 0, JSON.stringify(options))
    assert.equal(f.requests.length, 0, JSON.stringify(options))
    assert.equal(f.scripts.length, 0, JSON.stringify(options))
  }
  const automation = await fixture({ navigator: { webdriver: true } })
  automation.analytics.initializeAnalytics()
  await automation.advance()
  assert.equal(automation.instances.length, 0)
  assert.equal(automation.requests.length, 0)
})

test('automatic route views remain limited to the production root', async () => {
  const f = await fixture()
  f.analytics.initializeAnalytics()
  await f.advance()
  f.history.pushState({}, '', '/private?email=private@example.com')
  await f.advance(50)
  assert.equal(f.requests.length, 1)
  f.history.pushState({}, '', '/?new=private#secret')
  await f.advance(50)
  assert.equal(f.requests.length, 2)
  assert.deepEqual(JSON.parse(JSON.stringify(f.requests[1].payload)), {
    type: 'track', payload: { name: 'screen_view', properties: { __path: 'https://www.apollostreetcompany.com/' } },
  })
})

test('PostHog remains single-init, sanitized and stoppable', async () => {
  const f = await fixture()
  f.analytics.initializeAnalytics()
  await f.advance()
  const queued = f.window.posthog
  assert.equal(queued._i.length, 1)
  const config = queued._i[0][1]
  const captures = []
  let stopped = false
  const client = {
    capture: (name, properties) => captures.push({ name, properties }),
    opt_out_capturing: () => { stopped = true },
  }
  f.window.posthog = client
  config.loaded(client)
  config.loaded(client)
  assert.equal(captures.length, 1)
  assert.equal(captures[0].name, '$pageview')
  const uuid = '4f2ab33b-4bc9-4a12-a581-07e71904f818'
  const event = config.before_send({
    event: '$pageview',
    properties: { distinct_id: uuid, $device_id: uuid, $current_url: 'https://example.com/?private=yes', $referrer: 'private' },
  })
  assert.equal(event.properties.$current_url, 'https://www.apollostreetcompany.com/')
  assert.doesNotMatch(JSON.stringify(event), /private|referrer|\?|#/i)
  assert.equal(config.before_send({ event: 'anything-else', properties: {} }), null)
  f.analytics.turnAnalyticsOff()
  assert.equal(stopped, true)
  assert.equal(config.fetch_options.signal.aborted, true)
  assert.equal(config.before_send({ event: '$pageview', properties: { distinct_id: uuid, $device_id: uuid } }), null)
})

test('opt-out before the automatic view prevents a send and future queued views', async () => {
  const f = await fixture()
  f.analytics.initializeAnalytics()
  f.analytics.turnAnalyticsOff()
  await f.advance()
  f.history.pushState({}, '', '/?changed=private')
  await f.advance(50)
  assert.equal(f.instances[0].queue.length, 0)
  f.instances[0].ready()
  await f.advance()
  assert.equal(f.requests.length, 0)
  assert.equal(f.entries.get('asc-analytics-off'), '1')
  assert.equal(f.analytics.getAnalyticsState().openpanel, 'stopped')
})

test('cross-tab opt-out aborts an in-flight request and late completion cannot flush later views', async () => {
  const f = await fixture({ pending: true })
  f.analytics.initializeAnalytics()
  await f.advance()
  assert.equal(f.requests.length, 1)
  f.entries.set('asc-analytics-off', '1')
  f.storageEvent()
  assert.equal(f.requests[0].init.signal.aborted, true)
  f.resolvePending() // Exercise a response that wins the abort race.
  await f.settle()
  f.entries.delete('asc-analytics-off')
  f.storageEvent()
  f.history.pushState({}, '', '/?private=changed')
  await f.advance(50)
  assert.equal(f.instances[0].queue.length, 0)
  f.instances[0].ready()
  await f.advance()
  assert.equal(f.requests.length, 1)
  assert.equal(f.analytics.getAnalyticsState().openpanel, 'stopped')
})
