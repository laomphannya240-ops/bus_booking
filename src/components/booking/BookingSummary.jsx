import { useTranslation } from 'react-i18next'
import { CalendarDays, Clock3, MapPin } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useData } from '../../context/DataContext'
import { getBus } from '../../data/buses'
import { getCompany } from '../../data/companies'
import { getRoute } from '../../data/routes'
import { provinceName } from '../../data/provinces'
import { formatDate, formatDuration, durationBetween } from '../../utils/date'
import { cn, money } from '../../utils/format'
import CompanyLogo from '../bus/CompanyLogo'
import Card from '../common/Card'

export default function BookingSummary({ schedule, seats = [], showPricing = true, className }) {
  const { t } = useTranslation()
  const { language } = useApp()
  const { buses, routes } = useData()
  if (!schedule) return null

  const bus = getBus(schedule.busId, buses) || getBus(schedule.busId)
  const company = getCompany(schedule.companyId)
  const route = getRoute(schedule.routeId, routes) || getRoute(schedule.routeId)
  const total = schedule.price * seats.length

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="flex items-center gap-3 border-b p-5" style={{ borderColor: 'var(--border-color)' }}>
        <CompanyLogo company={company} />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{company?.name?.[language] || company?.name?.en}</p>
          <p className="text-xs text-muted">{bus?.name} · {bus?.type}</p>
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs text-muted">{t('booking.tripSummary')}</p>
          <p className="mt-1 font-bold">{provinceName(route?.fromProvinceId, language)} <span className="text-brand-600">→</span> {provinceName(route?.toProvinceId, language)}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Info icon={CalendarDays} label={t('common.date')} value={formatDate(schedule.date, language)} />
          <Info icon={Clock3} label={t('common.duration')} value={formatDuration(durationBetween(schedule.departureTime, schedule.arrivalTime), language)} />
          <Info icon={MapPin} label={t('search.departure')} value={schedule.departureTime} />
          <Info icon={MapPin} label={t('search.arrival')} value={schedule.arrivalTime} />
        </div>
        <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: 'var(--border-color)' }}>
          <span className="text-sm text-muted">{t('seats.selectionSummary')}</span>
          <span className="text-sm font-bold">{seats.length ? seats.join(', ') : '—'}</span>
        </div>
        {showPricing && (
          <div className="space-y-2 rounded-xl p-3 text-sm" style={{ background: 'var(--surface-muted)' }}>
            <div className="flex justify-between text-muted"><span>{t('seats.seatPrice')}</span><span>{money(schedule.price)}</span></div>
            <div className="flex justify-between text-muted"><span>{t('seats.totalPassengers')}</span><span>{seats.length}</span></div>
            <div className="flex justify-between border-t pt-2 font-extrabold" style={{ borderColor: 'var(--border-color)' }}>
              <span>{t('seats.totalPrice')}</span><span className="text-brand-600 dark:text-brand-300">{money(total)}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl p-2.5" style={{ background: 'var(--surface-muted)' }}>
      <p className="flex items-center gap-1 text-[10px] font-semibold text-muted"><Icon size={11} /> {label}</p>
      <p className="mt-0.5 text-sm font-bold">{value}</p>
    </div>
  )
}
