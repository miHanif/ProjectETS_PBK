import { defineStore } from 'pinia'
import { ref } from 'vue'
import restocksSeed from '../data/seed/restocks.json'
import restockItemsSeed from '../data/seed/restock_items.json'
import { STORAGE_KEYS } from '../constants/storageKeys.js'
import { appendRecords, loadCollection } from './collectionStorage.js'
import { writeStorage } from '../services/storage.js'

export const useRestocksStore = defineStore('restocks', () => {
  const restocks = ref([])
  const restockItems = ref([])

  function initialize() {
    restocks.value = loadCollection(STORAGE_KEYS.RESTOCKS, restocksSeed)
    restockItems.value = loadCollection(STORAGE_KEYS.RESTOCK_ITEMS, restockItemsSeed)
  }

  function addRestock(restock, items) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new TypeError('Restock harus memiliki minimal satu item.')
    }

    const nextRestocks = appendRecords(restocks.value, [restock])
    const nextItems = appendRecords(restockItems.value, items)
    writeStorage(STORAGE_KEYS.RESTOCK_ITEMS, nextItems)
    writeStorage(STORAGE_KEYS.RESTOCKS, nextRestocks)
    restocks.value = nextRestocks
    restockItems.value = nextItems
  }

  return { restocks, restockItems, initialize, addRestock }
})
