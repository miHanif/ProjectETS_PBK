<script setup>
import BaseButton from './BaseButton.vue'

const props = defineProps({
  brandName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  accountLabel: {
    type: String,
    required: true,
  },
  logoutLabel: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['logout'])
</script>

<template>
  <header class="app-topbar">
    <div>
      <p class="topbar-brand">{{ props.brandName }}</p>
      <p class="topbar-user">{{ props.accountLabel }} {{ props.userName }}</p>
    </div>
    <BaseButton :label="props.logoutLabel" variant="secondary" @click="emit('logout')" />
  </header>
</template>
