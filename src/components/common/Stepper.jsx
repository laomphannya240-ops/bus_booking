import { Check } from 'lucide-react'
import { cn } from '../../utils/format'

export function Stepper({ steps, current }) {
  return (
    <div className="no-scrollbar w-full overflow-x-auto pb-1">
      <div className="flex min-w-full items-center">
        {steps.map((step, index) => {
          const done = index < current
          const active = index === current
          return (
            <div key={step} className={cn('flex items-center', index < steps.length - 1 && 'flex-1')}>
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors',
                    done && 'border-brand-600 bg-brand-600 text-white',
                    active && 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200',
                    !done && !active && 'border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-muted)]',
                  )}
                >
                  {done ? <Check size={15} /> : index + 1}
                </div>
                <span className={cn('whitespace-nowrap text-[10px] font-semibold sm:text-xs', active ? 'text-brand-600 dark:text-brand-300' : 'text-muted')}>
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={cn('mx-1 mb-4 h-0.5 flex-1 rounded sm:mx-2', done ? 'bg-brand-600' : 'bg-[var(--border-color)]')} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Stepper
