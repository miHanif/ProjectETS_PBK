<script setup>
import BaseButton from './BaseButton.vue'
import BaseModal from './BaseModal.vue'

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  confirmLabel: {
    type: String,
    required: true,
  },
  cancelLabel: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <BaseModal
    :open="props.open"
    :title="props.title"
    :close-label="props.cancelLabel"
    @close="emit('cancel')"
  >
    <p>{{ props.message }}</p>
    <div class="confirm-dialog__actions">
      <BaseButton
        :label="props.cancelLabel"
        variant="secondary"
        @click="emit('cancel')"
      />
      <BaseButton
        :label="props.confirmLabel"
        variant="danger"
        @click="emit('confirm')"
      />
    </div>
  </BaseModal>
</template>
