import { useTranslation } from 'react-i18next'
import { ArrowRight, Clock3, MapPin, Sparkles, Users } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useData } from '../../context/DataContext'
import { getBus } from '../../data/buses'
import { getCompany } from '../../data/companies'
import { getRoute } from '../../data/routes'
import { stationName } from '../../data/stations'
import { provinceName } from '../../data/provinces'
import { durationBetween, formatDate, formatDuration } from '../../utils/date'
import { cn, money } from '../../utils/format'
import Badge from '../common/Badge'
import Button from '../common/Button'
import CompanyLogo from './CompanyLogo'
import BusIllustration from './BusIllustration'

export default function BusCard({ schedule, onSelect }) {
  const { t } = useTranslation()
  const { language } = useApp()
  const { buses, stations, routes } = useData()
  const bus = getBus(schedule.busId, buses) || getBus(schedule.busId)
  const company = getCompany(schedule.companyId)
  const route = getRoute(schedule.routeId, routes) || getRoute(schedule.routeId)
  const fromStation = stations.find((station) => station.provinceId === route?.fromProvinceId)
  const toStation = stations.find((station) => station.provinceId === route?.toProvinceId)
  const duration = durationBetween(schedule.departureTime, schedule.arrivalTime)

  return (
    <article className="app-card group overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-float">
      <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center">
        <div className="flex min-w-0 items-start gap-3 lg:w-52 lg:shrink-0">
          <CompanyLogo company={company} />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{company?.name?.[language] || company?.name?.en}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
              <Sparkles size={11} className="text-amber-500" /> {company?.rating} · {bus?.plate}
            </p>
            <Badge tone={bus?.type === 'VIP' ? 'brand' : bus?.type === 'Sleeper' ? 'violet' : 'neutral'} className="mt-2">
              {bus?.type}
            </Badge>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-5">
          <div>
            <p className="text-xl font-extrabold tracking-tight sm:text-2xl">{schedule.departureTime}</p>
            <p className="mt-0.5 text-xs font-semibold text-muted">{provinceName(route?.fromProvinceId, language)}</p>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted"><MapPin size={10} /> {fromStation ? stationName(fromStation.id, language, stations) : '—'}</p>
          </div>

          <div className="flex flex-col items-center">
            <p className="mb-1 flex items-center gap-1 whitespace-nowrap text-[11px] font-medium text-muted">
              <Clock3 size={11} /> {formatDuration(duration, language)}
            </p>
            <div className="flex w-full items-center">
              <span className="h-2 w-2 rounded-full border-2 border-brand-600" />
              <span className="h-px flex-1 bg-[var(--border-color)]" />
              <ArrowRight size={13} className="text-brand-500" />
              <span className="h-px flex-1 bg-[var(--border-color)]" />
              <span className="h-2 w-2 rounded-full bg-brand-600" />
            </div>
            <p className="mt-1 text-[11px] text-muted">{formatDate(schedule.date, language, { day: 'numeric', month: 'short' })}</p>
          </div>

          <div className="text-right">
            <p className="text-xl font-extrabold tracking-tight sm:text-2xl">{schedule.arrivalTime}</p>
            <p className="mt-0.5 text-xs font-semibold text-muted">{provinceName(route?.toProvinceId, language)}</p>
            <p className="mt-0.5 flex items-center justify-end gap-1 text-[11px] text-muted"><MapPin size={10} /> {toStation ? stationName(toStation.id, language, stations) : '—'}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t pt-4 lg:w-48 lg:flex-col lg:items-end lg:justify-center lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0" style={{ borderColor: 'var(--border-color)' }}>
          <div className="text-left lg:text-right">
            <p className="text-[11px] text-muted">{t('common.price')}</p>
            <p className="text-xl font-extrabold text-brand-600 dark:text-brand-300">{money(schedule.price)}</p>
            <p className={cn('mt-0.5 flex items-center gap-1 text-[11px]', schedule.availableSeats > 8 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400')}>
              <Users size={11} /> {t('search.availableSeats', { count: schedule.availableSeats })}
            </p>
          </div>
          <Button size="sm" onClick={() => onSelect(schedule)} disabled={schedule.availableSeats < 1}>
            {schedule.availableSeats < 1 ? t('search.soldOut') : t('search.viewSeats')}
          </Button>
        </div>
      </div>

      <div className="h-14 overflow-hidden border-t opacity-90" style={{ borderColor: 'var(--border-color)' }}>
        <BusIllustration company={company} type={bus?.type} plate={bus?.plate} className="h-14" />
      </div>
    </article>
  )
}
