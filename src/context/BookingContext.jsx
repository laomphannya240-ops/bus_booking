import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { todayISO } from '../utils/date'

const BookingContext = createContext(null)

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) throw new Error('useBooking must be used inside BookingProvider')
  return context
}

const emptyContact = { fullName: '', phone: '', email: '' }

export const BookingProvider = ({ children }) => {
  const [search, setSearch] = useState({ from: 1, to: 21, date: todayISO(), passengers: 1 })
  const [schedule, setSchedule] = useState(null)
  const [seats, setSeats] = useState([])
  const [contact, setContact] = useState(emptyContact)
  const [passengers, setPassengers] = useState([])
  const [booking, setBooking] = useState(null)
  const [payment, setPayment] = useState(null)
  const [proof, setProof] = useState(null)

  const updateSearch = useCallback((patch) => {
    setSearch((current) => ({ ...current, ...patch }))
    setSchedule(null)
    setSeats([])
  }, [])

  const selectSchedule = useCallback((nextSchedule) => {
    setSchedule(nextSchedule)
    setSeats([])
  }, [])

  const toggleSeat = useCallback(
    (seat, max = 1) => {
      setSeats((current) => {
        if (current.includes(seat)) return current.filter((item) => item !== seat)
        if (current.length >= max) return current
        return [...current, seat]
      })
    },
    [],
  )

  const resetJourney = useCallback(() => {
    setSchedule(null)
    setSeats([])
    setContact(emptyContact)
    setPassengers([])
    setBooking(null)
    setPayment(null)
    setProof(null)
  }, [])

  const value = useMemo(
    () => ({
      search,
      setSearch,
      updateSearch,
      schedule,
      selectSchedule,
      seats,
      setSeats,
      toggleSeat,
      contact,
      setContact,
      passengers,
      setPassengers,
      booking,
      setBooking,
      payment,
      setPayment,
      proof,
      setProof,
      resetJourney,
    }),
    [
      search, updateSearch, schedule, selectSchedule, seats, toggleSeat, contact,
      passengers, booking, payment, proof, resetJourney,
    ],
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}
