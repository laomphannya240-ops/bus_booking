import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Button from './Button'
import Card from './Card'
import EmptyState from './EmptyState'
import FormField from './FormField'
import Modal from './Modal'
import Pagination from './Pagination'

/**
 * Reusable admin table + form used by the management modules. In mock mode
 * all changes live in DataContext memory only; with VITE_API_MODE=live the
 * same callbacks call the prepared service layer.
 */
export default function CrudPage({
  title,
  subtitle,
  description,
  items = [],
  columns = [],
  fields = [],
  searchKeys = [],
  onAdd,
  onUpdate,
  onRemove,
  addLabel,
  headerActions,
  extraRowActions,
  readOnly = false,
  pageSize = 8,
  initialValues = {},
  toFormValues,
}) {
  const { t } = useTranslation()
  const { confirm } = useApp()
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const initialValuesKey = JSON.stringify(initialValues)
  const formInitialValues = useMemo(() => JSON.parse(initialValuesKey), [initialValuesKey])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term || searchKeys.length === 0) return items
    return items.filter((item) =>
      searchKeys.some((key) => String(item[key] ?? '').toLowerCase().includes(term)),
    )
  }, [items, query, searchKeys])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => setPage(1), [query])
  useEffect(() => {
    if (formOpen) {
      reset(editing ? { ...formInitialValues, ...(toFormValues ? toFormValues(editing) : editing) } : formInitialValues)
    }
    // toFormValues is a pure mapper defined at module level by callers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formOpen, editing, reset, formInitialValues])

  const openAdd = () => { setEditing(null); setFormOpen(true) }
  const openEdit = (item) => { setEditing(item); setFormOpen(true) }

  const submit = async (values) => {
    if (editing && onUpdate) await onUpdate(editing.id, values)
    else if (onAdd) await onAdd(values)
    setFormOpen(false)
  }

  const remove = async (item) => {
    const accepted = await confirm({
      title: t('admin.confirmDelete'),
      message: t('admin.confirmDeleteText'),
      confirmLabel: t('admin.deleteConfirm'),
    })
    if (accepted && onRemove) await onRemove(item.id)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {headerActions}
          {!readOnly && onAdd && (
            <Button icon={Plus} onClick={openAdd}>{addLabel || t('common.add')}</Button>
          )}
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4" style={{ borderColor: 'var(--border-color)' }}>
          <div className="relative w-full max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('admin.searchPlaceholder')}
              className="input-base !pl-9"
            />
          </div>
          <p className="text-xs font-semibold text-muted">{filtered.length} {t('common.details').toLowerCase()}</p>
        </div>

        {visible.length === 0 ? (
          <EmptyState title={t('common.noResults')} description={t('common.tryAgain')} />
        ) : (
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  {columns.map((column) => <th key={column.key}>{column.label}</th>)}
                  {(!readOnly || extraRowActions) && <th className="text-right">{t('common.actions')}</th>}
                </tr>
              </thead>
              <tbody>
                {visible.map((item, index) => (
                  <tr key={item.id || index}>
                    {columns.map((column) => (
                      <td key={column.key}>{column.render ? column.render(item) : item[column.key]}</td>
                    ))}
                    {(!readOnly || extraRowActions) && (
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          {extraRowActions?.(item)}
                          {!readOnly && (
                            <>
                              <button type="button" onClick={() => openEdit(item)} className="btn-ghost !p-2" title={t('common.edit')} aria-label={t('common.edit')}>
                                <Pencil size={15} />
                              </button>
                              <button type="button" onClick={() => remove(item)} className="btn-ghost !p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10" title={t('common.delete')} aria-label={t('common.delete')}>
                                <Trash2 size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </Card>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? t('common.edit') : addLabel || t('common.add')}
        subtitle={description}
        footer={
          <>
            <Button variant="outline" onClick={() => setFormOpen(false)}>{t('common.cancel')}</Button>
            <Button type="submit" form="crud-form">{t('common.save')}</Button>
          </>
        }
      >
        <form id="crud-form" onSubmit={handleSubmit(submit)} className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <FormField
              key={field.name}
              label={field.label}
              required={field.required}
              error={errors[field.name]?.message}
              className={field.full ? 'sm:col-span-2' : ''}
            >
              {field.type === 'select' ? (
                <select
                  className="input-base"
                  {...register(field.name, { required: field.required ? t('booking.requiredError') : false, valueAsNumber: field.numeric })}
                >
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  className="input-base min-h-20"
                  placeholder={field.placeholder}
                  {...register(field.name, { required: field.required ? t('booking.requiredError') : false })}
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  step={field.step}
                  min={field.min}
                  placeholder={field.placeholder}
                  className="input-base"
                  {...register(field.name, {
                    required: field.required ? t('booking.requiredError') : false,
                    valueAsNumber: field.type === 'number',
                  })}
                />
              )}
            </FormField>
          ))}
        </form>
      </Modal>
    </div>
  )
}
