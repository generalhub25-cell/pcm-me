'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'

/**
 * Language-switcher target plumbing (PRD §3 header #4): a detail page that has
 * a translated sibling (or an explicit fallback) sets the exact alternate URL
 * here; the header's LanguageSwitcher consumes it. When unset, the switcher
 * falls back to swapping the locale segment of the current path.
 */
type Ctx = {
  alternateHref: string | null
  setAlternateHref: (href: string | null) => void
}

const LangAlternateContext = createContext<Ctx>({
  alternateHref: null,
  setAlternateHref: () => {},
})

export const LangAlternateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alternateHref, setAlternateHref] = useState<string | null>(null)
  return (
    <LangAlternateContext.Provider value={{ alternateHref, setAlternateHref }}>
      {children}
    </LangAlternateContext.Provider>
  )
}

export const useLangAlternate = () => useContext(LangAlternateContext)

/**
 * Rendered by detail pages to declare the language-switcher target for the
 * other locale (the translated sibling's URL, or the other-locale home).
 */
export const SetLangAlternate: React.FC<{ href: string }> = ({ href }) => {
  const { setAlternateHref } = useLangAlternate()
  useEffect(() => {
    setAlternateHref(href)
    return () => setAlternateHref(null)
  }, [href, setAlternateHref])
  return null
}
