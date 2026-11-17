import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { authService } from '../services/authService'
import { THEME_STORAGE_KEY } from '../constants'
import ToastContainer from '../components/common/ToastContainer'
import ConfirmDialog from '../components/common/ConfirmDialog'

const AppContext = createContext(null)

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used inside AppProvider')
  return context
}

export const AppProvider = ({ children }) => {
  const { i18n, t } = useTranslation()
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) || 'light'
    } catch {
      return 'light'
    }
  })
  const [user, setUser] = useState(() => authService.currentUser())
  const [toasts, setToasts] = useState([])
  const [confirmation, setConfirmation] = useState(null)

  const language = i18n.language?.startsWith('km') ? 'km' : 'en'

  const pushToast = useCallback((type, message) => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((current) => [...current, { id, type, message }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 4200)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Theme still works for this session.
    }
  }, [theme])

  useEffect(() => {
    const onUnauthorized = () => {
      authService.logout()
      setUser(null)
      pushToast('error', t('auth.sessionExpired') || 'Session expired. Please log in again.')
    }
    window.addEventListener('api:unauthorized', onUnauthorized)
    return () => window.removeEventListener('api:unauthorized', onUnauthorized)
  }, [pushToast, t])

  const toast = useMemo(
    () => ({
      success: (message) => pushToast('success', message),
      error: (message) => pushToast('error', message),
      info: (message) => pushToast('info', message),
      warning: (message) => pushToast('warning', message),
    }),
    [pushToast],
  )

  const confirm = useCallback(
    (options) =>
      new Promise((resolve) => {
        setConfirmation({
          title: options.title || t('common.confirm'),
          message: options.message || '',
          confirmLabel: options.confirmLabel || t('common.confirm'),
          cancelLabel: options.cancelLabel || t('common.cancel'),
          tone: options.tone || 'danger',
          resolve,
        })
      }),
    [t],
  )

  const resolveConfirmation = (answer) => {
    confirmation?.resolve(answer)
    setConfirmation(null)
  }

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
      setTheme,
      language,
      setLanguage: (next) => i18n.changeLanguage(next),
      isKhmer: language === 'km',
      user,
      setUser,
      login: async (credentials) => {
        const session = await authService.login(credentials)
        setUser(session.user)
        return session.user
      },
      register: async (payload) => {
        const session = await authService.register(payload)
        setUser(session.user)
        return session.user
      },
      logout: async () => {
        await authService.logout()
        setUser(null)
      },
      toast,
      confirm,
    }),
    [theme, language, i18n, user, toast, confirm],
  )

  return (
    <AppContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((current) => current.filter((item) => item.id !== id))} />
      <ConfirmDialog confirmation={confirmation} onResolve={resolveConfirmation} />
    </AppContext.Provider>
  )
}
