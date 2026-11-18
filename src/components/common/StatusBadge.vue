<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    required: true,
    validator: (value) =>
      ['sukses', 'peringatan', 'bahaya', 'netral'].includes(value),
  },
})
</script>

<template>
  <span :class="['status-badge', `status-badge--${props.variant}`]">
    {{ props.label }}
  </span>
</template>
