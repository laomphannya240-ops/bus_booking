import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useApp } from './AppContext'
import { busService } from '../services/busService'
import { bookingService } from '../services/bookingService'
import { paymentService } from '../services/paymentService'
import { companies as seedCompanies } from '../data/companies'
import { buses as seedBuses } from '../data/buses'
import { stations as seedStations } from '../data/stations'
import { routes as seedRoutes } from '../data/routes'
import { schedules as seedSchedules } from '../data/schedules'
import { bookings as seedBookings } from '../data/bookings'
import { allCustomers } from '../data/users'
import { BOOKING_STATUS, PAYMENT_STATUS } from '../constants'

const DataContext = createContext(null)

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData must be used inside DataProvider')
  return context
}

function useCrudCollection(initialItems, service, label) {
  const [items, setItems] = useState(initialItems)
  const { toast } = useApp()

  const add = useCallback(
    async (payload) => {
      const created = await service.create(payload)
      setItems((current) => [created, ...current])
      toast.success(`${label} created`)
      return created
    },
    [service, label, toast],
  )

  const update = useCallback(
    async (id, payload) => {
      const updated = await service.update(id, payload)
      setItems((current) => current.map((item) => (item.id === id ? { ...item, ...updated } : item)))
      toast.success(`${label} updated`)
      return updated
    },
    [service, label, toast],
  )

  const remove = useCallback(
    async (id) => {
      await service.remove(id)
      setItems((current) => current.filter((item) => item.id !== id))
      toast.success(`${label} deleted`)
    },
    [service, label, toast],
  )

  return { items, setItems, add, update, remove }
}

const collectionService = (create, update, remove) => ({ create, update, remove })

export const DataProvider = ({ children }) => {
  const { toast } = useApp()
  const [payments, setPayments] = useState(() =>
    seedBookings
      .filter((booking) => booking.paymentReference)
      .map((booking) => ({
        id: `pay-${booking.id}`,
        reference: booking.paymentReference,
        bookingReference: booking.reference,
        amount: booking.amount,
        status: booking.paymentStatus,
        method: 'KHQR',
        createdAt: booking.createdAt,
      })),
  )
  const [customers, setCustomers] = useState(allCustomers)

  const companyCollection = useCrudCollection(
    seedCompanies,
    collectionService(busService.createCompany, busService.updateCompany, busService.deleteCompany),
    'Company',
  )
  const busCollection = useCrudCollection(
    seedBuses,
    collectionService(busService.createBus, busService.updateBus, busService.deleteBus),
    'Bus',
  )
  const stationCollection = useCrudCollection(
    seedStations,
    collectionService(busService.createStation, busService.updateStation, busService.deleteStation),
    'Station',
  )
  const routeCollection = useCrudCollection(
    seedRoutes,
    collectionService(busService.createRoute, busService.updateRoute, busService.deleteRoute),
    'Route',
  )
  const scheduleCollection = useCrudCollection(
    seedSchedules,
    collectionService(busService.createSchedule, busService.updateSchedule, busService.deleteSchedule),
    'Schedule',
  )
  const [bookings, setBookings] = useState(seedBookings)

  const addBooking = useCallback(
    async (payload) => {
      const created = await bookingService.createBooking(payload)
      setBookings((current) => [created, ...current])
      return created
    },
    [],
  )

  const updateBooking = useCallback((id, updates) => {
    setBookings((current) => current.map((booking) => (booking.id === id ? { ...booking, ...updates } : booking)))
  }, [])

  const cancelBooking = useCallback(
    async (id) => {
      const result = await bookingService.cancelBooking(id)
      updateBooking(id, { ...result, status: BOOKING_STATUS.CANCELLED })
      toast.info('Booking cancelled')
      return result
    },
    [toast, updateBooking],
  )

  const confirmBooking = useCallback(
    async (id) => {
      const result = await bookingService.confirmBooking(id)
      updateBooking(id, { ...result, status: BOOKING_STATUS.CONFIRMED })
      toast.success('Booking confirmed')
      return result
    },
    [toast, updateBooking],
  )

  const addPayment = useCallback(async (payload) => {
    const created = await paymentService.createPayment(payload)
    setPayments((current) => [created, ...current])
    return created
  }, [])

  const updatePayment = useCallback((id, updates) => {
    setPayments((current) => current.map((payment) => (payment.id === id ? { ...payment, ...updates } : payment)))
  }, [])

  const verifyPayment = useCallback(
    async (id) => {
      await paymentService.verifyPayment(id)
      updatePayment(id, { status: PAYMENT_STATUS.VERIFIED })
      toast.success('Payment verified')
    },
    [toast, updatePayment],
  )

  const toggleCustomerStatus = useCallback(
    (id) => {
      setCustomers((current) =>
        current.map((customer) =>
          customer.id === id
            ? { ...customer, status: customer.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
            : customer,
        ),
      )
      toast.success('Customer status updated')
    },
    [toast],
  )

  const value = useMemo(
    () => ({
      companies: companyCollection.items,
      companyActions: { add: companyCollection.add, update: companyCollection.update, remove: companyCollection.remove },
      buses: busCollection.items,
      busActions: { add: busCollection.add, update: busCollection.update, remove: busCollection.remove },
      stations: stationCollection.items,
      stationActions: { add: stationCollection.add, update: stationCollection.update, remove: stationCollection.remove },
      routes: routeCollection.items,
      routeActions: { add: routeCollection.add, update: routeCollection.update, remove: routeCollection.remove },
      schedules: scheduleCollection.items,
      scheduleActions: { add: scheduleCollection.add, update: scheduleCollection.update, remove: scheduleCollection.remove },
      bookings,
      setBookings,
      addBooking,
      updateBooking,
      cancelBooking,
      confirmBooking,
      payments,
      addPayment,
      updatePayment,
      verifyPayment,
      customers,
      setCustomers,
      toggleCustomerStatus,
    }),
    [
      companyCollection, busCollection, stationCollection, routeCollection, scheduleCollection,
      bookings, addBooking, updateBooking, cancelBooking, confirmBooking,
      payments, addPayment, updatePayment, verifyPayment, customers, toggleCustomerStatus,
    ],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
