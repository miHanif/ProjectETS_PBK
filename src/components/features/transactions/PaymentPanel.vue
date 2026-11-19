<script setup>
import BaseButton from '../../common/BaseButton.vue'
import BaseInput from '../../common/BaseInput.vue'
import { formatRupiah } from '../../../utils/formatters.js'

const props = defineProps({
  total: { type: Number, required: true },
  kembalian: { type: Number, required: true },
  uangDibayar: { type: String, required: true },
})
const emit = defineEmits(['update:uang-dibayar', 'submit'])
</script>

<template>
  <section class="payment-panel">
    <div class="payment-total">
      <strong>Total</strong>
      <strong>{{ formatRupiah(props.total) }}</strong>
    </div>
    <BaseInput
      :model-value="props.uangDibayar"
      type="number"
      label="Uang dibayar"
      @update:model-value="emit('update:uang-dibayar', $event)"
    />
    <div class="payment-change">
      <span>Kembalian</span>
      <strong>{{ formatRupiah(props.kembalian) }}</strong>
    </div>
    <BaseButton
      label="Simpan Transaksi"
      @click="emit('submit')"
    />
  </section>
</template>
