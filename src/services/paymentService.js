import api, { isMockMode } from './api'
import { PAYMENT_STATUS } from '../constants'
import { createId } from '../utils/format'

/**
 * The QR payload below is a demo-only string. It is NOT a Bakong KHQR code and
 * cannot initiate a real payment. Feed real encoded KHQR from the backend here.
 */
export const paymentService = {
  /** POST /api/payments */
  createPayment: async ({ amount, bookingReference }) => {
    if (isMockMode) {
      return {
        id: createId('pay'),
        reference: `KHQR-DEMO-${Math.floor(Math.random() * 900000) + 100000}`,
        amount,
        bookingReference,
        status: PAYMENT_STATUS.PENDING,
        method: 'KHQR',
        demoQrPayload: `DEMO-KHQR|${bookingReference}|${amount}|NOT-A-REAL-PAYMENT`,
        createdAt: new Date().toISOString(),
      }
    }
    const { data } = await api.post('/payments', { amount, bookingReference, method: 'KHQR' })
    return data
  },

  /** GET /api/payments/{id} */
  getPayment: async (id) => {
    if (isMockMode) return { id, status: PAYMENT_STATUS.PENDING }
    const { data } = await api.get(`/payments/${id}`)
    return data
  },

  uploadProof: async (paymentId, file) => {
    if (isMockMode) {
      return { paymentId, fileName: file?.name || 'proof', status: PAYMENT_STATUS.PROOF_UPLOADED }
    }
    const form = new FormData()
    form.append('proof', file)
    const { data } = await api.post(`/payments/${paymentId}/proof`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  verifyPayment: async (id) => {
    if (isMockMode) return { id, status: PAYMENT_STATUS.VERIFIED, verifiedAt: new Date().toISOString() }
    const { data } = await api.patch(`/payments/${id}/verify`)
    return data
  },
}
