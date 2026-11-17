import { provinces } from './provinces'

const namedStations = [
  { id: 'st-001', provinceId: 1, en: 'Psar Leantueng Bus Station', km: 'ស្ថានីយ៍ឡានក្រុងផ្សារឡើងត្បូង' },
  { id: 'st-002', provinceId: 1, en: 'Chroy Changvar Terminal', km: 'ស្ថានីយ៍ច្រៃចំការង្វាន់' },
  { id: 'st-003', provinceId: 1, en: 'Koh Pich Bus Terminal', km: 'ស្ថានីយ៍ឡានក្រុងកោះពេជ្រ' },
  { id: 'st-004', provinceId: 21, en: 'Siem Reap Central Bus Station', km: 'ស្ថានីយ៍ឡានក្រុងកណ្តាលសៀមរាប' },
  { id: 'st-005', provinceId: 21, en: 'Angkor Volunteer Terminal', km: 'ស្ថានីយ៍អង្គរស្ម័គ្រចិត្ត' },
  { id: 'st-006', provinceId: 16, en: 'Sihanoukville Bus Terminal', km: 'ស្ថានីយ៍ឡានក្រុងព្រះសីហនុ' },
  { id: 'st-007', provinceId: 16, en: 'Koh Kong Roundabout Stop', km: 'ចំណតរង្វង់មូលកោះកុង' },
  { id: 'st-008', provinceId: 3, en: 'Battambang Central Station', km: 'ស្ថានីយ៍កណ្តាលបាត់ដំបង' },
  { id: 'st-009', provinceId: 3, en: 'Sangkae Market Stop', km: 'ចំណតផ្សារសង្កែ' },
  { id: 'st-010', provinceId: 8, en: 'Kampot Bus Station', km: 'ស្ថានីយ៍ឡានក្រុងកំពត' },
  { id: 'st-011', provinceId: 8, en: 'Kep Beach Junction', km: 'ចំណតច្រកកែប' },
  { id: 'st-012', provinceId: 11, en: 'Koh Kong Bus Terminal', km: 'ស្ថានីយ៍ឡានក្រុងកោះកុង' },
  { id: 'st-013', provinceId: 2, en: 'Banteay Meanchey Terminal', km: 'ស្ថានីយ៍បន្ទាយមានជ័យ' },
  { id: 'st-014', provinceId: 4, en: 'Kampong Cham Central', km: 'ស្ថានីយ៍កណ្តាលកំពង់ចាម' },
  { id: 'st-015', provinceId: 5, en: 'Kampong Chhnang Station', km: 'ស្ថានីយ៍កំពង់ឆ្នាំង' },
  { id: 'st-016', provinceId: 6, en: 'Kampong Speu Station', km: 'ស្ថានីយ៍កំពង់ស្ពឺ' },
  { id: 'st-017', provinceId: 7, en: 'Kampong Thom Central', km: 'ស្ថានីយ៍កណ្តាលកំពង់ធំ' },
  { id: 'st-018', provinceId: 9, en: 'Kandal Bus Stop', km: 'ចំណតឡានក្រុងកណ្តាល' },
  { id: 'st-019', provinceId: 10, en: 'Kep Bus Station', km: 'ស្ថានីយ៍ឡានក្រុងកែប' },
  { id: 'st-020', provinceId: 12, en: 'Kratie Bus Station', km: 'ស្ថានីយ៍ឡានក្រុងក្រចេះ' },
  { id: 'st-021', provinceId: 13, en: 'Mondulkiri Terminal', km: 'ស្ថានីយ៍មណ្ឌលគិរី' },
  { id: 'st-022', provinceId: 14, en: 'Oddar Meanchey Station', km: 'ស្ថានីយ៍ឧត្តរមានជ័យ' },
  { id: 'st-023', provinceId: 15, en: 'Pailin Bus Station', km: 'ស្ថានីយ៍ឡានក្រុងប៉ៃលិន' },
  { id: 'st-024', provinceId: 17, en: 'Preah Vihear Station', km: 'ស្ថានីយ៍ព្រះវិហារ' },
  { id: 'st-025', provinceId: 18, en: 'Pursat Bus Station', km: 'ស្ថានីយ៍ឡានក្រុងពោធិ៍សាត់' },
  { id: 'st-026', provinceId: 19, en: 'Prey Veng Station', km: 'ស្ថានីយ៍ព្រៃវែង' },
  { id: 'st-027', provinceId: 20, en: 'Ratanakiri Terminal', km: 'ស្ថានីយ៍រតនគិរី' },
  { id: 'st-028', provinceId: 22, en: 'Stung Treng Station', km: 'ស្ថានីយ៍ស្ទឹងត្រែង' },
  { id: 'st-029', provinceId: 23, en: 'Svay Rieng Station', km: 'ស្ថានីយ៍ស្វាយរៀង' },
  { id: 'st-030', provinceId: 24, en: 'Takeo Bus Station', km: 'ស្ថានីយ៍ឡានក្រុងតាកែវ' },
  { id: 'st-031', provinceId: 25, en: 'Tboung Khmum Station', km: 'ស្ថានីយ៍ត្បូងឃ្មុំ' },
]

export const stations = namedStations.map((station) => ({
  ...station,
  name: { en: station.en, km: station.km },
  address: {
    en: `${station.en}, ${provinces.find((item) => item.id === station.provinceId)?.en || ''}`,
    km: `${station.km}, ${provinces.find((item) => item.id === station.provinceId)?.km || ''}`,
  },
}))

export const getStation = (id, list = stations) => list.find((station) => station.id === id)

export const stationsByProvince = (provinceId, list = stations) =>
  list.filter((station) => station.provinceId === Number(provinceId))

export const stationName = (id, language = 'km', list = stations) => {
  const station = getStation(id, list)
  if (!station) return '—'
  return station.name[language] || station.name.en
}
