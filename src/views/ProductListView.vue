<script setup>
import AlertMessage from '../components/common/AlertMessage.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseModal from '../components/common/BaseModal.vue'
import ConfirmDialog from '../components/common/ConfirmDialog.vue'
import PageHeader from '../components/common/PageHeader.vue'
import ProductFilterBar from '../components/features/products/ProductFilterBar.vue'
import ProductForm from '../components/features/products/ProductForm.vue'
import ProductTable from '../components/features/products/ProductTable.vue'
import { useProductManagement } from '../composables/useProductManagement.js'

const {
  categoriesStore,
  canEdit,
  filters,
  productModalOpen,
  editingProduct,
  productToDeactivate,
  productToActivate,
  productFormErrors,
  notice,
  filteredProducts,
  deactivationMessage,
  activationMessage,
  openProductForm,
  closeProductForm,
  saveProduct,
  requestDeactivation,
  requestActivation,
  deactivateSelectedProduct,
  activateSelectedProduct,
} = useProductManagement()
</script>

<template>
  <section class="page feature-page">
    <PageHeader
      title="Produk"
      subtitle="Cari, lihat, dan kelola daftar produk."
    />

    <div v-if="canEdit" class="feature-page-actions">
      <BaseButton label="Tambah produk" @click="openProductForm()" />
    </div>

    <AlertMessage
      v-if="notice.message"
      :type="notice.type"
      :message="notice.message"
      dismiss-label="Tutup pesan"
      @dismiss="notice = { type: '', message: '' }"
    />

    <ProductFilterBar
      :categories="categoriesStore.categories"
      :keyword="filters.keyword"
      :category-id="filters.categoryId"
      :only-low-stock="filters.onlyLowStock"
      :status="filters.status"
      @update:filter="filters = $event"
    />

    <ProductTable
      :products="filteredProducts"
      :categories="categoriesStore.categories"
      :can-edit="canEdit"
      @edit="openProductForm"
      @deactivate="requestDeactivation"
      @activate="requestActivation"
    />

    <BaseModal
      :open="productModalOpen"
      :title="editingProduct ? 'Ubah produk' : 'Tambah produk'"
      close-label="Tutup formulir"
      @close="closeProductForm"
    >
      <ProductForm
        :product="editingProduct"
        :categories="categoriesStore.categories"
        :errors="productFormErrors"
        @submit="saveProduct"
        @cancel="closeProductForm"
      />
    </BaseModal>

    <ConfirmDialog
      :open="Boolean(productToDeactivate)"
      title="Konfirmasi penonaktifan"
      :message="deactivationMessage"
      confirm-label="Nonaktifkan"
      cancel-label="Batal"
      @confirm="deactivateSelectedProduct"
      @cancel="productToDeactivate = null"
    />

    <ConfirmDialog
      :open="Boolean(productToActivate)"
      title="Konfirmasi aktivasi"
      :message="activationMessage"
      confirm-label="Aktifkan"
      cancel-label="Batal"
      @confirm="activateSelectedProduct"
      @cancel="productToActivate = null"
    />
  </section>
</template>
