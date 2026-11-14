<script setup>
const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  closeLabel: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['close'])
</script>

<template>
  <div v-if="props.open" class="modal-backdrop" @click.self="emit('close')">
    <section
      class="modal-panel"
      role="dialog"
      aria-modal="true"
      :aria-label="props.title"
    >
      <header class="modal-header">
        <h2>{{ props.title }}</h2>
        <button
          type="button"
          class="modal-close"
          :aria-label="props.closeLabel"
          @click="emit('close')"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </header>
      <div>
        <slot />
      </div>
    </section>
  </div>
</template>
