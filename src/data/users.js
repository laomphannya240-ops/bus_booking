import { ROLES } from '../constants'

export const demoUsers = [
  {
    id: 'usr-admin',
    name: { en: 'Sophea Chan', km: 'ចាន់ សុភ័ក្ត្រ' },
    email: 'admin@cambodiabus.demo',
    password: 'demo1234',
    role: ROLES.ADMIN,
    phone: '+855 12 345 678',
    status: 'ACTIVE',
    companyId: null,
    joinedAt: '2025-02-10',
    color: '#1d4ed8',
  },
  {
    id: 'usr-company',
    name: { en: 'Dara Meas', km: 'មាស ដារ៉ា' },
    email: 'company@cambodiabus.demo',
    password: 'demo1234',
    role: ROLES.COMPANY,
    phone: '+855 12 555 901',
    status: 'ACTIVE',
    companyId: 'cmp-01',
    joinedAt: '2025-04-18',
    color: '#0f766e',
  },
  {
    id: 'usr-customer',
    name: { en: 'Rith Piseth', km: 'រិទ្ធ ពិសិដ្ឋ' },
    email: 'customer@cambodiabus.demo',
    password: 'demo1234',
    role: ROLES.CUSTOMER,
    phone: '+855 12 777 321',
    status: 'ACTIVE',
    companyId: null,
    joinedAt: '2025-08-02',
    color: '#b45309',
  },
]

export const extraCustomers = [
  ['usr-cust-01', 'Sokha Thoeun', 'sokha@demo.kh', '+855 12 111 222', 'ACTIVE'],
  ['usr-cust-02', 'Chanthy Nim', 'chanthy@demo.kh', '+855 12 333 444', 'ACTIVE'],
  ['usr-cust-03', 'Vicheka Pich', 'vicheka@demo.kh', '+855 12 555 666', 'ACTIVE'],
  ['usr-cust-04', 'Sovannara Khuon', 'sovannara@demo.kh', '+855 12 777 888', 'INACTIVE'],
  ['usr-cust-05', 'Montha Chea', 'montha@demo.kh', '+855 12 999 000', 'ACTIVE'],
  ['usr-cust-06', 'Panha Soeung', 'panha@demo.kh', '+855 10 222 333', 'ACTIVE'],
  ['usr-cust-07', 'Thida Ros', 'thida@demo.kh', '+855 10 444 555', 'ACTIVE'],
  ['usr-cust-08', 'Kakada Ly', 'kakada@demo.kh', '+855 10 666 777', 'INACTIVE'],
  ['usr-cust-09', 'Bunthoeun San', 'bunthoeun@demo.kh', '+855 10 888 999', 'ACTIVE'],
  ['usr-cust-10', 'Rathanak Ouk', 'rathanak@demo.kh', '+855 11 222 333', 'ACTIVE'],
].map(([id, name, email, phone, status], index) => ({
  id,
  name: { en: name, km: name },
  email,
  phone,
  role: ROLES.CUSTOMER,
  status,
  joinedAt: `2026-0${(index % 9) + 1}-12`,
  color: ['#2563eb', '#0f766e', '#b45309', '#7c3aed', '#be123c'][index % 5],
}))

export const allCustomers = [demoUsers.find((user) => user.role === ROLES.CUSTOMER), ...extraCustomers]

export const findDemoUserByEmail = (email) =>
  demoUsers.find((user) => user.email.toLowerCase() === String(email || '').toLowerCase())
