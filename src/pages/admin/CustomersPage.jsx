import { useTranslation } from 'react-i18next'
import { UserCheck, UserX } from 'lucide-react'
import CrudPage from '../../components/common/CrudPage'
import Badge from '../../components/common/Badge'
import Avatar from '../../components/common/Avatar'
import { useApp } from '../../context/AppContext'
import { useData } from '../../context/DataContext'
import { formatDate } from '../../utils/date'

export default function CustomersPage() {
  const { t } = useTranslation()
  const { language } = useApp()
  const { customers, toggleCustomerStatus } = useData()

  return (
    <CrudPage
      title={t('admin.customers')}
      subtitle={t('admin.panelSubtitle')}
      items={customers}
      readOnly
      searchKeys={['email', 'phone']}
      pageSize={10}
      columns={[
        {
          key: 'name', label: t('common.name'),
          render: (item) => (
            <div className="flex items-center gap-3">
              <Avatar name={item.name?.en || item.name} color={item.color} size="sm" />
              <div><p className="font-bold">{item.name?.en || item.name}</p><p className="text-xs text-muted">{item.email}</p></div>
            </div>
          ),
        },
        { key: 'phone', label: t('common.phone') },
        { key: 'joinedAt', label: t('account.memberSince'), render: (item) => formatDate(item.joinedAt, language) },
        { key: 'status', label: t('common.status'), render: (item) => <Badge status={item.status} dot>{t(`common.${item.status.toLowerCase()}`)}</Badge> },
      ]}
      extraRowActions={(item) => (
        <button
          type="button"
          onClick={() => toggleCustomerStatus(item.id)}
          className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold ${item.status === 'ACTIVE' ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10' : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'}`}
        >
          {item.status === 'ACTIVE' ? <UserX size={15} /> : <UserCheck size={15} />}
          {item.status === 'ACTIVE' ? t('admin.deactivate') : t('admin.activate')}
        </button>
      )}
    />
  )
}
