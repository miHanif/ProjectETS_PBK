<script setup>
import { ref, watch } from 'vue'
import BaseButton from '../../common/BaseButton.vue'
import BaseInput from '../../common/BaseInput.vue'
import BaseModal from '../../common/BaseModal.vue'
import StatusBadge from '../../common/StatusBadge.vue'
import { TRANSACTION_STATUSES } from '../../../constants/business.js'
import { formatRupiah, formatDateTime } from '../../../utils/formatters.js'

const props = defineProps({
  open: { type: Boolean, required: true },
  transaction: { type: Object, default: null },
  items: { type: Array, required: true },
  canCancel: { type: Boolean, default: false },
})
const emit = defineEmits(['close', 'cancel-transaction'])
const cancelling = ref(false)
const reason = ref('')
const reasonError = ref('')

watch(
  () => [props.open, props.transaction?.id],
  () => {
    cancelling.value = false
    reason.value = ''
    reasonError.value = ''
  },
)

function confirmCancellation() {
  if (!reason.value.trim()) {
    reasonError.value = 'Alasan pembatalan wajib diisi.'
    return
  }
  emit('cancel-transaction', reason.value.trim())
}
</script>

<template>
  <BaseModal
    :open="props.open && Boolean(props.transaction)"
    title="Detail Transaksi"
    close-label="Tutup detail"
    @close="emit('close')"
  >
    <template v-if="props.transaction">
      <p>Tanggal: {{ formatDateTime(props.transaction.tanggal) }}</p>
      <p>Status: <StatusBadge :status="props.transaction.status" /></p>
      <p v-if="props.transaction.alasan_batal">
        Alasan pembatalan: {{ props.transaction.alasan_batal }}
      </p>
      <div class="transaction-detail-items">
        <h3>Item transaksi</h3>
        <div v-for="item in props.items" :key="item.id" class="transaction-detail-item">
          <strong>{{ item.nama }}</strong>
          <span>Jumlah {{ item.jumlah }}</span>
          <span>Harga normal: {{ formatRupiah(item.harga_normal) }}</span>
          <span>Harga satuan: {{ formatRupiah(item.harga_satuan) }}</span>
          <span>Subtotal: {{ formatRupiah(item.subtotal) }}</span>
        </div>
      </div>
      <p class="transaction-detail-total">
        Total: {{ formatRupiah(props.transaction.total) }}
      </p>
      <template
        v-if="
          props.canCancel &&
          props.transaction.status === TRANSACTION_STATUSES.COMPLETED
        "
      >
        <BaseButton
          v-if="!cancelling"
          label="Batalkan transaksi"
          variant="danger"
          @click="cancelling = true"
        />
        <div v-else class="transaction-cancel-form">
          <BaseInput
            v-model="reason"
            label="Alasan pembatalan"
            placeholder="Masukkan alasan"
            :error="reasonError"
          />
          <div class="feature-form-actions">
            <BaseButton
              label="Kembali"
              variant="secondary"
              @click="cancelling = false"
            />
            <BaseButton
              label="Konfirmasi pembatalan"
              variant="danger"
              @click="confirmCancellation"
            />
          </div>
        </div>
      </template>
    </template>
  </BaseModal>
</template>
