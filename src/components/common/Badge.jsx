import { cn, statusTone } from '../../utils/format'

const tones = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-700/60',
  brand: 'bg-brand-50 text-brand-700 ring-brand-200 dark:bg-brand-500/15 dark:text-brand-200 dark:ring-brand-700/60',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-700/60',
  danger: 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/15 dark:text-red-300 dark:ring-red-700/60',
  neutral: 'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-600/30 dark:text-slate-300 dark:ring-slate-600',
  violet: 'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:ring-violet-700/60',
}

export default function Badge({ children, tone = 'neutral', status, className, dot = false }) {
  const resolved = status ? statusTone(status) : tone
  return (
    <span className={cn('chip ring-1 ring-inset', tones[resolved] || tones.neutral, className)}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}
