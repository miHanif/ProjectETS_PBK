<script setup>
import { reactive, ref, watch } from 'vue'
import BaseButton from '../../common/BaseButton.vue'
import BaseInput from '../../common/BaseInput.vue'
import BaseSelect from '../../common/BaseSelect.vue'

const props = defineProps({
  product: {
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
const form = reactive({
  nama: '',
  category_id: '',
  harga_jual: '',
  stok: '',
  stok_minimum: '5',
})
const validationErrors = ref({})
const formError = ref('')

watch(
  () => props.errors.form,
  (error) => {
    formError.value = error ?? ''
  },
  { immediate: true },
)

function resetForm(product) {
  Object.assign(form, {
    nama: product?.nama ?? '',
    category_id: product ? String(product.category_id) : '',
    harga_jual: product ? String(product.harga_jual) : '',
    stok: product ? String(product.stok) : '',
    stok_minimum: product ? String(product.stok_minimum) : '5',
  })
  validationErrors.value = {}
}

watch(() => props.product, resetForm, { immediate: true })

function updateField(field, value) {
  form[field] = value
  delete validationErrors.value[field]
  delete validationErrors.value.form
  formError.value = ''
}

function submit() {
  const errors = {}
  const hargaJual = Number(form.harga_jual)
  const stok = Number(form.stok)
  const minimum = form.stok_minimum.trim() === '' ? 5 : Number(form.stok_minimum)

  if (!form.nama.trim()) {
    errors.nama = 'Nama wajib diisi.'
  }

  if (!form.category_id) {
    errors.category_id = 'Kategori wajib dipilih.'
  }

  if (!Number.isInteger(hargaJual) || hargaJual <= 0) {
    errors.harga_jual = 'Harga harus lebih dari 0 dan berupa bilangan bulat.'
  }

  if (!Number.isInteger(stok) || stok < 0) {
    errors.stok = 'Stok harus bilangan bulat dan tidak boleh negatif.'
  }

  if (!Number.isInteger(minimum) || minimum < 0) {
    errors.stok_minimum =
      'Stok minimum harus bilangan bulat dan tidak boleh negatif.'
  }

  validationErrors.value = errors
  if (Object.keys(errors).length) {
    return
  }

  emit('submit', {
    nama: form.nama.trim(),
    category_id: Number(form.category_id),
    harga_jual: hargaJual,
    stok,
    stok_minimum: minimum,
    aktif: props.product?.aktif ?? true,
  })
}
</script>

<template>
  <form class="feature-form" @submit.prevent="submit">
    <p v-if="formError" class="field-error" role="alert">
      {{ formError }}
    </p>
    <BaseInput
      :model-value="form.nama"
      label="Nama produk"
      :error="validationErrors.nama || props.errors.nama"
      @update:model-value="updateField('nama', $event)"
    />
    <BaseSelect
      :model-value="form.category_id"
      label="Kategori"
      :options="[
        { label: 'Pilih kategori', value: '' },
        ...props.categories.map((category) => ({
          label: category.nama,
          value: String(category.id),
        })),
      ]"
      :error="validationErrors.category_id || props.errors.category_id"
      @update:model-value="updateField('category_id', $event)"
    />
    <BaseInput
      :model-value="form.harga_jual"
      label="Harga jual (Rp)"
      type="number"
      :error="validationErrors.harga_jual || props.errors.harga_jual"
      @update:model-value="updateField('harga_jual', $event)"
    />
    <BaseInput
      :model-value="form.stok"
      label="Stok"
      type="number"
      :error="validationErrors.stok || props.errors.stok"
      @update:model-value="updateField('stok', $event)"
    />
    <BaseInput
      :model-value="form.stok_minimum"
      label="Stok minimum"
      type="number"
      :error="validationErrors.stok_minimum || props.errors.stok_minimum"
      @update:model-value="updateField('stok_minimum', $event)"
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
