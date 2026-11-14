<script setup>
const props = defineProps({
  message: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="empty-state">
    <p>{{ props.message }}</p>
  </div>
</template>
