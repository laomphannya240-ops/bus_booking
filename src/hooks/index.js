import { useEffect, useRef, useState } from 'react'

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Ignore quota or privacy-mode errors.
    }
  }, [key, value])

  return [value, setValue]
}

export const useDebounce = (value, delay = 250) => {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export const useCountdown = (seconds) => {
  const [remaining, setRemaining] = useState(seconds)
  const startRef = useRef(seconds)

  useEffect(() => {
    startRef.current = seconds
    setRemaining(seconds)
    const timer = window.setInterval(() => {
      setRemaining((current) => (current <= 0 ? 0 : current - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [seconds])

  const reset = () => {
    setRemaining(startRef.current)
  }

  const minutes = String(Math.floor(remaining / 60)).padStart(2, '0')
  const secs = String(remaining % 60).padStart(2, '0')
  return { remaining, formatted: `${minutes}:${secs}`, expired: remaining === 0, reset }
}

export const useDocumentTitle = (title) => {
  useEffect(() => {
    const previous = document.title
    document.title = title ? `${title} | CAMBODIA BUS` : 'CAMBODIA BUS'
    return () => {
      document.title = previous
    }
  }, [title])
}
