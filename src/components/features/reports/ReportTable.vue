<script setup>
import { formatDate, formatRupiah } from '../../../utils/formatters.js'

const props = defineProps({
  products: { type: Array, required: true },
  days: { type: Array, required: true },
  mode: { type: String, required: true },
})
</script>

<template>
  <section class="report-tables">
    <div>
      <h2>Rincian Barang Terjual</h2>
      <div class="feature-table-wrapper">
        <table class="data-table report-table">
          <thead>
            <tr>
              <th>Nama produk</th>
              <th>Jumlah terjual</th>
              <th>Total penjualan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in props.products" :key="product.product_id">
              <td>{{ product.nama }}</td>
              <td>{{ product.quantitySold }}</td>
              <td>{{ formatRupiah(product.totalSales) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="props.mode === 'bulanan'">
      <h2>Ringkasan Per Hari</h2>
      <div class="feature-table-wrapper">
        <table class="data-table report-table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Jumlah transaksi</th>
              <th>Total penjualan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="day in props.days" :key="day.date">
              <td>{{ formatDate(day.date) }}</td>
              <td>{{ day.transactionCount }}</td>
              <td>{{ formatRupiah(day.totalSales) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
