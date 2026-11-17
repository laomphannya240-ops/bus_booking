import { Inbox } from 'lucide-react'
import { cn } from '../../utils/format'

export default function EmptyState({ icon: Icon = Inbox, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-14 text-center', className)}>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: 'var(--surface-muted)', color: 'var(--text-muted)' }}>
        <Icon size={26} />
      </div>
      <h3 className="text-base font-bold">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
