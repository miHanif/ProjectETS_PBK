<script setup>
import BaseInput from '../../common/BaseInput.vue'
import BaseSelect from '../../common/BaseSelect.vue'

const props = defineProps({
  mode: { type: String, required: true },
  period: { type: String, required: true },
})
const emit = defineEmits(['update:mode', 'update:period'])
</script>

<template>
  <div class="report-filter">
    <BaseSelect
      :model-value="props.mode"
      label="Periode laporan"
      :options="[
        { label: 'Harian', value: 'harian' },
        { label: 'Bulanan', value: 'bulanan' },
      ]"
      @update:model-value="emit('update:mode', $event)"
    />
    <BaseInput
      v-if="props.mode === 'harian'"
      :model-value="props.period"
      type="date"
      label="Tanggal"
      @update:model-value="emit('update:period', $event)"
    />
    <BaseInput
      v-else
      :model-value="props.period"
      type="month"
      label="Bulan dan tahun"
      @update:model-value="emit('update:period', $event)"
    />
  </div>
</template>
