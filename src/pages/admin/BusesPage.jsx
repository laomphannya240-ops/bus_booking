import { useTranslation } from 'react-i18next'
import CrudPage from '../../components/common/CrudPage'
import Badge from '../../components/common/Badge'
import BusIllustration from '../../components/bus/BusIllustration'
import { useData } from '../../context/DataContext'
import { useApp } from '../../context/AppContext'
import { BUS_STATUSES, BUS_TYPES } from '../../constants'
import { createId } from '../../utils/format'

const toFormValues = (bus) => ({ ...bus })

export default function BusesPage() {
  const { t } = useTranslation()
  const { language } = useApp()
  const { buses, busActions, companies } = useData()

  return (
    <CrudPage
      title={t('admin.buses')}
      subtitle={t('admin.fleetHint')}
      items={buses}
      searchKeys={['name', 'plate', 'type']}
      columns={[
        {
          key: 'name', label: t('common.bus'),
          render: (item) => (
            <div className="flex items-center gap-3">
              <div className="h-10 w-16 shrink-0"><BusIllustration company={companies.find((c) => c.id === item.companyId)} type={item.type} className="h-10" /></div>
              <div><p className="font-bold">{item.name}</p><p className="text-xs text-muted">{item.plate}</p></div>
            </div>
          ),
        },
        { key: 'companyId', label: t('common.company'), render: (item) => companies.find((c) => c.id === item.companyId)?.name?.[language] || '—' },
        { key: 'type', label: t('admin.busType'), render: (item) => <Badge tone={item.type === 'VIP' ? 'brand' : item.type === 'Sleeper' ? 'violet' : 'neutral'}>{item.type}</Badge> },
        { key: 'capacity', label: t('admin.seatCapacity') },
        { key: 'status', label: t('common.status'), render: (item) => <Badge status={item.status} dot>{t(`common.${item.status.toLowerCase()}`)}</Badge> },
      ]}
      fields={[
        { name: 'name', label: t('common.name'), required: true },
        {
          name: 'companyId', label: t('common.company'), type: 'select', required: true,
          options: companies.map((company) => ({ value: company.id, label: company.name[language] || company.name.en })),
        },
        { name: 'type', label: t('admin.busType'), type: 'select', options: BUS_TYPES.map((type) => ({ value: type.value, label: type[language] || type.en })) },
        { name: 'capacity', label: t('admin.seatCapacity'), type: 'number', min: 20, required: true },
        { name: 'plate', label: 'Plate number' },
        { name: 'status', label: t('admin.busStatus'), type: 'select', options: BUS_STATUSES.map((status) => ({ value: status, label: t(`common.${status.toLowerCase()}`) })) },
      ]}
      toFormValues={toFormValues}
      initialValues={{ capacity: 48, type: 'VIP', status: 'ACTIVE' }}
      addLabel={t('admin.addBusTitle')}
      onAdd={(values) => busActions.add({ ...values, capacity: Number(values.capacity), amenities: ['wifi', 'ac', 'water'], createdAt: new Date().toISOString().slice(0, 10), status: values.status || 'ACTIVE', id: createId('bus') })}
      onUpdate={(id, values) => busActions.update(id, { ...values, capacity: Number(values.capacity) })}
      onRemove={busActions.remove}
    />
  )
}
