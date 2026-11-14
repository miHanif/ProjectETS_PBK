<script setup>
import BaseButton from '../../common/BaseButton.vue'
import EmptyState from '../../common/EmptyState.vue'

const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
  products: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['edit', 'delete'])

function productCount(categoryId) {
  return props.products.filter((product) => product.category_id === categoryId).length
}
</script>

<template>
  <div v-if="props.categories.length" class="feature-table-wrapper">
    <table class="data-table">
      <thead>
        <tr>
          <th scope="col">Nama kategori</th>
          <th scope="col">Produk terkait</th>
          <th scope="col">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in props.categories" :key="category.id">
          <td>{{ category.nama }}</td>
          <td>{{ productCount(category.id) }}</td>
          <td>
            <div class="feature-table-actions">
              <BaseButton
                label="Ubah"
                variant="secondary"
                @click="emit('edit', category)"
              />
              <BaseButton
                label="Hapus"
                variant="danger"
                @click="emit('delete', category)"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <EmptyState v-else message="Belum ada kategori." />
</template>
