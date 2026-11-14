<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from '../components/features/auth/LoginForm.vue'
import { BUSINESS_NAME } from '../constants/business.js'
import { ROLE_HOME_PATHS, ROUTE_PATHS } from '../constants/routes.js'
import AuthLayout from '../layouts/AuthLayout.vue'
import { useAuthStore } from '../stores/auth.js'

const authStore = useAuthStore()
const router = useRouter()
const errorMessage = ref('')

async function login(credentials) {
  const success = authStore.login(credentials.username, credentials.password)

  if (!success) {
    errorMessage.value = 'Username atau kata sandi salah'
    return
  }

  errorMessage.value = ''
  await router.replace(ROLE_HOME_PATHS[authStore.session.role] ?? ROUTE_PATHS.LOGIN)
}
</script>

<template>
  <AuthLayout>
    <section class="login-card">
      <p class="login-business">{{ BUSINESS_NAME }}</p>
      <h1>Masuk ke Sistem</h1>
      <LoginForm :error-message="errorMessage" @submit="login" />
    </section>
  </AuthLayout>
</template>
