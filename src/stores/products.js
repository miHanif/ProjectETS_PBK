import { defineStore } from 'pinia'
import { ref } from 'vue'
import productsSeed from '../data/seed/products.json'
import { STORAGE_KEYS } from '../constants/storageKeys.js'
import { appendRecord, loadCollection, updateRecord } from './collectionStorage.js'

export const useProductsStore = defineStore('products', () => {
  const products = ref([])

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

  return {
    products,
    initialize,
    addProduct,
    updateProduct,
    deactivateProduct,
    activateProduct,
  }
})
