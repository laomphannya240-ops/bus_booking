import { companies } from './companies'

const busDefinitions = [
  ['bus-01', 'cmp-01', 'VIP 609', 'VIP', 48, 'ACTIVE'],
  ['bus-02', 'cmp-01', 'Sleeper 312', 'Sleeper', 36, 'ACTIVE'],
  ['bus-03', 'cmp-02', 'Luxury 88', 'Luxury', 40, 'ACTIVE'],
  ['bus-04', 'cmp-02', 'VIP 205', 'VIP', 48, 'ACTIVE'],
  ['bus-05', 'cmp-03', 'Mekong Sleeper 71', 'Sleeper', 36, 'ACTIVE'],
  ['bus-06', 'cmp-03', 'Express 430', 'Standard', 52, 'ACTIVE'],
  ['bus-07', 'cmp-04', 'Angkor VIP 19', 'VIP', 44, 'ACTIVE'],
  ['bus-08', 'cmp-04', 'Luxury Sleeper 26', 'Sleeper', 34, 'ACTIVE'],
  ['bus-09', 'cmp-05', 'Lapita Luxury 52', 'Luxury', 42, 'ACTIVE'],
  ['bus-10', 'cmp-05', 'VIP 777', 'VIP', 48, 'ACTIVE'],
  ['bus-11', 'cmp-06', 'Coastal Express 14', 'Standard', 50, 'ACTIVE'],
  ['bus-12', 'cmp-06', 'Koh Kong VIP 33', 'VIP', 46, 'ACTIVE'],
  ['bus-13', 'cmp-07', 'Angkor Travel 45', 'Luxury', 40, 'ACTIVE'],
  ['bus-14', 'cmp-07', 'Sleeper 901', 'Sleeper', 36, 'ACTIVE'],
  ['bus-15', 'cmp-08', 'Mondala VIP 68', 'VIP', 48, 'ACTIVE'],
  ['bus-16', 'cmp-08', 'Mondala Express 27', 'Standard', 52, 'MAINTENANCE'],
]

const plateNumbers = ['AA 1234', 'BB 5678', 'CC 9012', 'DD 3456', 'EE 7890', 'FF 2468']

export const buses = busDefinitions.map(([id, companyId, name, type, capacity, status], index) => ({
  id,
  companyId,
  name,
  type,
  capacity,
  status,
  plate: plateNumbers[index % plateNumbers.length],
  amenities: index % 3 === 0
    ? ['wifi', 'ac', 'water', 'usb']
    : index % 3 === 1
      ? ['wifi', 'ac', 'blanket', 'usb']
      : ['ac', 'water', 'tv'],
  createdAt: '2025-01-15',
}))

export const getBus = (id, list = buses) => list.find((bus) => bus.id === id)

export const busesByCompany = (companyId, list = buses) =>
  list.filter((bus) => bus.companyId === companyId)

export const typeColor = (type) => {
  switch (type) {
    case 'VIP':
      return 'bg-brand-50 text-brand-700 ring-brand-200 dark:bg-brand-900/40 dark:text-brand-200 dark:ring-brand-700'
    case 'Sleeper':
      return 'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-900/40 dark:text-violet-200 dark:ring-violet-700'
    case 'Luxury':
      return 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:ring-amber-700'
    default:
      return 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-700/40 dark:text-slate-200 dark:ring-slate-600'
  }
}

export const companyForBus = (busId, list = buses) =>
  companies.find((company) => company.id === getBus(busId, list)?.companyId)
