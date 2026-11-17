import { useTranslation } from 'react-i18next'
import { MapPin } from 'lucide-react'
import CrudPage from '../../components/common/CrudPage'
import { useData } from '../../context/DataContext'
import { useApp } from '../../context/AppContext'
import { provinces, provinceName } from '../../data/provinces'
import { createId } from '../../utils/format'

const toFormValues = (station) => ({
  nameEn: station.name?.en || '',
  nameKm: station.name?.km || '',
  provinceId: station.provinceId,
})

export default function StationsPage() {
  const { t } = useTranslation()
  const { language } = useApp()
  const { stations, stationActions } = useData()

  return (
    <CrudPage
      title={t('admin.stations')}
      subtitle={t('admin.assignProvince')}
      items={stations}
      searchKeys={['name', 'provinceId']}
      columns={[
        {
          key: 'name', label: t('common.station'),
          render: (item) => (
            <div className="flex items-center gap-2"><MapPin size={15} className="text-brand-500" /><span className="font-bold">{item.name?.[language] || item.name?.en}</span></div>
          ),
        },
        { key: 'provinceId', label: t('admin.assignProvince'), render: (item) => provinceName(item.provinceId, language) },
        { key: 'address', label: t('common.address'), render: (item) => <span className="text-muted">{item.address?.[language] || item.address?.en || '—'}</span> },
      ]}
      fields={[
        { name: 'nameEn', label: `${t('common.name')} (English)`, required: true },
        { name: 'nameKm', label: `${t('common.name')} (ខ្មែរ)` },
        {
          name: 'provinceId', label: t('admin.assignProvince'), type: 'select', required: true, numeric: true,
          options: provinces.map((province) => ({ value: province.id, label: province[language] || province.en })),
        },
      ]}
      toFormValues={toFormValues}
      addLabel={t('admin.addStation')}
      onAdd={(values) => {
        const province = provinces.find((item) => item.id === Number(values.provinceId))
        stationActions.add({
          id: createId('st'),
          provinceId: Number(values.provinceId),
          name: { en: values.nameEn, km: values.nameKm || values.nameEn },
          address: { en: `${values.nameEn}, ${province?.en || ''}`, km: `${values.nameKm || values.nameEn}, ${province?.km || ''}` },
        })
      }}
      onUpdate={(id, values) => {
        const province = provinces.find((item) => item.id === Number(values.provinceId))
        stationActions.update(id, {
          provinceId: Number(values.provinceId),
          name: { en: values.nameEn, km: values.nameKm || values.nameEn },
          address: { en: `${values.nameEn}, ${province?.en || ''}`, km: `${values.nameKm || values.nameEn}, ${province?.km || ''}` },
        })
      }}
      onRemove={stationActions.remove}
    />
  )
}
