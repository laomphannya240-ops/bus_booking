export const ROLES = {
  ADMIN: 'ADMIN',
  COMPANY: 'BUS_COMPANY',
  CUSTOMER: 'CUSTOMER',
}

export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
}

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PROOF_UPLOADED: 'PROOF_UPLOADED',
  VERIFIED: 'VERIFIED',
  FAILED: 'FAILED',
}

export const SCHEDULE_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  FULL: 'FULL',
}

export const BUS_TYPES = [
  { value: 'VIP', color: 'brand', en: 'VIP', km: 'វីអាយភី' },
  { value: 'Sleeper', color: 'violet', en: 'Sleeper', km: 'ឡានដេក' },
  { value: 'Luxury', color: 'amber', en: 'Luxury', km: 'លុចស៊ូរី' },
  { value: 'Standard', color: 'slate', en: 'Standard', km: 'ធម្មតា' },
]

export const BUS_STATUSES = ['ACTIVE', 'MAINTENANCE', 'INACTIVE']

export const GENDERS = ['MALE', 'FEMALE', 'OTHER']

export const DEPARTURE_WINDOWS = [
  { id: 'early', en: 'Early morning', km: 'ព្រឹកព្រលឹម', from: 0, to: 6 },
  { id: 'morning', en: 'Morning', km: 'ព្រឹក', from: 6, to: 12 },
  { id: 'afternoon', en: 'Afternoon', km: 'ល្ងាច', from: 12, to: 18 },
  { id: 'evening', en: 'Evening', km: 'យប់', from: 18, to: 24 },
]

export const SORT_OPTIONS = [
  { value: 'recommended', key: 'search.sortRecommended' },
  { value: 'price-asc', key: 'search.sortPriceLow' },
  { value: 'price-desc', key: 'search.sortPriceHigh' },
  { value: 'departure', key: 'search.sortDeparture' },
  { value: 'duration', key: 'search.sortDuration' },
]

export const THEME_STORAGE_KEY = 'cambodia-bus-theme'
export const AUTH_STORAGE_KEY = 'cambodia-bus-demo-session'
export const BOOKING_REFERENCE_PREFIX = 'CBS'

export const CONTACT = {
  phone: '+855 23 999 888',
  email: 'support@cambodiabus.travel',
  addressEn: 'Phnom Penh, Cambodia',
  addressKm: 'រាជធានីភ្នំពេញ ព្រះរាជាណាចក្រកម្ពុជា',
}

export const PAYMENT_COUNTDOWN_SECONDS = 15 * 60
