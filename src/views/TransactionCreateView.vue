<script setup>
import { computed, ref } from 'vue'
import AlertMessage from '../components/common/AlertMessage.vue'
import PageHeader from '../components/common/PageHeader.vue'
import CartList from '../components/features/transactions/CartList.vue'
import PaymentPanel from '../components/features/transactions/PaymentPanel.vue'
import ProductPicker from '../components/features/transactions/ProductPicker.vue'
import { useCategoriesStore } from '../stores/categories.js'
import { useProductsStore } from '../stores/products.js'
import { useTransactionsStore } from '../stores/transactions.js'

const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()
const transactionsStore = useTransactionsStore()
const cart = ref([])
const uangDibayar = ref('')
const notice = ref({ type: '', message: '' })
const total = computed(() =>
  cart.value.reduce((sum, item) => {
    const subtotal = Number(item.jumlah) * Number(item.harga_satuan)
    return sum + (Number.isFinite(subtotal) ? subtotal : 0)
  }, 0),
)

function showNotice(message, type = 'bahaya') {
  notice.value = { type, message }
}

function addProduct(product) {
  const existing = cart.value.find((item) => item.productId === product.id)
  if (existing && Number(existing.jumlah) + 1 > product.stok) {
    showNotice(`Jumlah produk "${product.nama}" melebihi stok tersedia.`)
    return
  }
  if (existing) {
    existing.jumlah = Number(existing.jumlah) + 1
  } else {
    cart.value.push({
      productId: product.id,
      nama: product.nama,
      stok: product.stok,
      harga_normal: product.harga_jual,
      harga_satuan: product.harga_jual,
      jumlah: 1,
    })
  }
  notice.value = { type: '', message: '' }
}

function updateCartItem({ productId, field, value }) {
  cart.value = cart.value.map((item) =>
    item.productId === productId ? { ...item, [field]: value } : item,
  )
}

function removeCartItem(productId) {
  cart.value = cart.value.filter((item) => item.productId !== productId)
}

function saveTransaction() {
  try {
    const transaction = transactionsStore.addTransaction({
      items: cart.value.map((item) => ({
        product_id: item.productId,
        jumlah: Number(item.jumlah),
        harga_satuan: Number(item.harga_satuan),
      })),
      uang_dibayar: uangDibayar.value,
    })
    cart.value = []
    uangDibayar.value = ''
    showNotice(`Transaksi #${transaction.id} berhasil disimpan.`, 'sukses')
  } catch (error) {
    showNotice(error instanceof Error ? error.message : String(error))
  }
}
</script>

<template>
  <section class="page feature-page">
    <PageHeader title="Transaksi Baru" subtitle="Catat penjualan tunai." />
    <AlertMessage
      v-if="notice.message"
      :type="notice.type"
      :message="notice.message"
      dismiss-label="Tutup pesan"
      @dismiss="notice = { type: '', message: '' }"
    />
    <div class="transaction-layout">
      <ProductPicker
        :products="productsStore.products"
        :categories="categoriesStore.categories"
        @add-product="addProduct"
      />
      <section class="transaction-card">
        <h2>Keranjang</h2>
        <CartList
          :items="cart"
          @update-item="updateCartItem"
          @remove-item="removeCartItem"
        />
        <PaymentPanel
          :total="total"
          :uang-dibayar="uangDibayar"
          @update:uang-dibayar="uangDibayar = $event"
          @submit="saveTransaction"
        />
      </section>
    </div>
  </section>
</template>
