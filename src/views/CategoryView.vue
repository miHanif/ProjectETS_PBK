<script setup>
import { computed, ref } from 'vue'
import AlertMessage from '../components/common/AlertMessage.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseModal from '../components/common/BaseModal.vue'
import ConfirmDialog from '../components/common/ConfirmDialog.vue'
import PageHeader from '../components/common/PageHeader.vue'
import CategoryForm from '../components/features/categories/CategoryForm.vue'
import CategoryTable from '../components/features/categories/CategoryTable.vue'
import { useCategoriesStore } from '../stores/categories.js'

const categoriesStore = useCategoriesStore()
const categoryModalOpen = ref(false)
const editingCategory = ref(null)
const categoryToDelete = ref(null)
const categoryFormErrors = ref({})
const notice = ref({ type: '', message: '' })

const deleteMessage = computed(() =>
  categoryToDelete.value
    ? `Kategori "${categoryToDelete.value.nama}" akan dihapus.`
    : '',
)

function showNotice(message, type = 'sukses') {
  notice.value = { type, message }
}

function openCategoryForm(category = null) {
  editingCategory.value = category
  categoryFormErrors.value = {}
  categoryModalOpen.value = true
}

function closeCategoryForm() {
  categoryModalOpen.value = false
  editingCategory.value = null
  categoryFormErrors.value = {}
}

function saveCategory(category) {
  try {
    if (editingCategory.value) {
      categoriesStore.updateCategory(editingCategory.value.id, category)
      showNotice('Perubahan kategori berhasil disimpan.')
    } else {
      categoriesStore.addCategory(category)
      showNotice('Kategori berhasil ditambahkan.')
    }

    closeCategoryForm()
  } catch (error) {
    categoryFormErrors.value = {
      form: error instanceof Error ? error.message : String(error),
    }
  }
}

function requestCategoryDeletion(category) {
  const productCount = categoriesStore.productCountsByCategory[category.id] ?? 0

  if (productCount > 0) {
    showNotice(
      `Kategori "${category.nama}" tidak dapat dihapus karena masih digunakan oleh ${productCount} produk.`,
      'bahaya',
    )
    return
  }

  categoryToDelete.value = category
}

function deleteSelectedCategory() {
  const category = categoryToDelete.value
  if (!category) {
    return
  }

  try {
    categoriesStore.removeCategory(category.id)
    showNotice(`Kategori "${category.nama}" berhasil dihapus.`)
  } catch (error) {
    showNotice(error instanceof Error ? error.message : String(error), 'bahaya')
  } finally {
    categoryToDelete.value = null
  }
}
</script>

<template>
  <section class="page feature-page">
    <PageHeader
      title="Kategori"
      subtitle="Kelola kategori yang digunakan untuk mengelompokkan produk."
    />

    <div class="feature-page-actions">
      <BaseButton label="Tambah kategori" @click="openCategoryForm()" />
    </div>

    <AlertMessage
      v-if="notice.message"
      :type="notice.type"
      :message="notice.message"
      dismiss-label="Tutup pesan"
      @dismiss="notice = { type: '', message: '' }"
    />

    <CategoryTable
      :categories="categoriesStore.categories"
      :product-counts="categoriesStore.productCountsByCategory"
      @edit="openCategoryForm"
      @delete="requestCategoryDeletion"
    />

    <BaseModal
      :open="categoryModalOpen"
      :title="editingCategory ? 'Ubah kategori' : 'Tambah kategori'"
      close-label="Tutup formulir"
      @close="closeCategoryForm"
    >
      <CategoryForm
        :category="editingCategory"
        :categories="categoriesStore.categories"
        :errors="categoryFormErrors"
        @submit="saveCategory"
        @cancel="closeCategoryForm"
      />
    </BaseModal>

    <ConfirmDialog
      :open="Boolean(categoryToDelete)"
      title="Konfirmasi penghapusan"
      :message="deleteMessage"
      confirm-label="Hapus"
      cancel-label="Batal"
      @confirm="deleteSelectedCategory"
      @cancel="categoryToDelete = null"
    />
  </section>
</template>
