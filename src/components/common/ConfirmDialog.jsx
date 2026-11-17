import { AlertTriangle } from 'lucide-react'
import Button from './Button'
import Modal from './Modal'

export default function ConfirmDialog({ confirmation, onResolve }) {
  const open = Boolean(confirmation)
  return (
    <Modal
      open={open}
      onClose={() => onResolve(false)}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={() => onResolve(false)}>
            {confirmation?.cancelLabel}
          </Button>
          <Button variant={confirmation?.tone === 'danger' ? 'danger' : 'primary'} onClick={() => onResolve(true)}>
            {confirmation?.confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
          <AlertTriangle size={20} />
        </div>
        <div>
          <h4 className="font-bold">{confirmation?.title}</h4>
          {confirmation?.message && <p className="mt-1.5 text-sm leading-relaxed text-muted">{confirmation.message}</p>}
        </div>
      </div>
    </Modal>
  )
}
