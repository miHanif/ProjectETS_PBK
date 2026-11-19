<script setup>
import { computed, ref } from 'vue'
import AlertMessage from '../components/common/AlertMessage.vue'
import PageHeader from '../components/common/PageHeader.vue'
import CartList from '../components/features/transactions/CartList.vue'
import PaymentPanel from '../components/features/transactions/PaymentPanel.vue'
import ProductPicker from '../components/features/transactions/ProductPicker.vue'
import { useCartStore } from '../stores/cart.js'
import { useCategoriesStore } from '../stores/categories.js'
import { useProductsStore } from '../stores/products.js'
import { useRestocksStore } from '../stores/restocks.js'
import { useTransactionsStore } from '../stores/transactions.js'

const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()
const restocksStore = useRestocksStore()
const transactionsStore = useTransactionsStore()
const cartStore = useCartStore()
const notice = ref({ type: '', message: '' })
const cartWithPurchasePrices = computed(() =>
  cartStore.itemsWithSubtotals.map((item) => ({
    ...item,
    harga_beli_terakhir:
      restocksStore.latestPurchasePrices[item.product.id] ?? null,
  })),
)

function showNotice(message, type = 'bahaya') {
  notice.value = { type, message }
}

function addProduct(product) {
  try {
    cartStore.addItem(product)
    notice.value = { type: '', message: '' }
  } catch (error) {
    showNotice(error instanceof Error ? error.message : String(error))
  }
}

function saveTransaction() {
  try {
    const transaction = transactionsStore.addTransaction(
      cartStore.validateCheckout(),
    )
    cartStore.clear()
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
          :items="cartWithPurchasePrices"
          @update-quantity="
            cartStore.updateQuantity($event.productId, $event.value)
          "
          @update-price="
            cartStore.updateUnitPrice($event.productId, $event.value)
          "
          @remove-item="cartStore.removeItem"
        />
        <PaymentPanel
          :total="cartStore.total"
          :kembalian="cartStore.kembalian"
          :uang-dibayar="cartStore.uangDibayar"
          @update:uang-dibayar="cartStore.setAmountPaid"
          @submit="saveTransaction"
        />
      </section>
    </div>
  </section>
</template>
