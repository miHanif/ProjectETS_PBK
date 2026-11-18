<script setup>
import EmptyState from '../../common/EmptyState.vue'
import StatusBadge from '../../common/StatusBadge.vue'
import { getStatusPresentation } from '../../../utils/formatters.js'

const props = defineProps({
  rows: { type: Array, required: true },
})
const emit = defineEmits(['select-transaction'])
</script>

<template>
  <div v-if="props.rows.length" class="feature-table-wrapper">
    <table class="data-table transaction-table">
      <thead>
        <tr>
          <th>Tanggal</th>
          <th>Kasir</th>
          <th>Total</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in props.rows"
          :key="row.id"
          tabindex="0"
          @click="emit('select-transaction', row)"
          @keydown.enter="emit('select-transaction', row)"
        >
          <td>{{ row.tanggalLabel }}</td>
          <td>{{ row.kasir }}</td>
          <td>{{ row.totalLabel }}</td>
          <td><StatusBadge v-bind="getStatusPresentation(row.status)" /></td>
        </tr>
      </tbody>
    </table>
  </div>
  <EmptyState v-else message="Tidak ada transaksi yang sesuai." />
</template>
