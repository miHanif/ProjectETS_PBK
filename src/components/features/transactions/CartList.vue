<script setup>
import BaseButton from '../../common/BaseButton.vue'
import { formatRupiah } from '../../../utils/formatters.js'

const props = defineProps({
  items: { type: Array, required: true },
})
const emit = defineEmits(['update-item', 'remove-item'])

function update(item, field, event) {
  emit('update-item', {
    productId: item.productId,
    field,
    value: event.target.value,
  })
}

function subtotal(item) {
  const value = Number(item.jumlah) * Number(item.harga_satuan)
  return Number.isFinite(value) ? value : 0
}
</script>

<template>
  <ul v-if="props.items.length" class="cart-list">
    <li v-for="item in props.items" :key="item.productId" class="cart-item">
      <div class="cart-item__heading">
        <strong>{{ item.nama }}</strong>
        <BaseButton
          label="Hapus"
          variant="danger"
          @click="emit('remove-item', item.productId)"
        />
      </div>
      <div class="cart-item__inputs">
        <label>
          Jumlah
          <input
            type="number"
            step="1"
            :max="item.stok"
            :value="item.jumlah"
            @input="update(item, 'jumlah', $event)"
          />
        </label>
        <label>
          Harga satuan
          <input
            type="number"
            step="1"
            min="1"
            :value="item.harga_satuan"
            @input="update(item, 'harga_satuan', $event)"
          />
        </label>
      </div>
      <p class="cart-item__normal">Harga normal: {{ formatRupiah(item.harga_normal) }}</p>
      <p v-if="Number(item.harga_satuan) < item.harga_normal" class="cart-item__nego">
        Harga disepakati di bawah harga normal
      </p>
      <p class="cart-item__subtotal">Subtotal: {{ formatRupiah(subtotal(item)) }}</p>
    </li>
  </ul>
  <p v-else class="cart-empty">Keranjang masih kosong.</p>
</template>
