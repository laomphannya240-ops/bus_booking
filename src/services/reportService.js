import api, { isMockMode } from './api'
import {
  monthlyRevenue,
  dailyRevenue,
  bookingStatusData,
  popularRouteData,
  topCompanyData,
  platformStatistics,
} from '../data/dashboard'

export const reportService = {
  getMonthlyRevenue: () => (isMockMode ? monthlyRevenue : api.get('/reports/monthly').then((r) => r.data)),
  getDailyRevenue: () => (isMockMode ? dailyRevenue : api.get('/reports/daily').then((r) => r.data)),
  getBookingStats: () => (isMockMode ? bookingStatusData : api.get('/reports/bookings').then((r) => r.data)),
  getPopularRoutes: () => (isMockMode ? popularRouteData : api.get('/reports/routes').then((r) => r.data)),
  getTopCompanies: () => (isMockMode ? topCompanyData : api.get('/reports/companies').then((r) => r.data)),
  getStatistics: () => platformStatistics,
}
