import { cn } from '../../utils/format'

export const Card = ({ children, className, ...props }) => (
  <div className={cn('app-card', className)} {...props}>
    {children}
  </div>
)

export const CardHeader = ({ children, className, ...props }) => (
  <div className={cn('flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4', className)} style={{ borderColor: 'var(--border-color)' }} {...props}>
    {children}
  </div>
)

export const CardBody = ({ children, className, ...props }) => (
  <div className={cn('p-5', className)} {...props}>
    {children}
  </div>
)

export default Card
