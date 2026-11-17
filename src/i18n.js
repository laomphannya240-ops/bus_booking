import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import km from './locales/km.json'

export const LANGUAGE_STORAGE_KEY = 'cambodia-bus-language'
export const SUPPORTED_LANGUAGES = [
  { code: 'km', label: 'ភាសាខ្មែរ', short: 'KM' },
  { code: 'en', label: 'English', short: 'EN' },
]

const storedLanguage = (() => {
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'km'
  } catch {
    return 'km'
  }
})()

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    km: { translation: km },
  },
  lng: SUPPORTED_LANGUAGES.some((language) => language.code === storedLanguage)
    ? storedLanguage
    : 'km',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  returnNull: false,
})

i18n.on('languageChanged', (language) => {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  } catch {
    // Storage may be unavailable; language still works for this session.
  }
  document.documentElement.lang = language === 'km' ? 'km' : 'en'
})

document.documentElement.lang = i18n.language === 'km' ? 'km' : 'en'

export default i18n
