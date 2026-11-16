<script setup>
import PageHeader from '../components/common/PageHeader.vue'
import LowStockList from '../components/features/reports/LowStockList.vue'
import SummaryCards from '../components/features/reports/SummaryCards.vue'
import { useProductsStore } from '../stores/products.js'
import { useTransactionsStore } from '../stores/transactions.js'

const productsStore = useProductsStore()
const transactionsStore = useTransactionsStore()
</script>

<template>
  <section class="page feature-page">
    <PageHeader
      title="Dashboard"
      subtitle="Ringkasan transaksi dan kondisi stok hari ini."
    />
    <SummaryCards
      :transaction-count="transactionsStore.todaySummary.transactionCount"
      :total-sales="transactionsStore.todaySummary.totalSales"
      :low-stock-count="productsStore.lowStockCount"
    />
    <LowStockList :products="productsStore.lowStockProducts" />
  </section>
</template>
