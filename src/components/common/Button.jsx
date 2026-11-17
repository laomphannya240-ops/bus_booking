import { Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/format'

const variants = {
  primary: 'btn-primary',
  navy: 'btn-navy',
  outline: 'btn-outline',
  soft: 'btn-soft',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  className,
  children,
  to,
  disabled,
  type = 'button',
  ...props
}) {
  const classes = cn(
    'btn',
    variants[variant] || variants.primary,
    size === 'sm' && 'px-3 py-1.5 text-xs',
    size === 'lg' && 'px-6 py-3 text-base',
    className,
  )
  const content = (
    <>
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon ? <Icon size={16} /> : null}
      {children}
    </>
  )

  if (to) {
    return <Link to={to} className={classes} {...props}>{content}</Link>
  }

  return (
    <button type={type} className={classes} disabled={disabled || loading} {...props}>
      {content}
    </button>
  )
}
