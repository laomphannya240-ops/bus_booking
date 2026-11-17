import { Navigate, Outlet, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { ROLES } from '../constants'
import { useApp } from '../context/AppContext'

import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import AdminLayout from '../layouts/AdminLayout'
import CompanyLayout from '../layouts/CompanyLayout'

import HomePage from '../pages/customer/HomePage'
import SearchResultsPage from '../pages/customer/SearchResultsPage'
import SeatSelectionPage from '../pages/customer/SeatSelectionPage'
import BookingInfoPage from '../pages/customer/BookingInfoPage'
import PaymentPage from '../pages/customer/PaymentPage'
import BookingSuccessPage from '../pages/customer/BookingSuccessPage'
import MyBookingsPage from '../pages/customer/MyBookingsPage'
import BookingDetailsPage from '../pages/customer/BookingDetailsPage'
import CancelBookingPage from '../pages/customer/CancelBookingPage'
import ProfilePage from '../pages/customer/ProfilePage'

import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'

import AdminDashboardPage from '../pages/admin/DashboardPage'
import CompaniesPage from '../pages/admin/CompaniesPage'
import AdminBusesPage from '../pages/admin/BusesPage'
import StationsPage from '../pages/admin/StationsPage'
import RoutesPage from '../pages/admin/RoutesPage'
import AdminSchedulesPage from '../pages/admin/SchedulesPage'
import AdminBookingsPage from '../pages/admin/BookingsPage'
import PaymentsPage from '../pages/admin/PaymentsPage'
import CustomersPage from '../pages/admin/CustomersPage'
import ReportsPage from '../pages/admin/ReportsPage'
import SettingsPage from '../pages/admin/SettingsPage'

import CompanyDashboardPage from '../pages/company/CompanyDashboardPage'
import CompanyBusesPage from '../pages/company/CompanyBusesPage'
import CompanySchedulesPage from '../pages/company/CompanySchedulesPage'
import CompanyBookingsPage from '../pages/company/CompanyBookingsPage'
import CompanyRevenuePage from '../pages/company/CompanyRevenuePage'

import NotFoundPage from '../pages/errors/NotFoundPage'
import ForbiddenPage from '../pages/errors/ForbiddenPage'

/**
 * Frontend-only route guard. It controls which screens are reachable in the
 * demo; real authorization must still be enforced by the Laravel backend.
 */
function RequireAuth({ allowedRoles }) {
  const { user } = useApp()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />
  }

  return <Outlet />
}

function LegacySuccessRedirect() {
  const { bookingId } = useParams()
  return <Navigate to={`/booking/success/${bookingId}`} replace />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchResultsPage />} />

        <Route path="seats" element={<Navigate to="/search" replace />} />
        <Route path="seats/:scheduleId" element={<SeatSelectionPage />} />
        <Route path="booking/info" element={<BookingInfoPage />} />
        <Route path="booking/payment" element={<PaymentPage />} />
        <Route path="booking/success/:bookingId" element={<BookingSuccessPage />} />
        <Route path="booking-success/:bookingId" element={<LegacySuccessRedirect />} />
        <Route path="payment" element={<Navigate to="/booking/payment" replace />} />

        <Route element={<RequireAuth />}>
          <Route path="my-bookings" element={<MyBookingsPage />} />
          <Route path="my-bookings/:bookingId" element={<BookingDetailsPage />} />
          <Route path="cancel-booking/:bookingId" element={<CancelBookingPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="forbidden" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN]} />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="companies" element={<CompaniesPage />} />
          <Route path="buses" element={<AdminBusesPage />} />
          <Route path="stations" element={<StationsPage />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="schedules" element={<AdminSchedulesPage />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route element={<RequireAuth allowedRoles={[ROLES.COMPANY]} />}>
        <Route path="company" element={<CompanyLayout />}>
          <Route index element={<CompanyDashboardPage />} />
          <Route path="buses" element={<CompanyBusesPage />} />
          <Route path="schedules" element={<CompanySchedulesPage />} />
          <Route path="bookings" element={<CompanyBookingsPage />} />
          <Route path="revenue" element={<CompanyRevenuePage />} />
        </Route>
      </Route>
    </Routes>
  )
}
