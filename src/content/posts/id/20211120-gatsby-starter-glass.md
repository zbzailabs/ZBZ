---
title: "Templat Blog Gatsby"
description: "Situs ini adalah situs web statis yang dibangun menggunakan Gatsby, selamat mencoba."
category: "life"
tags:
  - "roam"
pubDate: 2021-11-20
heroImage: "https://cos.zbz.ai/images/202310181512144.avif"
heroImageAlt: "ZBZ-Templat Blog Gatsby"
heroImageWidth: 1960
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "id"
---

Templat untuk membangun situs web statis menggunakan Gatsby.

Kode sumber ada di **[gatsby-starter-glass](https://github.com/xiyizhou/gatsby-starter-glass)**, selamat mencoba.

## Fitur

- Siap pakai
- Sepenuhnya dilokalkan
- Termasuk komentar [Waline](https://waline.js.org)
- Termasuk Google Analytics
- Pengeditan Markdown

## Penyebaran Lokal

```bash
# 1. Kloning ke lokal
git clone https://github.com/xiyizhou/gatsby-starter-glass.git

# 2. cd ke direktori
cd gatsby-starter-glass

# 3. Instal dependensi
yarn install

# 4. Mulai mode pengembangan
yarn start

# 5. Bangun versi produksi
yarn  build
```

## Konfigurasi

- Konfigurasikan informasi situs web, ID Google Analytics, dll. di `gatsby-config.js`.
- Konfigurasikan informasi bilah navigasi atas di `src/components/header.js`.
- Konfigurasikan informasi bilah navigasi bawah di `src/components/footer.js`.

- Konfigurasikan informasi Waline di `src/components/comment.js`.

## Penerbitan Artikel

### Postingan Blog

Postingan blog terletak di `content/blog`. Templatnya adalah sebagai berikut:

```md
---
title: Instal Komponen Komentar Waline untuk Gatsby
date: 2021-11-17 08:08
slug: gatsby-waline
category: Kehidupan
tags:
  - Kehidupan
description: Karena Waline belum memiliki komponen Gatsby, tambahkan fungsionalitas komentar Waline ke situs Gatsby dengan menginstal pustaka klien Waline, membuat komponen React, dan memperkenalkan komponen di lokasi yang sesuai.
---

Gatsby adalah kerangka kerja pembuatan situs web statis berdasarkan react, yang dapat digunakan untuk menyebarkan toko online, situs web resmi, dan blog. Menggunakan plugin yang kaya, fungsi-fungsi seperti pemuatan gambar yang lambat, dukungan dokumen Markdown, dan komentar pengunjung dapat direalisasikan. Sistem komentar yang secara resmi direkomendasikan oleh Gatsby termasuk Disqus, Gitalk, dll.
```

### Halaman

Konten halaman terletak di `content/pages`.

## Catatan

- Starter ini didasarkan pada Gatsby V3, perhatikan kompatibilitas versi saat menginstal plugin.
- Kerangka kerja utama dilokalkan dari [gatsby-starter-glass](https://github.com/yinkakun/gatsby-starter-glass), terima kasih kepada [yinkakun](https://github.com/yinkakun).
