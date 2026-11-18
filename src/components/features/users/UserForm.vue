<script setup>
import { reactive, watch } from 'vue'
import BaseButton from '../../common/BaseButton.vue'
import BaseInput from '../../common/BaseInput.vue'
import BaseSelect from '../../common/BaseSelect.vue'
import { USER_ROLE_OPTIONS, USER_ROLES } from '../../../constants/roles.js'
import { MIN_PASSWORD_LENGTH } from '../../../constants/business.js'

const props = defineProps({
  account: { type: Object, default: null },
  users: { type: Array, required: true },
  errors: { type: Object, default: () => ({}) },
  activeOwnerCount: { type: Number, required: true },
})
const emit = defineEmits(['submit', 'cancel'])
const form = reactive({ nama: '', username: '', password: '', role: '' })
const errors = reactive({ nama: '', username: '', password: '', role: '' })

watch(
  () => props.account,
  (account) => {
    form.nama = account?.nama ?? ''
    form.username = account?.username ?? ''
    form.password = ''
    form.role = account?.role ?? ''
    clearErrors()
  },
  { immediate: true },
)

function clearErrors() {
  errors.nama = ''
  errors.username = ''
  errors.password = ''
  errors.role = ''
}

function submit() {
  clearErrors()
  const nama = form.nama.trim()
  const username = form.username.trim()

  if (!nama) errors.nama = 'Nama wajib diisi.'
  if (!username) errors.username = 'Nama pengguna wajib diisi.'
  else if (/\s/.test(username)) errors.username = 'Nama pengguna tidak boleh mengandung spasi.'
  else if (
    props.users.some(
      (user) =>
        user.id !== props.account?.id &&
        user.username.toLocaleLowerCase() === username.toLocaleLowerCase(),
    )
  ) {
    errors.username = 'Nama pengguna sudah digunakan.'
  }
  if (!props.account && form.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Kata sandi minimal ${MIN_PASSWORD_LENGTH} karakter.`
  } else if (
    props.account &&
    form.password &&
    form.password.length < MIN_PASSWORD_LENGTH
  ) {
    errors.password = `Kata sandi minimal ${MIN_PASSWORD_LENGTH} karakter.`
  }
  if (!USER_ROLE_OPTIONS.some((option) => option.value === form.role)) {
    errors.role = 'Peran wajib dipilih.'
  }
  if (
    props.account?.aktif &&
    props.account.role === USER_ROLES.OWNER &&
    form.role !== USER_ROLES.OWNER &&
    props.activeOwnerCount <= 1
  ) {
    errors.role = 'Pemilik aktif terakhir tidak dapat mengubah peran.'
  }

  if (Object.values(errors).some(Boolean)) return

  emit('submit', {
    nama,
    username,
    password: form.password,
    role: form.role,
  })
}
</script>

<template>
  <form class="feature-form" @submit.prevent="submit">
    <p v-if="props.errors.form" class="field-error" role="alert">
      {{ props.errors.form }}
    </p>
    <BaseInput
      v-model="form.nama"
      label="Nama"
      :error="errors.nama || props.errors.nama"
    />
    <BaseInput
      v-model="form.username"
      label="Nama pengguna"
      :error="errors.username || props.errors.username"
    />
    <BaseInput
      v-model="form.password"
      type="password"
      :label="props.account ? 'Kata sandi (kosongkan jika tidak diubah)' : 'Kata sandi'"
      :error="errors.password || props.errors.password"
      autocomplete="new-password"
    />
    <BaseSelect
      v-model="form.role"
      label="Peran"
      :options="[{ label: 'Pilih peran', value: '' }, ...USER_ROLE_OPTIONS]"
      :error="errors.role || props.errors.role"
    />
    <div class="feature-form-actions">
      <BaseButton label="Batal" variant="secondary" @click="emit('cancel')" />
      <BaseButton label="Simpan" type="submit" />
    </div>
  </form>
</template>
