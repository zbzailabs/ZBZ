---
title: "Menggunakan Obsidian sebagai CMS"
description: "Obsidian sangat nyaman sebagai CMS untuk blog"
category: "startup"
tags:
  - "management"
  - "allocation"
pubDate: 2024-09-11
authors:
  - default
heroImage: "https://cos.zbz.ai/images/202309151438569.avif"
heroImageAlt: "RealRip-Menggunakan Obsidian sebagai CMS"
heroImageWidth: 1960
heroImageHeight: 1102
draft: false
featured: false
locale: id
---

Akhirnya, saya mengganti kerangka platform blog ke Astro, yang tidak hanya mempercepat waktu pemuatan tetapi juga memudahkan pembaruan dan pemeliharaan. File Markdown dapat disinkronkan langsung. Sebelumnya, saya menggunakan Typora sebagai alat pengeditan Markdown, karena tampilan WYSIWYG membuat pengelolaan file tunggal sangat mudah. Namun, Typora tidak memiliki pengelola file, yang membuat pengelolaan banyak file menjadi tidak praktis, jadi saya beralih ke editor Markdown Obsidian. Setelah menjelajahi lebih lanjut, saya menemukan bahwa Obsidian sangat nyaman digunakan sebagai CMS untuk blog.

- **Pengelola File**: Dengan menggunakan fitur pencarian Obsidian, Anda dapat dengan mudah menambah, menghapus, memodifikasi, dan mencari file.
- **Properti Dokumen**: Mulai dari Obsidian 1.4, fitur properti dokumen diperkenalkan, yang memungkinkan frontmatter file Markdown diformat dalam format tetap. Dikombinasikan dengan fungsi template, menulis frontmatter menjadi sangat mudah. Sebelumnya, saat menggunakan Typora, saya sering membuat kesalahan karena format frontmatter yang ketat, tetapi sekarang, dengan properti dokumen Obsidian, hampir tidak ada kesalahan yang terjadi.
- **Gambar**: Gambar blog di-host di Tencent Cloud COS, dan saya menggunakan Picgo untuk mengelola gambar. Dengan plugin `Image auto upload Plugin`, Anda dapat mengunggah gambar dengan cepat. Anda dapat menggunakan Picgo.app atau Picgo-core. Jika menggunakan Picgo-core, atur dengan perintah [`picgo set uploader`], dan jika pengunggahan gagal, coba aktifkan opsi `Perbaiki variabel PATH` di plugin Obsidian.
- **Sinkronisasi**: Dengan menempatkan perpustakaan Obsidian di iCloud, Anda dapat menyinkronkan di beberapa perangkat, memungkinkan pengeditan dokumen kapan saja dan di mana saja.
- **Publikasi**: Dengan menggunakan plugin Git, Anda dapat mengatur publikasi terjadwal, dan setelah selesai menulis artikel, itu akan dipublikasikan secara otomatis ke platform hosting.
