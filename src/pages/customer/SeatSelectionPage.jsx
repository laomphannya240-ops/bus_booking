import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Armchair, Info } from 'lucide-react'
import { useBooking } from '../../context/BookingContext'
import { useData } from '../../context/DataContext'
import { useApp } from '../../context/AppContext'
import { busService } from '../../services/busService'
import { getBus } from '../../data/buses'
import { provinceName } from '../../data/provinces'
import { Stepper } from '../../components/common/Stepper'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import SeatMap from '../../components/booking/SeatMap'
import BookingSummary from '../../components/booking/BookingSummary'

export default function SeatSelectionPage() {
  const { scheduleId } = useParams()
  const { t } = useTranslation()
  const { language, toast } = useApp()
  const { schedules, buses, routes } = useData()
  const navigate = useNavigate()
  const {
    search, schedule, selectSchedule, seats, toggleSeat, setPassengers,
  } = useBooking()
  const [bookedSeats, setBookedSeats] = useState([])

  const found = schedules.find((item) => item.id === scheduleId)

  useEffect(() => {
    if (found && (!schedule || schedule.id !== found.id)) selectSchedule(found)
  }, [found, schedule, selectSchedule])

  useEffect(() => {
    let active = true
    busService.getSeats(scheduleId).then((result) => {
      if (active) setBookedSeats(result.length ? result : found?.bookedSeats || [])
    }).catch(() => {
      if (active) setBookedSeats(found?.bookedSeats || [])
    })
    return () => { active = false }
  }, [scheduleId, found])

  const activeSchedule = schedule?.id === scheduleId ? schedule : found
  const bus = getBus(activeSchedule?.busId, buses)
  const route = routes.find((item) => item.id === activeSchedule?.routeId)

  if (!found) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Card><EmptyState title={t('errors.notFoundTitle')} description={t('errors.notFoundText')} action={<Button to="/search">{t('search.editSearch')}</Button>} /></Card>
      </div>
    )
  }

  const max = search.passengers
  const total = (activeSchedule?.price || 0) * seats.length

  const continueBooking = () => {
    if (seats.length !== max) {
      toast.error(t('seats.selectSeatsFirst', { count: max }))
      return
    }
    setPassengers(seats.map((seat) => ({ name: '', gender: 'MALE', phone: '', seat })))
    navigate('/booking/info')
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: t('search.title'), to: '/search' }, { label: t('seats.title') }]} />
      <div className="mt-5">
        <Stepper
          current={1}
          steps={[t('seats.stepSearch'), t('seats.stepSeats'), t('seats.stepInfo'), t('seats.stepPayment'), t('seats.stepDone')]}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">{t('seats.title')}</h1>
          <p className="mt-1 text-sm text-muted">{t('seats.subtitle', { count: max })}</p>
        </div>
        <p className="text-sm font-semibold text-brand-600 dark:text-brand-300">
          {provinceName(route?.fromProvinceId, language)} → {provinceName(route?.toProvinceId, language)}
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card className="p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-2">
            <Armchair size={18} className="text-brand-600" />
            <h2 className="font-bold">{bus?.name || t('common.bus')}</h2>
            <span className="chip bg-[var(--surface-muted)] text-muted">{bus?.capacity} {t('common.seats')}</span>
          </div>
          <SeatMap
            capacity={activeSchedule?.capacity || bus?.capacity || 48}
            bookedSeats={bookedSeats}
            selectedSeats={seats}
            onToggle={(seat) => toggleSeat(seat, max)}
            type={bus?.type}
          />
          {seats.length >= max && (
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
              <Info size={13} /> {t('seats.maxSeats', { count: max })}
            </p>
          )}
        </Card>

        <div className="space-y-4">
          <BookingSummary schedule={activeSchedule} seats={seats} />

          <Card className="p-5">
            <h3 className="text-sm font-bold">{t('seats.selectionSummary')}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {seats.length ? seats.map((seat) => (
                <span key={seat} className="chip bg-brand-600 text-white">{seat}</span>
              )) : <p className="text-sm text-muted">—</p>}
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-4 text-sm" style={{ borderColor: 'var(--border-color)' }}>
              <span className="text-muted">{t('seats.totalPassengers')}</span>
              <span className="font-bold">{seats.length} / {max}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-muted">{t('seats.totalPrice')}</span>
              <span className="text-lg font-extrabold text-brand-600 dark:text-brand-300">${total.toFixed(2)}</span>
            </div>
            <Button size="lg" className="mt-4 w-full" icon={ArrowRight} onClick={continueBooking}>
              {t('seats.continueBooking')}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
