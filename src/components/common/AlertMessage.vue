<script setup>
const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['sukses', 'peringatan', 'bahaya'].includes(value),
  },
  message: {
    type: String,
    required: true,
  },
  dismissLabel: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['dismiss'])
</script>

<template>
  <div :class="['alert-message', `alert-message--${props.type}`]" role="status">
    <p>{{ props.message }}</p>
    <button
      type="button"
      class="alert-message__dismiss"
      :aria-label="props.dismissLabel"
      @click="emit('dismiss')"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>
