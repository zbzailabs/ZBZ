---
title: "Panduan Pembaruan Dependensi Otomatis dengan Renovate"
description: "Menggunakan Renovate untuk mengotomatisasi sepenuhnya pembaruan dependensi repositori GitHub tanpa intervensi manual"
category: "startup"
tags:
  - "management"
  - "innovation"
pubDate: 2026-02-06
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260206-renovate-guide.avif"
heroImageAlt: "Pembaruan dependensi otomatis dengan Renovate"
heroImageWidth: 2752
heroImageHeight: 1536
draft: false
featured: false
locale: id
---

## Pendahuluan

Pemeliharaan dependensi proyek adalah bagian dari pekerjaan sehari-hari pengembang. Memeriksa, memperbarui, dan menguji versi dependensi secara manual tidak hanya memakan waktu, tetapi juga rentan terhadap kelalaian. Artikel ini menjelaskan cara menggunakan **Renovate** untuk mengotomatisasi sepenuhnya pembaruan dependensi.

## Tujuan

- Memeriksa pembaruan dependensi secara otomatis setiap hari saat fajar
- Membuat PR secara otomatis dan menggabungkannya (setelah lulus CI)
- Tanpa intervensi manual, berjalan di latar belakang
- Manajemen terpadu di beberapa repositori

## Instalasi Renovate

1. Kunjungi [GitHub Apps - Renovate](https://github.com/apps/renovate)
2. Klik **Instal**
3. Pilih repositori yang akan diaktifkan (semua atau tertentu)
4. Selesaikan otorisasi

## File Konfigurasi

Buat `renovate.json` di root repositori:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:recommended",
    ":automergeAll",
    ":disableDependencyDashboard"
  ],
  "timezone": "Asia/Shanghai",
  "schedule": ["before 3:00am"]
}
```

Commit dan push:

```bash
git add renovate.json
git commit -m "chore: configure Renovate for automated dependency updates"
git push
```

## Detail Konfigurasi

| Opsi | Deskripsi |
|------|-----------|
| `config:recommended` | Konfigurasi dasar yang direkomendasikan secara resmi oleh Renovate |
| `:automergeAll` | **Opsi inti** — penggabungan otomatis semua pembaruan (termasuk versi mayor) |
| `:disableDependencyDashboard` | Nonaktifkan isu Dashboard untuk operasi latar belakang |
| `timezone` | Atur zona waktu ke Asia/Shanghai |
| `schedule` | Jalankan pemeriksaan sebelum pukul 3:00 pagi setiap hari |

## Alur Kerja

```
Pukul 3:00 pagi setiap hari
    ↓
Renovate memeriksa dependensi package.json
    ↓
Pembaruan yang tersedia terdeteksi
    ↓
Pembuatan Pull Request otomatis
    ↓
Pemicu pemeriksaan CI
    ↓
CI lulus → Penggabungan otomatis ke branch main
    ↓
Lihat dependensi yang diperbarui keesokan paginya
```

## Konfigurasi Multi-Repositori

Untuk beberapa proyek, salin file konfigurasi yang sama:

```bash
# Buat konfigurasi universal
cat > renovate.json << 'EOF'
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended", ":automergeAll", ":disableDependencyDashboard"],
  "timezone": "Asia/Shanghai",
  "schedule": ["before 3:00am"]
}
EOF

# Terapkan ke beberapa repositori
for repo in repo1 repo2 repo3; do
  cp renovate.json $repo/
  cd $repo && git add . && git commit -m "chore: configure Renovate" && git push
  cd ..
done
```

## FAQ

### PR tidak digabungkan secara otomatis?

Periksa status CI. Renovate hanya menggabungkan setelah semua pemeriksaan CI lulus. Jika CI gagal, perbaiki masalah secara manual dan jalankan ulang.

### Cara memicu pembaruan segera?

- Jika Dashboard diaktifkan: Buka Issues → Dependency Dashboard → Centang paket untuk diperbarui → Klik Rebase
- Atau tunggu waktu terjadwal untuk eksekusi otomatis

### Cara mengecualikan dependensi tertentu?

Tambahkan aturan pengecualian dalam konfigurasi:

```json
{
  "packageRules": [{
    "matchPackageNames": ["package-name"],
    "enabled": false
  }]
}
```

### Dukungan pnpm / yarn / npm?

Renovate secara otomatis mendeteksi jenis file kunci, tidak perlu konfigurasi tambahan.

## Verifikasi

Setelah mendorong konfigurasi, Renovate akan berjalan secara otomatis (atau menunggu waktu terjadwal). Langkah verifikasi:

1. Buka halaman **Pull requests** repositori
2. Lihat PR yang dibuat oleh Renovate (format judul: `chore(deps): update ...`)
3. Konfirmasi bahwa penggabungan otomatis diaktifkan untuk PR
4. Penggabungan otomatis setelah lulus CI

## Kesimpulan

Hanya 5 baris konfigurasi inti:

```json
{
  "extends": [
    "config:recommended",
    "automergeAll",
    "disableDependencyDashboard"
  ],
  "timezone": "Asia/Shanghai",
  "schedule": ["before 3:00am"]
}
```

Capai manajemen dependensi yang sepenuhnya terotomatisasi, memungkinkan pengembang untuk fokus pada kode bisnis.
