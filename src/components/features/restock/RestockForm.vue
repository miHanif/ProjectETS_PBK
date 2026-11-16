<script setup>
import { computed, ref, watch } from 'vue'
import BaseButton from '../../common/BaseButton.vue'
import BaseInput from '../../common/BaseInput.vue'
import RestockItemRow from './RestockItemRow.vue'

const props = defineProps({
  products: { type: Array, required: true },
  today: { type: String, required: true },
  resetKey: { type: Number, required: true },
})
const emit = defineEmits(['save-restock'])
let nextItemKey = 1
const tanggal = ref(props.today)
const catatan = ref('')
const items = ref([createItem()])
const errors = ref({ tanggal: '', form: '', items: [] })
const productOptions = computed(() => [
  { label: 'Pilih produk', value: '' },
  ...props.products.map((product) => ({
    label: product.nama,
    value: String(product.id),
  })),
])

function createItem() {
  return {
    key: nextItemKey++,
    product_id: '',
    jumlah: '1',
    harga_beli: '',
  }
}

function resetForm() {
  tanggal.value = props.today
  catatan.value = ''
  items.value = [createItem()]
  errors.value = { tanggal: '', form: '', items: [] }
}

watch(() => props.resetKey, resetForm)

function addItem() {
  items.value.push(createItem())
  errors.value.items.push({})
}

function updateItem({ key, field, value }) {
  items.value = items.value.map((item) =>
    item.key === key ? { ...item, [field]: value } : item,
  )
}

function removeItem(key) {
  const index = items.value.findIndex((item) => item.key === key)
  if (index < 0) {
    return
  }
  items.value.splice(index, 1)
  errors.value.items.splice(index, 1)
}

function submit() {
  const nextErrors = {
    tanggal: '',
    form: '',
    items: items.value.map(() => ({})),
  }

  if (!tanggal.value) {
    nextErrors.tanggal = 'Tanggal wajib diisi.'
  } else if (tanggal.value > props.today) {
    nextErrors.tanggal = 'Tanggal tidak boleh di masa depan.'
  }
  if (!items.value.length) {
    nextErrors.form = 'Restock harus memiliki minimal satu item.'
  }

  items.value.forEach((item, index) => {
    const product = props.products.find(
      (record) => record.id === Number(item.product_id),
    )
    if (!product) {
      nextErrors.items[index].product_id = 'Produk wajib dipilih.'
    }

    const quantity = Number(item.jumlah)
    if (!Number.isSafeInteger(quantity) || quantity <= 0) {
      nextErrors.items[index].jumlah =
        'Jumlah harus bilangan bulat lebih dari 0.'
    }

    if (item.harga_beli.trim() !== '') {
      const price = Number(item.harga_beli)
      if (!Number.isSafeInteger(price) || price < 0) {
        nextErrors.items[index].harga_beli =
          'Harga beli harus bilangan bulat dan tidak boleh negatif.'
      }
    }
  })

  errors.value = nextErrors
  const invalidItem = nextErrors.items.some(
    (item) => item.product_id || item.jumlah || item.harga_beli,
  )
  if (nextErrors.tanggal || nextErrors.form || invalidItem) {
    return
  }

  emit('save-restock', {
    tanggal: tanggal.value,
    catatan: catatan.value,
    items: items.value.map((item) => ({
      product_id: Number(item.product_id),
      jumlah: Number(item.jumlah),
      harga_beli: item.harga_beli.trim() === '' ? null : Number(item.harga_beli),
    })),
  })
}
</script>

<template>
  <section class="restock-card">
    <h2>Catat Restock</h2>
    <div class="restock-header-fields">
      <BaseInput v-model="tanggal" type="date" label="Tanggal" :error="errors.tanggal" />
      <BaseInput v-model="catatan" label="Catatan (opsional)" />
    </div>
    <p v-if="errors.form" class="field-error" role="alert">{{ errors.form }}</p>
    <div class="restock-items">
      <RestockItemRow
        v-for="(item, index) in items"
        :key="item.key"
        :item="item"
        :number="index + 1"
        :products="productOptions"
        :errors="errors.items[index] ?? {}"
        @update-field="updateItem"
        @remove="removeItem(item.key)"
      />
    </div>
    <div class="restock-form-actions">
      <BaseButton label="+ Tambah Barang" variant="secondary" @click="addItem" />
      <BaseButton label="Simpan Restock" @click="submit" />
    </div>
  </section>
</template>
