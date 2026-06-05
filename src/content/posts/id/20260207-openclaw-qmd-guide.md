---
title: "Mengaktifkan Backend Memori QMD untuk OpenClaw di Mac Apple Silicon"
description: "Panduan detail untuk mengkonfigurasi backend memori QMD OpenClaw di Mac seri M, dengan langkah lengkap dan rekomendasi pemilihan"
category: "startup"
tags:
  - "management"
  - "innovation"
pubDate: 2026-02-07
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260207-openclaw-qmd-guide.avif"
heroImageAlt: "Ilustrasi tutorial konfigurasi OpenClaw QMD"
heroImageWidth: 2752
heroImageHeight: 1536
draft: false
featured: false
locale: id
---

> ⚠️ **Rekomendasi Pemilihan**: Artikel ini mendokumentasikan proses konfigurasi QMD. Namun, berdasarkan evaluasi praktis, **indeks bawaan OpenClaw sudah cukup untuk sebagian besar skenario**. QMD memerlukan memori tambahan ~600MB dan pemeliharaan yang lebih kompleks. Silakan putuskan untuk mengaktifkannya berdasarkan kebutuhan aktual Anda (seperti apakah Anda perlu menjalankan sepenuhnya offline atau memiliki persyaratan kualitas pencarian yang sangat tinggi).

Artikel ini menjelaskan cara mengkonfigurasi backend memori QMD (Query Markdown Database) untuk OpenClaw di Mac Apple Silicon (M1/M2/M3/M4), yang memungkinkan pencarian hibrida dengan BM25 + vektor + reranking.

## Prasyarat

- macOS 14+ (Sonoma / Sequoia)
- OpenClaw 2026.2.3-1 atau lebih baru
- Homebrew (untuk menginstal SQLite)

## Langkah 1: Instal Bun

QMD bergantung pada runtime Bun. Pertama, instal Bun:

```bash
curl -fsSL https://bun.sh/install | bash
```

Verifikasi instalasi:
```bash
~/.bun/bin/bun --version
# Output: 1.3.8
```

## Langkah 2: Instal SQLite (dengan dukungan ekstensi)

QMD memerlukan SQLite dengan dukungan ekstensi:

```bash
brew install sqlite
```

## Langkah 3: Instal QMD

Instal QMD secara global menggunakan Bun:

```bash
~/.bun/bin/bun install -g https://github.com/tobi/qmd
```

Verifikasi instalasi QMD:
```bash
export PATH="$HOME/.bun/bin:$PATH"
qmd --version
```

## Langkah 4: Konfigurasi OpenClaw untuk Menggunakan QMD

Edit file konfigurasi OpenClaw:

```bash
openclaw config edit
```

Tambahkan atau ubah konfigurasi `memory`:

```json
{
  "memory": {
    "backend": "qmd"
  }
}
```

Contoh konfigurasi lengkap (dengan parameter opsional):

```json
{
  "memory": {
    "backend": "qmd",
    "citations": "auto",
    "qmd": {
      "includeDefaultMemory": true,
      "update": { 
        "interval": "5m", 
        "debounceMs": 15000 
      },
      "limits": { 
        "maxResults": 6, 
        "timeoutMs": 4000 
      }
    }
  }
}
```

## Langkah 5: Restart OpenClaw

```bash
openclaw gateway restart
```

## Langkah 6: Inisialisasi Indeks QMD

Setelah restart, QMD akan secara otomatis membuat indeks. Untuk inisialisasi manual:

```bash
# Setel variabel lingkungan
export PATH="$HOME/.bun/bin:$PATH"
export XDG_CONFIG_HOME="$HOME/.openclaw/agents/main/qmd/xdg-config"
export XDG_CACHE_HOME="$HOME/.openclaw/agents/main/qmd/xdg-cache"

# Buat koleksi
cd ~/.openclaw/workspace
qmd collection add memory --name memory-root --mask "**/*.md"

# Hasilkan embedding vektor (akan mengunduh ~600MB model pada pertama kali)
qmd embed
```

Eksekusi pertama `qmd embed` akan secara otomatis mengunduh dari HuggingFace:
- `embeddinggemma-300M-Q8_0.gguf` (model embedding)
- `qwen3-reranker-0.6b-q8_0.gguf` (model reranking)
- `Qwen3-0.6B-Q8_0.gguf` (model ekspansi kueri)

## Langkah 7: Verifikasi QMD Berfungsi

Uji pencarian memori:

```bash
openclaw memory-search "OpenClaw memory system"
```

Jika Anda melihat `source: "qmd//memory-root/..."`, QMD aktif.

Periksa status QMD:

```bash
export PATH="$HOME/.bun/bin:$PATH"
export XDG_CONFIG_HOME="$HOME/.openclaw/agents/main/qmd/xdg-config"
export XDG_CACHE_HOME="$HOME/.openclaw/agents/main/qmd/xdg-cache"
qmd status
```

## Pertanyaan Umum

### QMD tidak berfungsi, masih menampilkan indeks bawaan

Periksa apakah `memory.backend` diatur ke `"qmd"` di `~/.openclaw/openclaw.json`, lalu restart Gateway.

### Gagal mengunduh model

Pengguna di China dapat mengatur mirror HuggingFace:
```bash
export HF_ENDPOINT=https://hf-mirror.com
qmd embed
```

### Memori tidak cukup

Mac seri M harus memiliki setidaknya 8GB memori. Jika proses embedding dihentikan, coba tutup aplikasi lain.

## Referensi Konfigurasi

| Item Konfigurasi | Deskripsi | Nilai Default |
|------------------|-----------|---------------|
| `memory.backend` | Jenis backend memori | `"qmd"` |
| `memory.citations` | Tampilkan sumber kutipan | `"auto"` |
| `memory.qmd.update.interval` | Interval pembaruan indeks | `"5m"` |
| `memory.qmd.limits.maxResults` | Jumlah maksimum hasil | `6` |
| `memory.qmd.limits.timeoutMs` | Batas waktu pencarian | `4000` |

## Ringkasan

Setelah mengaktifkan QMD, pencarian memori OpenClaw akan memiliki:
- **Pencarian teks lengkap BM25**: Pencocokan presisi kata kunci, ID, simbol kode
- **Pencarian semantik vektor**: Pemahaman sinonim dan asosiasi konseptual
- **Optimasi reranking**: Qwen3 reranker meningkatkan relevansi

Dibandingkan dengan SQLite bawaan + Gemini Embeddings, QMD berjalan sepenuhnya secara lokal tanpa bergantung pada API eksternal dan menawarkan kualitas pencarian yang lebih tinggi.
