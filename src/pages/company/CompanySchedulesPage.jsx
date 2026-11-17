import { useTranslation } from 'react-i18next'
import CrudPage from '../../components/common/CrudPage'
import Badge from '../../components/common/Badge'
import { useApp } from '../../context/AppContext'
import { useData } from '../../context/DataContext'
import { provinceName } from '../../data/provinces'
import { formatDate } from '../../utils/date'
import { money } from '../../utils/format'

export default function CompanySchedulesPage() {
  const { t } = useTranslation()
  const { language, user } = useApp()
  const { buses, routes, schedules } = useData()

  const mySchedules = schedules.filter((schedule) => schedule.companyId === user?.companyId)

  const routeLabel = (routeId) => {
    const route = routes.find((item) => item.id === routeId)
    if (!route) return '—'
    return `${provinceName(route.fromProvinceId, language)} → ${provinceName(route.toProvinceId, language)}`
  }

  return (
    <CrudPage
      title={t('company.mySchedules')}
      subtitle={t('company.scheduleHint')}
      items={mySchedules}
      readOnly
      searchKeys={['id', 'busId', 'routeId', 'date']}
      pageSize={10}
      headerActions={<Badge tone="brand" dot>{t('company.viewOnly')}</Badge>}
      columns={[
        {
          key: 'routeId', label: t('common.route'),
          render: (item) => <span className="font-semibold">{routeLabel(item.routeId)}</span>,
        },
        {
          key: 'busId', label: t('common.bus'),
          render: (item) => buses.find((bus) => bus.id === item.busId)?.name || item.busId,
        },
        { key: 'date', label: t('common.date'), render: (item) => formatDate(item.date, language) },
        { key: 'time', label: t('common.time'), render: (item) => `${item.departureTime} – ${item.arrivalTime}` },
        { key: 'price', label: t('common.price'), render: (item) => money(item.price) },
        {
          key: 'seats', label: t('admin.availableSeats'),
          render: (item) => `${item.availableSeats} / ${item.capacity}`,
        },
        {
          key: 'status', label: t('common.status'),
          render: (item) => <Badge status={item.status} dot>{t(`common.${item.status.toLowerCase()}`)}</Badge>,
        },
      ]}
    />
  )
}
