import { USER_ROLES } from './roles.js'

export const ROUTE_PATHS = Object.freeze({
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PRODUCTS: '/produk',
  CATEGORIES: '/kategori',
  TRANSACTION_CREATE: '/transaksi/baru',
  TRANSACTION_HISTORY: '/transaksi',
  RESTOCK: '/restock',
  REPORTS: '/laporan',
  ACCOUNTS: '/akun',
  FORBIDDEN: '/403',
})

export const ROLE_HOME_PATHS = Object.freeze({
  [USER_ROLES.OWNER]: ROUTE_PATHS.DASHBOARD,
  [USER_ROLES.ASSISTANT]: ROUTE_PATHS.TRANSACTION_CREATE,
})
