import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-muted" aria-label="Breadcrumb">
      <Link to="/" className="flex items-center gap-1 hover:text-brand-600">
        <Home size={13} />
      </Link>
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
          <ChevronRight size={13} />
          {item.to ? <Link to={item.to} className="hover:text-brand-600">{item.label}</Link> : <span className="text-[var(--text-main)]">{item.label}</span>}
        </span>
      ))}
    </nav>
  )
}
