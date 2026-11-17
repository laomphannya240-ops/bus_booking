import { cn } from '../../utils/format'

export default function SectionHeader({ eyebrow, title, subtitle, action, align = 'left', className }) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-end justify-between gap-4',
        align === 'center' && 'flex-col items-center text-center',
        className,
      )}
    >
      <div className={align === 'center' ? 'max-w-2xl' : ''}>
        {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">{eyebrow}</p>}
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
