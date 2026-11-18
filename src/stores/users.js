import { defineStore } from 'pinia'
import { ref } from 'vue'
import usersSeed from '../data/seed/users.json'
import { MIN_PASSWORD_LENGTH } from '../constants/business.js'
import { USER_ROLES } from '../constants/roles.js'
import { STORAGE_KEYS } from '../constants/storageKeys.js'
import { appendRecord, loadCollection, updateRecord } from './collectionStorage.js'
import { useAuthStore } from './auth.js'

export const useUsersStore = defineStore('users', () => {
  const users = ref([])

  function initialize() {
    users.value = loadCollection(STORAGE_KEYS.USERS, usersSeed)
  }

  function requireOwner() {
    const authStore = useAuthStore()
    if (authStore.session?.role !== USER_ROLES.OWNER) {
      throw new Error('Hanya Pemilik yang dapat mengelola akun.')
    }
    return authStore
  }

  function validateFields(input, excludedId, currentUser = null) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      throw new Error('Data akun tidak valid.')
    }

    const nama = typeof input.nama === 'string' ? input.nama.trim() : ''
    const username =
      typeof input.username === 'string' ? input.username.trim() : ''
    const role = input.role

    if (!nama) {
      throw new Error('Nama wajib diisi.')
    }
    if (!username) {
      throw new Error('Nama pengguna wajib diisi.')
    }
    if (/\s/.test(username)) {
      throw new Error('Nama pengguna tidak boleh mengandung spasi.')
    }
    if (
      users.value.some(
        (user) =>
          user.id !== excludedId &&
          user.username.toLocaleLowerCase() === username.toLocaleLowerCase(),
      )
    ) {
      throw new Error('Nama pengguna sudah digunakan.')
    }
    if (!Object.values(USER_ROLES).includes(role)) {
      throw new Error('Peran wajib dipilih.')
    }

    let password
    if (!currentUser) {
      password = input.password
      if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
        throw new Error(`Kata sandi minimal ${MIN_PASSWORD_LENGTH} karakter.`)
      }
    } else if (input.password !== undefined && input.password !== '') {
      password = input.password
      if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
        throw new Error(`Kata sandi minimal ${MIN_PASSWORD_LENGTH} karakter.`)
      }
    }

    return {
      nama,
      username,
      role,
      ...(password === undefined ? {} : { password }),
    }
  }

  function activeOwnerCount() {
    return users.value.filter(
      (user) => user.aktif && user.role === USER_ROLES.OWNER,
    ).length
  }

  function addUser(user) {
    requireOwner()
    const normalized = validateFields(user, null)
    const id = Math.max(0, ...users.value.map((record) => record.id)) + 1
    users.value = appendRecord(STORAGE_KEYS.USERS, users.value, {
      ...normalized,
      id,
      aktif: true,
    })
  }

  function updateUser(id, changes) {
    const authStore = requireOwner()
    if (!changes || typeof changes !== 'object' || Array.isArray(changes)) {
      throw new Error('Data perubahan akun tidak valid.')
    }
    const currentUser = users.value.find((user) => user.id === id)
    if (!currentUser) {
      throw new Error(`Akun dengan id ${id} tidak ditemukan.`)
    }

    const normalized = validateFields(
      {
        nama: changes.nama ?? currentUser.nama,
        username: changes.username ?? currentUser.username,
        role: changes.role ?? currentUser.role,
        password: changes.password,
      },
      id,
      currentUser,
    )
    if (
      currentUser.aktif &&
      currentUser.role === USER_ROLES.OWNER &&
      normalized.role !== USER_ROLES.OWNER &&
      activeOwnerCount() <= 1
    ) {
      throw new Error('Pemilik aktif terakhir tidak dapat mengubah peran.')
    }

    users.value = updateRecord(
      STORAGE_KEYS.USERS,
      users.value,
      id,
      normalized,
    )
    authStore.syncUser(users.value.find((user) => user.id === id))
  }

  function deactivateUser(id) {
    const authStore = requireOwner()
    const user = users.value.find((record) => record.id === id)
    if (!user) {
      throw new Error(`Akun dengan id ${id} tidak ditemukan.`)
    }
    if (authStore.session.id === id) {
      throw new Error('Pemilik tidak dapat menonaktifkan akunnya sendiri.')
    }
    if (
      user.aktif &&
      user.role === USER_ROLES.OWNER &&
      activeOwnerCount() <= 1
    ) {
      throw new Error('Pemilik aktif terakhir tidak dapat dinonaktifkan.')
    }

    users.value = updateRecord(STORAGE_KEYS.USERS, users.value, id, {
      aktif: false,
    })
  }

  function activateUser(id) {
    requireOwner()
    users.value = updateRecord(STORAGE_KEYS.USERS, users.value, id, {
      aktif: true,
    })
  }

  return {
    users,
    activeOwnerCount,
    initialize,
    addUser,
    updateUser,
    deactivateUser,
    activateUser,
  }
})
