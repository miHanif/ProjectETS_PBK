<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'warning', 'danger'].includes(value),
  },
})
</script>

<template>
  <article :class="['stat-card', `stat-card--${props.variant}`]">
    <p class="stat-card__title">{{ props.title }}</p>
    <p class="stat-card__value">{{ props.value }}</p>
  </article>
</template>
