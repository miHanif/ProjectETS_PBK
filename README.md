# Toko Mida - Sistem Informasi Manajemen Penjualan dan Stok (PBK UTS)

Aplikasi Web Manajemen Penjualan Eceran dan Kontrol Stok Barang Berbasis Komponen (*Component-Driven Architecture*) untuk **Toko Mida** (kios perlengkapan rumah tangga dan pakaian di Pasar Pagi Pandau Permai).

Proyek ini dibangun untuk memenuhi **Ujian Tengah Semester (UTS) Mata Kuliah Pemrograman Berbasis Komponen (STI2545279)**, Program Studi Teknik Informatika, Fakultas Teknik, Universitas Islam Riau.

---

## 👤 Informasi Mahasiswa
* **Nama:** Muhammad Ibrahim Hanif
* **NIM:** 243510252
* **Kelas:** A
* **Dosen Pengampu:** Ir. M Rizki Fadhilah, S.T., M.Eng

---

## 🛠️ Tumpukan Teknologi (*Tech Stack*)
* **Framework:** Vue.js v3.5 (Composition API `<script setup>`)
* **State Management:** Pinia v4.1 (Modular Stores: `auth`, `products`, `categories`, `cart`, `transactions`, `restocks`, `users`)
* **Routing & Security:** Vue Router v5.5 (Role-Based Access Control / RBAC Navigation Guards)
* **Build Tool:** Vite v8.3
* **Penyimpanan Data:** `localStorage` Browser Engine dengan auto-seed & recovery mechanism
* **Styling:** CSS3 Custom Properties (Design System & Style Guide baku tanpa Tailwind/Bootstrap)

---

## 🚀 Fitur Utama & Pembagian Peran (*RBAC*)

### 1. Peran Pemilik (*Owner*)
* **Dashboard Eksekutif:** Ringkasan transaksi harian, total omzet penjualan, dan daftar produk stok menipis.
* **Manajemen Produk:** Tambah, ubah, dan nonaktifkan (*soft-delete*) produk etalase.
* **Manajemen Kategori:** Tambah, ubah, dan hapus kategori (dilengkapi proteksi integritas relasi produk).
* **Kasir & Transaksi Baru:** Pencatatan belanja tunai dengan fitur tawar-menawar harga per item.
* **Riwayat & Pembatalan Transaksi:** Melihat seluruh riwayat dan membatalkan transaksi (*void*) dengan pengembalian stok otomatis.
* **Belanja Grosir (*Restock*):** Pencatatan barang masuk grosir multi-item dengan harga modal opsional.
* **Laporan Penjualan:** Laporan omzet dan produk terlaris dalam periode harian atau bulanan.
* **Kelola Pengguna:** Menambah dan mengelola akun asisten/pemilik (proteksi anti-deadlock pemilik tunggal).

### 2. Peran Asisten (*Assistant*)
* **Katalog Produk:** Akses baca (*read-only*) daftar produk etalase dan informasi stok.
* **Kasir Cepat:** Melayani transaksi penjualan tunai dan negosiasi harga tawar-menawar.
* **Riwayat Hari Ini:** Hanya dapat melihat transaksi kasir hari berjalan (terisolasi dari transaksi lampau).
* **Pembatalan Terbatas:** Hanya berhak membatalkan nota transaksi pada hari yang sama dengan alasan pembatalan wajib.
* **Keamanan Rute (403):** Otomatis dicegat ke halaman *Forbidden* jika mencoba mengakses dashboard, laporan, restock, atau kelola akun.

---

## 📄 Lisensi & Hak Cipta
Dibuat untuk keperluan akademik evaluasi Ujian Tengah Semester PBK - Universitas Islam Riau © 2026.
