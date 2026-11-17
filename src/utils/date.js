export const toISODate = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const addDays = (days, from = new Date()) => {
  const date = new Date(from)
  date.setDate(date.getDate() + days)
  return toISODate(date)
}

export const todayISO = () => toISODate(new Date())

export const parseISODate = (iso) => {
  if (!iso) return new Date()
  const [year, month, day] = String(iso).slice(0, 10).split('-').map(Number)
  return new Date(year, (month || 1) - 1, day || 1)
}

export const timeToMinutes = (time = '00:00') => {
  const [hours, minutes] = time.split(':').map(Number)
  return (hours || 0) * 60 + (minutes || 0)
}

export const minutesToTime = (minutes) => {
  const normalized = ((minutes % 1440) + 1440) % 1440
  const hours = Math.floor(normalized / 60)
  const mins = normalized % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

export const addMinutesToTime = (time, minutes) => minutesToTime(timeToMinutes(time) + minutes)

export const durationBetween = (departure, arrival) => {
  const difference = timeToMinutes(arrival) - timeToMinutes(departure)
  return difference <= 0 ? difference + 1440 : difference
}

export const formatDuration = (minutes, language = 'en') => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (language === 'km') {
    return `${hours ? `${hours} ម៉ោង` : ''}${mins ? ` ${mins} នាទី` : ''}`.trim() || '០ នាទី'
  }
  return `${hours ? `${hours}h` : ''}${mins ? ` ${mins}m` : ''}`.trim() || '0m'
}

export const formatDate = (iso, language = 'en', options) => {
  if (!iso) return '—'
  const locale = language === 'km' ? 'km-KH' : 'en-US'
  return new Intl.DateTimeFormat(locale, options || {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parseISODate(iso))
}

export const formatLongDate = (iso, language = 'en') =>
  formatDate(iso, language, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

export const relativeDayLabel = (iso, language = 'en', t) => {
  if (iso === todayISO()) return t('common.today')
  if (iso === addDays(1)) return t('common.tomorrow')
  return formatDate(iso, language, { day: 'numeric', month: 'short' })
}
