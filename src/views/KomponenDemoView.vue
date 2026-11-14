<script setup>
import { ref } from 'vue'
import AlertMessage from '../components/common/AlertMessage.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseInput from '../components/common/BaseInput.vue'
import BaseModal from '../components/common/BaseModal.vue'
import BaseSelect from '../components/common/BaseSelect.vue'
import ConfirmDialog from '../components/common/ConfirmDialog.vue'
import DataTable from '../components/common/DataTable.vue'
import EmptyState from '../components/common/EmptyState.vue'
import PageHeader from '../components/common/PageHeader.vue'
import StatCard from '../components/common/StatCard.vue'
import StatusBadge from '../components/common/StatusBadge.vue'

const inputValue = ref('')
const selectedOption = ref('satu')
const modalOpen = ref(false)
const confirmOpen = ref(false)
const alertVisible = ref(true)
const tableMessage = ref('')

const options = [
  { label: 'Pilihan satu', value: 'satu' },
  { label: 'Pilihan dua', value: 'dua' },
]

const columns = [
  { key: 'name', label: 'Nama' },
  { key: 'value', label: 'Nilai' },
]

const rows = [
  { id: 1, name: 'Contoh A', value: '12' },
  { id: 2, name: 'Contoh B', value: '24' },
]
</script>

<template>
  <!-- Halaman sementara untuk melihat komponen common; akan dihapus. -->
  <section class="component-demo">
    <PageHeader
      title="Demo Komponen"
      subtitle="Pratinjau dan uji komponen antarmuka yang dapat digunakan kembali."
    />

    <section class="demo-section">
      <h2>Tombol</h2>
      <div class="demo-row">
        <BaseButton label="Utama" @click="tableMessage = 'Tombol utama dipilih.'" />
        <BaseButton label="Sekunder" variant="secondary" />
        <BaseButton label="Bahaya" variant="danger" />
        <BaseButton label="Memuat" :loading="true" />
        <BaseButton label="Nonaktif" :disabled="true" />
      </div>
    </section>

    <section class="demo-section">
      <h2>Isian</h2>
      <div class="demo-row">
        <BaseInput
          v-model="inputValue"
          class="demo-field"
          label="Teks"
          placeholder="Ketik sesuatu"
        />
        <BaseInput
          class="demo-field"
          label="Isian dengan galat"
          error="Periksa kembali nilai ini."
        />
        <BaseSelect
          v-model="selectedOption"
          class="demo-field"
          label="Pilihan"
          :options="options"
        />
      </div>
    </section>

    <section class="demo-section">
      <h2>Kartu ringkasan</h2>
      <div class="demo-row">
        <StatCard title="Nilai utama" value="128" />
        <StatCard title="Nilai sukses" value="96" variant="success" />
        <StatCard title="Nilai peringatan" value="24" variant="warning" />
        <StatCard title="Nilai bahaya" value="8" variant="danger" />
      </div>
    </section>

    <section class="demo-section">
      <h2>Status</h2>
      <div class="demo-row">
        <StatusBadge status="aman" />
        <StatusBadge status="menipis" />
        <StatusBadge status="habis" />
        <StatusBadge status="aktif" />
        <StatusBadge status="nonaktif" />
      </div>
    </section>

    <section class="demo-section">
      <h2>Pesan</h2>
      <AlertMessage
        v-if="alertVisible"
        type="sukses"
        message="Perubahan berhasil disimpan."
        dismiss-label="Tutup pesan"
        @dismiss="alertVisible = false"
      />
      <AlertMessage
        type="peringatan"
        message="Periksa kembali informasi yang dimasukkan."
        dismiss-label="Tutup pesan"
      />
      <EmptyState message="Belum ada data untuk ditampilkan." />
    </section>

    <section class="demo-section">
      <h2>Tabel</h2>
      <DataTable
        :columns="columns"
        :rows="rows"
        empty-text="Tidak ada data."
        @row-click="tableMessage = `Baris ${$event.name} dipilih.`"
      />
      <p v-if="tableMessage" aria-live="polite">{{ tableMessage }}</p>
      <EmptyState message="Contoh tampilan saat daftar kosong." />
    </section>

    <section class="demo-section">
      <h2>Dialog</h2>
      <div class="demo-row">
        <BaseButton label="Buka dialog" @click="modalOpen = true" />
        <BaseButton
          label="Buka konfirmasi"
          variant="secondary"
          @click="confirmOpen = true"
        />
      </div>
      <BaseModal
        :open="modalOpen"
        title="Dialog"
        close-label="Tutup dialog"
        @close="modalOpen = false"
      >
        <p>Konten dialog disediakan melalui slot.</p>
      </BaseModal>
      <ConfirmDialog
        :open="confirmOpen"
        title="Konfirmasi"
        message="Lanjutkan tindakan ini?"
        confirm-label="Lanjutkan"
        cancel-label="Batal"
        @confirm="confirmOpen = false"
        @cancel="confirmOpen = false"
      />
    </section>
  </section>
</template>
