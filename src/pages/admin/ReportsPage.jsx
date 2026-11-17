import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BarChart3, Download, Route, Trophy } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { reportService } from '../../services/reportService'
import { companyName } from '../../data/companies'
import { provinceName } from '../../data/provinces'
import { money, exportCsv } from '../../utils/format'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'

export default function ReportsPage() {
  const { t } = useTranslation()
  const { language } = useApp()
  const [period, setPeriod] = useState('monthly')

  const monthly = reportService.getMonthlyRevenue().map((item) => ({ ...item, label: language === 'km' ? item.km : item.month }))
  const daily = reportService.getDailyRevenue().map((item) => ({ ...item, label: language === 'km' ? item.km : item.day }))
  const routes = reportService.getPopularRoutes()
  const companies = reportService.getTopCompanies()
  const chartData = period === 'monthly' ? monthly : daily
  const maxRoute = Math.max(...routes.map((item) => item.bookings))

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">{t('admin.reports')}</h2>
          <p className="mt-1 text-sm text-muted">{t('admin.panelSubtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" icon={Download} onClick={() => exportCsv('cambodia-bus-revenue.csv', monthly.map((item) => ({ period: item.month, revenue: item.revenue, bookings: item.bookings })))}>
            {t('admin.exportReports')}
          </Button>
        </div>
      </div>

      <Card className="p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2"><BarChart3 size={18} className="text-brand-600" /><h3 className="font-bold">{period === 'monthly' ? t('admin.monthlyRevenue') : t('admin.dailyRevenue')}</h3></div>
          <div className="flex rounded-xl p-1" style={{ background: 'var(--surface-muted)' }}>
            {['monthly', 'daily'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPeriod(item)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold ${period === item ? 'bg-[var(--surface)] text-brand-600 shadow-sm' : 'text-muted'}`}
              >
                {t(item === 'monthly' ? 'admin.monthlyRevenue' : 'admin.dailyRevenue')}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="var(--border-color)" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-main)' }} />
            <Bar dataKey="revenue" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-bold"><Route size={17} className="text-brand-600" /> {t('admin.popularRoutes')}</h3>
            <Button variant="ghost" size="sm" icon={Download} onClick={() => exportCsv('cambodia-bus-popular-routes.csv', routes.map((item) => ({ from: provinceName(item.from, 'en'), to: provinceName(item.to, 'en'), bookings: item.bookings, revenue: item.revenue })))} />
          </div>
          <div className="space-y-4">
            {routes.map((item) => (
              <div key={item.id}>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">{provinceName(item.from, language)} → {provinceName(item.to, language)}</span>
                  <span className="text-muted">{item.bookings} {t('admin.unitTrips')}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full" style={{ background: 'var(--surface-muted)' }}>
                  <div className="h-full rounded-full bg-brand-600" style={{ width: `${(item.bookings / maxRoute) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-bold"><Trophy size={17} className="text-amber-500" /> {t('admin.topCompanies')}</h3>
            <Button variant="ghost" size="sm" icon={Download} onClick={() => exportCsv('cambodia-bus-companies.csv', companies.map((item) => ({ company: companyName(item.companyId, 'en'), bookings: item.bookings, revenue: item.revenue })))} />
          </div>
          <div className="space-y-3">
            {companies.map((item, index) => (
              <div key={item.companyId} className="flex items-center gap-3 rounded-xl p-3" style={{ background: 'var(--surface-muted)' }}>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-xs font-extrabold text-white">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{companyName(item.companyId, language)}</p>
                  <p className="text-xs text-muted">{item.bookings} {t('admin.unitTrips')}</p>
                </div>
                <span className="text-sm font-bold text-brand-600 dark:text-brand-300">{money(item.revenue)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
