<script setup>
import BaseButton from './BaseButton.vue'

const props = defineProps({
  businessName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['logout'])
</script>

<template>
  <header class="app-topbar">
    <div>
      <p class="topbar-business">{{ props.businessName }}</p>
      <p class="topbar-user">Masuk sebagai {{ props.userName }}</p>
    </div>
    <BaseButton label="Keluar" variant="secondary" @click="emit('logout')" />
  </header>
</template>
