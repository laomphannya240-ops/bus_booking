import { useTranslation } from 'react-i18next'
import { BarChart3, BusFront, CalendarClock, LayoutDashboard, Ticket } from 'lucide-react'
import DashboardShell from '../components/layout/DashboardShell'

export default function CompanyLayout() {
  const { t } = useTranslation()

  const groups = [
    {
      label: t('admin.overview'),
      items: [{ to: '/company', label: t('company.overview'), icon: LayoutDashboard, end: true }],
    },
    {
      label: t('admin.management'),
      items: [
        { to: '/company/buses', label: t('company.myBuses'), icon: BusFront },
        { to: '/company/schedules', label: t('company.mySchedules'), icon: CalendarClock },
        { to: '/company/bookings', label: t('company.companyBookings'), icon: Ticket },
      ],
    },
    {
      label: t('admin.system'),
      items: [{ to: '/company/revenue', label: t('company.revenue'), icon: BarChart3 }],
    },
  ]

  return <DashboardShell groups={groups} title={t('company.panel')} subtitle={t('company.panelSubtitle')} />
}
