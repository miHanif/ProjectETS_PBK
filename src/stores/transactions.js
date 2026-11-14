import { defineStore } from 'pinia'
import { ref } from 'vue'
import transactionsSeed from '../data/seed/transactions.json'
import transactionItemsSeed from '../data/seed/transaction_items.json'
import { STORAGE_KEYS } from '../constants/storageKeys.js'
import { appendRecords, loadCollection } from './collectionStorage.js'
import { writeStorage } from '../services/storage.js'

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref([])
  const transactionItems = ref([])

  function initialize() {
    transactions.value = loadCollection(STORAGE_KEYS.TRANSACTIONS, transactionsSeed)
    transactionItems.value = loadCollection(
      STORAGE_KEYS.TRANSACTION_ITEMS,
      transactionItemsSeed,
    )
  }

  function addTransaction(transaction, items) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new TypeError('Transaksi harus memiliki minimal satu item.')
    }

    const nextTransactions = appendRecords(transactions.value, [transaction])
    const nextItems = appendRecords(transactionItems.value, items)
    writeStorage(STORAGE_KEYS.TRANSACTION_ITEMS, nextItems)
    writeStorage(STORAGE_KEYS.TRANSACTIONS, nextTransactions)
    transactions.value = nextTransactions
    transactionItems.value = nextItems
  }

  return { transactions, transactionItems, initialize, addTransaction }
})
