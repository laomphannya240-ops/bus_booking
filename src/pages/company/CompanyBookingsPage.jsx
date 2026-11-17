import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Eye } from 'lucide-react'
import CrudPage from '../../components/common/CrudPage'
import Badge from '../../components/common/Badge'
import { useApp } from '../../context/AppContext'
import { useData } from '../../context/DataContext'
import { provinceName } from '../../data/provinces'
import { formatDate } from '../../utils/date'
import { money } from '../../utils/format'

export default function CompanyBookingsPage() {
  const { t } = useTranslation()
  const { language, user } = useApp()
  const { bookings, routes, schedules } = useData()
  const navigate = useNavigate()

  const myScheduleIds = new Set(schedules.filter((item) => item.companyId === user?.companyId).map((item) => item.id))
  const myBookings = bookings.filter((booking) => myScheduleIds.has(booking.scheduleId))

  const routeLabel = (scheduleId) => {
    const schedule = schedules.find((item) => item.id === scheduleId)
    const route = routes.find((item) => item.id === schedule?.routeId)
    if (!route) return '—'
    return `${provinceName(route.fromProvinceId, language)} → ${provinceName(route.toProvinceId, language)}`
  }

  return (
    <CrudPage
      title={t('company.companyBookings')}
      subtitle={t('company.bookingHint')}
      items={myBookings}
      readOnly
      searchKeys={['id', 'reference', 'customerName', 'email', 'phone']}
      pageSize={10}
      headerActions={<Badge tone="brand" dot>{t('company.viewOnly')}</Badge>}
      columns={[
        { key: 'reference', label: t('common.reference'), render: (item) => <span className="font-bold">{item.reference || item.id}</span> },
        {
          key: 'customerName', label: t('common.passenger'),
          render: (item) => <div><p className="font-semibold">{item.customerName}</p><p className="text-xs text-muted">{item.email}</p></div>,
        },
        { key: 'route', label: t('common.route'), render: (item) => routeLabel(item.scheduleId) },
        { key: 'date', label: t('common.date'), render: (item) => formatDate(item.createdAt, language) },
        { key: 'amount', label: t('common.amount'), render: (item) => money(item.amount) },
        {
          key: 'status', label: t('common.status'),
          render: (item) => <Badge status={item.status} dot>{t(`common.${item.status.toLowerCase()}`)}</Badge>,
        },
        {
          key: 'paymentStatus', label: t('payment.paymentStatus'),
          render: (item) => <Badge status={item.paymentStatus}>{t(`common.${String(item.paymentStatus).toLowerCase()}`)}</Badge>,
        },
      ]}
      extraRowActions={(item) => (
        <button
          type="button"
          className="btn-ghost !p-2"
          title={t('common.view')}
          aria-label={t('common.view')}
          onClick={() => navigate(`/my-bookings/${item.id}`)}
        >
          <Eye size={15} />
        </button>
      )}
    />
  )
}
