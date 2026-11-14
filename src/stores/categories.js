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

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref([])

  function initialize() {
    categories.value = loadCollection(STORAGE_KEYS.CATEGORIES, categoriesSeed)
  }

  function addCategory(category) {
    categories.value = appendRecord(STORAGE_KEYS.CATEGORIES, categories.value, category)
  }

  function updateCategory(id, changes) {
    categories.value = updateRecord(STORAGE_KEYS.CATEGORIES, categories.value, id, changes)
  }

  function removeCategory(id) {
    categories.value = removeRecord(STORAGE_KEYS.CATEGORIES, categories.value, id)
  }

  return { categories, initialize, addCategory, updateCategory, removeCategory }
})
