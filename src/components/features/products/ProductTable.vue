<script setup>
import { computed } from 'vue'
import BaseButton from '../../common/BaseButton.vue'
import EmptyState from '../../common/EmptyState.vue'
import StatusBadge from '../../common/StatusBadge.vue'

const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
  categories: {
    type: Array,
    default: () => [],
  },
  canEdit: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['edit', 'deactivate', 'activate'])
const categoryNames = computed(
  () => new Map(props.categories.map((category) => [category.id, category.nama])),
)

const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 0,
})

function stockStatus(product) {
  if (product.stok <= 0) {
    return 'habis'
  }

  return product.stok <= product.stok_minimum ? 'menipis' : 'aman'
}

function formatPrice(value) {
  return `Rp ${rupiahFormatter.format(value)}`
}
</script>

<template>
  <div v-if="props.products.length" class="feature-table-wrapper">
    <table class="data-table product-table">
      <thead>
        <tr>
          <th scope="col">Nama produk</th>
          <th scope="col">Kategori</th>
          <th scope="col">Harga jual</th>
          <th scope="col">Stok</th>
          <th scope="col">Kondisi stok</th>
          <th scope="col">Status</th>
          <th v-if="props.canEdit" scope="col">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in props.products" :key="product.id">
          <td>{{ product.nama }}</td>
          <td>{{ categoryNames.get(product.category_id) ?? 'Kategori tidak tersedia' }}</td>
          <td>{{ formatPrice(product.harga_jual) }}</td>
          <td>{{ product.stok }} / {{ product.stok_minimum }}</td>
          <td><StatusBadge :status="stockStatus(product)" /></td>
          <td>
            <StatusBadge :status="product.aktif ? 'aktif' : 'nonaktif'" />
          </td>
          <td v-if="props.canEdit">
            <div class="feature-table-actions">
              <BaseButton
                label="Ubah"
                variant="secondary"
                @click="emit('edit', product)"
              />
              <template v-if="product.aktif">
                <BaseButton
                  label="Nonaktifkan"
                  variant="danger"
                  @click="emit('deactivate', product)"
                />
              </template>
              <BaseButton
                v-else
                label="Aktifkan"
                @click="emit('activate', product)"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <EmptyState v-else message="Tidak ada produk yang sesuai." />
</template>
