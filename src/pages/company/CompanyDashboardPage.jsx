import { useTranslation } from 'react-i18next'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BusFront, CalendarClock, CreditCard, Ticket } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useData } from '../../context/DataContext'
import { reportService } from '../../services/reportService'
import { companyName } from '../../data/companies'
import { provinceName } from '../../data/provinces'
import { formatDate } from '../../utils/date'
import { money } from '../../utils/format'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'

export default function CompanyDashboardPage() {
  const { t, i18n } = useTranslation()
  const { user } = useApp()
  const { buses, schedules, bookings, routes } = useData()
  const language = i18n.language.startsWith('km') ? 'km' : 'en'
  const companyId = user?.companyId

  const myBuses = buses.filter((bus) => bus.companyId === companyId)
  const mySchedules = schedules.filter((schedule) => schedule.companyId === companyId)
  const myScheduleIds = new Set(mySchedules.map((schedule) => schedule.id))
  const myBookings = bookings.filter((booking) => myScheduleIds.has(booking.scheduleId))
  const revenue = myBookings.reduce((sum, booking) => sum + Number(booking.amount || 0), 0)
  const monthly = reportService.getMonthlyRevenue().map((item) => ({ ...item, label: language === 'km' ? item.km : item.month }))

  const stats = [
    { label: t('company.myBuses'), value: myBuses.length, icon: BusFront },
    { label: t('company.mySchedules'), value: mySchedules.length, icon: CalendarClock },
    { label: t('admin.bookings'), value: myBookings.length, icon: Ticket },
    { label: t('admin.totalRevenue'), value: money(revenue), icon: CreditCard },
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">{companyName(companyId, language)}</h2>
          <p className="mt-1 text-sm text-muted">{t('company.panelSubtitle')}</p>
        </div>
        <Badge tone="brand" dot>{t('company.viewOnly')}</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <div className="flex items-start justify-between">
              <div><p className="text-xs font-semibold text-muted">{stat.label}</p><p className="mt-2 text-2xl font-extrabold">{stat.value}</p></div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300"><stat.icon size={19} /></span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Card className="p-5">
          <h3 className="font-bold">{t('company.revenue')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthly} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <defs><linearGradient id="companyFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} /><stop offset="100%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-main)' }} />
              <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} fill="url(#companyFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-bold">{t('company.upcoming')}</h3>
          <div className="mt-4 space-y-3">
            {mySchedules.slice(0, 5).map((schedule) => {
              const route = routes.find((item) => item.id === schedule.routeId)
              return (
                <div key={schedule.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: 'var(--surface-muted)' }}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-xs font-bold text-brand-600 dark:bg-brand-900/40 dark:text-brand-200">{schedule.departureTime}</div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold">{route ? `${provinceName(route.fromProvinceId, language)} → ${provinceName(route.toProvinceId, language)}` : '—'}</p>
                    <p className="text-[11px] text-muted">{formatDate(schedule.date, language)} · {schedule.availableSeats} {t('common.seats')}</p>
                  </div>
                  <Badge status={schedule.status} />
                </div>
              )
            })}
            {mySchedules.length === 0 && <p className="text-sm text-muted">{t('common.noData')}</p>}
          </div>
        </Card>
      </div>
    </div>
  )
}
