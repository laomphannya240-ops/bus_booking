import { cn } from '../../utils/format'

export const Skeleton = ({ className }) => <div className={cn('skeleton', className)} />

export const SkeletonCard = () => (
  <div className="app-card p-5">
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-2.5 w-1/4" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
    <div className="mt-6 flex items-center gap-4">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-2 flex-1" />
      <Skeleton className="h-8 w-20" />
    </div>
    <div className="mt-6 flex justify-between">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="h-9 w-28 rounded-xl" />
    </div>
  </div>
)

export const SkeletonTable = ({ rows = 6 }) => (
  <div className="space-y-2 p-4">
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="flex items-center gap-4">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-3 w-1/5" />
        <Skeleton className="ml-auto h-3 w-16" />
      </div>
    ))}
  </div>
)
