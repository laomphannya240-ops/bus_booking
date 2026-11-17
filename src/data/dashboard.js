export const monthlyRevenue = [
  { month: 'Jan', km: 'មករា', revenue: 12400, bookings: 410 },
  { month: 'Feb', km: 'កុម្ភៈ', revenue: 15200, bookings: 480 },
  { month: 'Mar', km: 'មីនា', revenue: 14100, bookings: 450 },
  { month: 'Apr', km: 'មេសា', revenue: 18800, bookings: 590 },
  { month: 'May', km: 'ឧសភា', revenue: 17600, bookings: 560 },
  { month: 'Jun', km: 'មិថុនា', revenue: 21400, bookings: 640 },
  { month: 'Jul', km: 'កក្កដា', revenue: 23900, bookings: 720 },
  { month: 'Aug', km: 'សីហា', revenue: 22300, bookings: 680 },
  { month: 'Sep', km: 'កញ្ញា', revenue: 26800, bookings: 810 },
  { month: 'Oct', km: 'តុលា', revenue: 29500, bookings: 890 },
  { month: 'Nov', km: 'វិច្ឆិកា', revenue: 31200, bookings: 940 },
  { month: 'Dec', km: 'ធ្នូ', revenue: 34700, bookings: 1020 },
]

export const dailyRevenue = [
  { day: 'Mon', km: 'ច័ន្ទ', revenue: 980, bookings: 32 },
  { day: 'Tue', km: 'អង្គារ', revenue: 1240, bookings: 41 },
  { day: 'Wed', km: 'ពុធ', revenue: 1120, bookings: 37 },
  { day: 'Thu', km: 'ព្រហស្បតិ៍', revenue: 1460, bookings: 48 },
  { day: 'Fri', km: 'សុក្រ', revenue: 1810, bookings: 62 },
  { day: 'Sat', km: 'សៅរ៍', revenue: 2140, bookings: 75 },
  { day: 'Sun', km: 'អាទិត្យ', revenue: 1930, bookings: 68 },
]

export const bookingStatusData = [
  { key: 'CONFIRMED', value: 452 },
  { key: 'PAID', value: 318 },
  { key: 'PENDING', value: 124 },
  { key: 'COMPLETED', value: 286 },
  { key: 'CANCELLED', value: 48 },
]

export const popularRouteData = [
  { id: 'pp-sr', from: 1, to: 21, bookings: 842, revenue: 25300 },
  { id: 'pp-sh', from: 1, to: 16, bookings: 726, revenue: 17400 },
  { id: 'pp-bb', from: 1, to: 3, bookings: 618, revenue: 18600 },
  { id: 'pp-kp', from: 1, to: 8, bookings: 494, revenue: 12400 },
  { id: 'pp-kk', from: 1, to: 11, bookings: 402, revenue: 8900 },
]

export const topCompanyData = [
  { companyId: 'cmp-01', bookings: 512, revenue: 16800 },
  { companyId: 'cmp-02', bookings: 448, revenue: 14200 },
  { companyId: 'cmp-03', bookings: 396, revenue: 12100 },
  { companyId: 'cmp-04', bookings: 334, revenue: 9900 },
  { companyId: 'cmp-05', bookings: 288, revenue: 8200 },
]

export const platformStatistics = {
  provinces: 25,
  trips: '1.2M+',
  passengers: '850K+',
  companies: 48,
}
