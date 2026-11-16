import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import productsSeed from '../data/seed/products.json'
import { STORAGE_KEYS } from '../constants/storageKeys.js'
import { appendRecord, loadCollection, updateRecord } from './collectionStorage.js'
import { writeStorage } from '../services/storage.js'

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const lowStockProducts = computed(() =>
    products.value.filter(
      (product) => product.aktif && product.stok <= product.stok_minimum,
    ),
  )
  const lowStockCount = computed(() => lowStockProducts.value.length)

  function initialize() {
    products.value = loadCollection(STORAGE_KEYS.PRODUCTS, productsSeed)
  }

  function addProduct(product) {
    const id = Math.max(0, ...products.value.map((record) => record.id)) + 1
    products.value = appendRecord(STORAGE_KEYS.PRODUCTS, products.value, {
      ...product,
      id,
    })
  }

  function updateProduct(id, changes) {
    products.value = updateRecord(STORAGE_KEYS.PRODUCTS, products.value, id, changes)
  }

  function deactivateProduct(id) {
    updateProduct(id, { aktif: false })
  }

  function activateProduct(id) {
    updateProduct(id, { aktif: true })
  }

  function adjustStock(adjustments) {
    if (!Array.isArray(adjustments)) {
      throw new TypeError('Perubahan stok harus berupa daftar.')
    }

    const changesById = new Map()
    adjustments.forEach(({ productId, delta }) => {
      if (!Number.isInteger(productId) || !Number.isInteger(delta)) {
        throw new TypeError('Perubahan stok tidak valid.')
      }

      changesById.set(productId, (changesById.get(productId) ?? 0) + delta)
    })

    const nextProducts = products.value.map((product) => {
      const delta = changesById.get(product.id) ?? 0
      const stok = product.stok + delta

      if (!Number.isSafeInteger(stok) || stok < 0) {
        throw new Error(`Stok produk "${product.nama}" tidak mencukupi.`)
      }

      changesById.delete(product.id)
      return delta === 0 ? product : { ...product, stok }
    })

    if (changesById.size > 0) {
      throw new Error('Produk untuk perubahan stok tidak ditemukan.')
    }

    writeStorage(STORAGE_KEYS.PRODUCTS, nextProducts)
    products.value = nextProducts
  }

  return {
    products,
    lowStockProducts,
    lowStockCount,
    initialize,
    addProduct,
    updateProduct,
    deactivateProduct,
    activateProduct,
    adjustStock,
  }
})
