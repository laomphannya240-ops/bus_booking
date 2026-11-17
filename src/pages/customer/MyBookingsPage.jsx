import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CalendarDays, ChevronRight, MapPinned, Search, Ticket } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useData } from '../../context/DataContext'
import { provinceName } from '../../data/provinces'
import { getBus } from '../../data/buses'
import { formatDate } from '../../utils/date'
import { money } from '../../utils/format'
import { BOOKING_STATUS } from '../../constants'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import EmptyState from '../../components/common/EmptyState'

export default function MyBookingsPage() {
  const { t } = useTranslation()
  const { user } = useApp()
  const { bookings, routes, buses, schedules } = useData()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('ALL')

  const mine = useMemo(
    () => bookings.filter((booking) =>
      user ? booking.customerId === user.id || booking.customerId === 'guest' : booking.customerId === 'usr-customer',
    ),
    [bookings, user],
  )

  const routeFor = useCallback((booking) => {
    const schedule = schedules.find((item) => item.id === booking.scheduleId)
    return routes.find((item) => item.id === schedule?.routeId)
      || routes.find((item) => item.fromProvinceId === booking.from && item.toProvinceId === booking.to)
  }, [routes, schedules])

  const filtered = useMemo(() => mine.filter((booking) => {
    const route = routeFor(booking)
    const routeText = route ? `${provinceName(route.fromProvinceId, 'en')} ${provinceName(route.toProvinceId, 'en')}` : ''
    const matchesQuery = `${booking.id} ${booking.reference} ${routeText}`.toLowerCase().includes(query.toLowerCase())
    const matchesStatus = status === 'ALL' || booking.status === status
    return matchesQuery && matchesStatus
  }), [mine, query, status, routeFor])

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: t('account.bookingsTitle') }]} />
      <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">{t('account.bookingsTitle')}</h1>
          <p className="mt-1 text-sm text-muted">{t('account.bookingsSubtitle')}</p>
        </div>
        <Button to="/search" variant="outline">{t('account.findBus')}</Button>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <div className="relative min-w-56 flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input className="input-base !pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('account.searchBookings')} />
        </div>
        <select className="input-base max-w-48" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="ALL">{t('account.filterAll')}</option>
          {Object.values(BOOKING_STATUS).map((item) => <option key={item} value={item}>{t(`common.${item.toLowerCase()}`)}</option>)}
        </select>
      </div>

      <div className="mt-5 space-y-4">
        {filtered.length === 0 ? (
          <Card>
            <EmptyState icon={Ticket} title={query || status !== 'ALL' ? t('common.noResults') : t('account.emptyBookings')} description={t('account.emptyBookingsText')} action={<Button to="/search">{t('account.findBus')}</Button>} />
          </Card>
        ) : filtered.map((booking) => {
          const schedule = schedules.find((item) => item.id === booking.scheduleId)
          const route = routeFor(booking)
          const bus = getBus(schedule?.busId || booking.busId, buses)
          return (
            <Card key={booking.id} className="overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Ticket size={14} /> <span className="font-bold text-[var(--text-main)]">{booking.id}</span>
                  <span>·</span><span>{booking.reference}</span>
                </div>
                <Badge status={booking.status} dot>{t(`common.${booking.status.toLowerCase()}`)}</Badge>
              </div>
              <div className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="flex items-center gap-2 text-lg font-extrabold">
                    {route ? provinceName(route.fromProvinceId) : '—'}
                    <span className="text-brand-600">→</span>
                    {route ? provinceName(route.toProvinceId) : '—'}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
                    <span className="flex items-center gap-1"><CalendarDays size={13} /> {formatDate(booking.date)} {booking.departureTime}</span>
                    <span className="flex items-center gap-1"><MapPinned size={13} /> {bus?.name || t('common.bus')}</span>
                    <span>{t('seats.selectionSummary')}: {booking.seats.join(', ')}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <p className="text-xl font-extrabold text-brand-600 dark:text-brand-300">{money(booking.amount)}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" to={`/my-bookings/${booking.id}`}>{t('account.viewDetails')} <ChevronRight size={14} /></Button>
                    {!['CANCELLED', 'COMPLETED'].includes(booking.status) && (
                      <Button size="sm" variant="ghost" className="text-red-500" to={`/cancel-booking/${booking.id}`}>{t('account.cancelBooking')}</Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
