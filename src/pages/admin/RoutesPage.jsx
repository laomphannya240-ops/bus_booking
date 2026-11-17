import { useTranslation } from 'react-i18next'
import CrudPage from '../../components/common/CrudPage'
import Badge from '../../components/common/Badge'
import { useData } from '../../context/DataContext'
import { useApp } from '../../context/AppContext'
import { provinces, provinceName } from '../../data/provinces'
import { formatDuration } from '../../utils/date'
import { money, createId } from '../../utils/format'

const toFormValues = (route) => ({
  fromProvinceId: route.fromProvinceId,
  toProvinceId: route.toProvinceId,
  distanceKm: route.distanceKm,
  durationMinutes: route.durationMinutes,
  basePrice: route.basePrice,
  status: route.status || 'ACTIVE',
})

export default function RoutesPage() {
  const { t } = useTranslation()
  const { language } = useApp()
  const { routes, routeActions } = useData()
  const provinceOptions = provinces.map((province) => ({ value: province.id, label: province[language] || province.en }))

  return (
    <CrudPage
      title={t('admin.routes')}
      subtitle={t('admin.estimatedDuration')}
      items={routes}
      searchKeys={['fromProvinceId', 'toProvinceId']}
      columns={[
        { key: 'route', label: t('common.route'), render: (item) => <span className="font-bold">{provinceName(item.fromProvinceId, language)} → {provinceName(item.toProvinceId, language)}</span> },
        { key: 'distanceKm', label: t('admin.distance'), render: (item) => `${item.distanceKm} km` },
        { key: 'durationMinutes', label: t('admin.estimatedDuration'), render: (item) => formatDuration(item.durationMinutes, language) },
        { key: 'basePrice', label: t('search.priceRange'), render: (item) => money(item.basePrice) },
        { key: 'status', label: t('common.status'), render: (item) => <Badge status={item.status || 'ACTIVE'} dot>{t(`common.${String(item.status || 'active').toLowerCase()}`)}</Badge> },
      ]}
      fields={[
        { name: 'fromProvinceId', label: t('common.from'), type: 'select', required: true, numeric: true, options: provinceOptions },
        { name: 'toProvinceId', label: t('common.to'), type: 'select', required: true, numeric: true, options: provinceOptions },
        { name: 'distanceKm', label: t('admin.distance'), type: 'number', required: true },
        { name: 'durationMinutes', label: t('admin.estimatedDuration'), type: 'number', required: true, hint: 'minutes' },
        { name: 'basePrice', label: t('admin.ticketPrice'), type: 'number', required: true },
        { name: 'status', label: t('common.status'), type: 'select', numeric: false, options: [{ value: 'ACTIVE', label: t('common.active') }, { value: 'INACTIVE', label: t('common.inactive') }] },
      ]}
      toFormValues={toFormValues}
      initialValues={{ status: 'ACTIVE' }}
      addLabel={t('admin.createRoute')}
      onAdd={(values) => routeActions.add({
        id: createId('rt'),
        fromProvinceId: Number(values.fromProvinceId),
        toProvinceId: Number(values.toProvinceId),
        distanceKm: Number(values.distanceKm),
        durationMinutes: Number(values.durationMinutes),
        basePrice: Number(values.basePrice),
        status: values.status || 'ACTIVE',
        popular: false,
      })}
      onUpdate={(id, values) => routeActions.update(id, {
        fromProvinceId: Number(values.fromProvinceId),
        toProvinceId: Number(values.toProvinceId),
        distanceKm: Number(values.distanceKm),
        durationMinutes: Number(values.durationMinutes),
        basePrice: Number(values.basePrice),
        status: values.status || 'ACTIVE',
      })}
      onRemove={routeActions.remove}
    />
  )
}
