import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../../utils/format'

export default function Modal({ open, onClose, title, subtitle, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          'page-enter relative z-10 max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl shadow-float sm:max-h-[90vh] sm:rounded-2xl',
          size === 'sm' && 'max-w-md',
          size === 'md' && 'max-w-xl',
          size === 'lg' && 'max-w-3xl',
          size === 'xl' && 'max-w-5xl',
        )}
        style={{ background: 'var(--surface)', color: 'var(--text-main)' }}
      >
        {(title || onClose) && (
          <div className="flex items-start justify-between gap-4 border-b px-5 py-4" style={{ borderColor: 'var(--border-color)' }}>
            <div>
              {title && <h3 className="text-base font-bold">{title}</h3>}
              {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
            </div>
            <button type="button" onClick={onClose} className="btn-ghost !p-2" aria-label="Close">
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-4 sm:p-5">{children}</div>
        {footer && (
          <div className="flex flex-wrap justify-end gap-2 border-t px-4 py-4 [&>button]:flex-1 sm:px-5 sm:[&>button]:flex-none" style={{ borderColor: 'var(--border-color)' }}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
