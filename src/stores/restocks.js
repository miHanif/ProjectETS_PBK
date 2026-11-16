import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import restocksSeed from '../data/seed/restocks.json'
import restockItemsSeed from '../data/seed/restock_items.json'
import { STORAGE_KEYS } from '../constants/storageKeys.js'
import { USER_ROLES } from '../constants/roles.js'
import { appendRecords, loadCollection } from './collectionStorage.js'
import { writeStorage } from '../services/storage.js'
import { useAuthStore } from './auth.js'
import { useProductsStore } from './products.js'
import { localDateKey } from '../utils/formatters.js'

function isValidDateKey(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const date = new Date(`${value}T00:00:00`)
  return !Number.isNaN(date.getTime()) && localDateKey(date) === value
}

export const useRestocksStore = defineStore('restocks', () => {
  const restocks = ref([])
  const restockItems = ref([])
  const restockSummaries = computed(() =>
    restocks.value.map((restock) => {
      const items = restockItems.value.filter(
        (item) => item.restock_id === restock.id,
      )
      return {
        ...restock,
        jenisBarang: new Set(items.map((item) => item.product_id)).size,
        totalJumlah: items.reduce((total, item) => total + item.jumlah, 0),
        items,
      }
    }),
  )
  const latestPurchasePrices = computed(() => {
    const restockDates = new Map(
      restocks.value.map((restock) => [restock.id, restock.tanggal]),
    )
    const latestByProduct = new Map()

    restockItems.value.forEach((item) => {
      if (
        item.harga_beli === null ||
        item.harga_beli === undefined ||
        !Number.isSafeInteger(item.harga_beli) ||
        item.harga_beli < 0
      ) {
        return
      }

      const tanggal = restockDates.get(item.restock_id)
      const previous = latestByProduct.get(item.product_id)
      if (
        !tanggal ||
        (previous &&
          (tanggal < previous.tanggal ||
            (tanggal === previous.tanggal &&
              item.restock_id <= previous.restockId)))
      ) {
        return
      }

      latestByProduct.set(item.product_id, {
        harga_beli: item.harga_beli,
        tanggal,
        restockId: item.restock_id,
      })
    })

    return Object.fromEntries(
      Array.from(latestByProduct, ([productId, value]) => [
        productId,
        value.harga_beli,
      ]),
    )
  })

  function initialize() {
    restocks.value = loadCollection(STORAGE_KEYS.RESTOCKS, restocksSeed)
    restockItems.value = loadCollection(STORAGE_KEYS.RESTOCK_ITEMS, restockItemsSeed)
  }

  function addRestock({ tanggal, catatan, items }) {
    const authStore = useAuthStore()
    const productsStore = useProductsStore()

    if (!authStore.session || authStore.session.role !== USER_ROLES.OWNER) {
      throw new Error('Hanya Pemilik yang dapat mencatat restock.')
    }
    if (!isValidDateKey(tanggal)) {
      throw new Error('Tanggal wajib diisi dengan format yang valid.')
    }
    if (tanggal > localDateKey()) {
      throw new Error('Tanggal restock tidak boleh di masa depan.')
    }
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Restock harus memiliki minimal satu item.')
    }

    const normalizedItems = items.map((item) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        throw new Error('Produk wajib dipilih untuk setiap item restock.')
      }
      if (
        item.product_id === null ||
        item.product_id === undefined ||
        String(item.product_id).trim() === ''
      ) {
        throw new Error('Produk wajib dipilih untuk setiap item restock.')
      }

      const productId = Number(item.product_id)
      const product = productsStore.products.find(
        (record) => record.id === productId,
      )
      if (!Number.isInteger(productId) || !product) {
        throw new Error('Produk wajib dipilih untuk setiap item restock.')
      }

      const jumlah = Number(item.jumlah)
      if (!Number.isSafeInteger(jumlah) || jumlah <= 0) {
        throw new Error(`Jumlah produk "${product.nama}" harus bilangan bulat lebih dari 0.`)
      }

      const emptyPrice =
        item.harga_beli === null ||
        item.harga_beli === undefined ||
        (typeof item.harga_beli === 'string' && !item.harga_beli.trim())
      const hargaBeli = emptyPrice ? null : Number(item.harga_beli)
      if (
        hargaBeli !== null &&
        (!Number.isSafeInteger(hargaBeli) || hargaBeli < 0)
      ) {
        throw new Error(`Harga beli produk "${product.nama}" tidak boleh negatif dan harus berupa bilangan bulat.`)
      }

      return {
        product_id: productId,
        jumlah,
        harga_beli: hargaBeli,
      }
    })
    const id = Math.max(0, ...restocks.value.map((record) => record.id)) + 1
    const firstItemId =
      Math.max(0, ...restockItems.value.map((record) => record.id)) + 1
    const restock = {
      id,
      user_id: authStore.session.id,
      tanggal,
      catatan: typeof catatan === 'string' && catatan.trim() ? catatan.trim() : null,
    }
    const createdItems = normalizedItems.map((item, index) => ({
      id: firstItemId + index,
      restock_id: id,
      ...item,
    }))
    const nextRestocks = appendRecords(restocks.value, [restock])
    const nextItems = appendRecords(restockItems.value, createdItems)

    productsStore.adjustStock(
      normalizedItems.map((item) => ({
        productId: item.product_id,
        delta: item.jumlah,
      })),
    )
    writeStorage(STORAGE_KEYS.RESTOCK_ITEMS, nextItems)
    writeStorage(STORAGE_KEYS.RESTOCKS, nextRestocks)
    restocks.value = nextRestocks
    restockItems.value = nextItems
    return restock
  }

  return {
    restocks,
    restockItems,
    restockSummaries,
    latestPurchasePrices,
    initialize,
    addRestock,
  }
})
