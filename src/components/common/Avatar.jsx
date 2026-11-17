import { cn, initials } from '../../utils/format'

export default function Avatar({ name, color = '#2563eb', size = 'md', className }) {
  const dimensions = size === 'sm' ? 'h-8 w-8 text-[11px]' : size === 'lg' ? 'h-14 w-14 text-lg' : 'h-10 w-10 text-xs'
  return (
    <div
      className={cn('flex shrink-0 items-center justify-center rounded-full font-bold text-white', dimensions, className)}
      style={{ background: color }}
    >
      {initials(name)}
    </div>
  )
}
