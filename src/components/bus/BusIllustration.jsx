import { cn } from '../../utils/format'

/** Lightweight local SVG bus artwork — no remote image requests. */
export default function BusIllustration({ company, type = 'VIP', className, plate }) {
  const color = company?.logo || '#1d4ed8'
  const accent = company?.accent || '#60a5fa'
  const isSleeper = type === 'Sleeper'

  return (
    <svg viewBox="0 0 240 120" className={cn('w-full', className)} role="img" aria-label={`${type} bus`}>
      <ellipse cx="120" cy="108" rx="98" ry="6" fill="#0b1f3a" opacity="0.1" />
      <rect x="18" y="18" width="204" height="74" rx="16" fill={color} />
      <rect x="26" y="26" width="188" height="58" rx="12" fill="#ffffff" opacity="0.08" />
      {isSleeper ? (
        <>
          <rect x="34" y="32" width="46" height="46" rx="7" fill="#dceaff" opacity="0.95" />
          <rect x="86" y="32" width="46" height="46" rx="7" fill="#dceaff" opacity="0.95" />
          <rect x="138" y="32" width="44" height="46" rx="7" fill="#dceaff" opacity="0.95" />
          <rect x="188" y="32" width="18" height="46" rx="6" fill="#0b1f3a" opacity="0.45" />
        </>
      ) : (
        <>
          <rect x="34" y="32" width="58" height="38" rx="6" fill="#dceaff" opacity="0.95" />
          <rect x="98" y="32" width="58" height="38" rx="6" fill="#dceaff" opacity="0.95" />
          <rect x="162" y="32" width="44" height="38" rx="6" fill="#dceaff" opacity="0.95" />
          <rect x="34" y="76" width="172" height="4" rx="2" fill={accent} />
        </>
      )}
      <rect x="18" y="82" width="204" height="8" rx="4" fill={accent} opacity="0.85" />
      <circle cx="64" cy="92" r="12" fill="#0b1f3a" />
      <circle cx="64" cy="92" r="5" fill="#cbd5e1" />
      <circle cx="176" cy="92" r="12" fill="#0b1f3a" />
      <circle cx="176" cy="92" r="5" fill="#cbd5e1" />
      <rect x="210" y="68" width="12" height="7" rx="3" fill="#fde68a" />
      <rect x="18" y="68" width="8" height="6" rx="2" fill="#fca5a5" />
      {plate && (
        <text x="120" y="81" textAnchor="middle" fontSize="7" fontWeight="700" fill="#ffffff" opacity="0.9">
          {plate}
        </text>
      )}
    </svg>
  )
}
