import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, CalendarDays, CheckCircle2, ShieldAlert, Ticket } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useData } from '../../context/DataContext'
import { formatDate } from '../../utils/date'
import { money } from '../../utils/format'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import EmptyState from '../../components/common/EmptyState'

export default function CancelBookingPage() {
  const { bookingId } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { confirm, toast } = useApp()
  const { bookings, schedules, cancelBooking } = useData()
  const [done, setDone] = useState(false)

  const booking = bookings.find((item) => item.id === bookingId || item.reference === bookingId)
  const schedule = schedules.find((item) => item.id === booking?.scheduleId)

  if (!booking) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Card>
          <EmptyState
            icon={Ticket}
            title={t('account.noBookingFound')}
            action={<Button to="/my-bookings">{t('account.bookingsTitle')}</Button>}
          />
        </Card>
      </div>
    )
  }

  const isCancelled = done || booking.status === 'CANCELLED'

  const requestCancel = async () => {
    const accepted = await confirm({
      title: t('account.cancelTitle'),
      message: t('account.cancelText'),
      confirmLabel: t('account.cancelConfirm'),
      cancelLabel: t('account.keepBooking'),
    })
    if (!accepted) return
    await cancelBooking(booking.id)
    setDone(true)
    toast.success(t('account.cancelSuccess'))
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: t('account.bookingsTitle'), to: '/my-bookings' }, { label: t('account.cancelBooking') }]} />

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">{t('account.cancelPageTitle')}</h1>
          <p className="mt-1 text-sm text-muted">{t('account.cancelPageSubtitle')}</p>
        </div>
        <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate(-1)}>{t('common.back')}</Button>
      </div>

      <Card className="mt-6 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
          <div>
            <p className="text-xs font-semibold text-muted">{t('common.reference')}</p>
            <p className="mt-1 font-extrabold">{booking.reference || booking.id}</p>
          </div>
          <Badge status={isCancelled ? 'CANCELLED' : booking.status} dot>
            {t(`common.${(isCancelled ? 'CANCELLED' : booking.status).toLowerCase()}`)}
          </Badge>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: 'var(--surface-muted)' }}>
            <CalendarDays size={18} className="shrink-0 text-brand-600" />
            <div>
              <p className="text-[11px] font-semibold text-muted">{t('common.date')}</p>
              <p className="text-sm font-bold">{formatDate(booking.date || schedule?.date)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: 'var(--surface-muted)' }}>
            <Ticket size={18} className="shrink-0 text-brand-600" />
            <div>
              <p className="text-[11px] font-semibold text-muted">{t('common.seats')}</p>
              <p className="text-sm font-bold">{booking.seats?.join(', ') || '—'}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
          <span className="text-sm text-muted">{t('common.amount')}</span>
          <span className="text-lg font-extrabold">{money(booking.amount)}</span>
        </div>
      </Card>

      {isCancelled ? (
        <Card className="mt-5 border-emerald-200 p-6 text-center dark:border-emerald-900/40">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
            <CheckCircle2 size={28} />
          </div>
          <h2 className="mt-4 text-lg font-extrabold">{t('account.cancelSuccessTitle')}</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">{t('account.cancelSuccessText')}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Button to="/my-bookings" variant="outline">{t('account.backToBookings')}</Button>
            <Button to="/search">{t('account.findBus')}</Button>
          </div>
        </Card>
      ) : (
        <Card className="mt-5 flex flex-wrap items-start gap-4 border-red-200 p-5 dark:border-red-900/40">
          <ShieldAlert size={22} className="mt-0.5 shrink-0 text-red-500" />
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold">{t('account.cancelPolicy')}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">{t('account.cancelText')}</p>
          </div>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto">
            <Button variant="ghost" onClick={() => navigate(`/my-bookings/${booking.id}`)}>{t('account.keepBooking')}</Button>
            <Button variant="danger" onClick={requestCancel}>{t('account.cancelConfirm')}</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
