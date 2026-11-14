<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <header class="page-header">
    <h1>{{ props.title }}</h1>
    <p v-if="props.subtitle">{{ props.subtitle }}</p>
  </header>
</template>
