<script setup>
const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) =>
      ['aman', 'menipis', 'habis', 'aktif', 'nonaktif'].includes(value),
  },
})
</script>

<template>
  <span :class="['status-badge', `status-badge--${props.status}`]">
    {{ props.status }}
  </span>
</template>
