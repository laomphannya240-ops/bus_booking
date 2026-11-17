import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Filter, MapPinned, SearchX, SlidersHorizontal } from 'lucide-react'
import { useBooking } from '../../context/BookingContext'
import { useData } from '../../context/DataContext'
import { useApp } from '../../context/AppContext'
import { provinceName } from '../../data/provinces'
import { getBus } from '../../data/buses'
import { DEPARTURE_WINDOWS } from '../../constants'
import { timeToMinutes, formatDate } from '../../utils/date'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import EmptyState from '../../components/common/EmptyState'
import { SkeletonCard } from '../../components/common/Skeleton'
import SearchForm from '../../components/booking/SearchForm'
import SearchFilters from '../../components/booking/SearchFilters'
import BusCard from '../../components/bus/BusCard'

const defaultFilters = (max) => ({ maxPrice: max, timeWindows: [], types: [], companyIds: [] })

export default function SearchResultsPage() {
  const { t } = useTranslation()
  const { language } = useApp()
  const { search, selectSchedule } = useBooking()
  const { schedules, buses, companies, routes } = useData()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [mobileFilters, setMobileFilters] = useState(false)
  const [sort, setSort] = useState('recommended')

  // The mock service mirrors GET /api/schedules?from&to&date&passengers.
  const baseResults = useMemo(
    () => schedules.filter((schedule) => {
      const routeIds = new Set(
        routes.filter((route) =>
          Number(route.fromProvinceId) === Number(search.from) && Number(route.toProvinceId) === Number(search.to),
        ).map((route) => route.id),
      )
      return routeIds.has(schedule.routeId) && schedule.date === search.date &&
        schedule.status === 'ACTIVE' && schedule.availableSeats >= search.passengers
    }),
    [schedules, routes, search.from, search.to, search.date, search.passengers],
  )

  useEffect(() => {
    setLoading(true)
    const timer = window.setTimeout(() => setLoading(false), 450)
    return () => window.clearTimeout(timer)
  }, [search.from, search.to, search.date, search.passengers])

  const priceRange = useMemo(() => {
    const prices = baseResults.map((item) => item.price)
    return { min: prices.length ? Math.min(...prices) : 0, max: prices.length ? Math.max(...prices) : 100 }
  }, [baseResults])

  const [filters, setFilters] = useState(() => defaultFilters(100))
  useEffect(() => setFilters(defaultFilters(priceRange.max)), [priceRange.max])

  const results = useMemo(() => {
    const filtered = baseResults.filter((schedule) => {
      const bus = getBus(schedule.busId, buses)
      const minutes = timeToMinutes(schedule.departureTime)
      const windowMatch = filters.timeWindows.length === 0 || filters.timeWindows.some((id) => {
        const window = DEPARTURE_WINDOWS.find((item) => item.id === id)
        return window && minutes >= window.from * 60 && minutes < window.to * 60
      })
      return schedule.price <= filters.maxPrice &&
        windowMatch &&
        (filters.types.length === 0 || filters.types.includes(bus?.type)) &&
        (filters.companyIds.length === 0 || filters.companyIds.includes(schedule.companyId))
    })

    const sorted = [...filtered]
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price)
    if (sort === 'departure') sorted.sort((a, b) => timeToMinutes(a.departureTime) - timeToMinutes(b.departureTime))
    if (sort === 'duration') sorted.sort((a, b) => getDuration(a) - getDuration(b))
    return sorted
  }, [baseResults, buses, filters, sort])

  const filterPanel = (
    <SearchFilters
      filters={filters}
      onChange={setFilters}
      companies={companies}
      priceRange={priceRange}
      sort={sort}
      onSortChange={setSort}
    />
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: t('search.title') }]} />

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{t('search.title')}</h1>
          <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-sm text-muted">
            <MapPinned size={15} className="text-brand-500" />
            {provinceName(search.from, language)} <span className="text-brand-500">→</span> {provinceName(search.to, language)}
            <span className="mx-1 text-[var(--border-color)]">|</span>
            {formatDate(search.date, language)}
            <span className="mx-1 text-[var(--border-color)]">|</span>
            {search.passengers} {t('common.passengers')}
          </p>
        </div>
        <Button variant="outline" icon={editing ? ArrowLeft : SlidersHorizontal} onClick={() => setEditing((value) => !value)}>
          {editing ? t('common.cancel') : t('search.editSearch')}
        </Button>
      </div>

      {editing && <Card className="mt-4 p-5"><SearchForm onSearch={() => setEditing(false)} /></Card>}

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">{filterPanel}</aside>

        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-muted">{t('search.resultsCount', { count: results.length })}</p>
            <Button variant="outline" size="sm" icon={Filter} className="lg:hidden" onClick={() => setMobileFilters((value) => !value)}>
              {t('search.filterMobile')}
            </Button>
          </div>
          {mobileFilters && <div className="mb-4 lg:hidden">{filterPanel}</div>}

          {loading ? (
            <div className="space-y-4">
              <p className="flex items-center gap-2 text-sm text-muted"><span className="h-2 w-2 animate-pulse rounded-full bg-brand-500" />{t('search.loadingResults')}</p>
              {[1, 2, 3].map((item) => <SkeletonCard key={item} />)}
            </div>
          ) : results.length === 0 ? (
            <Card>
              <EmptyState
                icon={SearchX}
                title={t('search.noResultsTitle')}
                description={t('search.noResultsText')}
                action={<Button onClick={() => setEditing(true)}>{t('search.editSearch')}</Button>}
              />
            </Card>
          ) : (
            <div className="space-y-4">
              {results.map((schedule) => (
                <BusCard key={schedule.id} schedule={schedule} onSelect={(item) => { selectSchedule(item); navigate(`/seats/${item.id}`) }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function getDuration(schedule) {
  const [departHour, departMinute] = schedule.departureTime.split(':').map(Number)
  const [arrivalHour, arrivalMinute] = schedule.arrivalTime.split(':').map(Number)
  const difference = (arrivalHour * 60 + arrivalMinute) - (departHour * 60 + departMinute)
  return difference > 0 ? difference : difference + 1440
}
