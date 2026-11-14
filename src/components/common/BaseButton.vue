<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    default: 'primary',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'button',
  },
})

const emit = defineEmits(['click'])
</script>

<template>
  <button
    :type="props.type"
    :class="['base-button', `base-button--${props.variant}`]"
    :disabled="props.disabled || props.loading"
    :aria-busy="props.loading"
    @click="emit('click', $event)"
  >
    {{ props.loading ? 'Memproses...' : props.label }}
  </button>
</template>
