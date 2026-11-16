<script setup>
import { computed, ref } from 'vue'
import AlertMessage from '../components/common/AlertMessage.vue'
import PageHeader from '../components/common/PageHeader.vue'
import RestockForm from '../components/features/restock/RestockForm.vue'
import RestockTable from '../components/features/restock/RestockTable.vue'
import { useProductsStore } from '../stores/products.js'
import { useRestocksStore } from '../stores/restocks.js'
import { formatDate, localDateKey } from '../utils/formatters.js'

const productsStore = useProductsStore()
const restocksStore = useRestocksStore()
const formResetKey = ref(0)
const notice = ref({ type: '', message: '' })
const today = computed(() => localDateKey())
const restockRows = computed(() =>
  [...restocksStore.restockSummaries]
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.id - a.id)
    .map((restock) => ({
      ...restock,
      tanggalLabel: formatDate(restock.tanggal),
      items: restock.items.map((item) => ({
        ...item,
        nama:
          productsStore.products.find(
            (product) => product.id === item.product_id,
          )?.nama ?? `Produk #${item.product_id}`,
      })),
    })),
)

function saveRestock(payload) {
  try {
    const restock = restocksStore.addRestock(payload)
    formResetKey.value += 1
    notice.value = {
      type: 'sukses',
      message: `Restock tanggal ${restock.tanggal} berhasil disimpan.`,
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
      title="Restock"
      subtitle="Catat barang masuk dari grosir dan perbarui stok produk."
    />
    <AlertMessage
      v-if="notice.message"
      :type="notice.type"
      :message="notice.message"
      dismiss-label="Tutup pesan"
      @dismiss="notice = { type: '', message: '' }"
    />
    <RestockForm
      :products="productsStore.products"
      :today="today"
      :reset-key="formResetKey"
      @save-restock="saveRestock"
    />
    <RestockTable :rows="restockRows" />
  </section>
</template>
