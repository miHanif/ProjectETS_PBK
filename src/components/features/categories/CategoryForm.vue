<script setup>
import { reactive, ref, watch } from 'vue'
import BaseButton from '../../common/BaseButton.vue'
import BaseInput from '../../common/BaseInput.vue'

const props = defineProps({
  category: {
    type: Object,
    default: null,
  },
  categories: {
    type: Array,
    default: () => [],
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['submit', 'cancel'])
const form = reactive({ nama: '' })
const validationError = ref('')
const formError = ref('')

watch(
  () => props.errors.form,
  (error) => {
    formError.value = error ?? ''
  },
  { immediate: true },
)

watch(
  () => props.category,
  (category) => {
    form.nama = category?.nama ?? ''
    validationError.value = ''
  },
  { immediate: true },
)

function submit() {
  const nama = form.nama.trim()

  if (!nama) {
    validationError.value = 'Nama kategori wajib diisi.'
    return
  }

  const normalizedName = nama.toLocaleLowerCase()
  const duplicate = props.categories.some(
    (category) =>
      category.id !== props.category?.id &&
      category.nama.trim().toLocaleLowerCase() === normalizedName,
  )

  if (duplicate) {
    validationError.value = 'Nama kategori sudah digunakan.'
    return
  }

  validationError.value = ''
  emit('submit', { nama })
}

function updateName(value) {
  form.nama = value
  validationError.value = ''
  formError.value = ''
}
</script>

<template>
  <form class="feature-form" @submit.prevent="submit">
    <p v-if="formError" class="field-error" role="alert">
      {{ formError }}
    </p>
    <BaseInput
      :model-value="form.nama"
      label="Nama kategori"
      :error="validationError || props.errors.nama"
      @update:model-value="updateName"
    />
    <div class="feature-form-actions">
      <BaseButton
        label="Batal"
        variant="secondary"
        @click="emit('cancel')"
      />
      <BaseButton label="Simpan" type="submit" />
    </div>
  </form>
</template>
