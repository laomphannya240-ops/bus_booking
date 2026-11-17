import { useTranslation } from 'react-i18next'
import CrudPage from '../../components/common/CrudPage'
import Badge from '../../components/common/Badge'
import BusIllustration from '../../components/bus/BusIllustration'
import { useApp } from '../../context/AppContext'
import { useData } from '../../context/DataContext'
import { typeColor } from '../../data/buses'
import { cn } from '../../utils/format'

export default function CompanyBusesPage() {
  const { t } = useTranslation()
  const { user } = useApp()
  const { buses, schedules, companies } = useData()

  const myBuses = buses.filter((bus) => bus.companyId === user?.companyId)
  const company = companies.find((item) => item.id === user?.companyId)

  return (
    <CrudPage
      title={t('company.myBuses')}
      subtitle={t('company.fleetHint')}
      items={myBuses}
      readOnly
      searchKeys={['name', 'plate', 'type']}
      pageSize={10}
      headerActions={<Badge tone="brand" dot>{t('company.viewOnly')}</Badge>}
      columns={[
        {
          key: 'name', label: t('common.bus'),
          render: (item) => (
            <div className="flex items-center gap-3">
              <div className="h-10 w-16 shrink-0"><BusIllustration company={company} type={item.type} className="h-10" /></div>
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="text-xs text-muted">{item.plate}</p>
              </div>
            </div>
          ),
        },
        {
          key: 'type', label: t('admin.busType'),
          render: (item) => <span className={cn('chip ring-1 ring-inset', typeColor(item.type))}>{item.type}</span>,
        },
        { key: 'capacity', label: t('admin.seatCapacity') },
        {
          key: 'trips', label: t('admin.unitTrips'),
          render: (item) => schedules.filter((schedule) => schedule.busId === item.id).length,
        },
        {
          key: 'status', label: t('common.status'),
          render: (item) => <Badge status={item.status} dot>{t(`common.${item.status.toLowerCase()}`)}</Badge>,
        },
      ]}
    />
  )
}
