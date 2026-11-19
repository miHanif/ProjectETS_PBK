import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useProductsStore } from './products.js'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const uangDibayar = ref('')
  const itemsWithSubtotals = computed(() =>
    items.value.map((item) => {
      const subtotal = Number(item.jumlah) * Number(item.harga_satuan)
      return {
        ...item,
        subtotal: Number.isFinite(subtotal) ? subtotal : 0,
      }
    }),
  )
  const total = computed(() =>
    itemsWithSubtotals.value.reduce((sum, item) => sum + item.subtotal, 0),
  )
  const kembalian = computed(() => {
    const paid = Number(uangDibayar.value)
    return Number.isFinite(paid) ? Math.max(0, paid - total.value) : 0
  })

  function getAvailableProduct(productId) {
    const productsStore = useProductsStore()
    const product = productsStore.products.find(
      (record) => record.id === productId,
    )
    if (!product || !product.aktif) {
      throw new Error('Produk tidak tersedia untuk transaksi.')
    }

    return product
  }

  function addItem(product) {
    const currentProduct = getAvailableProduct(product.id)
    const existing = items.value.find(
      (item) => item.product.id === currentProduct.id,
    )

    if (existing) {
      const nextQuantity = (Number(existing.jumlah) || 0) + 1
      if (nextQuantity > currentProduct.stok) {
        throw new Error(
          `Jumlah produk "${currentProduct.nama}" melebihi stok tersedia.`,
        )
      }
      existing.jumlah = nextQuantity
      return
    }

    if (currentProduct.stok < 1) {
      throw new Error(
        `Jumlah produk "${currentProduct.nama}" melebihi stok tersedia.`,
      )
    }

    items.value.push({
      product: { ...currentProduct },
      jumlah: 1,
      harga_satuan: currentProduct.harga_jual,
    })
  }

  function updateQuantity(productId, jumlah) {
    items.value = items.value.map((item) =>
      item.product.id === productId ? { ...item, jumlah } : item,
    )
  }

  function updateUnitPrice(productId, hargaSatuan) {
    items.value = items.value.map((item) =>
      item.product.id === productId
        ? { ...item, harga_satuan: hargaSatuan }
        : item,
    )
  }

  function removeItem(productId) {
    items.value = items.value.filter(
      (item) => item.product.id !== productId,
    )
  }

  function setAmountPaid(value) {
    uangDibayar.value = String(value)
  }

  function validateCheckout() {
    if (!items.value.length) {
      throw new Error('Keranjang tidak boleh kosong.')
    }

    const productsStore = useProductsStore()
    const quantities = new Map()
    const normalizedItems = items.value.map((item) => {
      const product = productsStore.products.find(
        (record) => record.id === item.product.id,
      )
      if (!product || !product.aktif) {
        throw new Error('Produk tidak tersedia untuk transaksi.')
      }

      const jumlah = Number(item.jumlah)
      if (!Number.isInteger(jumlah) || jumlah <= 0) {
        throw new Error(
          `Jumlah produk "${product.nama}" harus bilangan bulat lebih dari 0.`,
        )
      }
      if (jumlah > product.stok) {
        throw new Error(
          `Jumlah produk "${product.nama}" melebihi stok tersedia.`,
        )
      }

      const hargaSatuan = Number(item.harga_satuan)
      if (!Number.isInteger(hargaSatuan) || hargaSatuan <= 0) {
        throw new Error(
          `Harga satuan produk "${product.nama}" harus lebih dari 0.`,
        )
      }

      quantities.set(
        product.id,
        (quantities.get(product.id) ?? 0) + jumlah,
      )
      return {
        product_id: product.id,
        jumlah,
        harga_satuan: hargaSatuan,
      }
    })

    quantities.forEach((jumlah, productId) => {
      const product = productsStore.products.find(
        (record) => record.id === productId,
      )
      if (jumlah > product.stok) {
        throw new Error(
          `Jumlah produk "${product.nama}" melebihi stok tersedia.`,
        )
      }
    })

    const checkoutTotal = normalizedItems.reduce(
      (sum, item) => sum + item.jumlah * item.harga_satuan,
      0,
    )
    if (!Number.isSafeInteger(checkoutTotal) || checkoutTotal <= 0) {
      throw new Error('Total transaksi tidak valid.')
    }

    const paid = Number(uangDibayar.value)
    if (!Number.isSafeInteger(paid) || paid < checkoutTotal) {
      throw new Error('Uang dibayar kurang dari total transaksi.')
    }

    return { items: normalizedItems, uang_dibayar: paid }
  }

  function clear() {
    items.value = []
    uangDibayar.value = ''
  }

  return {
    items,
    uangDibayar,
    itemsWithSubtotals,
    total,
    kembalian,
    addItem,
    updateQuantity,
    updateUnitPrice,
    removeItem,
    setAmountPaid,
    validateCheckout,
    clear,
  }
})
