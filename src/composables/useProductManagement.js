import { computed, ref } from 'vue'
import { USER_ROLES } from '../constants/roles.js'
import { useAuthStore } from '../stores/auth.js'
import { useCategoriesStore } from '../stores/categories.js'
import { useProductsStore } from '../stores/products.js'

export function useProductManagement() {
  const productsStore = useProductsStore()
  const categoriesStore = useCategoriesStore()
  const authStore = useAuthStore()
  const canEdit = computed(() => authStore.session?.role === USER_ROLES.OWNER)
  const filters = ref({
    keyword: '',
    categoryId: '',
    onlyLowStock: false,
    status: 'semua',
  })
  const productModalOpen = ref(false)
  const editingProduct = ref(null)
  const productToDeactivate = ref(null)
  const productToActivate = ref(null)
  const productFormErrors = ref({})
  const notice = ref({ type: '', message: '' })

  const filteredProducts = computed(() => {
    const keyword = filters.value.keyword.trim().toLocaleLowerCase()

    return productsStore.products.filter((product) => {
      const matchesKeyword = product.nama.toLocaleLowerCase().includes(keyword)
      const matchesCategory =
        !filters.value.categoryId ||
        String(product.category_id) === String(filters.value.categoryId)
      const matchesStock =
        !filters.value.onlyLowStock ||
        (product.stok > 0 && product.stok <= product.stok_minimum)
      const matchesStatus =
        filters.value.status === 'semua' ||
        (filters.value.status === 'aktif' ? product.aktif : !product.aktif)

      return matchesKeyword && matchesCategory && matchesStock && matchesStatus
    })
  })

  const deactivationMessage = computed(() =>
    productToDeactivate.value
      ? `Produk "${productToDeactivate.value.nama}" akan dinonaktifkan dan tetap tersimpan dalam daftar.`
      : '',
  )

  const activationMessage = computed(() =>
    productToActivate.value
      ? `Aktifkan kembali produk "${productToActivate.value.nama}"?`
      : '',
  )

  function showNotice(message, type = 'sukses') {
    notice.value = { type, message }
  }

  function openProductForm(product = null) {
    editingProduct.value = product
    productFormErrors.value = {}
    productModalOpen.value = true
  }

  function closeProductForm() {
    productModalOpen.value = false
    editingProduct.value = null
    productFormErrors.value = {}
  }

  function saveProduct(product) {
    try {
      if (editingProduct.value) {
        productsStore.updateProduct(editingProduct.value.id, product)
        showNotice('Perubahan produk berhasil disimpan.')
      } else {
        productsStore.addProduct(product)
        showNotice('Produk berhasil ditambahkan.')
      }

      closeProductForm()
    } catch (error) {
      productFormErrors.value = {
        form: error instanceof Error ? error.message : String(error),
      }
    }
  }

  function requestDeactivation(product) {
    productToDeactivate.value = product
  }

  function requestActivation(product) {
    productToActivate.value = product
  }

  function deactivateSelectedProduct() {
    const product = productToDeactivate.value
    if (!product) {
      return
    }

    try {
      productsStore.deactivateProduct(product.id)
      showNotice(`Produk "${product.nama}" berhasil dinonaktifkan.`)
    } catch (error) {
      showNotice(error instanceof Error ? error.message : String(error), 'bahaya')
    } finally {
      productToDeactivate.value = null
    }
  }

  function activateSelectedProduct() {
    const product = productToActivate.value
    if (!product) {
      return
    }

    try {
      productsStore.activateProduct(product.id)
      showNotice(`Produk "${product.nama}" berhasil diaktifkan.`)
    } catch (error) {
      showNotice(error instanceof Error ? error.message : String(error), 'bahaya')
    } finally {
      productToActivate.value = null
    }
  }

  return {
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
  }
}
