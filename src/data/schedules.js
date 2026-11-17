import { buses } from './buses'
import { routes } from './routes'
import { addDays, addMinutesToTime } from '../utils/date'
import { generateBookedSeats } from '../utils/seats'

const timeSlots = [
  { dayOffset: 0, time: '06:30', priceOffset: 0 },
  { dayOffset: 0, time: '13:30', priceOffset: 2 },
  { dayOffset: 1, time: '07:00', priceOffset: 0 },
  { dayOffset: 1, time: '20:00', priceOffset: 5 },
  { dayOffset: 2, time: '08:15', priceOffset: 3 },
  { dayOffset: 3, time: '14:45', priceOffset: 1 },
]

const activeBuses = buses.filter((bus) => bus.status === 'ACTIVE')

export const schedules = routes.flatMap((route, routeIndex) =>
  timeSlots.map((slot, slotIndex) => {
    const bus = activeBuses[(routeIndex * 3 + slotIndex) % activeBuses.length]
    const id = `sch-${String(routeIndex + 1).padStart(2, '0')}-${slotIndex + 1}`
    const bookedSeats = generateBookedSeats(id, bus.capacity)
    return {
      id,
      routeId: route.id,
      busId: bus.id,
      companyId: bus.companyId,
      date: addDays(slot.dayOffset),
      departureTime: slot.time,
      arrivalTime: addMinutesToTime(slot.time, route.durationMinutes),
      price: route.basePrice + slot.priceOffset,
      capacity: bus.capacity,
      bookedSeats,
      availableSeats: bus.capacity - bookedSeats.length,
      status: 'ACTIVE',
    }
  }),
)

export const getSchedule = (id, list = schedules) => list.find((schedule) => schedule.id === id)

export const searchSchedules = ({ from, to, date, passengers = 1 }, list = schedules) => {
  const matchingRouteIds = new Set(
    routes
      .filter(
        (route) =>
          Number(route.fromProvinceId) === Number(from) &&
          Number(route.toProvinceId) === Number(to) &&
          route.status !== 'INACTIVE',
      )
      .map((route) => route.id),
  )

  return list.filter(
    (schedule) =>
      matchingRouteIds.has(schedule.routeId) &&
      (!date || schedule.date === date) &&
      schedule.status === 'ACTIVE' &&
      schedule.availableSeats >= Number(passengers || 1),
  )
}

export const schedulesForCompany = (companyId, list = schedules) =>
  list.filter((schedule) => schedule.companyId === companyId)
