<script setup>
import StatCard from '../../common/StatCard.vue'
import { formatRupiah } from '../../../utils/formatters.js'

const props = defineProps({
  transactionCount: { type: Number, required: true },
  totalSales: { type: Number, required: true },
  lowStockCount: { type: Number, required: true },
})
</script>

<template>
  <div class="summary-cards">
    <StatCard
      title="Transaksi hari ini"
      :value="props.transactionCount"
      variant="primary"
    />
    <StatCard
      title="Penjualan hari ini"
      :value="formatRupiah(props.totalSales)"
      variant="success"
    />
    <StatCard
      title="Produk stok menipis"
      :value="props.lowStockCount"
      variant="warning"
    />
  </div>
</template>
