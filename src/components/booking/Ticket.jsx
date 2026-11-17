import { useTranslation } from 'react-i18next'
import { BusFront, CalendarDays, Clock3, MapPin, Ticket as TicketIcon } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useData } from '../../context/DataContext'
import { getBus } from '../../data/buses'
import { getCompany } from '../../data/companies'
import { getRoute } from '../../data/routes'
import { provinceName } from '../../data/provinces'
import { formatDate } from '../../utils/date'
import { cn, money } from '../../utils/format'
import Badge from '../common/Badge'

export default function Ticket({ booking, className }) {
  const { t } = useTranslation()
  const { language } = useApp()
  const { buses, routes } = useData()

  if (!booking) return null

  const schedule = booking.schedule || { date: booking.date, departureTime: booking.departureTime, arrivalTime: booking.arrivalTime }
  const bus = getBus(schedule.busId, buses)
  const company = getCompany(schedule.companyId || booking.companyId)
  const route = getRoute(schedule.routeId, routes) || { fromProvinceId: booking.from, toProvinceId: booking.to }
  const seatText = (booking.seats || []).join(', ') || '—'

  return (
    <div className={cn('ticket-print app-card overflow-hidden', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 bg-navy-950 px-5 py-4 text-white">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10"><BusFront size={19} /></span>
          <div>
            <p className="text-sm font-extrabold tracking-tight">CAMBODIA BUS</p>
            <p className="text-[10px] text-white/60">{t('brand.tagline')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-white/70">{t('success.ticket')}</span>
          <Badge tone={booking.status === 'CANCELLED' ? 'danger' : 'success'} className="bg-white/10 text-white ring-white/20">
            {t(`common.${String(booking.status || 'PENDING').toLowerCase()}`)}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <StationBlock
          label={t('success.departure')}
          city={provinceName(route.fromProvinceId, language)}
          time={schedule.departureTime}
        />
        <div className="flex items-center justify-center gap-2 text-brand-600">
          <span className="h-2 w-2 rounded-full border-2 border-brand-600" />
          <span className="h-px w-10 bg-brand-300" />
          <BusFront size={18} />
          <span className="h-px w-10 bg-brand-300" />
          <span className="h-2 w-2 rounded-full bg-brand-600" />
        </div>
        <StationBlock
          label={t('success.arrival')}
          city={provinceName(route.toProvinceId, language)}
          time={schedule.arrivalTime}
          align="right"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 px-5 pb-5 sm:grid-cols-4">
        <Detail label={t('common.date')} value={formatDate(schedule.date, language)} icon={CalendarDays} />
        <Detail label={t('success.seats')} value={seatText} icon={TicketIcon} />
        <Detail label={t('common.bus')} value={bus?.name || '—'} icon={BusFront} />
        <Detail label={t('common.company')} value={company?.name?.[language] || company?.name?.en || '—'} icon={MapPin} compact />
      </div>

      <div className="relative border-t border-dashed" style={{ borderColor: 'var(--border-color)' }}>
        <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full" style={{ background: 'var(--app-bg)' }} />
        <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full" style={{ background: 'var(--app-bg)' }} />
        <div className="grid gap-4 p-5 sm:grid-cols-[1fr_auto]">
          <div className="space-y-2 text-sm">
            <Row label={t('success.bookingId')} value={booking.id} />
            <Row label={t('common.reference')} value={booking.reference || '—'} />
            <Row label={t('success.passenger')} value={(booking.passengers || []).map((passenger) => passenger.name).join(', ') || booking.customerName || '—'} />
            <Row label={t('payment.paymentStatus')} value={t(`common.${String(booking.paymentStatus || 'pending').toLowerCase()}`)} />
          </div>
          <div className="flex flex-col items-end justify-between gap-3">
            <div className="text-right">
              <p className="text-xs text-muted">{t('success.totalAmount')}</p>
              <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-300">{money(booking.amount)}</p>
            </div>
            <div className="flex items-end gap-0.5 opacity-70" aria-hidden="true">
              {Array.from({ length: 26 }).map((_, index) => (
                <span key={index} className="bg-[var(--text-main)]" style={{ width: index % 3 === 0 ? 2 : 1, height: 26 + (index % 4) * 3 }} />
              ))}
            </div>
            <p className="text-[10px] text-muted">{t('success.keepCode')} · {booking.id}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StationBlock({ label, city, time, align = 'left' }) {
  return (
    <div className={align === 'right' ? 'text-right' : ''}>
      <p className="flex items-center gap-1 text-xs font-semibold text-muted" style={align === 'right' ? { justifyContent: 'flex-end' } : undefined}>
        <MapPin size={12} /> {label}
      </p>
      <p className="mt-1 text-xl font-extrabold">{city}</p>
      <p className="mt-0.5 flex items-center gap-1 text-sm font-bold text-brand-600 dark:text-brand-300" style={align === 'right' ? { justifyContent: 'flex-end' } : undefined}>
        <Clock3 size={13} /> {time}
      </p>
    </div>
  )
}

function Detail({ label, value, icon: Icon, compact }) {
  return (
    <div className="rounded-xl p-3" style={{ background: 'var(--surface-muted)' }}>
      <p className="flex items-center gap-1 text-[10px] font-semibold text-muted"><Icon size={11} /> {label}</p>
      <p className={cn('mt-0.5 truncate font-bold', compact ? 'text-xs' : 'text-sm')} title={value}>{value}</p>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-3 border-b pb-1.5 last:border-0" style={{ borderColor: 'var(--border-color)' }}>
      <span className="text-muted">{label}</span>
      <span className="text-right font-semibold">{value}</span>
    </div>
  )
}
