---
title: "Konfigurasi Multi-Perangkat Metode Input Rime"
description: "Baru-baru ini, Kementerian Perindustrian dan Teknologi Informasi merilis data yang menunjukkan bahwa hampir semua metode input cloud arus utama mengumpulkan data privasi pengguna yang melanggar peraturan. Untuk menginput dengan aman dan terjamin, hanya metode input offline yang dapat digunakan. Metode input offline terbaik saat ini tidak diragukan lagi adalah Rime."
category: "startup"
tags:
  - "management"
pubDate: 2021-05-09
heroImage: "https://cos.zbz.ai/images/202310031635857.avif"
heroImageAlt: "RealRip-"
heroImageWidth: 1944
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "id"
---

Baru-baru ini, Kementerian Perindustrian dan Teknologi Informasi merilis data yang menunjukkan bahwa hampir semua metode input cloud arus utama mengumpulkan data privasi pengguna yang melanggar peraturan. Untuk menginput dengan aman dan terjamin, hanya metode input offline yang dapat digunakan. Metode input offline terbaik saat ini tidak diragukan lagi adalah [Rime](https://github.com/rime/home/wiki/Introduction).

Secara akurat, Rime adalah mesin metode input lintas platform sumber terbuka. Kodenya adalah sumber terbuka dan sepenuhnya offline. Melalui penyesuaian dan penyetelan yang ekstrem, pengguna dapat menyesuaikan metode input yang sesuai untuk semua orang. Keuntungannya adalah keamanan dan dukungan untuk beberapa skema input; kerugiannya adalah tesaurus tidak cukup kuat, konfigurasinya rumit, dan sinkronisasi tesaurus perlu dilakukan secara semi-manual.

### Instalasi Versi Mac

Versi Tradisional Tiongkok yang awalnya dikembangkan oleh [Lotem](https://github.com/lotem), penulis Rime. Jika Anda ingin menggunakan versi Sederhana, Anda dapat mengonfigurasinya sesuai dengan tutorial [Yifang](https://github.com/maomiui/rime). Perhatikan hal berikut selama proses konfigurasi:

- Ada BUG di versi saat ini (2021-05-12). Jika diaktifkan di `luna_pinyin_simp.custom.yaml`
  `- derive/^([zcs])h/$1/ # zh, ch, sh => z, c, s`
  `- derive/^([zcs])([^h])/$1h$2/ # z, c, s => zh, ch, sh`
  Setelah suara kabur, Emoji dan waktu dinamis menjadi tidak valid.

- Penulis telah menyiapkan berbagai skema input. Jika Anda tidak menggunakan Xiaohe Shuangpin, dll., Anda dapat menghapus file konfigurasi yang sesuai.

- Bahkan jika Anda tidak menggunakan Luna Pinyin Tradisional, jangan hapus file seperti `luna_pinyin.zonghe.dict.yaml` dan `luna_pinyin.dict.yaml`. Penghapusan dapat menyebabkan kurangnya kata-kata yang diperlukan.

- Informasi umum seperti email dan alamat dapat diatur di `custom_phrase.txt`.

- Anda dapat memodifikasi dan mengubah tema di file `squirrel.custom.yaml`. Misalnya, berdasarkan tema `macos_light`, penulis meniru tema "Dunia Merah Muda" metode input Google Pinyin.

### Instalasi Versi Win10

Untuk versi Win10 dari Rime Weasel, cukup ikuti [tutorial resmi](https://github.com/rime/weasel) untuk menginstal. Setelah instalasi selesai, Anda dapat menyalin file konfigurasi Mac untuk digunakan. Perlu memperhatikan

- Perlu menamai `squirrel.custom.yaml` sebagai `weasel.custom.yaml`

- Garis tunggal dan ganda kulit, tampilan satu baris Pinyin, dll. disesuaikan di `weasel.custom.yaml` sebagai berikut:

  ```yaml
  # Pengaturan horizontal teks
  style/horizontal: true

  # Tampilan satu baris
  style/inline_preedit: true

  # Ubah kulit
  style/color_scheme: win10
  ```

- Jalur sinkronisasi di `installation.yaml` berbeda untuk Win dan Mac. Tanda kutip tunggal atau tanda kutip ganda tidak diperlukan di Win.

  ```yaml
  # format jalur sinkronisasi win
  sync_dir: C:\Users\NamaPengguna\iCloudDrive\Rime

  # format jalur sinkronisasi mac
  sync_dir: "/Users/NamaPengguna/Library/Mobile Documents/com~apple~CloudDocs/Rime"
  ```

- Di win10, Anda dapat menggunakan penjadwal tugas win10 untuk menyinkronkan data [secara otomatis](https://www.cnblogs.com/cstylex/p/Rime_on_Linux_Android_Mac_Windows_iOS_sync.html). Belum ada cara untuk mencapai sinkronisasi otomatis di Mac.

Untuk ponsel Android, Anda dapat menginstal dan menggunakan [Trime](https://github.com/osfans/trime), dan untuk ponsel iOS, Anda dapat menginstal dan menggunakan [iRime](https://apps.apple.com/cn/app/irime%E8%BE%93%E5%85%A5%E6%B3%95/id1142623977).
