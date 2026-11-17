import { useMemo } from 'react'

/**
 * Draws a deterministic QR-style pattern from a demo payload.
 * This is visual only and is NOT a valid KHQR / Bakong code.
 */
export default function PaymentQR({ payload, size = 220 }) {
  const modules = useMemo(() => {
    const count = 29
    const grid = Array.from({ length: count }, () => Array(count).fill(false))
    let seed = 2166136261
    for (let index = 0; index < payload.length; index += 1) {
      seed ^= payload.charCodeAt(index)
      seed = Math.imul(seed, 16777619)
    }
    const isFinder = (row, col) =>
      (row < 8 && col < 8) || (row < 8 && col > count - 9) || (row > count - 9 && col < 8)

    for (let row = 0; row < count; row += 1) {
      for (let col = 0; col < count; col += 1) {
        if (isFinder(row, col)) continue
        seed = (Math.imul(seed, 1103515245) + 12345) & 0x7fffffff
        grid[row][col] = (seed >>> 16) % 100 < 46
      }
    }
    return { grid, count }
  }, [payload])

  const { grid, count } = modules
  const cell = 100 / count
  const finder = (x, y) => (
    <g key={`${x}-${y}`} transform={`translate(${x * cell} ${y * cell})`}>
      <rect width={cell * 7} height={cell * 7} fill="#0b1f3a" />
      <rect x={cell} y={cell} width={cell * 5} height={cell * 5} fill="#ffffff" />
      <rect x={cell * 2} y={cell * 2} width={cell * 3} height={cell * 3} fill="#0b1f3a" />
    </g>
  )

  return (
    <svg viewBox="-4 -4 108 108" width={size} height={size} className="mx-auto h-auto w-full max-w-[220px]" role="img" aria-label="Demo KHQR preview">
      <rect x="-4" y="-4" width="108" height="108" fill="#ffffff" />
      {grid.map((row, rowIndex) =>
        row.map((value, colIndex) =>
          value ? (
            <rect
              key={`${rowIndex}-${colIndex}`}
              x={colIndex * cell}
              y={rowIndex * cell}
              width={cell}
              height={cell}
              fill="#0b1f3a"
            />
          ) : null,
        ),
      )}
      {finder(0, 0)}
      {finder(count - 7, 0)}
      {finder(0, count - 7)}
    </svg>
  )
}
