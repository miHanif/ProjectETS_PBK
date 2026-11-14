<script setup>
import { useId } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'text',
  },
  error: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  autocomplete: {
    type: String,
    default: 'off',
  },
})

const emit = defineEmits(['update:modelValue'])
const inputId = useId()
</script>

<template>
  <div class="form-field">
    <label :for="inputId">{{ props.label }}</label>
    <input
      :id="inputId"
      :type="props.type"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      :autocomplete="props.autocomplete"
      :aria-invalid="Boolean(props.error)"
      :aria-describedby="props.error ? `${inputId}-error` : undefined"
      @input="emit('update:modelValue', $event.target.value)"
    />
    <p v-if="props.error" :id="`${inputId}-error`" class="field-error">
      {{ props.error }}
    </p>
  </div>
</template>
