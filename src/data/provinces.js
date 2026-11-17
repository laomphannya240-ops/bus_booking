/**
 * All 25 provinces and capital cities of Cambodia, in English and Khmer.
 * This is the single source of truth for the frontend; the future backend
 * endpoint GET /api/provinces can replace it without touching components.
 */
export const provinces = [
  { id: 1, code: 'PP', en: 'Phnom Penh', km: 'ភ្នំពេញ' },
  { id: 2, code: 'BM', en: 'Banteay Meanchey', km: 'បន្ទាយមានជ័យ' },
  { id: 3, code: 'BB', en: 'Battambang', km: 'បាត់ដំបង' },
  { id: 4, code: 'KC', en: 'Kampong Cham', km: 'កំពង់ចាម' },
  { id: 5, code: 'KCH', en: 'Kampong Chhnang', km: 'កំពង់ឆ្នាំង' },
  { id: 6, code: 'KSP', en: 'Kampong Speu', km: 'កំពង់ស្ពឺ' },
  { id: 7, code: 'KT', en: 'Kampong Thom', km: 'កំពង់ធំ' },
  { id: 8, code: 'KPT', en: 'Kampot', km: 'កំពត' },
  { id: 9, code: 'KD', en: 'Kandal', km: 'កណ្តាល' },
  { id: 10, code: 'KEP', en: 'Kep', km: 'កែប' },
  { id: 11, code: 'KK', en: 'Koh Kong', km: 'កោះកុង' },
  { id: 12, code: 'KR', en: 'Kratie', km: 'ក្រចេះ' },
  { id: 13, code: 'MD', en: 'Mondulkiri', km: 'មណ្ឌលគិរី' },
  { id: 14, code: 'OM', en: 'Oddar Meanchey', km: 'ឧត្តរមានជ័យ' },
  { id: 15, code: 'PL', en: 'Pailin', km: 'ប៉ៃលិន' },
  { id: 16, code: 'SH', en: 'Preah Sihanouk', km: 'ព្រះសីហនុ' },
  { id: 17, code: 'PV', en: 'Preah Vihear', km: 'ព្រះវិហារ' },
  { id: 18, code: 'PS', en: 'Pursat', km: 'ពោធិ៍សាត់' },
  { id: 19, code: 'PVG', en: 'Prey Veng', km: 'ព្រៃវែង' },
  { id: 20, code: 'RK', en: 'Ratanakiri', km: 'រតនគិរី' },
  { id: 21, code: 'SR', en: 'Siem Reap', km: 'សៀមរាប' },
  { id: 22, code: 'ST', en: 'Stung Treng', km: 'ស្ទឹងត្រែង' },
  { id: 23, code: 'SV', en: 'Svay Rieng', km: 'ស្វាយរៀង' },
  { id: 24, code: 'TK', en: 'Takeo', km: 'តាកែវ' },
  { id: 25, code: 'TKC', en: 'Tboung Khmum', km: 'ត្បូងឃ្មុំ' },
]

export const POPULAR_PROVINCE_IDS = [21, 16, 3, 8, 11, 24]

export const getProvince = (id) => provinces.find((province) => province.id === Number(id))

export const provinceName = (id, language = 'km') => {
  const province = getProvince(id)
  if (!province) return '—'
  return province[language] || province.en
}

export const provinceOptions = (language = 'km') =>
  provinces.map((province) => ({
    value: province.id,
    label: province[language] || province.en,
    en: province.en,
  }))
