import { cn } from '../../utils/format'

export default function CompanyLogo({ company, size = 'md', className }) {
  if (!company) return null
  const dimensions = size === 'sm' ? 'h-9 w-9 text-[10px]' : size === 'lg' ? 'h-14 w-14 text-base' : 'h-11 w-11 text-xs'
  return (
    <div
      className={cn('flex shrink-0 items-center justify-center rounded-xl font-extrabold tracking-tight text-white shadow-sm', dimensions, className)}
      style={{ backgroundColor: company.logo || '#1d4ed8' }}
      title={company.name?.en}
    >
      {company.short || company.name?.en?.slice(0, 2).toUpperCase()}
    </div>
  )
}
