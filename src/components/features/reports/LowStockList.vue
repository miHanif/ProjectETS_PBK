<script setup>
import EmptyState from '../../common/EmptyState.vue'
import StatusBadge from '../../common/StatusBadge.vue'
import { ROUTE_PATHS } from '../../../constants/routes.js'

const props = defineProps({
  products: { type: Array, required: true },
})
</script>

<template>
  <section class="low-stock-card">
    <div class="low-stock-heading">
      <h2>Stok Menipis</h2>
      <RouterLink :to="ROUTE_PATHS.RESTOCK" class="restock-link">
        Catat Restock
      </RouterLink>
    </div>
    <div v-if="props.products.length" class="feature-table-wrapper">
      <table class="data-table low-stock-table">
        <thead>
          <tr>
            <th>Nama produk</th>
            <th>Stok</th>
            <th>Stok minimum</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in props.products" :key="product.id">
            <td>{{ product.nama }}</td>
            <td>{{ product.stok }}</td>
            <td>{{ product.stok_minimum }}</td>
            <td>
              <StatusBadge :status="product.stok === 0 ? 'habis' : 'menipis'" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <EmptyState v-else message="Tidak ada produk dengan stok menipis." />
  </section>
</template>
