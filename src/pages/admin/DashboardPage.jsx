import { useTranslation } from 'react-i18next'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import {
  ArrowUpRight, BarChart3, BusFront, CalendarClock, CreditCard, Plus, Ticket, Users,
} from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useApp } from '../../context/AppContext'
import { reportService } from '../../services/reportService'
import { getRoute } from '../../data/routes'
import { provinceName } from '../../data/provinces'
import { formatDate } from '../../utils/date'
import { money } from '../../utils/format'
import { BOOKING_STATUS } from '../../constants'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Avatar from '../../components/common/Avatar'

const statusColors = {
  CONFIRMED: '#2563eb', PAID: '#059669', PENDING: '#d97706', COMPLETED: '#7c3aed', CANCELLED: '#94a3b8',
}

export default function DashboardPage() {
  const { t } = useTranslation()
  const { language } = useApp()
  const { bookings, customers, buses, schedules } = useData()
  const revenue = reportService.getMonthlyRevenue()
  const daily = reportService.getDailyRevenue()
  const statsData = reportService.getBookingStats()

  const totalRevenue = bookings.reduce((sum, booking) => sum + Number(booking.amount || 0), 0)
  const cards = [
    { label: t('admin.totalBookings'), value: bookings.length, icon: Ticket, tone: 'brand', note: `+12% ${t('admin.thisMonth')}` },
    { label: t('admin.totalRevenue'), value: money(totalRevenue), icon: CreditCard, tone: 'success', note: `+8% ${t('admin.thisMonth')}` },
    { label: t('admin.totalCustomers'), value: customers.length, icon: Users, tone: 'violet', note: `+5% ${t('admin.thisMonth')}` },
    { label: t('admin.totalBuses'), value: buses.length, icon: BusFront, tone: 'warning', note: `${schedules.filter((item) => item.status === 'ACTIVE').length} ${t('admin.activeSchedules')}` },
  ]

  const chartData = revenue.map((item) => ({ ...item, label: language === 'km' ? item.km : item.month }))
  const dailyData = daily.map((item) => ({ ...item, label: language === 'km' ? item.km : item.day }))
  const pieData = statsData.map((item) => ({
    ...item,
    name: t(`common.${item.key.toLowerCase()}`),
    fill: statusColors[item.key],
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">{t('admin.dashboard')}</h2>
          <p className="mt-1 text-sm text-muted">{t('admin.panelSubtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" to="/admin/schedules" icon={CalendarClock}>{t('admin.createSchedule')}</Button>
          <Button size="sm" to="/admin/buses" icon={Plus}>{t('admin.addBus')}</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-muted">{card.label}</p>
                <p className="mt-2 text-2xl font-extrabold tracking-tight">{card.value}</p>
              </div>
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                card.tone === 'brand' ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300'
                  : card.tone === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300'
                    : card.tone === 'violet' ? 'bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300'
                      : 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300'
              }`}><card.icon size={19} /></span>
            </div>
            <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400"><ArrowUpRight size={13} /> {card.note}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold">{t('admin.revenueChart')}</h3>
              <p className="mt-0.5 text-xs text-muted">{t('admin.monthlyRevenue')} (USD)</p>
            </div>
            <Badge tone="brand">2026</Badge>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-main)' }} />
              <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} fill="url(#revenueFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-bold">{t('admin.bookingStats')}</h3>
          <p className="mt-0.5 text-xs text-muted">{t('admin.overview')}</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={78} paddingAngle={3}>
                {pieData.map((entry) => <Cell key={entry.key} fill={entry.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-main)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2">
            {pieData.map((item) => (
              <div key={item.key} className="flex items-center gap-2 text-xs">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.fill }} />
                <span className="text-muted">{item.name}</span>
                <strong className="ml-auto">{item.value}</strong>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: 'var(--border-color)' }}>
            <div>
              <h3 className="font-bold">{t('admin.recentBookings')}</h3>
              <p className="mt-0.5 text-xs text-muted">{t('admin.overview')}</p>
            </div>
            <Button variant="ghost" size="sm" to="/admin/bookings">{t('common.view')} <ArrowUpRight size={14} /></Button>
          </div>
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead><tr><th>ID</th><th>{t('common.route')}</th><th>{t('common.date')}</th><th>{t('common.amount')}</th><th>{t('common.status')}</th></tr></thead>
              <tbody>
                {bookings.slice(0, 6).map((booking) => {
                  const schedule = schedules.find((item) => item.id === booking.scheduleId)
                  const route = getRoute(schedule?.routeId)
                  return (
                    <tr key={booking.id}>
                      <td className="font-semibold">{booking.id}</td>
                      <td>{route ? `${provinceName(route.fromProvinceId, language)} → ${provinceName(route.toProvinceId, language)}` : '—'}</td>
                      <td>{formatDate(booking.date, language)}</td>
                      <td className="font-bold">{money(booking.amount)}</td>
                      <td><Badge status={booking.status} dot>{t(`common.${booking.status.toLowerCase()}`)}</Badge></td>
                    </tr>
                  )
                })}
                {bookings.length === 0 && <tr><td colSpan={5} className="text-center text-muted">{t('admin.noBookingsYet')}</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2"><BarChart3 size={17} className="text-brand-600" /><h3 className="font-bold">{t('admin.dailyRevenue')}</h3></div>
            <ResponsiveContainer width="100%" height={170}>
              <BarChart data={dailyData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-main)' }} />
                <Bar dataKey="revenue" fill="#60a5fa" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5">
            <h3 className="font-bold">{t('admin.quickActions')}</h3>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="soft" size="sm" to="/admin/companies">{t('admin.addCompany')}</Button>
              <Button variant="soft" size="sm" to="/admin/routes">{t('admin.createRoute')}</Button>
              <Button variant="soft" size="sm" to="/admin/payments">{t('admin.payments')}</Button>
              <Button variant="soft" size="sm" to="/admin/reports">{t('admin.viewReports')}</Button>
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-5">
        <h3 className="font-bold">{t('admin.totalBookings')}</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          {bookings.slice(0, 4).map((booking) => (
            <div key={booking.id} className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: 'var(--surface-muted)' }}>
              <Avatar name={booking.customerName} color="#2563eb" size="sm" />
              <div><p className="text-xs font-bold">{booking.customerName}</p><p className="text-[10px] text-muted">{booking.id}</p></div>
              <Badge status={booking.status === BOOKING_STATUS.CANCELLED ? BOOKING_STATUS.CANCELLED : BOOKING_STATUS.CONFIRMED}>{t(`common.${booking.status.toLowerCase()}`)}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
