import { useTranslation } from 'react-i18next'
import { Star } from 'lucide-react'
import CrudPage from '../../components/common/CrudPage'
import CompanyLogo from '../../components/bus/CompanyLogo'
import { useData } from '../../context/DataContext'
import { useApp } from '../../context/AppContext'
import { createId } from '../../utils/format'

const toFormValues = (company) => ({
  nameEn: company.name?.en || '',
  nameKm: company.name?.km || '',
  short: company.short || '',
  logo: company.logo || '#1d4ed8',
  accent: company.accent || '#60a5fa',
  rating: company.rating || 4.5,
  phone: company.phone || '',
  email: company.email || '',
})

const build = (values) => ({
  name: { en: values.nameEn, km: values.nameKm || values.nameEn },
  short: values.short || values.nameEn.slice(0, 2).toUpperCase(),
  logo: values.logo || '#1d4ed8',
  accent: values.accent || '#60a5fa',
  rating: Number(values.rating) || 4.5,
  phone: values.phone || '',
  email: values.email || '',
})

export default function CompaniesPage() {
  const { t } = useTranslation()
  const { language } = useApp()
  const { companies, companyActions } = useData()

  return (
    <CrudPage
      title={t('admin.companies')}
      subtitle={t('admin.companiesSubtitle') || t('home.companiesSubtitle')}
      items={companies}
      searchKeys={['short', 'email', 'phone']}
      columns={[
        {
          key: 'name',
          label: t('common.name'),
          render: (item) => (
            <div className="flex items-center gap-3">
              <CompanyLogo company={item} size="sm" />
              <div><p className="font-bold">{item.name?.[language] || item.name?.en}</p><p className="text-xs text-muted">{item.short}</p></div>
            </div>
          ),
        },
        { key: 'rating', label: 'Rating', render: (item) => <span className="flex items-center gap-1"><Star size={13} className="fill-amber-400 text-amber-400" /> {item.rating}</span> },
        { key: 'trips', label: t('admin.unitTrips') },
        { key: 'phone', label: t('common.phone') },
        { key: 'email', label: t('common.email') },
      ]}
      fields={[
        { name: 'nameEn', label: `${t('common.name')} (English)`, required: true },
        { name: 'nameKm', label: `${t('common.name')} (ខ្មែរ)` },
        { name: 'short', label: 'Short code', required: true },
        { name: 'logo', label: 'Brand colour' },
        { name: 'accent', label: 'Accent colour' },
        { name: 'rating', label: 'Rating', type: 'number', step: '0.1' },
        { name: 'phone', label: t('common.phone') },
        { name: 'email', label: t('common.email') },
      ]}
      toFormValues={toFormValues}
      initialValues={{ rating: 4.5, logo: '#1d4ed8', accent: '#60a5fa' }}
      addLabel={t('admin.addCompany')}
      onAdd={(values) => companyActions.add({ ...build(values), id: createId('cmp'), trips: 0, founded: new Date().getFullYear() })}
      onUpdate={(id, values) => companyActions.update(id, build(values))}
      onRemove={companyActions.remove}
    />
  )
}
