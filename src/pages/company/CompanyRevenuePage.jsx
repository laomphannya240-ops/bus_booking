import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { CalendarClock, CheckCircle2, Clock3, CreditCard, Ticket } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useData } from '../../context/DataContext'
import { monthlyRevenue } from '../../data/dashboard'
import { provinceName } from '../../data/provinces'
import { formatDate } from '../../utils/date'
import { money } from '../../utils/format'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'

const sumAmount = (items) => items.reduce((total, item) => total + Number(item.amount || 0), 0)

export default function CompanyRevenuePage() {
  const { t, i18n } = useTranslation()
  const { user } = useApp()
  const { bookings, routes, schedules } = useData()
  const language = i18n.language?.startsWith('km') ? 'km' : 'en'

  const mySchedules = useMemo(
    () => schedules.filter((item) => item.companyId === user?.companyId),
    [schedules, user?.companyId],
  )

  const myBookings = useMemo(() => {
    const ids = new Set(mySchedules.map((item) => item.id))
    return bookings.filter((item) => ids.has(item.scheduleId))
  }, [bookings, mySchedules])

  const totalRevenue = sumAmount(myBookings.filter((item) => item.status !== 'CANCELLED'))
  const verifiedRevenue = sumAmount(myBookings.filter((item) => item.paymentStatus === 'VERIFIED'))
  const pendingRevenue = sumAmount(myBookings.filter((item) => ['PENDING', 'PROOF_UPLOADED'].includes(item.paymentStatus)))
  const activeTrips = mySchedules.filter((item) => item.status === 'ACTIVE').length

  const capacity = mySchedules.reduce((total, item) => total + Number(item.capacity || 0), 0)
  const bookedSeats = mySchedules.reduce((total, item) => total + Number(item.bookedSeats?.length || 0), 0)
  const occupancy = capacity ? Math.round((bookedSeats / capacity) * 100) : 0

  const platformShare = bookings.length ? myBookings.length / bookings.length : 0
  const chartData = monthlyRevenue.map((item) => ({
    ...item,
    label: language === 'km' ? item.km : item.month,
    revenue: Math.round(item.revenue * platformShare),
  }))

  const routeBreakdown = useMemo(() => {
    const groups = new Map()
    myBookings.forEach((booking) => {
      if (booking.status === 'CANCELLED') return
      const schedule = schedules.find((item) => item.id === booking.scheduleId)
      const route = routes.find((item) => item.id === schedule?.routeId)
      if (!route) return
      const key = route.id
      const current = groups.get(key) || { route, revenue: 0, count: 0 }
      current.revenue += Number(booking.amount || 0)
      current.count += 1
      groups.set(key, current)
    })
    return [...groups.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5)
  }, [myBookings, routes, schedules])

  const recentTransactions = useMemo(
    () => [...myBookings].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))).slice(0, 5),
    [myBookings],
  )

  const stats = [
    { label: t('admin.totalRevenue'), value: money(totalRevenue), icon: CreditCard, tone: 'text-brand-600' },
    { label: t('company.verifiedRevenue'), value: money(verifiedRevenue), icon: CheckCircle2, tone: 'text-emerald-600' },
    { label: t('company.pendingRevenue'), value: money(pendingRevenue), icon: Clock3, tone: 'text-amber-600' },
    { label: t('company.activeTrips'), value: activeTrips, icon: CalendarClock, tone: 'text-violet-600' },
  ]

  const routeName = (route) =>
    `${provinceName(route.fromProvinceId, language)} → ${provinceName(route.toProvinceId, language)}`

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">{t('company.revenue')}</h2>
          <p className="mt-1 text-sm text-muted">{t('company.myRevenue')}</p>
        </div>
        <Badge tone="brand" dot>{t('company.viewOnly')}</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-muted">{stat.label}</p>
                <p className="mt-2 text-2xl font-extrabold">{stat.value}</p>
              </div>
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-muted)] ${stat.tone}`}>
                <stat.icon size={19} />
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Card className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-bold">{t('admin.monthlyRevenue')}</h3>
              <p className="mt-1 text-xs text-muted">{t('company.revenueEstimate')}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted">{t('admin.occupancy')}</p>
              <p className="text-lg font-extrabold">{occupancy}%</p>
            </div>
          </div>
          <div className="mt-5">
            <ResponsiveContainer width="100%" height={270}>
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="companyRevenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value) => [money(value), t('admin.totalRevenue')]}
                  contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-main)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} fill="url(#companyRevenueFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-bold">{t('company.topRoutes')}</h3>
          <div className="mt-4 space-y-4">
            {routeBreakdown.map(({ route, revenue, count }) => (
              <div key={route.id}>
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="truncate font-semibold">{routeName(route)}</span>
                  <span className="shrink-0 font-bold">{money(revenue)}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                  <div
                    className="h-full rounded-full bg-brand-600"
                    style={{ width: `${totalRevenue ? Math.min(100, (revenue / totalRevenue) * 100) : 0}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-muted">{count} {t('admin.bookings').toLowerCase()}</p>
              </div>
            ))}
            {routeBreakdown.length === 0 && <p className="text-sm text-muted">{t('company.noRevenue')}</p>}
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b p-5" style={{ borderColor: 'var(--border-color)' }}>
          <h3 className="font-bold">{t('company.recentTransactions')}</h3>
        </div>
        {recentTransactions.length === 0 ? (
          <p className="p-5 text-sm text-muted">{t('company.noRevenue')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>{t('common.reference')}</th>
                  <th>{t('common.passenger')}</th>
                  <th>{t('common.date')}</th>
                  <th>{t('common.amount')}</th>
                  <th>{t('common.status')}</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((booking) => (
                  <tr key={booking.id}>
                    <td className="font-bold">{booking.reference || booking.id}</td>
                    <td>{booking.customerName}</td>
                    <td>{formatDate(booking.createdAt, language)}</td>
                    <td className="font-bold">{money(booking.amount)}</td>
                    <td><Badge status={booking.paymentStatus}>{t(`common.${String(booking.paymentStatus).toLowerCase()}`)}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <p className="flex items-center gap-2 text-xs text-muted">
        <Ticket size={14} /> {t('company.revenueNote')}
      </p>
    </div>
  )
}
