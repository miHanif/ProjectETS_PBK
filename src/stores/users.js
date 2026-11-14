import { defineStore } from 'pinia'
import { ref } from 'vue'
import usersSeed from '../data/seed/users.json'
import { STORAGE_KEYS } from '../constants/storageKeys.js'
import { appendRecord, loadCollection, updateRecord } from './collectionStorage.js'

export const useUsersStore = defineStore('users', () => {
  const users = ref([])

  function initialize() {
    users.value = loadCollection(STORAGE_KEYS.USERS, usersSeed)
  }

  function addUser(user) {
    users.value = appendRecord(STORAGE_KEYS.USERS, users.value, user)
  }

  function updateUser(id, changes) {
    users.value = updateRecord(STORAGE_KEYS.USERS, users.value, id, changes)
  }

  function deactivateUser(id) {
    updateUser(id, { aktif: false })
  }

  return { users, initialize, addUser, updateUser, deactivateUser }
})
