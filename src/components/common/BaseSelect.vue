<script setup>
import { useId } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    default: () => [],
  },
  error: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])
const selectId = useId()
</script>

<template>
  <div class="base-select">
    <label :for="selectId">{{ props.label }}</label>
    <select
      :id="selectId"
      :value="props.modelValue"
      :disabled="props.disabled"
      :aria-invalid="Boolean(props.error)"
      :aria-describedby="props.error ? `${selectId}-error` : undefined"
      @change="emit('update:modelValue', $event.target.value)"
    >
      <option
        v-for="option in props.options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <p v-if="props.error" :id="`${selectId}-error`" class="field-error">
      {{ props.error }}
    </p>
  </div>
</template>
