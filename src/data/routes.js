import { provinceName } from './provinces'

const distanceFromPhnomPenh = {
  2: 350, 3: 290, 4: 175, 5: 60, 6: 45, 7: 145, 8: 250, 9: 30, 10: 260,
  11: 210, 12: 500, 13: 760, 14: 650, 15: 370, 16: 230, 17: 330, 18: 200,
  19: 120, 20: 780, 21: 320, 22: 640, 23: 220, 24: 90, 25: 130,
}

const extraRoutes = [
  { from: 21, to: 3, distance: 290 },
  { from: 3, to: 15, distance: 100 },
  { from: 21, to: 17, distance: 155 },
  { from: 16, to: 8, distance: 95 },
  { from: 8, to: 10, distance: 25 },
  { from: 4, to: 25, distance: 95 },
  { from: 12, to: 22, distance: 180 },
  { from: 2, to: 14, distance: 135 },
  { from: 21, to: 1, distance: 320 },
  { from: 16, to: 1, distance: 230 },
  { from: 3, to: 1, distance: 290 },
  { from: 8, to: 1, distance: 250 },
  { from: 11, to: 1, distance: 210 },
]

const popularDestinations = [21, 16, 3, 8, 11, 24]

const buildRoute = (from, to, distance, index) => ({
  id: `rt-${String(index + 1).padStart(3, '0')}`,
  fromProvinceId: from,
  toProvinceId: to,
  distanceKm: distance,
  durationMinutes: Math.max(45, Math.round((distance / 65) * 60 / 15) * 15 + 15),
  basePrice: Math.round(distance * 0.045 + 2),
  popular: to === 1 || popularDestinations.includes(to),
  status: 'ACTIVE',
})

const definitions = [
  ...Object.entries(distanceFromPhnomPenh).map(([to, distance]) => ({
    from: 1,
    to: Number(to),
    distance,
  })),
  ...extraRoutes,
]

export const routes = definitions.map((route, index) =>
  buildRoute(route.from, route.to, route.distance, index),
)

export const getRoute = (id, list = routes) => list.find((route) => route.id === id)

export const findRoute = (fromProvinceId, toProvinceId, list = routes) =>
  list.find(
    (route) =>
      Number(route.fromProvinceId) === Number(fromProvinceId) &&
      Number(route.toProvinceId) === Number(toProvinceId) &&
      route.status !== 'INACTIVE',
  )

export const routeLabel = (route, language = 'km') =>
  `${provinceName(route.fromProvinceId, language)} → ${provinceName(route.toProvinceId, language)}`
