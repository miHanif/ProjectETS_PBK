<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AppSidebar from '../components/common/AppSidebar.vue'
import AppTopbar from '../components/common/AppTopbar.vue'
import { BUSINESS_NAME } from '../constants/business.js'
import { ROUTE_PATHS } from '../constants/routes.js'
import { USER_ROLES } from '../constants/roles.js'
import { useAuthStore } from '../stores/auth.js'

const authStore = useAuthStore()
const router = useRouter()

const ownerMenu = [
  { label: 'Dashboard', path: ROUTE_PATHS.DASHBOARD },
  { label: 'Produk', path: ROUTE_PATHS.PRODUCTS },
  { label: 'Kategori', path: ROUTE_PATHS.CATEGORIES },
  { label: 'Transaksi Baru', path: ROUTE_PATHS.TRANSACTION_CREATE },
  { label: 'Riwayat Transaksi', path: ROUTE_PATHS.TRANSACTION_HISTORY },
  { label: 'Barang Masuk', path: ROUTE_PATHS.RESTOCK },
  { label: 'Laporan', path: ROUTE_PATHS.REPORTS },
  { label: 'Kelola Akun', path: ROUTE_PATHS.ACCOUNTS },
]

const assistantMenu = [
  { label: 'Produk', path: ROUTE_PATHS.PRODUCTS },
  { label: 'Transaksi Baru', path: ROUTE_PATHS.TRANSACTION_CREATE },
  { label: 'Riwayat Transaksi', path: ROUTE_PATHS.TRANSACTION_HISTORY },
]

const menuItems = computed(() =>
  authStore.session?.role === USER_ROLES.OWNER ? ownerMenu : assistantMenu,
)

async function logout() {
  authStore.logout()
  await router.replace(ROUTE_PATHS.LOGIN)
}
</script>

<template>
  <div class="main-layout">
    <AppSidebar
      :items="menuItems"
      heading="Menu"
      navigation-label="Navigasi utama"
    />
    <div class="main-content">
      <AppTopbar
        :brand-name="BUSINESS_NAME"
        :user-name="authStore.session?.nama ?? ''"
        account-label="Masuk sebagai"
        logout-label="Keluar"
        @logout="logout"
      />
      <main class="page-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>
