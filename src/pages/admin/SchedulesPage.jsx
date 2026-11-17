import { useTranslation } from 'react-i18next'
import CrudPage from '../../components/common/CrudPage'
import Badge from '../../components/common/Badge'
import { useData } from '../../context/DataContext'
import { useApp } from '../../context/AppContext'
import { provinceName } from '../../data/provinces'
import { formatDate } from '../../utils/date'
import { money, createId } from '../../utils/format'

const toFormValues = (schedule) => ({
  busId: schedule.busId,
  routeId: schedule.routeId,
  date: schedule.date,
  departureTime: schedule.departureTime,
  arrivalTime: schedule.arrivalTime,
  price: schedule.price,
  availableSeats: schedule.availableSeats,
  status: schedule.status,
})

export default function SchedulesPage() {
  const { t } = useTranslation()
  const { language } = useApp()
  const { schedules, scheduleActions, buses, routes } = useData()

  return (
    <CrudPage
      title={t('admin.schedules')}
      subtitle={t('admin.createScheduleTitle')}
      items={schedules}
      searchKeys={['busId', 'routeId', 'date']}
      pageSize={10}
      columns={[
        { key: 'busId', label: t('common.bus'), render: (item) => buses.find((bus) => bus.id === item.busId)?.name || item.busId },
        {
          key: 'routeId', label: t('common.route'),
          render: (item) => {
            const route = routes.find((r) => r.id === item.routeId)
            return route ? `${provinceName(route.fromProvinceId, language)} → ${provinceName(route.toProvinceId, language)}` : item.routeId
          },
        },
        { key: 'date', label: t('common.date'), render: (item) => formatDate(item.date, language) },
        { key: 'time', label: t('common.time'), render: (item) => `${item.departureTime} – ${item.arrivalTime}` },
        { key: 'price', label: t('common.price'), render: (item) => money(item.price) },
        { key: 'availableSeats', label: t('admin.availableSeats') },
        { key: 'status', label: t('common.status'), render: (item) => <Badge status={item.status} dot>{t(`common.${item.status.toLowerCase()}`)}</Badge> },
      ]}
      fields={[
        { name: 'busId', label: t('admin.selectBus'), type: 'select', required: true, options: buses.map((bus) => ({ value: bus.id, label: bus.name })) },
        {
          name: 'routeId', label: t('admin.selectRoute'), type: 'select', required: true,
          options: routes.map((route) => ({ value: route.id, label: `${provinceName(route.fromProvinceId, language)} → ${provinceName(route.toProvinceId, language)}` })),
        },
        { name: 'date', label: t('admin.departureDate'), type: 'date', required: true },
        { name: 'departureTime', label: t('admin.departureTime'), type: 'time', required: true },
        { name: 'arrivalTime', label: t('admin.arrivalTime'), type: 'time', required: true },
        { name: 'price', label: t('admin.ticketPrice'), type: 'number', required: true },
        { name: 'availableSeats', label: t('admin.availableSeats'), type: 'number', required: true },
        { name: 'status', label: t('admin.scheduleStatus'), type: 'select', options: [{ value: 'ACTIVE', label: t('common.active') }, { value: 'INACTIVE', label: t('common.inactive') }, { value: 'FULL', label: 'Full' }] },
      ]}
      toFormValues={toFormValues}
      initialValues={{ status: 'ACTIVE' }}
      addLabel={t('admin.createScheduleTitle')}
      onAdd={(values) => {
        const bus = buses.find((item) => item.id === values.busId)
        return scheduleActions.add({
          id: createId('sch'),
          ...values,
          price: Number(values.price),
          availableSeats: Number(values.availableSeats),
          capacity: bus?.capacity || Number(values.availableSeats),
          companyId: bus?.companyId,
          bookedSeats: [],
          status: values.status || 'ACTIVE',
        })
      }}
      onUpdate={(id, values) => scheduleActions.update(id, { ...values, price: Number(values.price), availableSeats: Number(values.availableSeats) })}
      onRemove={scheduleActions.remove}
    />
  )
}
