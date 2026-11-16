<script setup>
import { computed, ref } from 'vue'
import AlertMessage from '../components/common/AlertMessage.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseModal from '../components/common/BaseModal.vue'
import ConfirmDialog from '../components/common/ConfirmDialog.vue'
import PageHeader from '../components/common/PageHeader.vue'
import UserForm from '../components/features/users/UserForm.vue'
import UserTable from '../components/features/users/UserTable.vue'
import { USER_ROLES } from '../constants/roles.js'
import { useAuthStore } from '../stores/auth.js'
import { useUsersStore } from '../stores/users.js'

const authStore = useAuthStore()
const usersStore = useUsersStore()
const formOpen = ref(false)
const editingUser = ref(null)
const userToToggle = ref(null)
const formErrors = ref({})
const notice = ref({ type: '', message: '' })
const activeOwnerCount = computed(
  () =>
    usersStore.users.filter(
      (user) => user.aktif && user.role === USER_ROLES.OWNER,
    )
      .length,
)
const toggleMessage = computed(() => {
  if (!userToToggle.value) return ''
  return userToToggle.value.aktif
    ? `Nonaktifkan akun "${userToToggle.value.nama}"?`
    : `Aktifkan kembali akun "${userToToggle.value.nama}"?`
})

function openForm(user = null) {
  editingUser.value = user
  formErrors.value = {}
  formOpen.value = true
}

function closeForm() {
  formOpen.value = false
  editingUser.value = null
  formErrors.value = {}
}

function saveUser(user) {
  try {
    if (editingUser.value) {
      usersStore.updateUser(editingUser.value.id, user)
      notice.value = { type: 'sukses', message: 'Perubahan akun berhasil disimpan.' }
    } else {
      usersStore.addUser(user)
      notice.value = { type: 'sukses', message: 'Akun berhasil ditambahkan.' }
    }
    closeForm()
  } catch (error) {
    formErrors.value = {
      form: error instanceof Error ? error.message : String(error),
    }
  }
}

function confirmToggle() {
  const user = userToToggle.value
  if (!user) return

  try {
    if (user.aktif) {
      usersStore.deactivateUser(user.id)
      notice.value = { type: 'sukses', message: 'Akun berhasil dinonaktifkan.' }
    } else {
      usersStore.activateUser(user.id)
      notice.value = { type: 'sukses', message: 'Akun berhasil diaktifkan.' }
    }
  } catch (error) {
    notice.value = {
      type: 'bahaya',
      message: error instanceof Error ? error.message : String(error),
    }
  } finally {
    userToToggle.value = null
  }
}
</script>

<template>
  <section class="page feature-page">
    <PageHeader
      title="Kelola Akun"
      subtitle="Atur akun pengguna dan hak akses sistem."
    />
    <AlertMessage
      v-if="notice.message"
      :type="notice.type"
      :message="notice.message"
      dismiss-label="Tutup pesan"
      @dismiss="notice = { type: '', message: '' }"
    />
    <div class="feature-page-actions">
      <BaseButton label="Tambah Akun" @click="openForm()" />
    </div>
    <UserTable
      :users="usersStore.users"
      :current-user-id="authStore.session?.id ?? null"
      :active-owner-count="activeOwnerCount"
      @edit-user="openForm"
      @toggle-user="userToToggle = $event"
    />
    <BaseModal
      :open="formOpen"
      :title="editingUser ? 'Ubah Akun' : 'Tambah Akun'"
      close-label="Tutup formulir"
      @close="closeForm"
    >
      <UserForm
        :account="editingUser"
        :users="usersStore.users"
        :errors="formErrors"
        :active-owner-count="activeOwnerCount"
        @submit="saveUser"
        @cancel="closeForm"
      />
    </BaseModal>
    <ConfirmDialog
      :open="Boolean(userToToggle)"
      :title="userToToggle?.aktif ? 'Nonaktifkan Akun' : 'Aktifkan Akun'"
      :message="toggleMessage"
      :confirm-label="userToToggle?.aktif ? 'Nonaktifkan' : 'Aktifkan'"
      cancel-label="Batal"
      @confirm="confirmToggle"
      @cancel="userToToggle = null"
    />
  </section>
</template>
