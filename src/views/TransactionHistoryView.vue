<script setup>
import { computed, ref } from 'vue'
import AlertMessage from '../components/common/AlertMessage.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseInput from '../components/common/BaseInput.vue'
import PageHeader from '../components/common/PageHeader.vue'
import TransactionDetailModal from '../components/features/transactions/TransactionDetailModal.vue'
import TransactionTable from '../components/features/transactions/TransactionTable.vue'
import { TRANSACTION_STATUSES } from '../constants/business.js'
import { USER_ROLES } from '../constants/roles.js'
import { useAuthStore } from '../stores/auth.js'
import { useProductsStore } from '../stores/products.js'
import { useTransactionsStore } from '../stores/transactions.js'
import { useUsersStore } from '../stores/users.js'
import {
  formatDateTime,
  formatRupiah,
  localDateKey,
} from '../utils/formatters.js'

const authStore = useAuthStore()
const productsStore = useProductsStore()
const transactionsStore = useTransactionsStore()
const usersStore = useUsersStore()
const owner = computed(() => authStore.session?.role === USER_ROLES.OWNER)
const dateFilter = ref('')
const selectedTransaction = ref(null)
const notice = ref({ type: '', message: '' })
const visibleTransactions = computed(() => {
  return transactionsStore.viewableTransactions
    .filter(
      (transaction) =>
        !owner.value ||
        !dateFilter.value ||
        transaction.tanggal.slice(0, 10) === dateFilter.value,
    )
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
    .map((transaction) => ({
      ...transaction,
      tanggalLabel: formatDateTime(transaction.tanggal),
      kasir:
        usersStore.users.find((user) => user.id === transaction.user_id)?.nama ??
        'Pengguna tidak diketahui',
      totalLabel: formatRupiah(transaction.total),
    }))
})
const selectedItems = computed(() => {
  if (!selectedTransaction.value) {
    return []
  }
  return transactionsStore.viewableTransactionItems
    .filter((item) => item.transaction_id === selectedTransaction.value.id)
    .map((item) => ({
      ...item,
      nama:
        productsStore.products.find((product) => product.id === item.product_id)
          ?.nama ?? `Produk #${item.product_id}`,
    }))
})

function selectTransaction(transaction) {
  selectedTransaction.value =
    transactionsStore.findViewableTransaction(transaction.id) ?? null
}
const canCancel = computed(() => {
  if (!selectedTransaction.value) {
    return false
  }
  return (
    selectedTransaction.value.status === TRANSACTION_STATUSES.COMPLETED &&
    (owner.value ||
      selectedTransaction.value.tanggal.slice(0, 10) === localDateKey())
  )
})

function cancelTransaction(reason) {
  try {
    transactionsStore.cancelTransaction(selectedTransaction.value.id, reason)
    selectedTransaction.value = null
    notice.value = {
      type: 'sukses',
      message: 'Transaksi berhasil dibatalkan dan stok telah dikembalikan.',
    }
  } catch (error) {
    notice.value = {
      type: 'bahaya',
      message: error instanceof Error ? error.message : String(error),
    }
  }
}
</script>

<template>
  <section class="page feature-page">
    <PageHeader
      title="Riwayat Transaksi"
      :subtitle="owner ? 'Lihat seluruh transaksi yang tercatat.' : 'Transaksi hari ini.'"
    />
    <AlertMessage
      v-if="notice.message"
      :type="notice.type"
      :message="notice.message"
      dismiss-label="Tutup pesan"
      @dismiss="notice = { type: '', message: '' }"
    />
    <div v-if="owner" class="history-filter">
      <BaseInput v-model="dateFilter" type="date" label="Filter tanggal" />
      <BaseButton
        v-if="dateFilter"
        label="Hapus filter"
        variant="secondary"
        @click="dateFilter = ''"
      />
    </div>
    <TransactionTable
      :rows="visibleTransactions"
      @select-transaction="selectTransaction"
    />
    <TransactionDetailModal
      :open="Boolean(selectedTransaction)"
      :transaction="selectedTransaction"
      :items="selectedItems"
      :can-cancel="canCancel"
      @close="selectedTransaction = null"
      @cancel-transaction="cancelTransaction"
    />
  </section>
</template>
