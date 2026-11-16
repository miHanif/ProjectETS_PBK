<script setup>
import BaseButton from '../../common/BaseButton.vue'
import BaseInput from '../../common/BaseInput.vue'
import BaseSelect from '../../common/BaseSelect.vue'

const props = defineProps({
  item: { type: Object, required: true },
  number: { type: Number, required: true },
  products: { type: Array, required: true },
  errors: { type: Object, required: true },
})
const emit = defineEmits(['update-field', 'remove'])

function update(field, value) {
  emit('update-field', { key: props.item.key, field, value })
}
</script>

<template>
  <article class="restock-item">
    <div class="restock-item__heading">
      <h3>Barang {{ props.number }}</h3>
      <BaseButton
        label="Hapus"
        variant="danger"
        @click="emit('remove')"
      />
    </div>
    <BaseSelect
      :model-value="props.item.product_id"
      label="Produk"
      :options="props.products"
      :error="props.errors.product_id"
      @update:model-value="update('product_id', $event)"
    />
    <div class="restock-item__inputs">
      <BaseInput
        :model-value="props.item.jumlah"
        type="number"
        label="Jumlah"
        :error="props.errors.jumlah"
        @update:model-value="update('jumlah', $event)"
      />
      <BaseInput
        :model-value="props.item.harga_beli"
        type="number"
        label="Harga beli per unit (opsional)"
        :error="props.errors.harga_beli"
        @update:model-value="update('harga_beli', $event)"
      />
    </div>
  </article>
</template>
