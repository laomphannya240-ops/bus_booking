import { useTranslation } from 'react-i18next'
import { RotateCcw, SlidersHorizontal } from 'lucide-react'
import { BUS_TYPES, DEPARTURE_WINDOWS, SORT_OPTIONS } from '../../constants'
import { useApp } from '../../context/AppContext'
import { money } from '../../utils/format'

const Checkbox = ({ label, checked, onChange }) => (
  <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 rounded border-[var(--border-color)] accent-brand-600"
    />
    <span>{label}</span>
  </label>
)

export default function SearchFilters({ filters, onChange, companies, priceRange, sort, onSortChange }) {
  const { t } = useTranslation()
  const { language } = useApp()

  const toggle = (key, value) => {
    const current = filters[key]
    onChange({
      ...filters,
      [key]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    })
  }

  const activeCount =
    filters.types.length + filters.timeWindows.length + filters.companyIds.length + (filters.maxPrice < priceRange.max ? 1 : 0)

  return (
    <div className="app-card p-5">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold">
          <SlidersHorizontal size={16} className="text-brand-600" /> {t('search.filters')}
          {activeCount > 0 && <span className="chip bg-brand-600 text-white">{activeCount}</span>}
        </h3>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => onChange({ maxPrice: priceRange.max, timeWindows: [], types: [], companyIds: [] })}
            className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline"
          >
            <RotateCcw size={12} /> {t('search.clearFilters')}
          </button>
        )}
      </div>

      <div className="mb-6">
        <label className="label-base">{t('search.sortBy')}</label>
        <select className="input-base" value={sort} onChange={(event) => onSortChange(event.target.value)}>
          {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{t(option.key)}</option>)}
        </select>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-semibold">{t('search.priceRange')}</label>
          <span className="text-xs font-bold text-brand-600">{t('search.maxPrice', { price: money(filters.maxPrice) })}</span>
        </div>
        <input
          type="range"
          min={priceRange.min}
          max={priceRange.max}
          value={filters.maxPrice}
          onChange={(event) => onChange({ ...filters, maxPrice: Number(event.target.value) })}
          className="w-full accent-brand-600"
        />
        <div className="mt-1 flex justify-between text-[11px] text-muted">
          <span>{money(priceRange.min)}</span>
          <span>{money(priceRange.max)}</span>
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-1 text-sm font-semibold">{t('search.departureTime')}</p>
        {DEPARTURE_WINDOWS.map((window) => (
          <Checkbox
            key={window.id}
            label={window[language] || window.en}
            checked={filters.timeWindows.includes(window.id)}
            onChange={() => toggle('timeWindows', window.id)}
          />
        ))}
      </div>

      <div className="mb-6">
        <p className="mb-1 text-sm font-semibold">{t('search.busType')}</p>
        {BUS_TYPES.map((type) => (
          <Checkbox
            key={type.value}
            label={type[language] || type.en}
            checked={filters.types.includes(type.value)}
            onChange={() => toggle('types', type.value)}
          />
        ))}
      </div>

      <div>
        <p className="mb-1 text-sm font-semibold">{t('search.company')}</p>
        <div className="max-h-52 space-y-0.5 overflow-y-auto pr-1">
          {companies.map((company) => (
            <Checkbox
              key={company.id}
              label={company.name[language] || company.name.en}
              checked={filters.companyIds.includes(company.id)}
              onChange={() => toggle('companyIds', company.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
