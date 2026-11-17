import { downloadFile } from './format'
import { formatDate } from './date'

/** Generates a self-contained printable ticket file for the frontend demo. */
export const downloadTicket = (booking, schedule, labels = {}) => {
  if (!booking) return
  const passengers = (booking.passengers || [])
    .map((passenger) => `<li>${escapeHtml(passenger.name)} — ${escapeHtml(passenger.seat)} (${escapeHtml(passenger.gender || '')})</li>`)
    .join('')

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Ticket ${escapeHtml(booking.id)}</title>
<style>
 body{font-family:Arial,sans-serif;color:#0b1f3a;margin:0;padding:32px;background:#f5f8fc}
 .ticket{max-width:720px;margin:auto;background:#fff;border:2px solid #0b1f3a;border-radius:14px;overflow:hidden}
 header{background:#0b1f3a;color:#fff;padding:18px 24px;display:flex;justify-content:space-between;align-items:center}
 h1{margin:0;font-size:18px;letter-spacing:.5px}
 .route{padding:24px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px dashed #94a3b8}
 .route strong{display:block;font-size:22px}
 .grid{padding:20px 24px;display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
 .grid div{background:#f1f5f9;padding:10px;border-radius:8px}
 small{color:#64748b;display:block;font-size:11px}
 .details{padding:0 24px 24px}
 table{width:100%;border-collapse:collapse}td{padding:6px 0;border-bottom:1px solid #e2e8f0}
 footer{padding:14px 24px;background:#f1f5f9;font-size:11px;color:#64748b}
 @media print{body{background:#fff;padding:0}}
</style></head><body><div class="ticket">
<header><h1>CAMBODIA BUS — E-TICKET</h1><span>${escapeHtml(labels.paid || '')}</span></header>
<div class="route"><div><small>${escapeHtml(labels.departure || 'Departure')}</small><strong>${escapeHtml(booking.from || '')} ${escapeHtml(schedule?.departureTime || booking.departureTime || '')}</strong></div>
<div>→</div><div style="text-align:right"><small>${escapeHtml(labels.arrival || 'Arrival')}</small><strong>${escapeHtml(booking.to || '')} ${escapeHtml(schedule?.arrivalTime || booking.arrivalTime || '')}</strong></div></div>
<div class="grid">
 <div><small>${escapeHtml(labels.date || 'Date')}</small><strong>${escapeHtml(formatDate(schedule?.date || booking.date, 'en'))}</strong></div>
 <div><small>${escapeHtml(labels.bookingId || 'Booking ID')}</small><strong>${escapeHtml(booking.id)}</strong></div>
 <div><small>${escapeHtml(labels.seats || 'Seats')}</small><strong>${escapeHtml((booking.seats || []).join(', '))}</strong></div>
 <div><small>${escapeHtml(labels.total || 'Total')}</small><strong>$${Number(booking.amount || 0).toFixed(2)}</strong></div>
</div>
<div class="details"><h3>${escapeHtml(labels.passenger || 'Passengers')}</h3><ul>${passengers}</ul>
<table><tr><td>${escapeHtml(labels.reference || 'Reference')}</td><td>${escapeHtml(booking.reference || '')}</td></tr>
<tr><td>${escapeHtml(labels.paymentStatus || 'Payment status')}</td><td>${escapeHtml(booking.paymentStatus || '')}</td></tr></table></div>
<footer>CAMBODIA BUS · ${escapeHtml(labels.demo || 'Frontend demo — not proof of payment')}</footer>
</div></body></html>`

  downloadFile(`cambodia-bus-ticket-${booking.id}.html`, html, 'text/html;charset=utf-8')
}

const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
