import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Copy, Lang } from '@/content'

const STORAGE_KEY = 'asc-lang'

type LangState = { lang: Lang; setLang: (lang: Lang) => void }

const LangContext = createContext<LangState>({ lang: 'en', setLang: () => {} })

function readStoredLang(): Lang {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'jp' ? 'jp' : 'en'
  } catch {
    return 'en'
  }
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage can be unavailable (private mode); the choice still applies for this visit.
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang === 'jp' ? 'ja' : 'en'
  }, [lang])

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}

/** Returns a translator that picks the active language from a Copy pair. */
export function useT() {
  const { lang } = useLang()
  return useCallback((copy: Copy) => copy[lang], [lang])
}
