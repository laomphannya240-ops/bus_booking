import { useTranslation } from 'react-i18next'
import {
  BarChart3, BusFront, Building2, CalendarClock, CreditCard, LayoutDashboard,
  MapPin, Route, Settings, Ticket, Users,
} from 'lucide-react'
import DashboardShell from '../components/layout/DashboardShell'

export default function AdminLayout() {
  const { t } = useTranslation()

  const groups = [
    {
      label: t('admin.overview'),
      items: [{ to: '/admin', label: t('admin.dashboard'), icon: LayoutDashboard, end: true }],
    },
    {
      label: t('admin.management'),
      items: [
        { to: '/admin/companies', label: t('admin.companies'), icon: Building2 },
        { to: '/admin/buses', label: t('admin.buses'), icon: BusFront },
        { to: '/admin/stations', label: t('admin.stations'), icon: MapPin },
        { to: '/admin/routes', label: t('admin.routes'), icon: Route },
        { to: '/admin/schedules', label: t('admin.schedules'), icon: CalendarClock },
        { to: '/admin/bookings', label: t('admin.bookings'), icon: Ticket },
        { to: '/admin/payments', label: t('admin.payments'), icon: CreditCard },
        { to: '/admin/customers', label: t('admin.customers'), icon: Users },
      ],
    },
    {
      label: t('admin.system'),
      items: [
        { to: '/admin/reports', label: t('admin.reports'), icon: BarChart3 },
        { to: '/admin/settings', label: t('admin.settings'), icon: Settings },
      ],
    },
  ]

  return <DashboardShell groups={groups} title={t('admin.panel')} subtitle={t('admin.panelSubtitle')} />
}
