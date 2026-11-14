import { createRouter, createWebHistory } from 'vue-router'
import { ROLE_HOME_PATHS, ROUTE_PATHS } from '../constants/routes.js'
import { USER_ROLES } from '../constants/roles.js'
import { useAuthStore } from '../stores/auth.js'
import MainLayout from '../layouts/MainLayout.vue'
import CategoryView from '../views/CategoryView.vue'
import DashboardView from '../views/DashboardView.vue'
import ForbiddenView from '../views/ForbiddenView.vue'
import LoginView from '../views/LoginView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import ProductListView from '../views/ProductListView.vue'
import ReportView from '../views/ReportView.vue'
import RestockView from '../views/RestockView.vue'
import TransactionCreateView from '../views/TransactionCreateView.vue'
import TransactionHistoryView from '../views/TransactionHistoryView.vue'
import UserManagementView from '../views/UserManagementView.vue'
import KomponenDemoView from '../views/KomponenDemoView.vue'

const ownerOnly = [USER_ROLES.OWNER]
const ownerAndAssistant = [USER_ROLES.OWNER, USER_ROLES.ASSISTANT]

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: ROUTE_PATHS.LOGIN,
      name: 'login',
      component: LoginView,
      meta: { public: true },
    },
    {
      path: ROUTE_PATHS.FORBIDDEN,
      name: 'forbidden',
      component: ForbiddenView,
      meta: { public: true },
    },
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          redirect: () => {
            const { session } = useAuthStore()
            return session
              ? ROLE_HOME_PATHS[session.role] ?? ROUTE_PATHS.LOGIN
              : ROUTE_PATHS.LOGIN
          },
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: DashboardView,
          meta: { roles: ownerOnly },
        },
        {
          path: 'produk',
          name: 'products',
          component: ProductListView,
          meta: { roles: ownerAndAssistant },
        },
        {
          path: 'kategori',
          name: 'categories',
          component: CategoryView,
          meta: { roles: ownerOnly },
        },
        {
          path: 'transaksi/baru',
          name: 'transaction-create',
          component: TransactionCreateView,
          meta: { roles: ownerAndAssistant },
        },
        {
          path: 'transaksi',
          name: 'transaction-history',
          component: TransactionHistoryView,
          meta: { roles: ownerOnly },
        },
        {
          path: 'restock',
          name: 'restock',
          component: RestockView,
          meta: { roles: ownerOnly },
        },
        {
          path: 'laporan',
          name: 'reports',
          component: ReportView,
          meta: { roles: ownerOnly },
        },
        {
          path: 'akun',
          name: 'accounts',
          component: UserManagementView,
          meta: { roles: ownerOnly },
        },
        {
          path: 'komponen',
          name: 'komponen-demo',
          component: KomponenDemoView,
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: { public: true },
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.name === 'login' && authStore.session) {
    return ROLE_HOME_PATHS[authStore.session.role] ?? ROUTE_PATHS.LOGIN
  }

  if (to.meta.public) {
    return true
  }

  if (!authStore.session) {
    return ROUTE_PATHS.LOGIN
  }

  if (to.meta.roles && !to.meta.roles.includes(authStore.session.role)) {
    return ROUTE_PATHS.FORBIDDEN
  }

  return true
})

export default router
