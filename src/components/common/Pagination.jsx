import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
  return (
    <div className="flex items-center justify-center gap-1.5 py-4">
      <button type="button" className="btn-outline !p-2" disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <ChevronLeft size={16} />
      </button>
      {pages.map((item) => (
        <button
          type="button"
          key={item}
          onClick={() => onChange(item)}
          className={item === page ? 'btn-primary !h-9 !w-9 !p-0' : 'btn-outline !h-9 !w-9 !p-0'}
        >
          {item}
        </button>
      ))}
      <button type="button" className="btn-outline !p-2" disabled={page === totalPages} onClick={() => onChange(page + 1)} aria-label="Next page">
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
