<script setup>
import { ref } from 'vue'
import BaseButton from '../../common/BaseButton.vue'
import BaseModal from '../../common/BaseModal.vue'
import EmptyState from '../../common/EmptyState.vue'
import { formatRupiah } from '../../../utils/formatters.js'

const props = defineProps({
  rows: { type: Array, required: true },
})
const selectedRestock = ref(null)
</script>

<template>
  <section>
    <h2>Riwayat Restock</h2>
    <div v-if="props.rows.length" class="feature-table-wrapper">
      <table class="data-table restock-table">
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Catatan</th>
            <th>Jenis barang</th>
            <th>Total jumlah</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in props.rows" :key="row.id">
            <td>{{ row.tanggalLabel }}</td>
            <td>{{ row.catatan || '—' }}</td>
            <td>{{ row.jenisBarang }}</td>
            <td>{{ row.totalJumlah }}</td>
            <td>
              <BaseButton
                label="Lihat detail"
                variant="secondary"
                @click="selectedRestock = row"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <EmptyState v-else message="Belum ada riwayat restock." />

    <BaseModal
      :open="Boolean(selectedRestock)"
      :title="
        selectedRestock
          ? `Detail restock ${selectedRestock.tanggalLabel}`
          : 'Detail restock'
      "
      close-label="Tutup detail"
      @close="selectedRestock = null"
    >
      <ul v-if="selectedRestock" class="restock-detail-list">
        <li v-for="item in selectedRestock.items" :key="item.id">
          <strong>{{ item.nama }}</strong>
          <span>Jumlah: {{ item.jumlah }}</span>
          <span>
            Harga beli per unit:
            {{
              item.harga_beli === null || item.harga_beli === undefined
                ? 'Tidak dicatat'
                : formatRupiah(item.harga_beli)
            }}
          </span>
        </li>
      </ul>
    </BaseModal>
  </section>
</template>
