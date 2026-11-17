import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, Download, Printer, TicketPlus } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useBooking } from '../../context/BookingContext'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import EmptyState from '../../components/common/EmptyState'
import Stepper from '../../components/common/Stepper'
import Ticket from '../../components/booking/Ticket'
import { downloadTicket } from '../../utils/ticket'
import { formatDate } from '../../utils/date'

export default function BookingSuccessPage() {
  const { bookingId } = useParams()
  const { t } = useTranslation()
  const { bookings, schedules } = useData()
  const { resetJourney } = useBooking()

  const booking = bookings.find((item) => item.id === bookingId || item.reference === bookingId)
  const schedule = schedules.find((item) => item.id === booking?.scheduleId)

  if (!booking) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Card><EmptyState title={t('account.noBookingFound')} action={<Button to="/my-bookings">{t('account.bookingsTitle')}</Button>} /></Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="no-print">
        <Breadcrumbs items={[{ label: t('account.bookingsTitle'), to: '/my-bookings' }, { label: booking.id }]} />
        <div className="mt-5">
          <Stepper steps={[t('seats.stepSearch'), t('seats.stepSeats'), t('seats.stepInfo'), t('seats.stepPayment'), t('seats.stepDone')]} current={4} />
        </div>
      </div>

      <div className="no-print mt-7 flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
          <CheckCircle2 size={30} />
        </span>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">{t('success.title')}</h1>
        <p className="mt-2 max-w-lg text-sm text-muted">{t('success.subtitle')}</p>
        <p className="mt-2 text-xs text-muted">
          {t('common.date')}: {formatDate(schedule?.date || booking.date)} · {t('success.bookingId')}: <strong>{booking.id}</strong>
        </p>
      </div>

      <div className="mt-6">
        <Ticket booking={{ ...booking, schedule }} />
      </div>

      <p className="no-print mt-3 text-center text-xs text-amber-600 dark:text-amber-400">{t('success.pendingNote')}</p>

      <div className="no-print mt-6 grid gap-3 sm:grid-cols-2">
        <Button size="lg" icon={Download} onClick={() => downloadTicket(
          booking,
          schedule,
          {
            departure: t('success.departure'), arrival: t('success.arrival'), date: t('common.date'),
            bookingId: t('success.bookingId'), seats: t('success.seats'), total: t('success.totalAmount'),
            passenger: t('success.passenger'), reference: t('common.reference'),
            paymentStatus: t('payment.paymentStatus'), demo: t('footer.demo'),
          },
        )}>
          {t('success.download')}
        </Button>
        <Button size="lg" variant="outline" icon={Printer} onClick={() => window.print()}>{t('success.print')}</Button>
        <Button variant="soft" icon={TicketPlus} to="/search" onClick={resetJourney}>{t('success.bookAnother')}</Button>
        <Button variant="ghost" to="/my-bookings">{t('success.viewBookings')}</Button>
      </div>
    </div>
  )
}
