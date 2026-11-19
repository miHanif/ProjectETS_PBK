<script setup>
import BaseButton from '../../common/BaseButton.vue'
import { formatRupiah } from '../../../utils/formatters.js'

const props = defineProps({
  items: { type: Array, required: true },
})
const emit = defineEmits([
  'update-quantity',
  'update-price',
  'remove-item',
])

function updateQuantity(item, event) {
  emit('update-quantity', {
    productId: item.product.id,
    value: event.target.value,
  })
}

function updatePrice(item, event) {
  emit('update-price', {
    productId: item.product.id,
    value: event.target.value,
  })
}
</script>

<template>
  <ul v-if="props.items.length" class="cart-list">
    <li v-for="item in props.items" :key="item.product.id" class="cart-item">
      <div class="cart-item__heading">
        <strong>{{ item.product.nama }}</strong>
        <BaseButton
          label="Hapus"
          variant="danger"
          @click="emit('remove-item', item.product.id)"
        />
      </div>
      <div class="cart-item__inputs">
        <label>
          Jumlah
          <input
            type="number"
            step="1"
            :max="item.product.stok"
            :value="item.jumlah"
            @input="updateQuantity(item, $event)"
          />
        </label>
        <label>
          Harga satuan
          <input
            type="number"
            step="1"
            min="1"
            :value="item.harga_satuan"
            @input="updatePrice(item, $event)"
          />
        </label>
      </div>
      <p class="cart-item__normal">
        Harga normal: {{ formatRupiah(item.product.harga_jual) }}
      </p>
      <p
        v-if="Number(item.harga_satuan) < item.product.harga_jual"
        class="cart-item__nego"
      >
        Harga disepakati di bawah harga normal
      </p>
      <p
        v-if="
          item.harga_beli_terakhir !== null &&
          item.harga_beli_terakhir !== undefined &&
          Number(item.harga_satuan) < item.harga_beli_terakhir
        "
        class="cart-item__cost-warning"
      >
        Harga di bawah harga beli terakhir
        ({{ formatRupiah(item.harga_beli_terakhir) }}). Transaksi tetap dapat disimpan.
      </p>
      <p class="cart-item__subtotal">
        Subtotal: {{ formatRupiah(item.subtotal) }}
      </p>
    </li>
  </ul>
  <p v-else class="cart-empty">Keranjang masih kosong.</p>
</template>
