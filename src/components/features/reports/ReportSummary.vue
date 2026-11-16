<script setup>
import StatCard from '../../common/StatCard.vue'
import { formatRupiah } from '../../../utils/formatters.js'

const props = defineProps({
  summary: { type: Object, required: true },
})
</script>

<template>
  <div class="summary-cards">
    <StatCard
      title="Jumlah transaksi"
      :value="props.summary.transactionCount"
      variant="primary"
    />
    <StatCard
      title="Total penjualan"
      :value="formatRupiah(props.summary.totalSales)"
      variant="success"
    />
    <StatCard
      title="Barang terjual"
      :value="props.summary.quantitySold"
      variant="warning"
    />
  </div>
</template>
