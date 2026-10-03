// All visible copy, EN + JP. Strings carried over from the previous site are
// verbatim; anything new or edited is listed in the copy review (scripts/copy-review).

export type Lang = 'en' | 'jp'
export type Copy = { en: string; jp: string }

const t = (en: string, jp: string): Copy => ({ en, jp })

export const contactEmail = 'apollostreetcompany@gmail.com'

export const nav = {
  homeLabel: 'Apollo Street Company home',
  logoAlt: 'Apollo Street Company',
  links: [
    { href: '#learn', label: t('APPROACH', 'アプローチ') },
    { href: '#about', label: t('HOW WE WORK', '私たちの取り組み方') },
    { href: '#works', label: t('PROJECTS', 'プロジェクト') },
    { href: '#work-with-us', label: t('WORK WITH US', 'パートナーシップ') },
  ],
  menu: t('MENU', 'メニュー'),
  cta: t('Start a conversation', 'お問い合わせ'),
}

export const hero = {
  eyebrow: t(
    'Cross-border operators for Japan and the US',
    '日本と米国をつなぐ越境オペレーター',
  ),
  titleLead: t('Crossing', '越える'),
  titleEm: t('Borders', '国境'),
  lede: t(
    'Apollo Street Company invests in, launches, and operates market entries where local judgment matters.',
    'Apollo Street Companyは、現地の判断が重要な市場参入に投資し、立ち上げ、運営します。',
  ),
  primaryCta: t('Start a conversation', 'お問い合わせ'),
  secondaryCta: t('View selected work', '実績を見る'),
  rail: [
    t('Japan ⇄ US', '日本 ⇄ 米国'),
    t('Market entry', '市場参入'),
    t('Venture build', '事業構築'),
  ],
  scroll: t('SCROLL', 'スクロール'),
}

export const approach = {
  eyebrow: t('APOLLO STREET COMPANY', 'APOLLO STREET COMPANY'),
  watermark: t('Apollo', 'アポロ'),
  title: t('Global reach, local command.', 'グローバルな視点、現地での実行力。'),
  statement: t(
    'We work at the point where capital, culture, and execution meet.',
    '資本、文化、実行が交差する場所で事業をつくります。',
  ),
  body: [
    t(
      'Apollo Street Company helps teams enter new markets, form operating partnerships, and build ventures with enough local context to last beyond launch.',
      'Apollo Street Companyは、新市場への参入、運営パートナーシップの形成、立ち上げ後も続く事業づくりを支援します。',
    ),
    t(
      'Our work is practical by design: research the market, shape the offer, assemble the route, and stay close while the business starts moving.',
      '私たちの仕事は実践的です。市場を調べ、提案を磨き、進出ルートを組み、事業が動き出すまで伴走します。',
    ),
  ],
  list: [
    t('Market entry for US brands in Japan', '米国ブランドの日本市場参入'),
    t('Japan-US operating partnerships', '日米の運営パートナーシップ'),
    t(
      'AI-enabled workflows and venture prototypes',
      'AIを活用したワークフローと事業プロトタイプ',
    ),
  ],
}

export const howWeWork = {
  eyebrow: t('HOW WE WORK', '私たちの取り組み方'),
  title: t('Invest, operate, execute.', '投資、運営、実行。'),
  rows: [
    {
      number: '01',
      title: t('Investment', '投資'),
      body: t(
        'We identify where the market is misread, then structure the entry around customer demand, partner incentives, and realistic operating cost.',
        '市場が誤解されている場所を見極め、顧客需要、パートナーのインセンティブ、現実的な運営コストに基づいて参入を設計します。',
      ),
      tags: [
        t('Market entry', '市場参入'),
        t('Joint ventures', '合弁事業'),
        t('Company formation', '会社設立'),
      ],
    },
    {
      number: '02',
      title: t('Execution', '実行'),
      body: t(
        'We move from concept to proof with prototypes, commerce setup, localization, and the operating cadence needed to learn quickly.',
        'プロトタイプ、コマース構築、ローカライズ、学習を速める運営リズムによって、コンセプトを検証へ進めます。',
      ),
      tags: [
        t('Prototype development', 'プロトタイプ開発'),
        t('Marketing strategy', 'マーケティング戦略'),
        t('E-commerce setup', 'Eコマース構築'),
      ],
    },
    {
      number: '03',
      title: t('Agentic AI', 'エージェントAI'),
      body: t(
        'We build focused AI workflows for research, support, content operations, and internal execution where repeatable judgment matters.',
        'リサーチ、サポート、コンテンツ運用、社内実行など、反復できる判断が重要な領域でAIワークフローを構築します。',
      ),
      tags: [
        t('Skills', 'スキル'),
        t('Workflows', 'ワークフロー'),
        t('Prototypes', 'プロトタイプ'),
      ],
    },
  ],
}

export type Project = {
  id: string
  eyebrow: Copy
  name: Copy
  body: Copy
  href: string
  image: string
  alt: string
  // How the image sits in its frame: screenshots fill it, share images fit whole,
  // logos float on a matching ground.
  fit: 'cover' | 'contain' | 'logo'
  ground: string
}

export const works = {
  eyebrow: t('SELECTED WORK', '厳選されたプロジェクト'),
  title: t(
    'Recent builds across commerce, mobility, and AI.',
    'コマース、移動、AIにまたがる最近の取り組み。',
  ),
  visit: t('Visit project', 'プロジェクトを見る'),
  projects: [
    {
      id: 'shogun-sauce',
      eyebrow: t('Market Entry', '市場参入'),
      name: t('Shogun Sauce', 'Shogun Sauce'),
      body: t(
        'A Japanese barrel-aged soy sauce positioned for US chefs, with commerce, product story, and launch path shaped for local adoption.',
        '日本の木桶熟成醤油を米国のシェフ向けに調整し、コマース、商品ストーリー、ローンチ導線を設計。',
      ),
      href: 'https://www.shogunsauces.com',
      image: '/images/projects/shogun.jpg',
      alt: 'Shogun Sauce bottle and brand artwork',
      fit: 'logo',
      ground: '#efe7d8',
    },
    {
      id: 'gochamaze',
      eyebrow: t('Tabletop Game', 'ボードゲーム'),
      name: t('Gochamaze', 'ごちゃまぜ'),
      body: t(
        "A high-energy geography battle across Japan's 47 prefectures, built so families and friends can start playing right away.",
        '47都道府県をめぐるハイテンション地理バトル。家族や友だちとすぐに盛り上がれるボードゲーム。',
      ),
      href: 'https://gochamaze.pages.dev/',
      image: '/images/projects/gochamaze.jpg',
      alt: 'Gochamaze prefecture cards on a green game table',
      fit: 'cover',
      ground: '#23573f',
    },
    {
      id: 'christ-lab',
      eyebrow: t('AI Studio', 'AIスタジオ'),
      name: t('Christ Lab', 'Christ Lab'),
      body: t(
        'The Christian AI Company, building faith-centered AI products including Chosen Portion, Biblexica, Ezra, and Bibe Code.',
        'クリスチャンのためのAIカンパニー。Chosen Portion、Biblexica、Ezra、Bibe Codeなど、信仰を軸にしたAIプロダクトを開発。',
      ),
      href: 'https://christlab.ai',
      image: '/images/projects/christlab.jpg',
      alt: 'Christ Lab: The Christian AI Company, with an open glowing Bible',
      fit: 'contain',
      ground: '#000000',
    },
    {
      id: 'chosen-portion',
      eyebrow: t('iOS App', 'iOSアプリ'),
      name: t('Chosen Portion', 'Chosen Portion'),
      body: t(
        'A Christian prayer app with daily devotionals, Scripture on your home screen, and a companion who prays with you.',
        '毎日のデボーション、ホーム画面の聖句、共に祈るコンパニオンを備えたクリスチャン向け祈りアプリ。',
      ),
      href: 'https://chosenportionapp.com',
      image: '/images/projects/chosen-portion.jpg',
      alt: 'Chosen Portion home screen: Begin Each Day With God',
      fit: 'cover',
      ground: '#efe6d8',
    },
    {
      id: 'japan-visa-guide',
      eyebrow: t('Immigration Playbooks', '移住プレイブック'),
      name: t('Japan Visa Guide', '日本ビザガイド'),
      body: t(
        'A practical resource for navigating Japanese visa routes, built around clear information architecture and action-oriented guidance.',
        '日本のビザルートを理解するための実用的なリソース。明快な情報設計と行動につながる案内を重視。',
      ),
      href: 'https://japanvisa.guide',
      image: '/images/projects/japan-visa-guide.jpg',
      alt: 'Japan Visa Guide interface preview',
      fit: 'cover',
      ground: '#f4f7f5',
    },
  ] satisfies Project[],
}

export const contact = {
  eyebrow: t('START WORKING WITH US', '私たちと働き始める'),
  watermark: t('Partner', '連携'),
  title: t(
    'Bring us the border you need to cross.',
    '越えたい境界を、私たちにご相談ください。',
  ),
  body: t(
    'Whether you are entering Japan, expanding into the US, or building an AI-enabled operating system, we can help shape the next move.',
    '日本への参入、米国への展開、AIを活用した運営基盤づくりまで、次の一手を設計します。',
  ),
  cta: t('Start a conversation', 'お問い合わせ'),
}

export const footer = {
  logoAlt: 'Apollo Street Company',
}

export const analyticsPrivacy = {
  title: t('Privacy & website terms', 'プライバシーとウェブサイト利用条件'),
  disclosure: t(
    'Public-page visits may be measured with PostHog and Datafast. We do not collect form text or session recordings. You can turn analytics off below and save that choice for future visits.',
    '公開ページへの訪問をPostHogとDatafastで計測する場合があります。フォームの入力内容やセッション録画は収集しません。下のボタンで計測をオフにし、今後の訪問にも適用する設定を保存できます。',
  ),
  terms: t(
    'Linked products have their own terms. Contact links open your email app.',
    'リンク先の各サービスには、それぞれの利用条件が適用されます。お問い合わせリンクを選ぶと、メールアプリが開きます。',
  ),
  turnOff: t('Turn analytics off', 'アクセス計測をオフにする'),
  offSaved: t('Analytics off — saved', 'アクセス計測オフ・保存済み'),
  choice: {
    checking: t('Checking your analytics preference.', 'アクセス計測の設定を確認しています。'),
    on: t('Analytics is allowed. Provider availability is shown below.', 'アクセス計測は許可されています。計測サービスの状態は下に表示されます。'),
    'saved-off': t('Analytics is off for this visit and future visits in this browser.', 'このブラウザでは、今回と今後の訪問のアクセス計測がオフになっています。'),
    'storage-unavailable': t('Analytics is off because this browser cannot reliably save a preference.', '設定を確実に保存できないため、アクセス計測はオフになっています。'),
    'storage-invalid': t('Analytics is off because the saved preference is invalid.', '保存された設定が無効なため、アクセス計測はオフになっています。'),
    'off-unsaved': t('Analytics is off for this visit. Your choice could not be saved for future visits.', '今回の訪問のアクセス計測はオフです。今後の訪問の設定は保存できませんでした。'),
  },
  signalOff: t('Analytics is off because your browser requests no tracking.', 'ブラウザの追跡拒否設定により、アクセス計測はオフになっています。'),
  productionOnly: t('Analytics is off here. Measurement is limited to the public production page.', 'ここではアクセス計測はオフです。公開中の本番ページのみが計測対象です。'),
  posthog: {
    idle: t('PostHog is not loaded.', 'PostHogは読み込まれていません。'),
    loading: t('PostHog is loading; event delivery is unverified.', 'PostHogを読み込んでいます。データの送信は未確認です。'),
    loaded: t('PostHog is loaded; event delivery is unverified.', 'PostHogは読み込まれています。データの送信は未確認です。'),
    failed: t('PostHog could not load or start. Event delivery is unverified.', 'PostHogを読み込むか開始することができませんでした。データの送信は未確認です。'),
    stopped: t('PostHog is stopped.', 'PostHogは停止しています。'),
  },
  datafast: {
    idle: t('Datafast is not started.', 'Datafastは開始されていません。'),
    loading: t('Datafast is sending a public-page visit; delivery is unverified.', 'Datafastで公開ページへの訪問を送信しています。データの送信は未確認です。'),
    loaded: t('Datafast accepted a pageview request. Visitor estimates are checked separately.', 'Datafastがページ閲覧の送信を受け付けました。訪問者数の推定値は別途確認します。'),
    failed: t('Datafast could not send this visit. Event delivery is unverified.', 'Datafastで今回の訪問を送信できませんでした。データの送信は未確認です。'),
    stopped: t('Datafast is stopped.', 'Datafastは停止しています。'),
  },
}
