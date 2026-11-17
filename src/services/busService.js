import api, { isMockMode } from './api'
import { provinces } from '../data/provinces'
import { stations } from '../data/stations'
import { companies } from '../data/companies'
import { buses } from '../data/buses'
import { routes } from '../data/routes'
import { schedules, searchSchedules as searchLocalSchedules, getSchedule } from '../data/schedules'
import { generateBookedSeats } from '../utils/seats'
import { createId } from '../utils/format'

const get = async (path, fallback) => {
  if (isMockMode) return fallback
  const { data } = await api.get(path)
  return data
}

const write = async (path, payload, method = 'post') => {
  if (isMockMode) return { ...payload, id: payload.id || createId('new') }
  const { data } = await api[method](path, payload)
  return data
}

export const busService = {
  getProvinces: () => get('/provinces', provinces),
  getStations: () => get('/stations', stations),
  getCompanies: () => get('/companies', companies),
  getBuses: () => get('/buses', buses),
  getRoutes: () => get('/routes', routes),
  getSchedules: () => get('/schedules', schedules),

  searchSchedules: async (params) => {
    if (isMockMode) return searchLocalSchedules(params)
    const { data } = await api.get('/schedules', { params })
    return data
  },

  getSchedule: async (id) => {
    if (isMockMode) return getSchedule(id)
    const { data } = await api.get(`/schedules/${id}`)
    return data
  },

  /** GET /api/schedules/{id}/seats */
  getSeats: async (scheduleId) => {
    if (isMockMode) {
      const schedule = getSchedule(scheduleId)
      if (!schedule) return []
      return generateBookedSeats(scheduleId, schedule.capacity)
    }
    const { data } = await api.get(`/schedules/${scheduleId}/seats`)
    return data
  },

  createCompany: (payload) => write('/companies', payload),
  updateCompany: (id, payload) => write(`/companies/${id}`, payload, 'patch'),
  deleteCompany: (id) => (isMockMode ? { id } : api.delete(`/companies/${id}`).then(() => ({ id }))),

  createBus: (payload) => write('/buses', payload),
  updateBus: (id, payload) => write(`/buses/${id}`, payload, 'patch'),
  deleteBus: (id) => (isMockMode ? { id } : api.delete(`/buses/${id}`).then(() => ({ id }))),

  createStation: (payload) => write('/stations', payload),
  updateStation: (id, payload) => write(`/stations/${id}`, payload, 'patch'),
  deleteStation: (id) => (isMockMode ? { id } : api.delete(`/stations/${id}`).then(() => ({ id }))),

  createRoute: (payload) => write('/routes', payload),
  updateRoute: (id, payload) => write(`/routes/${id}`, payload, 'patch'),
  deleteRoute: (id) => (isMockMode ? { id } : api.delete(`/routes/${id}`).then(() => ({ id }))),

  createSchedule: (payload) => write('/schedules', payload),
  updateSchedule: (id, payload) => write(`/schedules/${id}`, payload, 'patch'),
  deleteSchedule: (id) => (isMockMode ? { id } : api.delete(`/schedules/${id}`).then(() => ({ id }))),
}
