import { cn } from '../../utils/format'

/** Small decorative landscape artwork used for destination cards. */
export default function DestinationArt({ hue = 205, className }) {
  const sky = `hsl(${hue} 80% 92%)`
  const skyDark = `hsl(${hue} 70% 82%)`
  const hill = `hsl(${hue} 55% 55%)`
  const hillBack = `hsl(${hue} 45% 72%)`
  return (
    <svg viewBox="0 0 320 140" className={cn('h-full w-full', className)} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`sky-${hue}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sky} />
          <stop offset="100%" stopColor={skyDark} />
        </linearGradient>
      </defs>
      <rect width="320" height="140" fill={`url(#sky-${hue})`} />
      <circle cx="252" cy="42" r="21" fill="#ffffff" opacity="0.75" />
      <path d="M0 108 L70 48 L125 108 Z" fill={hillBack} />
      <path d="M88 110 L170 36 L248 110 Z" fill={hill} opacity="0.85" />
      <path d="M190 112 L254 62 L320 112 Z" fill={hillBack} />
      <rect y="108" width="320" height="32" fill={hill} opacity="0.55" />
      <path d="M0 124 Q80 116 160 124 T320 124" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.5" />
      <g fill="#ffffff" opacity="0.9">
        <rect x="42" y="86" width="28" height="10" rx="3" />
        <rect x="47" y="76" width="18" height="10" rx="3" />
      </g>
    </svg>
  )
}
