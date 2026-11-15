# Aturan Proyek: Sistem Informasi Manajemen Penjualan dan Stok (kios)

## Konteks
Aplikasi untuk satu kios eceran (barang rumah tangga dan pakaian). Dipakai Pemilik
dan Asisten. Acuan rancangan ada di folder docs/ (bab1-analisis.md,
bab2-perancangan.md, bab3-implementasi.md). Ikuti docs/, jangan mengarang fitur,
tabel, atau endpoint di luarnya. Abaikan bagian bertanda [ISI] karena itu isian laporan.

## Teknologi
- Vue 3 dengan <script setup>, Vite, Vue Router, Pinia. JavaScript biasa.
- Frontend saja, tanpa backend. Data: JSON seed -> state Pinia -> localStorage.
- Spesifikasi API di docs/ adalah kontrak rancangan. Implementasinya berupa aksi store.

## Aturan kode
- Tidak ada data hardcode di komponen. Data berasal dari store.
- Komponen kecil dan reusable. Satu file satu tugas. Pecah bila lebih dari ~150 baris.
- views hanya merakit komponen. components/features menerima data lewat props dan
  melapor lewat emits. components/common tidak mengenal bisnis.
- Hanya stores yang mengubah data. Hanya services/storage.js yang menyentuh localStorage.
- Nama role, kunci localStorage, dan nilai tetap diletakkan di src/constants/.
- Penjagaan akses role dilakukan di router (Pemilik dan Asisten, halaman 403 bila ditolak).

## Data
- Data seed di src/data/seed/*.json, semua berlabel "Contoh ..." (data contoh).
- Saat inisialisasi: bila localStorage kosong atau JSON rusak, salin dari seed lalu simpan.
- Setiap tambah, ubah, hapus harus langsung ditulis ke localStorage.
- Produk tidak dihapus, hanya dinonaktifkan (aktif = false).
- Transaksi menyimpan harga_normal dan harga_satuan (hasil tawar-menawar).
- Transaksi tidak diedit atau dihapus. Transaksi yang salah dibatalkan: status menjadi           "dibatalkan",
  alasan wajib diisi (alasan_batal), pembatalnya dicatat (dibatalkan_oleh), stok barangnya
  dikembalikan, dan transaksi dibatalkan tidak dihitung di laporan.
- Pemilik boleh membatalkan semua transaksi. Asisten hanya boleh melihat dan membatalkan
  transaksi hari ini.

## Tampilan
- Semua teks antarmuka dalam bahasa Indonesia. Format rupiah: Rp 45.000.
- Gaya mengikuti Bab 2.4: font Inter, primary #1F6F5C, sukses #2E9E5B,
  peringatan #F5A524, bahaya #D64545. Simpan sebagai CSS variables.

## Cara bekerja
- Kerjakan hanya yang diminta di prompt. Jangan mengubah file lain tanpa alasan.
- Setelah selesai, sebutkan file yang dibuat atau diubah dan cara mengujinya.