import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import transactionsSeed from '../data/seed/transactions.json'
import transactionItemsSeed from '../data/seed/transaction_items.json'
import { STORAGE_KEYS } from '../constants/storageKeys.js'
import { TRANSACTION_STATUSES } from '../constants/business.js'
import { USER_ROLES } from '../constants/roles.js'
import { appendRecords, loadCollection } from './collectionStorage.js'
import { writeStorage } from '../services/storage.js'
import { useAuthStore } from './auth.js'
import { useProductsStore } from './products.js'
import { getReportDateRange, localDateKey } from '../utils/formatters.js'

function localDateTime(date) {
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref([])
  const transactionItems = ref([])
  const todaySummary = computed(() => {
    const todayTransactions = transactions.value.filter(
      (transaction) =>
        transaction.status === TRANSACTION_STATUSES.COMPLETED &&
        transaction.tanggal.slice(0, 10) === localDateKey(),
    )

    return {
      transactionCount: todayTransactions.length,
      totalSales: todayTransactions.reduce(
        (total, transaction) => total + transaction.total,
        0,
      ),
    }
  })
  const reportForPeriod = computed(() => (mode, period) => {
    const range = getReportDateRange(mode, period)
    if (!range) {
      return {
        hasTransactions: false,
        summary: { transactionCount: 0, totalSales: 0, quantitySold: 0 },
        products: [],
        days: [],
      }
    }

    const periodTransactions = transactions.value.filter(
      (transaction) =>
        transaction.status === TRANSACTION_STATUSES.COMPLETED &&
        transaction.tanggal.slice(0, 10) >= range.start &&
        transaction.tanggal.slice(0, 10) <= range.end,
    )
    const transactionIds = new Set(periodTransactions.map(({ id }) => id))
    const transactionDates = new Map(
      periodTransactions.map(({ id, tanggal }) => [id, tanggal.slice(0, 10)]),
    )
    const productTotals = new Map()
    const dayTotals = new Map()
    let totalSales = 0
    let quantitySold = 0

    transactionItems.value.forEach((item) => {
      if (!transactionIds.has(item.transaction_id)) {
        return
      }

      const subtotal = item.jumlah * item.harga_satuan
      const date = transactionDates.get(item.transaction_id)
      totalSales += subtotal
      quantitySold += item.jumlah

      const productTotal = productTotals.get(item.product_id) ?? {
        product_id: item.product_id,
        quantitySold: 0,
        totalSales: 0,
      }
      productTotal.quantitySold += item.jumlah
      productTotal.totalSales += subtotal
      productTotals.set(item.product_id, productTotal)

      const dayTotal = dayTotals.get(date) ?? {
        date,
        transactionCount: 0,
        totalSales: 0,
      }
      dayTotal.totalSales += subtotal
      dayTotals.set(date, dayTotal)
    })

    periodTransactions.forEach((transaction) => {
      const date = transaction.tanggal.slice(0, 10)
      const dayTotal = dayTotals.get(date) ?? {
        date,
        transactionCount: 0,
        totalSales: 0,
      }
      dayTotal.transactionCount += 1
      dayTotals.set(date, dayTotal)
    })

    const productsStore = useProductsStore()
    return {
      hasTransactions: periodTransactions.length > 0,
      summary: {
        transactionCount: periodTransactions.length,
        totalSales,
        quantitySold,
      },
      products: Array.from(productTotals.values())
        .map((product) => ({
          ...product,
          nama:
            productsStore.products.find(
              (record) => record.id === product.product_id,
            )?.nama ?? `Produk #${product.product_id}`,
        }))
        .sort(
          (a, b) =>
            b.quantitySold - a.quantitySold ||
            b.totalSales - a.totalSales ||
            a.nama.localeCompare(b.nama, 'id'),
        ),
      days:
        mode === 'bulanan'
          ? Array.from(dayTotals.values()).sort((a, b) =>
              a.date.localeCompare(b.date),
            )
          : [],
    }
  })

  function initialize() {
    const loadedTransactions = loadCollection(
      STORAGE_KEYS.TRANSACTIONS,
      transactionsSeed,
    )
    let migrated = false
    transactions.value = loadedTransactions.map((transaction) => {
      const next = {
        ...transaction,
        status: transaction.status ?? TRANSACTION_STATUSES.COMPLETED,
        alasan_batal: transaction.alasan_batal ?? null,
        dibatalkan_oleh: transaction.dibatalkan_oleh ?? null,
      }

      if (
        transaction.status == null ||
        !Object.prototype.hasOwnProperty.call(transaction, 'alasan_batal') ||
        !Object.prototype.hasOwnProperty.call(transaction, 'dibatalkan_oleh')
      ) {
        migrated = true
      }

      return next
    })
    if (migrated) {
      writeStorage(STORAGE_KEYS.TRANSACTIONS, transactions.value)
    }
    transactionItems.value = loadCollection(
      STORAGE_KEYS.TRANSACTION_ITEMS,
      transactionItemsSeed,
    )
  }

  function addTransaction({ items, uang_dibayar }) {
    const authStore = useAuthStore()
    const productsStore = useProductsStore()
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Keranjang tidak boleh kosong.')
    }
    if (!authStore.session) {
      throw new Error('Sesi pengguna tidak ditemukan. Silakan masuk kembali.')
    }

    const quantities = new Map()
    const prices = new Map()
    items.forEach((item) => {
      const product = productsStore.products.find(
        (record) => record.id === item.product_id,
      )
      if (!product || !product.aktif) {
        throw new Error('Produk tidak tersedia untuk transaksi.')
      }

      if (!Number.isInteger(item.jumlah) || item.jumlah <= 0) {
        throw new Error(`Jumlah produk "${product.nama}" harus bilangan bulat lebih dari 0.`)
      }
      if (!Number.isInteger(item.harga_satuan) || item.harga_satuan <= 0) {
        throw new Error(`Harga satuan produk "${product.nama}" harus lebih dari 0.`)
      }

      quantities.set(
        product.id,
        (quantities.get(product.id) ?? 0) + item.jumlah,
      )
      prices.set(product.id, item.harga_satuan)
    })

    const normalizedItems = Array.from(quantities, ([productId, jumlah]) => {
      const product = productsStore.products.find(
        (record) => record.id === productId,
      )
      if (jumlah > product.stok) {
        throw new Error(`Jumlah produk "${product.nama}" melebihi stok tersedia.`)
      }

      return {
        product,
        jumlah,
        harga_satuan: prices.get(productId),
      }
    })
    const total = normalizedItems.reduce(
      (sum, item) => sum + item.jumlah * item.harga_satuan,
      0,
    )
    if (!Number.isSafeInteger(total) || total <= 0) {
      throw new Error('Total transaksi tidak valid.')
    }
    const paid = Number(uang_dibayar)
    if (!Number.isSafeInteger(paid) || paid < total) {
      throw new Error('Uang dibayar kurang dari total transaksi.')
    }

    const transactionId =
      Math.max(0, ...transactions.value.map((record) => record.id)) + 1
    const firstItemId =
      Math.max(0, ...transactionItems.value.map((record) => record.id)) + 1
    const transaction = {
      id: transactionId,
      user_id: authStore.session.id,
      tanggal: localDateTime(new Date()),
      total,
      uang_dibayar: paid,
      kembalian: paid - total,
      status: TRANSACTION_STATUSES.COMPLETED,
      alasan_batal: null,
      dibatalkan_oleh: null,
    }
    const createdItems = normalizedItems.map((item, index) => ({
      id: firstItemId + index,
      transaction_id: transactionId,
      product_id: item.product.id,
      jumlah: item.jumlah,
      harga_normal: item.product.harga_jual,
      harga_satuan: item.harga_satuan,
      subtotal: item.jumlah * item.harga_satuan,
    }))
    const nextTransactions = appendRecords(transactions.value, [transaction])
    const nextItems = appendRecords(transactionItems.value, createdItems)

    productsStore.adjustStock(
      normalizedItems.map(({ product, jumlah }) => ({
        productId: product.id,
        delta: -jumlah,
      })),
    )
    writeStorage(STORAGE_KEYS.TRANSACTION_ITEMS, nextItems)
    writeStorage(STORAGE_KEYS.TRANSACTIONS, nextTransactions)
    transactions.value = nextTransactions
    transactionItems.value = nextItems
    return transaction
  }

  function cancelTransaction(id, reason) {
    const authStore = useAuthStore()
    const productsStore = useProductsStore()
    const transaction = transactions.value.find((record) => record.id === id)

    if (typeof reason !== 'string' || !reason.trim()) {
      throw new Error('Alasan pembatalan wajib diisi.')
    }
    if (!transaction) {
      throw new Error('Transaksi tidak ditemukan.')
    }
    if (transaction.status === TRANSACTION_STATUSES.CANCELLED) {
      throw new Error('Transaksi sudah dibatalkan.')
    }
    if (!authStore.session) {
      throw new Error('Sesi pengguna tidak ditemukan. Silakan masuk kembali.')
    }
    if (
      authStore.session.role !== USER_ROLES.OWNER &&
      authStore.session.role !== USER_ROLES.ASSISTANT
    ) {
      throw new Error('Pengguna tidak memiliki akses untuk membatalkan transaksi.')
    }
    if (
      authStore.session.role === USER_ROLES.ASSISTANT &&
      transaction.tanggal.slice(0, 10) !== localDateKey()
    ) {
      throw new Error('Asisten hanya dapat membatalkan transaksi hari ini.')
    }

    const items = transactionItems.value.filter(
      (item) => item.transaction_id === transaction.id,
    )
    if (items.length === 0) {
      throw new Error('Item transaksi tidak ditemukan; stok tidak dapat dikembalikan.')
    }

    const stockReturns = new Map()
    items.forEach((item) => {
      stockReturns.set(
        item.product_id,
        (stockReturns.get(item.product_id) ?? 0) + item.jumlah,
      )
    })
    const nextTransactions = transactions.value.map((record) =>
      record.id === id
        ? {
            ...record,
            status: TRANSACTION_STATUSES.CANCELLED,
            alasan_batal: reason.trim(),
            dibatalkan_oleh: authStore.session.id,
          }
        : record,
    )

    productsStore.adjustStock(
      Array.from(stockReturns, ([productId, jumlah]) => ({
        productId,
        delta: jumlah,
      })),
    )
    writeStorage(STORAGE_KEYS.TRANSACTIONS, nextTransactions)
    transactions.value = nextTransactions
  }

  return {
    transactions,
    transactionItems,
    todaySummary,
    reportForPeriod,
    initialize,
    addTransaction,
    cancelTransaction,
  }
})
