import { defineStore } from 'pinia'
import { ref } from 'vue'
import { USER_ROLES } from '../constants/roles.js'
import { STORAGE_KEYS } from '../constants/storageKeys.js'
import { removeStorage, readStorage, writeStorage } from '../services/storage.js'
import { useUsersStore } from './users.js'

function createSession(user) {
  return {
    id: user.id,
    nama: user.nama,
    role: user.role,
  }
}

function isSession(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Number.isInteger(value.id) &&
    typeof value.nama === 'string' &&
    typeof value.role === 'string'
  )
}

export const useAuthStore = defineStore('auth', () => {
  const session = ref(null)
  const usersStore = useUsersStore()

  function initialize() {
    const savedSession = readStorage(STORAGE_KEYS.SESSION)

    if (savedSession === null) {
      session.value = null
      return
    }

    if (!isSession(savedSession)) {
      session.value = null
      removeStorage(STORAGE_KEYS.SESSION)
      return
    }

    const user = usersStore.users.find(
      (record) =>
        record.id === savedSession.id &&
        record.aktif &&
        record.role === savedSession.role &&
        Object.values(USER_ROLES).includes(record.role),
    )

    if (!user) {
      session.value = null
      removeStorage(STORAGE_KEYS.SESSION)
      return
    }

    session.value = createSession(user)
    if (
      Object.keys(savedSession).length !== 3 ||
      savedSession.nama !== session.value.nama
    ) {
      writeStorage(STORAGE_KEYS.SESSION, session.value)
    }
  }

  function login(username, password) {
    if (typeof username !== 'string' || typeof password !== 'string') {
      return false
    }

    const user = usersStore.users.find(
      (record) =>
        record.username === username &&
        record.password === password &&
        record.aktif &&
        Object.values(USER_ROLES).includes(record.role),
    )

    if (!user) {
      return false
    }

    const nextSession = createSession(user)
    writeStorage(STORAGE_KEYS.SESSION, nextSession)
    session.value = nextSession
    return true
  }

  function logout() {
    removeStorage(STORAGE_KEYS.SESSION)
    session.value = null
  }

  return { session, initialize, login, logout }
})
