import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, Eye, XCircle } from 'lucide-react'
import CrudPage from '../../components/common/CrudPage'
import Badge from '../../components/common/Badge'
import { useApp } from '../../context/AppContext'
import { useData } from '../../context/DataContext'
import { getRoute } from '../../data/routes'
import { provinceName } from '../../data/provinces'
import { formatDate } from '../../utils/date'
import { money } from '../../utils/format'

export default function AdminBookingsPage() {
  const { t } = useTranslation()
  const { language } = useApp()
  const { confirm, toast } = useApp()
  const { bookings, schedules, confirmBooking, cancelBooking } = useData()
  const navigate = useNavigate()

  const requestCancel = async (booking) => {
    const accepted = await confirm({
      title: t('account.cancelTitle'),
      message: t('account.cancelText'),
      confirmLabel: t('account.cancelConfirm'),
    })
    if (accepted) {
      await cancelBooking(booking.id)
      toast.success(t('common.cancelled'))
    }
  }

  return (
    <CrudPage
      title={t('admin.bookings')}
      subtitle={t('admin.panelSubtitle')}
      items={bookings}
      readOnly
      searchKeys={['id', 'reference', 'customerName', 'email', 'phone']}
      pageSize={10}
      columns={[
        { key: 'id', label: 'ID', render: (item) => <span className="font-bold">{item.id}</span> },
        { key: 'customerName', label: t('common.passenger'), render: (item) => <div><p className="font-semibold">{item.customerName}</p><p className="text-xs text-muted">{item.email}</p></div> },
        {
          key: 'route', label: t('common.route'),
          render: (item) => {
            const schedule = schedules.find((row) => row.id === item.scheduleId)
            const route = getRoute(schedule?.routeId)
            return route ? `${provinceName(route.fromProvinceId, language)} → ${provinceName(route.toProvinceId, language)}` : '—'
          },
        },
        { key: 'date', label: t('common.date'), render: (item) => formatDate(item.date, language) },
        { key: 'amount', label: t('common.amount'), render: (item) => money(item.amount) },
        { key: 'status', label: t('common.status'), render: (item) => <Badge status={item.status} dot>{t(`common.${item.status.toLowerCase()}`)}</Badge> },
      ]}
      extraRowActions={(item) => (
        <>
          <button type="button" className="btn-ghost !p-2" title={t('common.view')} onClick={() => navigate(`/my-bookings/${item.id}`)}><Eye size={15} /></button>
          {!['CANCELLED', 'COMPLETED', 'CONFIRMED'].includes(item.status) && (
            <button type="button" className="btn-ghost !p-2 text-emerald-600" title={t('admin.confirmBooking')} onClick={() => confirmBooking(item.id)}><CheckCircle2 size={15} /></button>
          )}
          {!['CANCELLED', 'COMPLETED'].includes(item.status) && (
            <button type="button" className="btn-ghost !p-2 text-red-500" title={t('account.cancelBooking')} onClick={() => requestCancel(item)}><XCircle size={15} /></button>
          )}
        </>
      )}
    />
  )
}
