import axios from 'axios'
import { getAuthToken } from './token'

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

/**
 * `mock` (default) keeps the whole frontend offline. Set VITE_API_MODE=live
 * once the Laravel API is available — no component contains an API URL.
 */
export const isMockMode = (import.meta.env.VITE_API_MODE || 'mock') !== 'live'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const message =
      error.response?.data?.message ||
      (status === 401 ? 'Session expired. Please log in again.' : null) ||
      error.message ||
      'Something went wrong. Please try again.'

    if (status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('api:unauthorized'))
    }

    return Promise.reject({ message, status, details: error.response?.data })
  },
)

export default api
