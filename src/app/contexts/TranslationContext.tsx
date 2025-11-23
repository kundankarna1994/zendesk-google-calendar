import { createContext } from 'react'
import type I18n from '../../lib/i18n'

export const TranslationContext = createContext<{
  i18n: I18n
  handleLocale: (locale: string) => void
} | null>(null)
