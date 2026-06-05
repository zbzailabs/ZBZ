---
title: "Deploy Proyek Astro dengan Dokploy dan Nixpacks serta Aktifkan Cache untuk Mengoptimalkan Kecepatan Build"
description: "Deploy situs web statis Astro dengan cepat menggunakan Dokploy dan Nixpacks, mengaktifkan sepenuhnya mekanisme caching untuk meningkatkan kecepatan build secara signifikan. Tutorial ini mencakup konfigurasi Astro, pengaturan variabel lingkungan Dokploy, dan strategi pengoptimalan cache Nixpacks, cocok untuk praktik integrasi dan penerapan berkelanjutan untuk situs web berbasis konten."
category: "startup"
tags:
  - "innovation"
pubDate: 2025-07-14
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20250714082742453.avif"
heroImageAlt: "ZBZ-Deploy Proyek Astro dengan Dokploy dan Nixpacks serta Aktifkan Cache untuk Mengoptimalkan Kecepatan Build"
heroImageWidth: 1960
heroImageHeight: 1102
draft: false
featured: false
locale: id
---

## I. Konfigurasi Dokploy

Dokploy adalah platform penerapan open-source yang dapat di-host sendiri, dirancang sebagai alternatif gratis untuk Heroku, Vercel, dan Netlify, dibangun di atas Docker dan Traefik.

### 1. Buat Proyek Baru dan Hubungkan Repositori GitHub

### 2. Tetapkan Variabel Lingkungan

```bash
NIXPACKS_NODE_VERSION=22
NIXPACKS_PNPM_STORE_PATH=/root/.local/share/pnpm/store/v3
NIXPACKS_INSTALL_CACHE_DIRS=/app/node_modules
NIXPACKS_BUILD_CACHE_DIRS=/app/node_modules/.cache,/app/astro_cache
```

### 3. Nonaktifkan Pembersihan Cache

- Layanan Proyek → **Clean Cache**: Nonaktifkan
- Server Web → **Daily Docker Cleanup**: Nonaktifkan

---

## II. Mesin Build Nixpacks

Nixpacks adalah alat build open-source yang diluncurkan oleh Railway yang membangun kode sumber menjadi gambar Docker standar. Dokploy menggunakan Nixpacks sebagai mesin build default dan mendukung penentuan konfigurasi build dalam file `nixpacks.toml` atau `nixpacks.json`. Buat file `nixpacks.toml` di direktori root proyek dan konfigurasikan direktori cache yang relevan.

### Prioritas Konfigurasi (Rendah → Tinggi):

1. Logika default penyedia
2. `nixpacks.toml`
3. Variabel lingkungan
4. Argumen CLI

### Variabel Lingkungan Umum

| Nama Variabel                 | Deskripsi                            |
| :---------------------------- | :----------------------------------- |
| `NIXPACKS_INSTALL_CMD`        | Perintah instal kustom               |
| `NIXPACKS_BUILD_CMD`          | Perintah build kustom                |
| `NIXPACKS_START_CMD`          | Perintah mulai kustom                |
| `NIXPACKS_PKGS`               | Instal paket Nix tambahan            |
| `NIXPACKS_APT_PKGS`           | Instal paket Apt tambahan            |
| `NIXPACKS_INSTALL_CACHE_DIRS` | Direktori cache fase instal          |
| `NIXPACKS_BUILD_CACHE_DIRS`   | Direktori cache fase build           |
| `NIXPACKS_NO_CACHE`           | Nonaktifkan cache (tidak disarankan) |
| `NIXPACKS_CONFIG_FILE`        | Tentukan file konfigurasi            |
| `NIXPACKS_DEBIAN`             | Aktifkan gambar dasar Debian         |

## III. Konfigurasi Proyek Astro

Astro adalah kerangka kerja Web modern untuk situs konten, sangat cocok untuk situs web statis seperti blog, halaman pemasaran, dan e-commerce. Ketika situs web memiliki banyak gambar dan sumber daya statis, kecepatan build mungkin terpengaruh. Dengan mengaktifkan mekanisme caching, efisiensi build dapat ditingkatkan secara signifikan.

### 1. Konfigurasikan Direktori Artefak Cache Build:

Proyek Astro perlu menentukan direktori cache dalam file konfigurasi untuk menggunakan kembali artefak build sebelumnya dalam build berikutnya. File dalam direktori ini akan digunakan dalam build berikutnya untuk mempercepat waktu build.
Nilai ini bisa berupa jalur absolut atau jalur relatif.

```js
//`astro.config.mjs`
export default defineConfig({
  cacheDir: "./astro_cache",
});
```

---

### 2. File Konfigurasi Cache Nixpacks

Buat file `nixpacks.toml` di direktori root proyek Astro dan konfigurasikan direktori cache dan perintah build.

```toml
# Gunakan versi Node.js dan pnpm yang ditentukan
[phases.setup]
nixPkgs = ["nodejs_22", "pnpm"]

# Instal dependensi dan aktifkan cache pnpm
[phases.install]
cmds = ["pnpm install --frozen-lockfile"]
cacheDirectories = ["/root/.local/share/pnpm/store/v3"]

# Build proyek Astro dan cache node_modules/.cache dan astro_cache
[phases.build]
cmds = ["pnpm run build"]
cacheDirectories = [
  "node_modules/.cache",
  "astro_cache"
]

# Perintah mulai (Anda menggunakan NGINX untuk menyajikan direktori statis dist, ini hanya placeholder)
[start]
cmd = "echo 'Build selesai, silakan akses direktori dist melalui NGINX'"
```

---

## 3. Optimalkan Konteks Build Docker

Tambahkan `.dockerignore` ke direktori root proyek Astro:

```
node_modules
astro_cache
dist
*.log
.DS_Store
.vscode
.env*
```

---

## IV. Penerapan dan Verifikasi

Setelah penerapan otomatis Dokploy, periksa log build untuk konten berikut guna mengonfirmasi bahwa caching efektif:

### 1. Perintah Build Menggunakan Cache yang Dipasang

```bash
RUN --mount=type=cache,id=xxxx-node_modules/cache,target=/app/node_modules/.cache \
    --mount=type=cache,id=xxxx-astro_cache,target=/app/astro_cache \
    pnpm run build
```

### 2. Build Astro Menggunakan Kembali Entri Cache (Terutama Pengoptimalan Gambar)

```bash
▶ /_astro/202409272055577_Z2smeTW.avif (reused cache entry)
▶ /_astro/202409272055575_Z2wPyJN.avif (reused cache entry)
▶ /_astro/202409272055577_1IgP6g.avif (reused cache entry)
```

✅ Jika Anda melihat log cache pemasangan di atas dan teks "reused cache entry", itu berarti mekanisme caching telah berhasil diaktifkan dan build telah mencapai percepatan inkremental.

🎉 Dari tab Deployments proyek Dokploy, Anda juga dapat melihat bahwa tanpa pengaturan cache, membangun proyek membutuhkan waktu 31 menit, sedangkan dengan pengaturan cache diaktifkan, hanya membutuhkan waktu 3 menit, sangat mempersingkat waktu build dan menghemat lalu lintas dan bandwidth.

## V. Percepat Situs dengan Tencent EdgeOne

## Latar Belakang: "Segitiga Mustahil" Transmisi Lintas Batas

Menyebarkan server di Singapura. Solusi ini hemat biaya dan tidak memerlukan proses pendaftaran yang rumit, tetapi bagi pengguna di Tiongkok daratan, pengalaman akses sering kali menghadapi tantangan besar:

1. **Latensi Fisik Tinggi**: RTT (Round Trip Time) dari Singapura ke Tiongkok daratan biasanya berfluktuasi antara 50 md - 200 md.
2. **Kehilangan Paket Parah**: Terganggu oleh firewall GFW, jabat tangan TCP sering kali habis waktu, menyebabkan gambar macet saat dimuat setengah jalan (Pending).
3. **Jeda Lompatan**: Aplikasi multi-halaman memerlukan waktu tunggu layar putih yang lama saat mengklik tautan.

Untuk mengatasi masalah ini, kami menggunakan **Tencent Cloud EdgeOne** bersama dengan konfigurasi **Traefik** yang disempurnakan untuk membuat "pukulan kombo", mencapai pengalaman pembukaan yang hampir instan mendekati situs web yang terdaftar secara lokal.

### Ide Arsitektur Inti

Strategi pengoptimalan kami berkisar pada tiga kata kunci: **Anti-Kehilangan Paket**, **Offloading Kompresi**, dan **Caching Berlapis**.

1. **Lapisan Protokol (EdgeOne)**: Memanfaatkan protokol **HTTP/3 (QUIC)** berdasarkan karakteristik UDP untuk menyelesaikan sepenuhnya gangguan pemuatan konten yang disebabkan oleh kehilangan paket lintas batas TCP.
2. **Lapisan Transportasi (Traefik -> EdgeOne)**: Matikan kompresi asal Traefik dan biarkan node tepi EdgeOne bertanggung jawab atas kompresi cerdas **Brotli** yang lebih efisien untuk mengurangi volume transmisi.
3. **Lapisan Cache (Strategi)**: Gunakan `s-maxage` untuk mencapai pemisahan "Cache CDN Jangka Panjang" dan "Cache Browser Jangka Pendek", memastikan tingkat hit CDN dan ketepatan waktu pembaruan konten.

### I. Konfigurasi Global EdgeOne (Aktifkan Mode "Anti-Kehilangan Paket")

Meskipun EdgeOne tidak dapat menyediakan node domestik untuk domain yang tidak terdaftar, node tepinya (Hong Kong/Singapura) ke jalur domestik dioptimalkan dan mendukung protokol QUIC, yang merupakan kunci untuk menyelesaikan "jeda jaringan".

Masuk ke Konsol EdgeOne -> **Akselerasi Situs** -> **Konfigurasi Fitur**:

### 1. Aktifkan HTTP/3 (QUIC) ✅

Ini adalah langkah yang paling kritis. Dalam jaringan lintas batas dengan tingkat kehilangan paket yang tinggi, protokol QUIC dapat secara efektif menghindari pemblokiran head-of-line TCP. Setelah diaktifkan, fenomena gambar "berputar" atau "dimuat setengah" akan hilang sepenuhnya.

### 2. Aktifkan Kompresi Cerdas (Brotli + Gzip) ✅

Disarankan untuk mengaktifkan Brotli dan Gzip. EdgeOne akan memprioritaskan pengembalian format **Brotli (`br`)** ke browser yang didukung, yang memiliki tingkat kompresi 15%-20% lebih tinggi daripada Gzip. Semakin kecil volumenya, semakin cepat melewati dinding.

### 3. Aktifkan Pra-penyegaran Cache (90%) ✅

Tetapkan rasio pra-penyegaran ke **90%**. Ini berarti bahwa dalam 10% waktu terakhir sebelum cache kedaluwarsa, CDN akan secara asinkron kembali ke sumber untuk memperbarui. Pengguna tidak akan pernah mengalami jeda yang disebabkan oleh "kedaluwarsa cache yang menyebabkan kembali ke sumber", mencapai pengalaman hit 100%.

## II. Pengoptimalan Konfigurasi Traefik (Strategi Asal)

Kita perlu memodifikasi `dynamic_conf.yml` Traefik (atau Label Docker) untuk melakukan dua hal: **Offload Kompresi** dan **Suntikkan Header Cache yang Disempurnakan**.

### 1. Nonaktifkan Kompresi Asal

Harap periksa konfigurasi Router Anda dan **hapus** semua middleware `compress` (Gzip).

- **Alasan**: EdgeOne sudah bertanggung jawab atas kompresi Brotli. Melakukan Gzip di asal lagi akan membuang CPU dan dapat menyebabkan masalah kompresi ganda.

### 2. Tentukan Strategi Caching Berlapis (Kode Inti)

Ini adalah inti untuk menyelesaikan kontradiksi antara "pengguna tidak dapat melihat konten baru setelah menerbitkan artikel" dan "kecepatan kembali ke sumber langsung terlalu lambat".

Kami mendefinisikan middleware khusus untuk halaman HTML di Traefik:

```yaml
http:
  routers:
    # Paksa pengalihan HTTPS
    idimi-uygy0r-redirect-https:
      entryPoints:
        - web
      rule: Host(`realrip.com`)
      middlewares:
        - idimi-uygy0r-to-https
      service: noop@internal
      priority: 1000

    # Service Worker (Inti PWA) - Tanpa kompresi, ditangani oleh EdgeOne
    idimi-uygy0r-sw:
      rule: >
        Host(`realrip.com`) &&
        ( Path(`/service-worker.js`) || Path(`/sw.js`) )
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-no-store
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 900

    # Sumber Daya Statis Inti Astro (Sidik Jari Hash) - Tanpa kompresi, ditangani oleh EdgeOne
    idimi-uygy0r-static-immutable:
      rule: >
        Host(`realrip.com`) &&
        ( PathPrefix(`/_astro`) || PathPrefix(`/assets`) )
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-cache-static-immutable
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 800

    # File WASM Pagefind - Tanpa kompresi, ditangani oleh EdgeOne
    idimi-uygy0r-pagefind-wasm-ctype:
      rule: >
        Host(`realrip.com`) &&
        PathRegexp(`^/pagefind/.*\\.wasm$`)
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-set-wasm-ctype
        - idimi-uygy0r-cache-static-immutable
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 760

    # File Indeks Pagefind - Tanpa kompresi, ditangani oleh EdgeOne
    idimi-uygy0r-pagefind-immutable:
      rule: >
        Host(`realrip.com`) &&
        PathPrefix(`/pagefind`)
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-cache-static-immutable
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 750

    # Sitemap / Robots / RSS - Tanpa kompresi, ditangani oleh EdgeOne
    idimi-uygy0r-meta-short:
      rule: >
        Host(`realrip.com`) &&
        ( Path(`/sitemap.xml`) ||
          Path(`/robots.txt`) ||
          Path(`/sitemap-index.xml`) ||
          Path(`/atom.xml`) || Path(`/rss.xml`) || Path(`/feed.xml`) )
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-cache-short
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 700

    # Manifest - Tanpa kompresi, ditangani oleh EdgeOne
    idimi-uygy0r-manifest:
      rule: >
        Host(`realrip.com`) &&
        ( Path(`/manifest.webmanifest`) ||
          Path(`/site.webmanifest`) ||
          Path(`/browserconfig.xml`) )
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-cache-1d
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 650

    # File Statis Lainnya (Gambar/Video dll.) - Tanpa kompresi, ditangani oleh EdgeOne
    idimi-uygy0r-public-30d:
      rule: >
        Host(`realrip.com`) &&
        PathRegexp(`.+\\..+`)
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-cache-30d-swr
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 600

    # Halaman HTML (Aturan Fallback) - Tanpa kompresi, ditangani oleh EdgeOne
    # Strategi pemisahan s-maxage=3600 diterapkan
    idimi-uygy0r-pages:
      rule: Host(`realrip.com`)
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-cache-html
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 100

  services:
    idimi-uygy0r-app:
      loadBalancer:
        servers:
          - url: http://idimi-idimi-uygy0r:80
        passHostHeader: true

  middlewares:
    idimi-uygy0r-to-https:
      redirectScheme:
        scheme: https
        permanent: true

    # --- Definisi middleware kompresi dipertahankan tetapi tidak dipanggil (dihapus dari Router) ---
    idimi-uygy0r-gzip-compress:
      compress:
        minResponseBodyBytes: 1024
        excludedContentTypes:
          - "image/png"
          - "image/jpeg"
          - "image/gif"
          - "image/webp"
          - "image/avif"
          - "font/*"

    idimi-uygy0r-security-headers:
      headers:
        addVaryHeader: true
        stsSeconds: 31536000
        stsIncludeSubdomains: true
        stsPreload: true
        contentTypeNosniff: true
        browserXssFilter: true
        referrerPolicy: "strict-origin-when-cross-origin"
        permissionsPolicy: "geolocation=(), microphone=(), camera=()"
        frameDeny: true
        customResponseHeaders:
          Timing-Allow-Origin: "*"

    idimi-uygy0r-no-store:
      headers:
        customResponseHeaders:
          Cache-Control: "no-cache, no-store, must-revalidate"

    idimi-uygy0r-cache-short:
      headers:
        customResponseHeaders:
          Cache-Control: "public, max-age=600, stale-while-revalidate=600"
          Vary: "Accept-Encoding"

    idimi-uygy0r-cache-1d:
      headers:
        customResponseHeaders:
          Cache-Control: "public, max-age=86400, stale-while-revalidate=86400"
          Vary: "Accept-Encoding"

    idimi-uygy0r-cache-30d-swr:
      headers:
        customResponseHeaders:
          Cache-Control: "public, max-age=2592000, stale-while-revalidate=604800"
          Vary: "Accept-Encoding"

    idimi-uygy0r-cache-static-immutable:
      headers:
        customResponseHeaders:
          Cache-Control: "public, max-age=31536000, immutable"
          Vary: "Accept-Encoding"

    # Modifikasi Utama: Strategi Cache HTML
    # Browser menyimpan cache selama 5 menit (300 detik), CDN menyimpan cache selama 1 jam (3600 detik)
    idimi-uygy0r-cache-html:
      headers:
        customResponseHeaders:
          Cache-Control: "public, max-age=300, s-maxage=3600, stale-while-revalidate=600"
          Vary: "Accept-Encoding"

    idimi-uygy0r-set-wasm-ctype:
      headers:
        customResponseHeaders:
          Content-Type: "application/wasm"
```

**Penjelasan Konfigurasi:**

- **`s-maxage=3600`**: Ini adalah arahan yang ditulis khusus untuk CDN. EdgeOne melihat ini dan menyimpan cache halaman HTML selama 1 jam.
- **`max-age=300`**: Saat EdgeOne mengirimkannya ke pengguna, ia menghapus `s-maxage`, dan browser pengguna hanya melihat 300 detik (5 menit).
- **Efek**: CDN menangani lalu lintas selama 1 jam, sementara pengguna hanya perlu menunggu 5 menit untuk melihat artikel yang baru diterbitkan.

## III. Mesin Aturan EdgeOne

Karena struktur URL Astro (tanpa akhiran) dan layanan gambar dinamis (`/_image`), aturan yang tepat diperlukan untuk mencapai cache.

Di **Mesin Aturan** EdgeOne, konfigurasikan aturan berikut secara ketat **secara berurutan**:

### Aturan 1: Sumber Daya Statis Inti Astro (Cache Permanen)

Aset Astro, artefak build, dan layanan gambar dinamis, konten yang tidak pernah berubah atau sangat menghabiskan CPU, harus di-cache secara paksa.

- **Kondisi Pencocokan**: `Jalur URL` -> `Pencocokan Regex`
- **Nilai Pencocokan**: `^/(_astro|assets|pagefind|_image)/`
- _Catatan: `_image` ditambahkan di sini, secara khusus mengoptimalkan gambar yang dioptimalkan secara dinamis yang dihasilkan oleh komponen `<Image />` Astro._
- **Tindakan**:
  - Cache Node: **365 hari** (Paksa)
  - Cache Browser: **365 hari**

### Aturan 2: File Statis Reguler

- **Kondisi Pencocokan**: `Ekstensi File` sama dengan `png, jpg, jpeg, webp, css, js`, dll.
- **Tindakan**: Cache Node **30 hari** (Paksa).

### Aturan 3: Service Worker (Inti PWA)

- **Kondisi Pencocokan**: `Jalur URL` sama dengan `/sw.js` atau `/service-worker.js`.
- **Tindakan**: Cache Node **1 jam** (Paksa).
- _Peringatan: Jangan cache terlalu lama, jika tidak PWA tidak dapat diperbarui tepat waktu setelah rilis._

### Aturan 4: Aturan Fallback (Halaman HTML)

- **Kondisi Pencocokan**: (Tidak ada kondisi / Cocok dengan semua permintaan yang tersisa)
- **Tindakan**:
  - Cache Node: **Ikuti Asal** (yaitu membaca `s-maxage=3600` dari Traefik).
  - Cache Browser: **Ikuti Asal** (yaitu membaca `max-age=300` dari Traefik).

## IV. Pengoptimalan Tingkat Kode Astro (Akselerasi yang Dirasakan)

Untuk membuat transisi halaman semulus "aplikasi asli" dan sepenuhnya menghilangkan waktu tunggu layar putih selama lompatan, kita perlu menggunakan **Client Router (sebelumnya View Transitions)** Astro.

### 1. Aktifkan Client Router

Tambahkan di `<head>` dari `src/layouts/MainLayout.astro`:

```js
import { ClientRouter } from 'astro:transitions';

<head>
  <!-- Tag meta lainnya -->
  <ClientRouter />
</head>
```

### 2. Aktifkan Prefetch

Konfigurasikan strategi prefetch di `astro.config.mjs`:

```js
export default defineConfig({
  // 'viewport': Unduh saat tautan memasuki viewport (keseimbangan lalu lintas dan kecepatan)
  // 'load': Unduh semua tautan segera setelah halaman dimuat (kecepatan ekstrem, tetapi menghabiskan bandwidth)
  prefetch: {
    defaultStrategy: "viewport",
  },
  // ...
});
```
