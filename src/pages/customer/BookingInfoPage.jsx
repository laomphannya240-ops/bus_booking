import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ArrowRight, CircleAlert, Mail, Phone, UserRound, Users } from 'lucide-react'
import { useBooking } from '../../context/BookingContext'
import { useApp } from '../../context/AppContext'
import { GENDERS } from '../../constants'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import FormField from '../../components/common/FormField'
import Stepper from '../../components/common/Stepper'
import BookingSummary from '../../components/booking/BookingSummary'

export default function BookingInfoPage() {
  const { t } = useTranslation()
  const { toast } = useApp()
  const navigate = useNavigate()
  const { schedule, seats, contact, setContact, passengers, setPassengers } = useBooking()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: contact.fullName,
      phone: contact.phone,
      email: contact.email,
      passengers: passengers.length
        ? passengers.map((passenger, index) => ({ ...passenger, seat: seats[index] || passenger.seat }))
        : seats.map((seat) => ({ name: '', gender: 'MALE', phone: '', seat })),
      agreement: false,
    },
  })

  useEffect(() => {
    if (!schedule || seats.length === 0) navigate('/search', { replace: true })
  }, [schedule, seats.length, navigate])

  if (!schedule || seats.length === 0) return null

  const submit = (values) => {
    setContact({ fullName: values.fullName.trim(), phone: values.phone.trim(), email: values.email.trim() })
    setPassengers(values.passengers.map((passenger, index) => ({ ...passenger, seat: seats[index] })))
    toast.success(t('common.saveDemo'))
    navigate('/booking/payment')
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: t('search.title'), to: '/search' }, { label: t('seats.title') }, { label: t('booking.title') }]} />
      <div className="mt-5">
        <Stepper steps={[t('seats.stepSearch'), t('seats.stepSeats'), t('seats.stepInfo'), t('seats.stepPayment'), t('seats.stepDone')]} current={2} />
      </div>

      <div className="mt-6 mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight">{t('booking.title')}</h1>
        <p className="mt-1 text-sm text-muted">{t('booking.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit(submit)} className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <Card className="p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300"><UserRound size={17} /></span>
              <h2 className="font-bold">{t('booking.contactTitle')}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label={t('booking.fullName')} required error={errors.fullName?.message} className="sm:col-span-2">
                <input
                  className="input-base"
                  placeholder={t('booking.fullName')}
                  {...register('fullName', {
                    required: t('booking.requiredError'),
                    minLength: { value: 2, message: t('booking.minNameError') },
                  })}
                  aria-invalid={Boolean(errors.fullName)}
                />
              </FormField>
              <FormField label={t('booking.phoneNumber')} required error={errors.phone?.message}>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    className="input-base !pl-9"
                    placeholder="012 345 678"
                    {...register('phone', {
                      required: t('booking.requiredError'),
                      validate: (value) => /^(?:\+855|0)?[1-9]\d{8,9}$/.test(value.replace(/\s/g, '')) || t('booking.phoneError'),
                    })}
                    aria-invalid={Boolean(errors.phone)}
                  />
                </div>
              </FormField>
              <FormField label={t('booking.emailAddress')} required error={errors.email?.message}>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="email"
                    className="input-base !pl-9"
                    placeholder="name@example.com"
                    {...register('email', {
                      required: t('booking.requiredError'),
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t('booking.emailError') },
                    })}
                    aria-invalid={Boolean(errors.email)}
                  />
                </div>
              </FormField>
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300"><Users size={17} /></span>
              <h2 className="font-bold">{t('common.passengers')}</h2>
            </div>
            <div className="space-y-5">
              {seats.map((seat, index) => (
                <div key={seat} className="rounded-xl border p-4" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-bold">{t('booking.passengerTitle', { number: index + 1 })}</h3>
                    <span className="chip bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">{t('booking.seat')} {seat}</span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <FormField label={t('booking.passengerName')} required error={errors.passengers?.[index]?.name?.message}>
                      <input
                        className="input-base"
                        {...register(`passengers.${index}.name`, {
                          required: t('booking.requiredError'),
                          minLength: { value: 2, message: t('booking.minNameError') },
                        })}
                      />
                    </FormField>
                    <FormField label={t('booking.passengerGender')} required>
                      <select className="input-base" {...register(`passengers.${index}.gender`)}>
                        {GENDERS.map((gender) => (
                          <option key={gender} value={gender}>{t(`common.${gender.toLowerCase()}`)}</option>
                        ))}
                      </select>
                    </FormField>
                    <FormField label={t('booking.passengerPhone')}>
                      <input className="input-base" {...register(`passengers.${index}.phone`)} />
                    </FormField>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <label className="flex cursor-pointer items-start gap-3">
              <input type="checkbox" className="mt-1 h-4 w-4 accent-brand-600" {...register('agreement', { required: t('booking.agreementError') })} />
              <span className="text-sm">{t('booking.agreement')}</span>
            </label>
            {errors.agreement && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.agreement.message}</p>}
            <div className="mt-4 flex gap-2 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
              <CircleAlert size={16} className="mt-0.5 shrink-0" />
              <div><strong>{t('booking.cancellationPolicy')}:</strong> {t('booking.cancellationText')}</div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <BookingSummary schedule={schedule} seats={seats} />
          <Button type="submit" size="lg" className="w-full" icon={ArrowRight}>{t('booking.continuePayment')}</Button>
        </div>
      </form>
    </div>
  )
}
