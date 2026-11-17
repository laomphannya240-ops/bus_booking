import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  AlertTriangle, ArrowLeft, CheckCircle2, Clock3, FileCheck2, RefreshCw, Upload,
} from 'lucide-react'
import { useBooking } from '../../context/BookingContext'
import { useData } from '../../context/DataContext'
import { useApp } from '../../context/AppContext'
import { PAYMENT_COUNTDOWN_SECONDS, PAYMENT_STATUS } from '../../constants'
import { paymentService } from '../../services/paymentService'
import { useCountdown } from '../../hooks'
import { money } from '../../utils/format'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Stepper from '../../components/common/Stepper'
import Badge from '../../components/common/Badge'
import PaymentQR from '../../components/booking/PaymentQR'
import BookingSummary from '../../components/booking/BookingSummary'

export default function PaymentPage() {
  const { t } = useTranslation()
  const { toast, user } = useApp()
  const navigate = useNavigate()
  const { schedule, seats, passengers, contact, payment, setPayment, setProof, booking, setBooking, resetJourney } = useBooking()
  const { addPayment, updatePayment, addBooking, routes } = useData()
  const { formatted, expired, reset } = useCountdown(PAYMENT_COUNTDOWN_SECONDS)
  const [fileName, setFileName] = useState('')
  const startedRef = useRef(false)

  useEffect(() => {
    if (!schedule || seats.length === 0 || !contact.fullName) {
      navigate('/booking/info', { replace: true })
    }
  }, [schedule, seats.length, contact.fullName, navigate])

  useEffect(() => {
    if (!schedule || !payment || startedRef.current) return
    startedRef.current = true
    addPayment({
      amount: schedule.price * seats.length,
      bookingReference: `DRAFT-${Date.now().toString(36).toUpperCase()}`,
    }).then((created) => setPayment(created)).catch(() => startedRef.current = false)
  }, [schedule, seats.length, payment, addPayment, setPayment])

  if (!schedule || seats.length === 0) return null

  const total = schedule.price * seats.length
  const reference = booking?.reference || payment?.bookingReference || 'PENDING'
  const route = routes.find((item) => item.id === schedule.routeId)

  const createBooking = async () => {
    const created = await addBooking({
      scheduleId: schedule.id,
      from: route?.fromProvinceId,
      to: route?.toProvinceId,
      date: schedule.date,
      departureTime: schedule.departureTime,
      arrivalTime: schedule.arrivalTime,
      customerId: user?.id || 'guest',
      customerName: contact.fullName,
      email: contact.email,
      phone: contact.phone,
      passengers: passengers.map((passenger) => ({ ...passenger })),
      seats: [...seats],
      amount: total,
      paymentStatus: payment?.status === PAYMENT_STATUS.PROOF_UPLOADED ? PAYMENT_STATUS.PROOF_UPLOADED : PAYMENT_STATUS.PENDING,
      paymentReference: payment?.reference,
    })
    setBooking(created)
    toast.success(t('success.title'))
    navigate(`/booking/success/${created.id}`)
  }

  const onProofChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('payment.proofHint'))
      return
    }
    setFileName(file.name)
    setProof({ name: file.name, size: file.size })
    if (payment) {
      const result = await paymentService.uploadProof(payment.id, file)
      updatePayment(payment.id, { status: result.status, proofName: file.name })
      setPayment((current) => ({ ...current, status: result.status, proofName: file.name }))
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: t('booking.title') }, { label: t('payment.title') }]} />
      <div className="mt-5">
        <Stepper steps={[t('seats.stepSearch'), t('seats.stepSeats'), t('seats.stepInfo'), t('seats.stepPayment'), t('seats.stepDone')]} current={3} />
      </div>

      <div className="mt-6 mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight">{t('payment.title')}</h1>
        <p className="mt-1 text-sm text-muted">{t('payment.subtitle')}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <Card className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-bold">{t('payment.methodTitle')}</h2>
                <p className="mt-1 text-sm text-muted">{t('payment.khqr')}</p>
              </div>
              <Badge tone="brand">{t('payment.khqr')}</Badge>
            </div>

            <div className="mt-5 grid gap-6 sm:grid-cols-[220px_1fr] sm:items-center">
              <div className="rounded-2xl border p-3" style={{ borderColor: 'var(--border-color)' }}>
                {expired ? (
                  <div className="flex h-[220px] flex-col items-center justify-center gap-3 text-center">
                    <Clock3 size={30} className="text-amber-500" />
                    <p className="text-sm font-bold">{t('payment.expired')}</p>
                    <Button size="sm" icon={RefreshCw} onClick={() => { reset(); toast.info(t('payment.refresh')) }}>{t('payment.refresh')}</Button>
                  </div>
                ) : (
                  <PaymentQR payload={payment?.demoQrPayload || `DEMO|${total}|${reference}`} />
                )}
              </div>
              <div className="space-y-4">
                <div className="rounded-xl p-4" style={{ background: 'var(--surface-muted)' }}>
                  <p className="text-xs text-muted">{t('payment.qrTitle')}</p>
                  <p className="mt-1 text-sm leading-relaxed">{t('payment.qrHint')}</p>
                  <div className="mt-3 flex items-center gap-2 text-brand-600 dark:text-brand-300">
                    <Clock3 size={16} />
                    <span className="text-sm font-bold">{t('payment.countdownTitle')}: {formatted}</span>
                  </div>
                </div>
                <div className="flex gap-2 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  <p>{t('payment.demoWarning')}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl p-3" style={{ background: 'var(--surface-muted)' }}>
                    <p className="text-[11px] text-muted">{t('payment.amountDue')}</p>
                    <p className="text-lg font-extrabold text-brand-600 dark:text-brand-300">{money(total)}</p>
                  </div>
                  <div className="rounded-xl p-3" style={{ background: 'var(--surface-muted)' }}>
                    <p className="text-[11px] text-muted">{t('payment.bookingReference')}</p>
                    <p className="truncate text-sm font-bold">{reference}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <h2 className="font-bold">{t('payment.proofTitle')}</h2>
            <p className="mt-1 text-xs text-muted">{t('payment.proofOptional')}</p>
            <div className="mt-4">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors hover:border-brand-400" style={{ borderColor: 'var(--border-color)' }}>
                {fileName ? <FileCheck2 size={26} className="text-emerald-500" /> : <Upload size={26} className="text-muted" />}
                <span className="text-sm font-semibold">{fileName || t('payment.proofTitle')}</span>
                <span className="text-xs text-muted">{t('payment.proofHint')}</span>
                <input type="file" accept="image/png,image/jpeg,application/pdf" className="hidden" onChange={onProofChange} />
              </label>
              {fileName && (
                <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <span className="flex items-center gap-2"><CheckCircle2 size={15} /> {t('payment.uploaded')}: {fileName}</span>
                  <button type="button" onClick={() => { setFileName(''); setProof(null); if (payment) { updatePayment(payment.id, { status: PAYMENT_STATUS.PENDING }); setPayment((current) => ({ ...current, status: PAYMENT_STATUS.PENDING })) } }} className="text-xs font-bold underline">
                    {t('payment.removeProof')}
                  </button>
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl p-3 text-sm" style={{ background: 'var(--surface-muted)' }}>
              <span className="text-muted">{t('payment.paymentStatus')}</span>
              <Badge status={payment?.status || PAYMENT_STATUS.PENDING} dot>
                {t(payment?.status === PAYMENT_STATUS.PROOF_UPLOADED ? 'payment.statusProof' : 'payment.statusAwaiting')}
              </Badge>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <BookingSummary schedule={schedule} seats={seats} />
          <Card className="p-5">
            <p className="text-xs leading-relaxed text-muted">{t('payment.paymentNote')}</p>
            <Button size="lg" className="mt-4 w-full" onClick={createBooking}>{t('payment.confirmPayment')}</Button>
            <Button variant="ghost" className="mt-2 w-full" icon={ArrowLeft} onClick={() => navigate('/booking/info')}>
              {t('payment.backToBooking')}
            </Button>
            <button
              type="button"
              onClick={() => { resetJourney(); navigate('/') }}
              className="mt-2 w-full text-center text-xs text-muted hover:underline"
            >
              {t('common.cancel')}
            </button>
          </Card>
        </div>
      </div>
    </div>
  )
}
