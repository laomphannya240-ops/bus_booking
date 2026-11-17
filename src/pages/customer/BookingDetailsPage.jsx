import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Download, Printer, ShieldAlert } from 'lucide-react'
import { useData } from '../../context/DataContext'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import EmptyState from '../../components/common/EmptyState'
import Ticket from '../../components/booking/Ticket'
import { downloadTicket } from '../../utils/ticket'

export default function BookingDetailsPage() {
  const { bookingId } = useParams()
  const { t } = useTranslation()
  const { bookings, schedules } = useData()
  const navigate = useNavigate()

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
      <Breadcrumbs items={[{ label: t('account.bookingsTitle'), to: '/my-bookings' }, { label: booking.id }]} />
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight">{t('account.detailsTitle')}</h1>
        <Button variant="ghost" onClick={() => navigate(-1)}>{t('common.back')}</Button>
      </div>

      <div className="mt-6"><Ticket booking={{ ...booking, schedule }} /></div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Button icon={Download} onClick={() => downloadTicket(booking, schedule, {
          departure: t('success.departure'), arrival: t('success.arrival'), date: t('common.date'),
          bookingId: t('success.bookingId'), seats: t('success.seats'), total: t('success.totalAmount'),
          passenger: t('success.passenger'), reference: t('common.reference'),
          paymentStatus: t('payment.paymentStatus'), demo: t('footer.demo'),
        })}>{t('success.download')}</Button>
        <Button variant="outline" icon={Printer} onClick={() => window.print()}>{t('success.print')}</Button>
      </div>

      {!['CANCELLED', 'COMPLETED'].includes(booking.status) && (
        <Card className="mt-5 flex flex-wrap items-center justify-between gap-4 border-red-200 p-5 dark:border-red-900/40">
          <div className="flex items-start gap-3">
            <ShieldAlert size={20} className="mt-0.5 shrink-0 text-red-500" />
            <div>
              <h3 className="text-sm font-bold">{t('account.cancelBooking')}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">{t('booking.cancellationText')}</p>
            </div>
          </div>
          <Button variant="danger" to={`/cancel-booking/${booking.id}`}>{t('account.cancelBooking')}</Button>
        </Card>
      )}
    </div>
  )
}
