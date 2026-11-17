import { useTranslation } from 'react-i18next'
import { CircleCheck, CircleSlash, Square } from 'lucide-react'
import { generateSeatLabels } from '../../utils/seats'
import { cn } from '../../utils/format'

export default function SeatMap({ capacity = 48, bookedSeats = [], selectedSeats = [], onToggle, type = 'VIP' }) {
  const { t } = useTranslation()
  const labels = generateSeatLabels(capacity)
  const rows = []
  for (let index = 0; index < labels.length; index += 4) rows.push(labels.slice(index, index + 4))

  const seatClass = (seat) => {
    if (bookedSeats.includes(seat)) return 'border-slate-300 bg-slate-300 text-slate-500 dark:border-slate-600 dark:bg-slate-600 dark:text-slate-400 cursor-not-allowed'
    if (selectedSeats.includes(seat)) return 'border-brand-600 bg-brand-600 text-white shadow-md shadow-brand-500/30'
    return 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:border-emerald-500 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20'
  }

  return (
    <div className="w-full">
      <div className="mx-auto max-w-sm rounded-[2rem] border-2 p-3 sm:p-5" style={{ borderColor: 'var(--border-color)', background: 'var(--surface)' }}>
        <div className="mb-4 flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
          <span className="text-xs font-bold text-muted">{type.toUpperCase()}</span>
          <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold text-white" style={{ background: 'var(--surface-muted)', color: 'var(--text-muted)' }}>
            {t('seats.driver')}
          </div>
        </div>

        <div className="space-y-2.5">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center justify-center gap-1.5 sm:gap-2">
              <span className="w-4 text-center text-[10px] font-bold text-muted">{rowIndex + 1}</span>
              {row.map((seat, seatIndex) => (
                <div key={seat} className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    disabled={bookedSeats.includes(seat)}
                    onClick={() => onToggle(seat)}
                    title={t('seats.seatNumber', { number: seat })}
                    aria-label={t('seats.seatNumber', { number: seat })}
                    aria-pressed={selectedSeats.includes(seat)}
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-lg border text-[10px] font-bold transition-all active:scale-95 sm:h-10 sm:w-10 sm:text-xs',
                      seatClass(seat),
                    )}
                  >
                    {seat}
                  </button>
                  {seatIndex === 1 && <span className="w-4 sm:w-6" />}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-4 h-2 rounded-full" style={{ background: 'var(--surface-muted)' }} />
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2">
        <Legend className="border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" icon={Square} label={t('seats.available')} />
        <Legend className="border-brand-600 bg-brand-600 text-white" icon={CircleCheck} label={t('seats.selected')} />
        <Legend className="border-slate-300 bg-slate-300 text-slate-600 dark:bg-slate-600 dark:text-slate-300" icon={CircleSlash} label={t('seats.booked')} />
      </div>
      <p className="mt-3 text-center text-xs text-muted">{t('seats.seatMapHint')}</p>
    </div>
  )
}

function Legend({ className, icon: Icon, label }) {
  return (
    <span className="flex items-center gap-2 text-xs font-medium text-muted">
      <span className={cn('flex h-5 w-5 items-center justify-center rounded border', className)}><Icon size={11} /></span>
      {label}
    </span>
  )
}
