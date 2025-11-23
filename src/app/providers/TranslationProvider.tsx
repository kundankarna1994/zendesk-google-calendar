import { type ReactNode, useCallback, useEffect, useState } from 'react'
import { TranslationContext } from '@/contexts/TranslationContext'
import I18n from '../../lib/i18n'
import { useClient } from '../hooks/useClient'

const i18n = new I18n()

export function TranslationProvider({ children }: { children: ReactNode }) {
  const client = useClient()
  const [locale, setLocale] = useState<string | undefined>()
  const [loading, setLoading] = useState(true)

  const loadTranslations = useCallback(
    async (currentLocale: string | undefined) => {
      const { currentUser } = await client.get('currentUser')

      const locale = currentLocale || currentUser.locale

      await i18n.loadTranslations(locale)
      setLoading(false)
    },
    [client]
  )

  const handleLocale = (locale: string) => {
    setLocale(locale)
  }

  useEffect(() => {
    loadTranslations(locale)
  }, [locale, loadTranslations])

  if (loading) return null

  return (
    <TranslationContext.Provider value={{ i18n, handleLocale }}>
      {children}
    </TranslationContext.Provider>
  )
}
