import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

// Exercise the real analytics module and card handlers with a local transport.
// No request in this suite reaches Datafast or a portfolio website.
async function fixture(options = {}) {
  const requests = []
  const storage = new Map(options.storage ?? [])
  const listeners = new Map()
  const navigator = { webdriver: false, ...options.navigator }
  const localStorage = {
    getItem(key) {
      if (options.storageUnavailable) throw new Error('storage unavailable')
      return storage.get(key) ?? null
    },
    setItem(key, value) {
      if (options.storageUnavailable) throw new Error('storage unavailable')
      storage.set(key, value)
    },
    removeItem(key) { storage.delete(key) },
  }
  const location = {
    protocol: 'https:', host: 'www.apollostreetcompany.com',
    hostname: 'www.apollostreetcompany.com', pathname: '/', ...options.location,
  }
  const window = {
    location,
    ...options.window,
    crypto: { randomUUID },
    AbortController,
    setTimeout: () => 1,
    clearTimeout: () => {},
    addEventListener: (name, callback) => listeners.set(name, callback),
    fetch: (url, request) => {
      requests.push({ url, ...request, payload: JSON.parse(request.body) })
      if (options.fetch) return options.fetch(requests.at(-1))
      return Promise.resolve({ ok: true })
    },
  }
  const document = {
    createElement: () => ({ remove() {} }),
    head: { append() {} },
  }
  const context = vm.createContext({ window, navigator, localStorage, document, AbortController, URL })
  const load = async (path) => {
    const source = await readFile(new URL(path, import.meta.url), 'utf8')
    const code = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
    }).outputText
    return new vm.SourceTextModule(code, {
      context,
      initializeImportMeta: (meta) => { meta.env = { PROD: options.production !== false } },
    })
  }
  const analytics = await load('../src/lib/analytics.ts')
  await analytics.link(() => { throw new Error('unexpected analytics import') })
  await analytics.evaluate()
  const content = await load('../src/content.ts')
  await content.link(() => { throw new Error('unexpected content import') })
  await content.evaluate()
  const components = await load('../src/components/Projects.tsx')
  const jsx = (type, props) => ({ type, props })
  const modules = {
    'react/jsx-runtime': { jsx, jsxs: jsx },
    'lucide-react': { ArrowUpRight: 'arrow' },
    '@/content': { works: content.namespace.works },
    '@/lib/i18n': { useT: () => (copy) => copy.en },
    '@/lib/motion': { Reveal: 'reveal' },
    '@/lib/utils': { cn: (...classes) => classes.filter(Boolean).join(' ') },
    '@/lib/analytics': { trackPortfolioOutlink: analytics.namespace.trackPortfolioOutlink },
  }
  await components.link((specifier) => {
    const exports = modules[specifier]
    if (!exports) throw new Error(`unexpected component import: ${specifier}`)
    return new vm.SyntheticModule(Object.keys(exports), function () {
      for (const [key, value] of Object.entries(exports)) this.setExport(key, value)
    }, { context })
  })
  await components.evaluate()

  const anchors = []
  function walk(node) {
    if (Array.isArray(node)) return node.forEach(walk)
    if (!node || typeof node !== 'object') return
    if (typeof node.type === 'function') return walk(node.type(node.props))
    if (node.type === 'a') anchors.push(node)
    walk(node.props?.children)
  }
  walk(components.namespace.Projects())
  return { analytics: analytics.namespace, anchors, requests, listeners, navigator, storage, window }
}

function activation(anchor, overrides = {}) {
  return {
    isTrusted: true,
    defaultPrevented: false,
    button: 0,
    currentTarget: { href: new URL(anchor.props.href).href },
    ...overrides,
  }
}

const settle = () => new Promise((resolve) => setImmediate(resolve))

test('each real portfolio card activation sends one bounded custom goal using the page session', async () => {
  const f = await fixture()
  f.analytics.initializeAnalytics()
  await settle()
  assert.equal(f.anchors.length, 5)
  for (const anchor of f.anchors) anchor.props.onClick(activation(anchor))
  await settle()

  assert.equal(f.requests.length, 6)
  const [pageview, ...goals] = f.requests
  assert.equal(pageview.payload.type, 'pageview')
  const expected = ['shogun-sauce', 'gochamaze', 'christ-lab', 'chosen-portion', 'japan-visa-guide']
  assert.deepEqual(goals.map(({ payload }) => payload.extraData.project_slug), expected)
  assert.equal(new Set(f.requests.map(({ payload }) => payload.sessionId)).size, 1)
  assert.equal(new Set(f.requests.map(({ payload }) => payload.visitorId)).size, 6)
  assert.deepEqual([...f.storage.keys()], [])
  for (const { url, payload, credentials, referrerPolicy, keepalive, signal } of goals) {
    assert.equal(url, 'https://datafa.st/api/events')
    assert.equal(credentials, 'omit')
    assert.equal(referrerPolicy, 'no-referrer')
    assert.equal(keepalive, false)
    assert.equal(signal.aborted, false)
    assert.deepEqual(Object.keys(payload).sort(), [
      'cookieless', 'domain', 'extraData', 'href', 'referrer', 'sessionId', 'type', 'visitorId', 'websiteId',
    ].sort())
    assert.equal(payload.type, 'custom')
    assert.equal(payload.websiteId, f.analytics.datafastProperty.trackingId)
    assert.equal(payload.domain, 'www.apollostreetcompany.com')
    assert.equal(payload.href, 'https://www.apollostreetcompany.com/')
    assert.equal(payload.referrer, null)
    assert.equal(payload.cookieless, true)
    assert.deepEqual(payload.extraData, {
      eventName: 'portfolio_outlink_clicked', project_slug: payload.extraData.project_slug, surface: 'portfolio',
    })
    assert.doesNotMatch(JSON.stringify(payload), /\?|#|@|shogunsauces\.com|pages\.dev|christlab\.ai|chosenportionapp\.com|japanvisa\.guide/)
  }
})

test('only trusted, uncancelled activation of known destinations sends a goal', async () => {
  const f = await fixture()
  f.analytics.initializeAnalytics()
  await settle()
  const anchor = f.anchors[0]
  anchor.props.onClick(activation(anchor, { isTrusted: false }))
  anchor.props.onClick(activation(anchor, { defaultPrevented: true }))
  anchor.props.onClick(activation(anchor, { currentTarget: { href: `${new URL(anchor.props.href).href}?email=private` } }))
  anchor.props.onClick(activation(anchor, { currentTarget: { href: 'https://unknown.example/' } }))
  anchor.props.onAuxClick(activation(anchor, { button: 2 }))
  f.analytics.trackPortfolioOutlink('unknown-project', new URL(anchor.props.href).href)
  await settle()
  assert.equal(f.requests.length, 1)
  anchor.props.onAuxClick(activation(anchor, { button: 1 }))
  await settle()
  assert.equal(f.requests.length, 2)
  assert.equal(f.requests[1].payload.extraData.project_slug, 'shogun-sauce')
})

test('privacy signals, invalid preferences, automation, and non-production pages suppress goals', async () => {
  const cases = [
    { storage: [['asc-analytics-off', '1']] },
    { storage: [['asc-analytics-off', 'invalid']] },
    { storageUnavailable: true },
    { navigator: { globalPrivacyControl: true } },
    { navigator: { doNotTrack: '1' } },
    { window: { doNotTrack: 'yes' } },
    { navigator: { msDoNotTrack: '1' } },
    { navigator: { webdriver: true } },
    { location: { pathname: '/other' } },
    { location: { protocol: 'http:' } },
    { location: { host: 'localhost', hostname: 'localhost' } },
    { production: false },
  ]
  for (const options of cases) {
    const f = await fixture(options)
    f.analytics.initializeAnalytics()
    f.anchors[0].props.onClick(activation(f.anchors[0]))
    await settle()
    assert.equal(f.requests.length, 0, JSON.stringify(options))
  }
})

test('turning analytics off aborts a pending goal and prevents later goals', async () => {
  const f = await fixture({
    fetch: ({ payload }) => payload.type === 'pageview'
      ? Promise.resolve({ ok: true })
      : new Promise(() => {}),
  })
  f.analytics.initializeAnalytics()
  await settle()
  f.anchors[0].props.onClick(activation(f.anchors[0]))
  assert.equal(f.requests.length, 2)
  f.analytics.turnAnalyticsOff()
  assert.equal(f.requests[1].signal.aborted, true)
  f.anchors[1].props.onClick(activation(f.anchors[1]))
  await settle()
  assert.equal(f.requests.length, 2)
  assert.equal(f.storage.get('asc-analytics-off'), '1')
})

test('an opt-out from another tab aborts pending goals', async () => {
  const f = await fixture({
    fetch: ({ payload }) => payload.type === 'pageview'
      ? Promise.resolve({ ok: true })
      : new Promise(() => {}),
  })
  f.analytics.initializeAnalytics()
  await settle()
  f.anchors[0].props.onClick(activation(f.anchors[0]))
  f.storage.set('asc-analytics-off', '1')
  f.listeners.get('storage')({ key: 'asc-analytics-off' })
  assert.equal(f.requests[1].signal.aborted, true)
  f.anchors[1].props.onClick(activation(f.anchors[1]))
  await settle()
  assert.equal(f.requests.length, 2)
})

test('a new page has a fresh memory-only session and failed network does not block activation', async () => {
  const first = await fixture()
  first.analytics.initializeAnalytics()
  await settle()
  const second = await fixture({
    location: { host: 'apollostreetcompany.com', hostname: 'apollostreetcompany.com' },
    fetch: ({ payload }) => payload.type === 'pageview'
      ? Promise.resolve({ ok: true })
      : Promise.reject(new Error('offline')),
  })
  second.analytics.initializeAnalytics()
  await settle()
  const event = activation(second.anchors[0])
  assert.doesNotThrow(() => second.anchors[0].props.onClick(event))
  await settle()
  assert.equal(event.defaultPrevented, false)
  assert.equal(second.requests[1].payload.href, 'https://apollostreetcompany.com/')
  assert.notEqual(first.requests[0].payload.sessionId, second.requests[0].payload.sessionId)
  assert.deepEqual([...second.storage.keys()], [])
})
