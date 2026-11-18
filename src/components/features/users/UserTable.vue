<script setup>
import BaseButton from '../../common/BaseButton.vue'
import EmptyState from '../../common/EmptyState.vue'
import StatusBadge from '../../common/StatusBadge.vue'
import { USER_ROLES } from '../../../constants/roles.js'
import { getStatusPresentation } from '../../../utils/formatters.js'

const props = defineProps({
  users: { type: Array, required: true },
  currentUserId: { type: Number, default: null },
  activeOwnerCount: { type: Number, required: true },
})
const emit = defineEmits(['edit-user', 'toggle-user'])

function mayDeactivate(user) {
  return (
    user.id !== props.currentUserId &&
    !(
      user.aktif &&
      user.role === USER_ROLES.OWNER &&
      props.activeOwnerCount <= 1
    )
  )
}
</script>

<template>
  <div v-if="props.users.length" class="feature-table-wrapper">
    <table class="data-table user-table">
      <thead>
        <tr>
          <th>Nama</th>
          <th>Nama pengguna</th>
          <th>Peran</th>
          <th>Status</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in props.users" :key="user.id">
          <td>{{ user.nama }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.role }}</td>
          <td>
            <StatusBadge
              v-bind="getStatusPresentation(user.aktif ? 'aktif' : 'nonaktif')"
            />
          </td>
          <td>
            <div class="feature-table-actions">
              <BaseButton
                label="Ubah"
                variant="secondary"
                @click="emit('edit-user', user)"
              />
              <BaseButton
                v-if="user.aktif"
                label="Nonaktifkan"
                variant="danger"
                :disabled="!mayDeactivate(user)"
                @click="emit('toggle-user', user)"
              />
              <BaseButton
                v-else
                label="Aktifkan"
                @click="emit('toggle-user', user)"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <EmptyState v-else message="Belum ada akun." />
</template>
