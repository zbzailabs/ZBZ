---
title: "Panduan Lengkap Pengaturan Lingkungan Pengembangan Modern di Mac dengan Chip M"
description: "Panduan komprehensif yang dirancang khusus untuk chip Apple Silicon (M1/M2/M3), mencakup alat penting, konektivitas GitHub, dan alur kerja pengembangan yang terstandardisasi"
category: "startup"
tags:
  - "innovation"
  - "management"
pubDate: 2026-02-12
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260212-mac-github.avif"
heroImageAlt: "Pengaturan Lingkungan Pengembangan Mac"
heroImageWidth: 5632
heroImageHeight: 3072
draft: false
featured: false
locale: id
---

# Panduan Lengkap Pengaturan Lingkungan Pengembangan Modern di Mac dengan Chip M

Ini adalah panduan komprehensif yang dirancang khusus untuk chip Apple Silicon (M1/M2/M3). Ini mencakup tidak hanya instalasi alat penting, tetapi juga mengatasi titik-titik nyeri seperti masalah konektivitas GitHub dan pemblokiran skrip build asli di lingkungan pengembangan.



## Fase 1: Pengaturan Lingkungan Pengembangan Esensial

Pada chip seri M, penyejajaran jalur dan arsitektur sangat penting untuk stabilitas.

### 1. Instal Homebrew (Pengelola Paket)

Di Apple Silicon, Homebrew diinstal di `/opt/homebrew` secara default.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Konfigurasi Variabel Lingkungan:**

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### 2. Instal fnm (Pengelola Versi Node.js)

`fnm` secara native mendukung ARM64 dan saat ini adalah pengelola Node paling berkinerja untuk macOS.

```bash
brew install fnm
```

Tambahkan yang berikut ke `~/.zshrc` untuk secara otomatis mengalihkan versi Node saat memasuki direktori proyek:

```bash
echo 'eval "$(fnm env --use-on-cd --shell zsh)"' >> ~/.zshrc
source ~/.zshrc
```

### 3. Instal pnpm (Pengelola Paket Inti)

Direkomendasikan untuk menginstal secara terpisah melalui Homebrew dengan konfigurasi global yang dioptimalkan:

```bash
brew install pnpm
pnpm setup
source ~/.zshrc
```

**Optimasi Kunci:** Izinkan eksekusi otomatis skrip build modul asli (seperti Gemini CLI, Sharp, dll.) untuk menghindari kesalahan kompilasi pada chip M:

```bash
pnpm config set -g ignore-scripts false
```

------

## Fase 2: Koneksi Aman GitHub dan Tunneling Jaringan

Selesaikan masalah batas waktu koneksi umum atau pengaturan ulang melalui SSH-over-HTTPS (port 443) dengan alat proxy.

### 1. Konfigurasi Identitas Global

Ganti placeholder di bawah ini dengan informasi GitHub Anda:

```bash
git config --global user.name "<your_username>"
git config --global user.email "<your_email@example.com>"
git config --global init.defaultBranch main
```

### 2. Hasilkan Kunci ED25519

```bash
ssh-keygen -t ed25519 -C "<your_email@example.com>"
```

Jalankan `cat ~/.ssh/id_ed25519.pub` dan tambahkan konten ke [Pengaturan SSH GitHub](https://github.com/settings/keys).

### 3. Tulis File Konfigurasi SSH "Universal"

Edit `~/.ssh/config` untuk memastikan lalu lintas melewati port proxy yang ditentukan (contoh menggunakan 7897):

```
Host github.com
  HostName ssh.github.com
  Port 443
  User git
  IdentityFile ~/.ssh/id_ed25519
  AddKeysToAgent yes
  UseKeychain yes
  # Paksa melalui proxy lokal (modifikasi port sesuai alat proxy Anda)
  ProxyCommand nc -X 5 -x 127.0.0.1:7897 %h %p
```

**Perbaikan Izin:**

```bash
chmod 600 ~/.ssh/config
```

------

## Fase 3: Alur Kerja Pengembangan Terstandardisasi

Setelah lingkungan siap, mengikuti alur kerja terstandardisasi sangat meningkatkan efisiensi kolaborasi dan pemeliharaan.

### 1. Pemeriksaan Lingkungan

Setelah memasuki direktori proyek, verifikasi bahwa lingkungan sudah disejajarkan dengan benar:

```bash
node -v && pnpm -v
```

### 2. Manajemen Dependensi

Dengan eksekusi skrip diaktifkan, modul asli secara otomatis menyelesaikan kompilasi lokal selama instalasi:

```bash
pnpm install
```

### 3. Commit Konvensional

Kami merekomendasikan penggunaan spesifikasi **Conventional Commits** untuk menjaga riwayat commit yang jelas:

- `feat:` Fitur baru
- `fix:` Perbaikan bug
- `chore:` Perubahan pada proses build atau alat bantu
- `docs:` Perubahan dokumentasi

**Tip:** Anda dapat menggunakan alat AI untuk membantu menghasilkan pesan commit yang sesuai:

```bash
git diff --cached | <ai_tool_command> "Hasilkan pesan commit bahasa Inggris berdasarkan perubahan"
```

### 4. Push dan Sinkronisasi

```bash
git pull origin main  # Pull sebelum push untuk menghindari konflik
git push origin main
```
