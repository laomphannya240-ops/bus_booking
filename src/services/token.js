import { AUTH_STORAGE_KEY } from '../constants'

/**
 * Demo-only session storage. It is intentionally session-scoped and never
 * stores booking data. A real backend will issue a token consumed here.
 */
export const readSession = () => {
  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const writeSession = (session) => {
  try {
    if (session) sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
    else sessionStorage.removeItem(AUTH_STORAGE_KEY)
  } catch {
    // Ignore storage errors in restricted browser contexts.
  }
}

export const getAuthToken = () => readSession()?.token || null
