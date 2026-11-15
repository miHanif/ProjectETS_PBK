# Bab 1: Profil Usaha dan Analisis Kebutuhan

Catatan untuk agen AI: bagian bertanda **[ISI]** diisi sendiri oleh mahasiswa, abaikan dan jangan mengarang isinya. Bagian bertanda *(usulan)* sudah disetujui mahasiswa.

## 1.1 Profil Singkat dan Bukti Izin Observasi

- **Nama usaha:** [ISI]
- **Alamat:** [ISI]
- **Pemilik:** ibu mahasiswa. Mahasiswa terkadang membantu.
- **Bidang usaha:** perdagangan eceran di pasar pagi.
- **Produk:** barang harian rumah tangga (sapu, baskom, alat masak, barang pecah belah) dan pakaian.
- **Skala operasional:** satu kios, dikelola sendiri tanpa karyawan. Jumlah pelanggan tidak menentu (kadang sepi, kadang ramai).
- **Jam buka:** [ISI]
- **Perkiraan jumlah jenis barang:** [ISI]
- **Lampiran bukti izin:** [dilampirkan sendiri oleh mahasiswa]

## 1.2 Analisis Proses Bisnis Berjalan (As-Is)

1. Pemilik membuka kios di pasar pagi dan menata barang dagangan.
2. Pelanggan datang dan melihat-lihat barang.
3. Pelanggan memilih barang, lalu pemilik melayani transaksi secara langsung. Harga barang dapat ditawar pelanggan (tawar-menawar).
4. Pelanggan membayar secara **tunai** (cash only).
5. Pemilik mencatat **setiap transaksi** di buku.
6. Pemilik membuat **rekap harian** dari catatan transaksi.
7. Saat stok perlu ditambah, pemilik **membeli barang di grosir**, lalu mencatatnya sebagai barang masuk di catatan stok.
8. Seluruh pekerjaan dikerjakan pemilik sendiri. Mahasiswa terkadang membantu.

Catatan stok, keuangan, dan kebutuhan lain berada dalam satu buku fisik.

## 1.3 Identifikasi Kendala dan Harapan Pengguna

**Kendala utama**

1. Pekerjaan dilakukan secara tradisional (manual di buku).
2. Semua transaksi tunai.
3. Bekerja sendiri tanpa karyawan, sehingga semua tugas bertumpu pada satu orang.
4. Jumlah pelanggan tidak menentu.
5. Rekap harian dihitung manual dari catatan per transaksi. *(usulan, perlu dikonfirmasi ke ibu)*

**Harapan pengguna:** [ISI, dari hasil tanya langsung ke ibu]

## 1.4 Pemetaan Role dan Fitur Sistem

| Nama Role | Deskripsi Peran | Fitur yang Dapat Diakses |
|---|---|---|
| Pemilik (ibu) | Pemilik usaha, pengambil keputusan | Dashboard, kelola produk dan kategori, kelola harga, restock (barang masuk), peringatan stok menipis, catat transaksi tunai, riwayat transaksi, pembatalan transaksi, laporan harian/bulanan, kelola akun |
| Asisten (mahasiswa) | Membantu melayani saat kios ramai | Lihat produk dan stok, catat transaksi tunai (termasuk mengubah harga saat tawar-menawar), lihat riwayat transaksi hari itu, batalkan transaksi hari itu (dengan alasan) |

**Kaitan fitur dengan kendala**

| Kendala | Fitur yang menjawab |
|---|---|
| Tradisional (manual di buku) | Data produk, transaksi, dan laporan digital |
| Cash only | Pencatatan transaksi tunai dengan total dan kembalian otomatis |
| Bekerja sendiri | Pencatatan cepat dan role Asisten |
| Pelanggan tidak menentu | Laporan harian/bulanan untuk melihat pola ramai dan sepi |
| Rekap manual | Laporan harian otomatis |

**Keputusan yang sudah disetujui (usulan):** harga beli dicatat saat restock (boleh dikosongkan bila ibu tidak mencatatnya), serta fitur peringatan stok menipis dan kategori produk (kategori awal: Pecah Belah dan Perlengkapan Rumah Tangga, Pakaian, Lainnya; Pemilik bisa menambah kategori). Transaksi yang salah input tidak diedit, tetapi dibatalkan dengan alasan: stok dikembalikan dan transaksi tidak dihitung di laporan. Pemilik bisa membatalkan semua transaksi, Asisten hanya transaksi hari itu.
