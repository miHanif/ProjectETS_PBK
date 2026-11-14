import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import { useUsersStore } from './stores/users.js'
import { useCategoriesStore } from './stores/categories.js'
import { useProductsStore } from './stores/products.js'
import { useTransactionsStore } from './stores/transactions.js'
import { useRestocksStore } from './stores/restocks.js'
import { useAuthStore } from './stores/auth.js'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

useUsersStore(pinia).initialize()
useCategoriesStore(pinia).initialize()
useProductsStore(pinia).initialize()
useTransactionsStore(pinia).initialize()
useRestocksStore(pinia).initialize()
useAuthStore(pinia).initialize()

app.use(router)
app.mount('#app')
