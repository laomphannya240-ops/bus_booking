import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, CalendarDays, MapPin, Users } from 'lucide-react'
import { useBooking } from '../../context/BookingContext'
import { useApp } from '../../context/AppContext'
import { provinces } from '../../data/provinces'
import { todayISO } from '../../utils/date'
import Button from '../common/Button'

export default function SearchForm({ onSearch, className = '' }) {
  const { t } = useTranslation()
  const { language, toast } = useApp()
  const { search, updateSearch } = useBooking()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      from: search.from,
      to: search.to,
      date: search.date || todayISO(),
      passengers: search.passengers,
    },
  })

  useEffect(() => {
    reset({ from: search.from, to: search.to, date: search.date, passengers: search.passengers })
  }, [search, reset])

  const from = watch('from')

  const submit = (values) => {
    if (Number(values.from) === Number(values.to)) {
      toast.error(t('search.noResultsTitle'))
      return
    }
    updateSearch({
      from: Number(values.from),
      to: Number(values.to),
      date: values.date,
      passengers: Number(values.passengers),
    })
    if (onSearch) onSearch(values)
    else navigate('/search')
  }

  return (
    <form onSubmit={handleSubmit(submit)} className={className}>
      <div className="search-form-grid">
        <div className="search-from">
          <label className="label-base flex items-center gap-1.5"><MapPin size={13} /> {t('home.fromProvince')}</label>
          <select className="input-base" {...register('from', { valueAsNumber: true })} aria-invalid={Boolean(errors.from)}>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>{province[language] || province.en}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => {
            const currentFrom = watch('from')
            setValue('from', watch('to'))
            setValue('to', currentFrom)
          }}
          className="search-swap btn-outline mb-0.5 h-10 w-10 self-end !rounded-full !p-0 xl:mb-0.5"
          title={t('home.swap')}
          aria-label={t('home.swap')}
        >
          <ArrowRight size={16} className="rotate-90 xl:rotate-0" />
        </button>

        <div className="search-to">
          <label className="label-base flex items-center gap-1.5"><MapPin size={13} /> {t('home.toProvince')}</label>
          <select className="input-base" {...register('to', { valueAsNumber: true })} aria-invalid={Boolean(errors.to)}>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>{province[language] || province.en}</option>
            ))}
          </select>
        </div>

        <div className="search-date">
          <label className="label-base flex items-center gap-1.5"><CalendarDays size={13} /> {t('home.departureDate')}</label>
          <input
            type="date"
            min={todayISO()}
            className="input-base"
            {...register('date', { required: true })}
            aria-invalid={Boolean(errors.date)}
          />
        </div>

        <div className="search-passengers">
          <label className="label-base flex items-center gap-1.5"><Users size={13} /> {t('home.passengersCount')}</label>
          <select className="input-base" {...register('passengers', { valueAsNumber: true })}>
            {[1, 2, 3, 4, 5, 6].map((count) => (
              <option key={count} value={count}>{count} {t('common.passengers')}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted">
          {provinces.find((item) => item.id === Number(from)) ? `${t('common.from')} ${(provinces.find((item) => item.id === Number(from))[language] || provinces.find((item) => item.id === Number(from)).en)}` : ''}
        </p>
        <Button type="submit" size="lg" icon={ArrowRight} className="w-full sm:w-auto">
          {t('home.searchBuses')}
        </Button>
      </div>
    </form>
  )
}
