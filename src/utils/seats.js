/**
 * Seat numbering and deterministic demo occupancy shared by the seat map,
 * schedule mock data and booking views.
 */
export const generateSeatLabels = (capacity = 48) => {
  const rows = Math.ceil(capacity / 4)
  const labels = []
  for (let row = 1; row <= rows; row += 1) {
    for (const column of ['A', 'B', 'C', 'D']) {
      if (labels.length < capacity) labels.push(`${row}${column}`)
    }
  }
  return labels
}

export const generateBookedSeats = (scheduleId = 'schedule', capacity = 48) => {
  const seed = [...scheduleId].reduce((total, char) => total + char.charCodeAt(0), 0)
  return generateSeatLabels(capacity).filter((_, index) => (index * 7 + seed) % 11 < 3)
}
