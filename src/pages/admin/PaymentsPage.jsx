import { useTranslation } from 'react-i18next'
import { BadgeCheck, CreditCard, Eye } from 'lucide-react'
import CrudPage from '../../components/common/CrudPage'
import Badge from '../../components/common/Badge'
import { useApp } from '../../context/AppContext'
import { useData } from '../../context/DataContext'
import { formatDate } from '../../utils/date'
import { money } from '../../utils/format'

export default function PaymentsPage() {
  const { t } = useTranslation()
  const { language } = useApp()
  const { payments, verifyPayment } = useData()
  const { toast } = useApp()

  return (
    <CrudPage
      title={t('admin.payments')}
      subtitle={t('payment.paymentNote')}
      items={payments}
      readOnly
      searchKeys={['reference', 'bookingReference', 'status']}
      pageSize={10}
      columns={[
        { key: 'reference', label: t('common.reference'), render: (item) => <span className="flex items-center gap-2 font-bold"><CreditCard size={14} className="text-brand-500" />{item.reference}</span> },
        { key: 'bookingReference', label: t('payment.bookingReference') },
        { key: 'amount', label: t('common.amount'), render: (item) => money(item.amount) },
        { key: 'method', label: t('payment.methodTitle') },
        { key: 'createdAt', label: t('common.created'), render: (item) => formatDate(item.createdAt, language) },
        { key: 'status', label: t('common.status'), render: (item) => <Badge status={item.status} dot>{t(item.status === 'PROOF_UPLOADED' ? 'payment.statusProof' : `common.${item.status.toLowerCase()}`)}</Badge> },
      ]}
      extraRowActions={(item) => (
        <>
          <button type="button" className="btn-ghost !p-2" title={t('common.view')} onClick={() => toast.info(`${item.reference} · ${money(item.amount)}`)}><Eye size={15} /></button>
          {item.status !== 'VERIFIED' && (
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
              onClick={() => verifyPayment(item.id)}
            >
              <BadgeCheck size={15} /> {t('admin.verifyPayment')}
            </button>
          )}
        </>
      )}
    />
  )
}
