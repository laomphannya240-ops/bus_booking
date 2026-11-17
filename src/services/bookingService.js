import api, { isMockMode } from './api'
import { bookings as demoBookings } from '../data/bookings'
import { BOOKING_STATUS, PAYMENT_STATUS } from '../constants'
import { createBookingReference } from '../utils/format'

export const bookingService = {
  /** POST /api/bookings */
  createBooking: async (payload) => {
    if (isMockMode) {
      return {
        ...payload,
        id: `CB-${Math.floor(Math.random() * 90000) + 10000}`,
        reference: createBookingReference('CBS'),
        status: BOOKING_STATUS.PENDING,
        paymentStatus: payload.paymentStatus || PAYMENT_STATUS.PENDING,
        createdAt: new Date().toISOString(),
      }
    }
    const { data } = await api.post('/bookings', payload)
    return data
  },

  /** GET /api/bookings */
  getBookings: async () => {
    if (isMockMode) return demoBookings
    const { data } = await api.get('/bookings')
    return data
  },

  /** GET /api/bookings/{id} */
  getBooking: async (id) => {
    if (isMockMode) return demoBookings.find((booking) => booking.id === id || booking.reference === id)
    const { data } = await api.get(`/bookings/${id}`)
    return data
  },

  confirmBooking: async (id) => {
    if (isMockMode) return { id, status: BOOKING_STATUS.CONFIRMED }
    const { data } = await api.patch(`/bookings/${id}/confirm`)
    return data
  },

  /** POST /api/bookings/{id}/cancel */
  cancelBooking: async (id) => {
    if (isMockMode) return { id, status: BOOKING_STATUS.CANCELLED, cancelledAt: new Date().toISOString() }
    const { data } = await api.post(`/bookings/${id}/cancel`)
    return data
  },
}
