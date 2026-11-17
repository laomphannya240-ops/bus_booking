import { cn } from '../../utils/format'

export default function FormField({ label, error, hint, required, children, className, htmlFor }) {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="label-base" htmlFor={htmlFor}>
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  )
}
