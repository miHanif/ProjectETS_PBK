<script setup>
import { ref } from 'vue'
import BaseButton from '../../common/BaseButton.vue'
import BaseInput from '../../common/BaseInput.vue'

const props = defineProps({
  errorMessage: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['submit'])
const username = ref('')
const password = ref('')

function submit() {
  emit('submit', {
    username: username.value.trim(),
    password: password.value,
  })
}
</script>

<template>
  <form class="login-form" @submit.prevent="submit">
    <BaseInput
      v-model="username"
      label="Nama pengguna"
      placeholder="Masukkan nama pengguna"
      autocomplete="username"
    />
    <BaseInput
      v-model="password"
      label="Kata sandi"
      type="password"
      placeholder="Masukkan kata sandi"
      autocomplete="current-password"
    />
    <p v-if="props.errorMessage" class="login-error" role="alert">
      {{ props.errorMessage }}
    </p>
    <BaseButton label="Masuk" type="submit" />
  </form>
</template>
