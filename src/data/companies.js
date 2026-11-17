/**
 * Demo bus companies. `logo` values are brand colours used by the local
 * CompanyLogo component — no remote logo requests are made.
 */
export const companies = [
  {
    id: 'cmp-01',
    name: { en: 'Giant Ibis Transport', km: 'ចាន់ថ្ម ត្រានស្ប៉ូត' },
    short: 'GI',
    logo: '#1d4ed8',
    accent: '#60a5fa',
    rating: 4.8,
    trips: 128,
    founded: 2009,
    phone: '+855 23 999 101',
    email: 'info@giantibis.demo',
  },
  {
    id: 'cmp-02',
    name: { en: 'Sorya Transport', km: 'សូរិយា ត្រានស្ប៉ូត' },
    short: 'ST',
    logo: '#0f766e',
    accent: '#5eead4',
    rating: 4.7,
    trips: 112,
    founded: 2002,
    phone: '+855 23 999 202',
    email: 'info@sorya.demo',
  },
  {
    id: 'cmp-03',
    name: { en: 'Mekong Express', km: 'មេគង្គ អិចស្ព្រេស' },
    short: 'ME',
    logo: '#b45309',
    accent: '#fbbf24',
    rating: 4.6,
    trips: 96,
    founded: 2005,
    phone: '+855 23 999 303',
    email: 'info@mekongexpress.demo',
  },
  {
    id: 'cmp-04',
    name: { en: 'Paramount Angkor Express', km: 'ប៉ារ៉ាម៉ៅន អង្គរ អិចស្ព្រេស' },
    short: 'PA',
    logo: '#7c3aed',
    accent: '#c4b5fd',
    rating: 4.5,
    trips: 84,
    founded: 2011,
    phone: '+855 23 999 404',
    email: 'info@paramount.demo',
  },
  {
    id: 'cmp-05',
    name: { en: 'Lapita Express', km: 'ឡាបីតា អិចស្ព្រេស' },
    short: 'LE',
    logo: '#be123c',
    accent: '#fda4af',
    rating: 4.4,
    trips: 76,
    founded: 2013,
    phone: '+855 23 999 505',
    email: 'info@lapita.demo',
  },
  {
    id: 'cmp-06',
    name: { en: 'Koh Kong Express', km: 'កោះកុង អិចស្ព្រេស' },
    short: 'KK',
    logo: '#0369a1',
    accent: '#7dd3fc',
    rating: 4.3,
    trips: 65,
    founded: 2015,
    phone: '+855 23 999 606',
    email: 'info@kohkong.demo',
  },
  {
    id: 'cmp-07',
    name: { en: 'Angkor Cambodia Travel', km: 'អង្គរ កម្ពុជា ត្រាវែល' },
    short: 'AC',
    logo: '#4d7c0f',
    accent: '#a3e635',
    rating: 4.5,
    trips: 71,
    founded: 2008,
    phone: '+855 23 999 707',
    email: 'info@angkorch.demo',
  },
  {
    id: 'cmp-08',
    name: { en: 'Rith Mondala Transport', km: 'រិទ្ធិ មណ្ឌល ត្រានស្ប៉ូត' },
    short: 'RM',
    logo: '#4338ca',
    accent: '#a5b4fc',
    rating: 4.2,
    trips: 58,
    founded: 2016,
    phone: '+855 23 999 808',
    email: 'info@rithmondala.demo',
  },
]

export const getCompany = (id) => companies.find((company) => company.id === id)

export const companyName = (id, language = 'km') => {
  const company = getCompany(id)
  if (!company) return '—'
  return company.name[language] || company.name.en
}
