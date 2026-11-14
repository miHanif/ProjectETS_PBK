import { defineStore } from 'pinia'
import { ref } from 'vue'
import categoriesSeed from '../data/seed/categories.json'
import { STORAGE_KEYS } from '../constants/storageKeys.js'
import {
  appendRecord,
  loadCollection,
  removeRecord,
  updateRecord,
} from './collectionStorage.js'
import { useProductsStore } from './products.js'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref([])

  function initialize() {
    categories.value = loadCollection(STORAGE_KEYS.CATEGORIES, categoriesSeed)
  }

  function normalizeCategory(name, excludedId) {
    if (typeof name !== 'string' || !name.trim()) {
      throw new Error('Nama kategori wajib diisi.')
    }

    const normalizedName = name.trim()
    const duplicate = categories.value.some(
      (category) =>
        category.id !== excludedId &&
        category.nama.trim().toLocaleLowerCase() ===
          normalizedName.toLocaleLowerCase(),
    )

    if (duplicate) {
      throw new Error('Nama kategori sudah digunakan.')
    }

    return normalizedName
  }

  function addCategory(category) {
    const normalized = normalizeCategory(category.nama)
    const id = Math.max(0, ...categories.value.map((record) => record.id)) + 1
    categories.value = appendRecord(STORAGE_KEYS.CATEGORIES, categories.value, {
      ...category,
      id,
      nama: normalized,
    })
  }

  function updateCategory(id, changes) {
    const normalized = normalizeCategory(changes.nama, id)
    categories.value = updateRecord(STORAGE_KEYS.CATEGORIES, categories.value, id, {
      ...changes,
      nama: normalized,
    })
  }

  function removeCategory(id) {
    const productsStore = useProductsStore()
    if (productsStore.products.some((product) => product.category_id === id)) {
      throw new Error('Kategori tidak dapat dihapus karena masih digunakan oleh produk.')
    }

    categories.value = removeRecord(STORAGE_KEYS.CATEGORIES, categories.value, id)
  }

  return { categories, initialize, addCategory, updateCategory, removeCategory }
})
