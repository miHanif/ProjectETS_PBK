<script setup>
import { computed, ref } from 'vue'
import BaseButton from '../../common/BaseButton.vue'
import BaseInput from '../../common/BaseInput.vue'
import BaseSelect from '../../common/BaseSelect.vue'
import EmptyState from '../../common/EmptyState.vue'
import { formatRupiah } from '../../../utils/formatters.js'

const props = defineProps({
  products: { type: Array, required: true },
  categories: { type: Array, required: true },
})
const emit = defineEmits(['add-product'])
const keyword = ref('')
const categoryId = ref('')
const categoryNames = computed(
  () => new Map(props.categories.map((category) => [category.id, category.nama])),
)
const filteredProducts = computed(() => {
  const query = keyword.value.trim().toLocaleLowerCase()
  return props.products.filter(
    (product) =>
      product.aktif &&
      product.stok > 0 &&
      product.nama.toLocaleLowerCase().includes(query) &&
      (!categoryId.value || String(product.category_id) === categoryId.value),
  )
})
</script>

<template>
  <section class="transaction-card">
    <h2>Daftar Produk</h2>
    <div class="transaction-filters">
      <BaseInput
        v-model="keyword"
        label="Cari nama produk"
        placeholder="Masukkan nama produk"
      />
      <BaseSelect
        v-model="categoryId"
        label="Kategori"
        :options="[
          { label: 'Semua kategori', value: '' },
          ...props.categories.map((category) => ({
            label: category.nama,
            value: String(category.id),
          })),
        ]"
      />
    </div>
    <ul v-if="filteredProducts.length" class="product-picker-list">
      <li v-for="product in filteredProducts" :key="product.id">
        <div>
          <strong>{{ product.nama }}</strong>
          <p>{{ categoryNames.get(product.category_id) }} · Stok {{ product.stok }}</p>
          <span>{{ formatRupiah(product.harga_jual) }}</span>
        </div>
        <BaseButton
          label="+ Tambah"
          variant="secondary"
          @click="emit('add-product', product)"
        />
      </li>
    </ul>
    <EmptyState v-else message="Tidak ada produk aktif dengan stok yang sesuai." />
  </section>
</template>
