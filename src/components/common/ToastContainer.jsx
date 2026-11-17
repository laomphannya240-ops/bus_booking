import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { cn } from '../../utils/format'

const config = {
  success: { icon: CheckCircle2, className: 'text-emerald-500' },
  error: { icon: XCircle, className: 'text-red-500' },
  warning: { icon: AlertTriangle, className: 'text-amber-500' },
  info: { icon: Info, className: 'text-brand-500' },
}

export default function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="no-print pointer-events-none fixed right-4 top-4 z-[200] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
      {toasts.map((toast) => {
        const item = config[toast.type] || config.info
        const Icon = item.icon
        return (
          <div
            key={toast.id}
            className="toast-in pointer-events-auto flex items-start gap-3 rounded-xl px-4 py-3 shadow-float"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-color)' }}
            role="status"
          >
            <Icon size={19} className={cn('mt-0.5 shrink-0', item.className)} />
            <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
            <button type="button" onClick={() => onDismiss(toast.id)} className="btn-ghost !p-1" aria-label="Dismiss">
              <X size={15} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
