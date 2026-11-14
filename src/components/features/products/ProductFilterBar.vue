<script setup>
import BaseInput from '../../common/BaseInput.vue'
import BaseSelect from '../../common/BaseSelect.vue'

const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  keyword: {
    type: String,
    default: '',
  },
  categoryId: {
    type: [String, Number],
    default: '',
  },
  onlyLowStock: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: 'semua',
  },
})

const emit = defineEmits(['update:filter'])

function updateFilter(key, value) {
  emit('update:filter', {
    keyword: props.keyword,
    categoryId: props.categoryId,
    onlyLowStock: props.onlyLowStock,
    status: props.status,
    [key]: value,
  })
}
</script>

<template>
  <div class="product-filter-bar">
    <BaseInput
      :model-value="props.keyword"
      label="Cari nama produk"
      placeholder="Masukkan nama produk"
      @update:model-value="updateFilter('keyword', $event)"
    />
    <BaseSelect
      :model-value="props.categoryId"
      label="Kategori"
      :options="[
        { label: 'Semua kategori', value: '' },
        ...props.categories.map((category) => ({
          label: category.nama,
          value: String(category.id),
        })),
      ]"
      @update:model-value="updateFilter('categoryId', $event)"
    />
    <BaseSelect
      :model-value="props.status"
      label="Status produk"
      :options="[
        { label: 'Semua', value: 'semua' },
        { label: 'Aktif', value: 'aktif' },
        { label: 'Nonaktif', value: 'nonaktif' },
      ]"
      @update:model-value="updateFilter('status', $event)"
    />
    <label class="product-filter-checkbox">
      <input
        type="checkbox"
        :checked="props.onlyLowStock"
        @change="updateFilter('onlyLowStock', $event.target.checked)"
      />
      <span>Stok menipis</span>
    </label>
  </div>
</template>
