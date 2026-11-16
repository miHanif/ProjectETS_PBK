<script setup>
import { computed, ref, watch } from 'vue'
import EmptyState from '../components/common/EmptyState.vue'
import PageHeader from '../components/common/PageHeader.vue'
import ReportFilter from '../components/features/reports/ReportFilter.vue'
import ReportSummary from '../components/features/reports/ReportSummary.vue'
import ReportTable from '../components/features/reports/ReportTable.vue'
import { useTransactionsStore } from '../stores/transactions.js'
import { localDateKey, localMonthKey } from '../utils/formatters.js'

const transactionsStore = useTransactionsStore()
const mode = ref('harian')
const selectedDate = ref(localDateKey())
const selectedMonth = ref(localMonthKey())
const period = computed(() =>
  mode.value === 'harian' ? selectedDate.value : selectedMonth.value,
)
const report = computed(() =>
  transactionsStore.reportForPeriod(mode.value, period.value),
)

watch(mode, (nextMode) => {
  if (nextMode === 'harian' && !selectedDate.value) {
    selectedDate.value = localDateKey()
  } else if (nextMode === 'bulanan' && !selectedMonth.value) {
    selectedMonth.value = localMonthKey()
  }
})

function updatePeriod(value) {
  if (mode.value === 'harian') {
    selectedDate.value = value
  } else {
    selectedMonth.value = value
  }
}
</script>

<template>
  <section class="page feature-page">
    <PageHeader
      title="Laporan"
      subtitle="Ringkasan penjualan dan barang terjual."
    />
    <ReportFilter
      :mode="mode"
      :period="period"
      @update:mode="mode = $event"
      @update:period="updatePeriod"
    />
    <template v-if="report.hasTransactions">
      <ReportSummary :summary="report.summary" />
      <ReportTable
        :products="report.products"
        :days="report.days"
        :mode="mode"
      />
    </template>
    <EmptyState
      v-else
      message="Tidak ada transaksi selesai pada periode yang dipilih."
    />
  </section>
</template>
