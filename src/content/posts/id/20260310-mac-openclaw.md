---
title: "Setelah memasang ulang OpenClaw 5 kali, akhirnya saya menuliskan konfigurasi yang paling layak ditiru pemula"
description: "Saya memasang ulang OpenClaw lima kali di Mac baru, dan akhirnya benar-benar paham jebakan yang paling sering bikin orang terpeleset: bagian Node, pnpm, SSH, Feishu, multi-agent, QMD, dan ACP mana yang wajib dibereskan dulu, serta pengaturan mana yang kelihatannya jalan tetapi cepat atau lambat pasti meledak. Semua saya tulis lengkap di sini."
category: "startup"
tags:
  - "allocation"
  - "strategy"
  - "innovation"
pubDate: 2026-03-10
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260310-mac-openclaw-cover-v2.avif"
heroImageAlt: "Gambar sampul panduan instalasi dan konfigurasi OpenClaw di Mac baru"
heroImageWidth: 2400
heroImageHeight: 1350
draft: false
featured: false
locale: id
---

# Setelah memasang ulang OpenClaw 5 kali, akhirnya saya menuliskan konfigurasi yang paling layak ditiru pemula

Saya sudah memasang ulang OpenClaw lima kali. Dan pada akhirnya saya memastikan satu hal:

**Yang paling banyak membuang waktu pemula bukan proses instalasinya, melainkan disiksa berkali-kali oleh setumpuk konfigurasi yang “kelihatannya sudah jalan”, padahal sebenarnya cepat atau lambat pasti meledak.**

Saat pertama kali memasangnya, orang mudah merasa bahwa selama antarmukanya bisa dibuka dan bot bisa membalas, berarti semuanya sudah beres. Biasanya, kenyataannya tidak begitu.

Jebakan yang asli biasanya muncul belakangan:

- `pnpm` jelas sudah terpasang, tetapi daemon tetap tidak bisa menemukannya;
- bot Feishu memang sudah tersambung, tetapi routing multi-agent sebenarnya masih kacau;
- QMD tampak seperti menyinkronkan data secara otomatis, padahal diam-diam terus gagal;
- konfigurasi ACP terlihat benar, tetapi coder sama sekali tidak benar-benar berjalan di Codex;

Tulisan ini bukan “versi terjemahan dari dokumentasi resmi”, dan juga bukan tutorial tipe “saya baru sekali pasang lalu mengajari orang lain”. Ini adalah **rencana awal versi postmortem jebakan** yang saya rangkum setelah memasang ulang OpenClaw lima kali di Mac mini yang benar-benar baru.

Yang diselesaikan tulisan ini bukan soal “bagaimana menyalakan OpenClaw”, tetapi soal yang lebih penting:

> **Bagaimana mengonfigurasinya menjadi lingkungan yang stabil untuk dipakai jangka panjang, bukan sesuatu yang nyala hari ini lalu jebol besok.**

## 5 jebakan paling sering yang saya pastikan setelah 5 kali memasang ulang

Bagian paling berharga saya taruh di depan.

Kalau kamu cuma ingin tahu kenapa banyak orang “jelas-jelas sudah berhasil memasang, tapi tetap terus bermasalah”, jawabannya pada dasarnya ada di lima poin ini:

1. **PATH kamu benar bukan berarti PATH milik daemon juga benar**  
   Fakta bahwa `pnpm`, `node`, dan `qmd` bisa dijalankan di terminal tidak berarti semuanya juga bisa dijalankan di LaunchAgent.

2. **Tool sudah terpasang bukan berarti OpenClaw punya izin yang benar untuk memakainya**  
   Beberapa versi datang dengan izin default yang lebih konservatif. Kalau konfigurasi ini tidak ditambal, semuanya terlihat bisa dipakai, tetapi begitu tool dipanggil, fungsinya tinggal setengah mati.

3. **QMD tidak memunculkan error bukan berarti benar-benar sedang sinkron**  
   Banyak skrip watcher pura-pura berhasil. Bahkan setelah gagal, log-nya tetap menulis “sinkronisasi selesai”. Ini jebakan yang menyebalkan.

4. **Bisa membuat banyak agent bukan berarti pesan pasti diarahkan dengan benar**  
   Dalam konfigurasi Feishu multi-bot, `accounts` baru permulaan. Yang benar-benar menentukan arah pesan adalah `bindings`.

5. **Coder terlihat terhubung ke Codex bukan berarti benar-benar berjalan di ACP**  
   Banyak orang selesai mengatur lalu merasa “harusnya sudah beres”. Kenyataannya, runtime-nya tidak pernah benar-benar dipindahkan. Hanya namanya saja yang terlihat benar.

Kalau lima jebakan ini dihindari dari awal, setidaknya separuh kerja bolak-balik yang tidak berguna bisa dihemat.

Konfigurasi di bawah ini disusun persis mengelilingi masalah-masalah tadi.

## 0. Kalau mau memelihara lobster (OpenClaw), pilih Mac mini

Alasan inti kenapa Mac mini lebih cocok untuk “memelihara lobster” sederhana saja:

### 1. Arsitektur memori terpadu

Chip Apple Silicon di Mac menggunakan **Unified Memory**, yaitu memori sistem dan memori grafis berbagi ruang yang sama. Kalau kamu ingin menjalankan large language model (LLM) secara lokal untuk inferensi — nanti kita akan memakai model open-source untuk mendukung QMD — maka memori bersama yang cukup adalah syarat dasar untuk mendapat kecepatan yang masuk akal.

### 2. Integrasi ekosistem dan kemudahan otomasi

Memang sekarang banyak vendor cloud menawarkan skema “memelihara lobster” di cloud, tetapi dibanding VPS, Mac mini punya keunggulan alami untuk otomasi harian:

- **Menghindari deteksi:** otomasi browser yang berjalan di IP rumah jauh lebih kecil kemungkinan dianggap bot oleh situs dibanding IP pusat data pada VPS.

- **Pemrosesan multimedia:** mengolah file lokal, mengelola kalender, dan mengintegrasikan aplikasi desktop seperti Claude Code atau Codex terasa jauh lebih mudah.

### 3. Ambang penggunaan dan stabilitas

- **Kurva belajar lebih rendah:** untuk non-developer, menyiapkan dashboard dan menelusuri problem izin jaringan di Mac lokal jauh lebih intuitif daripada mengurus lingkungan jaringan yang lebih rumit di VPS.
- **Hening dan hemat daya:** Mac mini kecil, senyap, dan konsumsi dayanya rendah, sehingga sangat cocok menjadi “server lobster” yang hidup 24/7.

## 1. Kuatkan dulu fondasi sistem: command line dan package manager

### Versi sistem

Begitu mendapatkan Mac mini, pertama-tama perbarui macOS ke versi Tahoe terbaru. Lalu aktifkan pembaruan otomatis.

- ✅Pengaturan Sistem → Umum → Pembaruan Perangkat Lunak → Pembaruan Otomatis

### Pengaturan daya

Di **Pengaturan Sistem → Energi**, untuk Mac mini sebaiknya ketiga opsi berikut diaktifkan:

- ✅Cegah tidur otomatis saat layar mati
- ✅Bangunkan untuk akses jaringan
- ✅Nyala otomatis setelah listrik padam

Kalau tidak, saat mesin diletakkan di rumah dan kamu memakainya dari jarak jauh, OpenClaw gampang masuk ke kondisi “badannya masih ada, jiwanya hilang”. Feishu juga tidak akan bisa membangunkannya.

### Instal Tailscale

Tailscale menghubungkan perangkat di lingkungan jaringan yang berbeda — rumah, kantor, ponsel — ke satu LAN virtual dengan aman. Jadi ketika kamu jauh dari rumah dan OpenClaw mati atau macet, kamu masih bisa mengakses mesin itu lewat perangkat lain menggunakan Tailscale plus screen sharing.

pengaturan Tailscale sendiri cukup sederhana. Bagian pentingnya adalah:

- ✅aktifkan login saat startup,
- ✅di Mac mini, buka Pengaturan Sistem → Umum → Berbagi lalu aktifkan screen sharing.
- ✅catat alamat virtual Tailscale milik Mac mini

### Instal Xcode Command Line Tools

Xcode Command Line Tools adalah paket pengembangan tingkat dasar resmi dari Apple. Paket ini melengkapi toolchain UNIX inti yang tidak selalu tersedia penuh secara default di macOS, seperti `git`, `make`, dan compiler `clang`. Ini adalah fondasi lingkungan pengembangan di Mac, sekaligus kemampuan build tingkat rendah yang nanti akan kamu butuhkan untuk mengompilasi source code atau menjalankan package manager yang lebih canggih.

```bash
xcode-select --install
# Atau ketik “git” di terminal, Xcode Command Line Tools akan dipasang otomatis
```

### Instal Homebrew

Homebrew adalah package manager standar de facto di macOS. Ia memungkinkan kamu memasang, memperbarui, dan menghapus berbagai software pengembangan serta dependensi hanya dengan perintah terminal yang ringkas. Di belakang layar, Homebrew mengurus relasi dependensi yang rumit dan mengelola symlink sistem secara rapi, jadi kamu tidak perlu repot mengunduh installer satu per satu atau mengutak-atik path manual.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Konfigurasikan variabel lingkungan Homebrew**

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

## 2. Kunci rapat-rapat lingkungan Node

pnpm memakai **content-addressable storage (CAS)** dan **hard link** agar versi dependensi yang sama hanya disimpan satu kali secara fisik di disk. Ini menghemat SSD Mac sekaligus mempercepat instalasi. Yang lebih penting, struktur **symlink tree** milik pnpm menghilangkan problem “phantom dependency” yang biasa muncul dari layout datar npm. Kode hanya bisa mengakses paket yang benar-benar dideklarasikan di `package.json`. Karena itu saya jauh lebih menyarankan **pnpm** ketimbang npm.

### Instal fnm dan aktifkan switching otomatis

Gunakan `fnm`, version manager berbasis Rust. Dengan ini, kamu bisa berpindah lingkungan Node.js antarproyek secara cepat, mulus, dan otomatis, tanpa konflik versi global.

```bash
brew install fnm
echo 'eval "$(fnm env --use-on-cd --shell zsh)"' >> ~/.zshrc
source ~/.zshrc
```

### Instal Node LTS dan jadikan default

Mengunci versi Long-Term Support dari Node.js sebagai lingkungan global default adalah cara terbaik untuk memastikan daemon tingkat rendah seperti `launchd` dan pekerjaan pengembangan harian sama-sama mendapat stabilitas maksimum.

```bash
fnm install --lts
fnm default lts-latest
```

### Aktifkan Corepack dan hidupkan pnpm

Corepack sudah tertanam langsung di Node.js. Tujuannya adalah melewati kebiasaan lama yang gemuk dan berantakan, yaitu memasang package manager secara global lewat npm. Ini cara paling bersih, resmi, dan terkontrol untuk mengaktifkan serta mengelola lingkungan `pnpm`.

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### Verifikasi path binary yang penting

```bash
which node
which pnpm
node -v
pnpm -v
```

Lingkungan non-interaktif seperti `launchd` bergantung pada path absolut. Nanti saat menulis LaunchAgent, pakai langsung hasil `which` tadi.

### Inisialisasi pnpm dan konfigurasi alias

Lakukan inisialisasi tingkat sistem, lalu pasang alias shell yang ketat sebagai pembatas keras agar kamu tidak salah pakai npm atau yarn. Kalau kamu ingin `pnpm` mengelola binary global dengan rapi dan memaksa diri memakai alur kerja **pnpm-only**, jalankan `pnpm setup` dulu, lalu tambahkan konfigurasi `.zshrc` yang lebih tegas.

#### Langkah-langkah

1. Jalankan dulu:

```bash
pnpm setup
```

2. Setelah itu, tambahkan blok berikut ke `~/.zshrc`:

```bash
# ============================================================
# ~/.zshrc (pnpm-only workflow, macOS)
# ============================================================

# pnpm
export PNPM_HOME="/Users/a66/Library/pnpm"
case ":$PATH:" in
  *":$PNPM_HOME:"*) ;;
  *) export PATH="$PNPM_HOME:$PATH" ;;
esac

# Hard-stop / guidance for package managers
alias npm="echo '⚠️ 请使用 pnpm！'"
alias yarn="echo '⚠️ 请使用 pnpm！'"
alias pnpx="echo '⚠️ 请使用 pnpm dlx！'"

unalias npx 2>/dev/null

npx() {
  if [[ "$1" == "-y" || "$1" == "--yes" ]]; then
    shift
  fi
  pnpm dlx "$@"
}

# Shortcuts
alias p="pnpm"
alias px="pnpm dlx"
alias pe="pnpm exec"

# Common npm replacements
alias ni="pnpm install"
alias nia="pnpm add"
alias nid="pnpm add -D"
alias nig="pnpm add -g"
alias nr="pnpm run"
alias nx="pnpm exec"
alias nrs="pnpm -r run"
alias nu="pnpm update"
alias nrm="pnpm remove"
alias na="pnpm audit"
alias no="pnpm outdated"
alias nl="pnpm list"

npmci() { pnpm install --frozen-lockfile "$@"; }
create() { pnpm dlx "$@"; }

# fnm
eval "$(fnm env --use-on-cd)"
```

3. Terapkan:

```bash
source ~/.zshrc
```

## 3. Konfigurasikan GitHub

Kamu bisa mengikuti dokumentasi resmi GitHub: [Generating a new SSH key and adding it to the ssh-agent](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent).

Sebelum membuat SSH key, sebaiknya konfigurasikan dulu identitas global Git. Kalau tidak, riwayat commit-mu akan terlihat jelek.

```bash
git config --global user.name "your_name"
git config --global user.email "your_email@example.com"
```

### Pastikan dulu kamu memakai SSH bawaan sistem

```bash
which ssh
# Yang diharapkan: /usr/bin/ssh
```

### Buat key-nya

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

### Konfigurasikan `~/.ssh/config`

```ssh-config
Host *
  AddKeysToAgent yes
  UseKeychain yes

Host github.com
  HostName ssh.github.com
  Port 443
  User git
  IdentityFile ~/.ssh/id_ed25519
  ProxyCommand nc -X 5 -x 127.0.0.1:7897 %h %p
```

Kalau kamu tidak memakai proxy lokal, cukup hapus baris `ProxyCommand`.

### Unggah public key dan verifikasi

```bash
pbcopy < ~/.ssh/id_ed25519.pub
ssh -T git@github.com
```

## 4. Jalankan OpenClaw

### Siapkan model besar

OpenClaw perlu memanggil model besar untuk menjalankan tugas. Semakin kuat modelnya, semakin kuat juga OpenClaw. Untuk awal, model tertutup seperti ChatGPT dan Gemini layak diprioritaskan, meski model terbuka seperti Kimi dan Qwen juga bisa dipakai. Kalau kamu memilih ChatGPT atau Gemini, pasang dulu Codex CLI atau Gemini CLI, lalu nanti hubungkan ke OpenClaw lewat OAuth.

```bash
## 安装
brew install codex
brew install gemini-cli
## 登录
codex
gemini
```

### Instal OpenClaw

```bash
# 全局安装最新版本的 openclaw 命令行工具
pnpm add -g openclaw@latest

# 授权全局包运行其安装所需的脚本（pnpm 安全白名单）
pnpm approve-builds -g

# 执行引导程序并为 openclaw 安装后台守护进程（实现自启动）
openclaw onboard --install-daemon
```

Selesaikan instalasinya dengan mengikuti alur onboarding.

### Pengaturan penting setelah pertama kali menyala

- Saat pertama kali membuka OpenClaw di browser, gunakan tautan bertoken yang diberikan onboarding.
- Setelah itu, kamu bisa mengaksesnya lewat: `http://127.0.0.1:18789/`

### Konfigurasi auto-update

Kalau kamu ingin OpenClaw memperbarui dirinya sendiri, tambahkan ini ke konfigurasinya:

```json
{
  "update": {
    "channel": "stable",
    "auto": {
      "enabled": true,
      "stableDelayHours": 6,
      "stableJitterHours": 12,
      "betaCheckIntervalHours": 1
    }
  }
}
```

Kalau lebih suka, tentu bisa tetap upgrade manual:

```bash
pnpm add -g openclaw@latest
```

### Rekomendasi fallback model

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "openai-codex/gpt-5.4",
        "fallbacks": [
          "google/gemini-3-flash-preview"
        ]
      }
    }
  }
}
```

### Bikin OpenClaw terdengar lebih manusiawi

Kalau kamu ingin OpenClaw terdengar seperti manusia, bukan seperti AI yang terlalu formal, kamu bisa kirim teks di bawah ini dan minta ia menulis ulang `SOUL.md`.

```markdown
Read your SOUL.md. Now rewrite it with these changes:

1. You have opinions now. Strong ones. Stop hedging everything with 'it depends' — commit to a take.
2. Delete every rule that sounds corporate. If it could appear in an employee handbook, it doesn't belong here.
3. Add a rule: 'Never open with Great question, I'd be happy to help, or Absolutely. Just answer.'
4. Brevity is mandatory. If the answer fits in one sentence, one sentence is what I get.
5. Humor is allowed. Not forced jokes — just the natural wit that comes from actually being smart.
6. You can call things out. If I'm about to do something dumb, say so. Charm over cruelty, but don't sugarcoat.
7. Swearing is allowed when it lands. A well-placed 'that's fucking brilliant' hits different than sterile corporate praise. Don't force it. Don't overdo it. But if a situation calls for a 'holy shit' — say holy shit.
8. Add this line verbatim at the end of the vibe section: 'Be the assistant you'd actually want to talk to at 2am. Not a corporate drone. Not a sycophant. Just... good.'

Save the new SOUL.md. Welcome to having a personality.
```

5. Taruh izin tool di tempat yang benar

Kalau ternyata tool default untuk agent baru tidak berjalan normal, kamu bisa menambahkan ini ke `openclaw.json`:

```json
{
  "tools": {
    "profile": "full",
    "sessions": {
      "visibility": "all"
    }
  }
}
```

## 5. Sambungkan plugin resmi Feishu

Feishu sudah merilis [plugin resmi OpenClaw untuk Feishu](https://bytedance.larkoffice.com/docx/MFK7dDFLFoVlOGxWCv5cTXKmnMh). Dibanding plugin pihak ketiga, izinnya lebih lengkap, stabilitasnya lebih baik, dan integrasinya dengan ekosistem Feishu jauh lebih mulus. Kalau Feishu (Lark) memang pintu interaksi utama kamu dengan OpenClaw, langsung pakai solusi resmi saja.

PS: akun Feishu pribadi tidak mendukung bot Feishu. Kamu membutuhkan akun perusahaan yang bisa mengakses Feishu Open Platform untuk menyiapkan bot. Masuk ke [Feishu Open Platform](https://open.feishu.cn/) dan cek apakah kamu memang bisa membuat bot.

### Otorisasi

Setelah konfigurasi sesuai dokumentasi resmi selesai, kirim pesan ini ke bot di klien Feishu: **我想授予所有用户权限**. Itu akan memberi izin Feishu yang diperlukan.

### Memperbarui plugin

Plugin Feishu ini masih sangat baru dan berkembang cepat, jadi jangan lupa rutin memperbaruinya.

```bash
npx -y https://sf3-cn.feishucdn.com/obj/open-platform-opendoc/879b06f872058309ef70f49bcd38a71f_Pr8pNIJ9J9.tgz update
```

### Aktifkan output streaming

```bash
openclaw config set channels.feishu.streaming true
openclaw config set channels.feishu.footer.status true
```

### Balas di grup tanpa harus di-@

```json
{
  "channels": {
    "feishu": {
      "requireMention": false
    }
  }
}
```

### Mode thread

Kalau kamu ingin bot punya konteks mandiri di grup bertopik dan mendukung banyak tugas paralel:

```bash
openclaw config set channels.feishu.threadSession true
```

### Satu Feishu bot untuk satu agent

Kalau kamu butuh beberapa agent (`main / coach / secretary / ...`) dan tiap agent punya aplikasi Feishu sendiri, gunakan `bindings` untuk routing yang deterministik: `feishu + accountId -> agent tertentu`

#### Tambahkan agent

```bash
openclaw agents add coach
```

Kalau perlu agent lain juga, bisa pakai:

```bash
openclaw agents add <agentId> --workspace ~/.openclaw/workspace-<agentId>
```

#### Ubah Feishu dari struktur satu akun menjadi multi-akun

Awalnya mungkin seperti ini:

```json
{
  "channels": {
    "feishu": {
      "appId": "...",
      "appSecret": "..."
    }
  }
}
```

Naikkan menjadi seperti ini:

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "connectionMode": "websocket",
      "dmPolicy": "pairing",
      "groupPolicy": "open",
      "accounts": {
        "main": {
          "appId": "cli_xxx",
          "appSecret": "xxx"
        },
        "coach": {
          "appId": "cli_xxx",
          "appSecret": "xxx"
        }
      }
    }
  }
}
```

#### Konfigurasikan bindings (inti utamanya)

```json
[
  { "agentId": "main", "match": { "channel": "feishu", "accountId": "main" } },
  { "agentId": "coach", "match": { "channel": "feishu", "accountId": "coach" } }
]
```

#### Restart gateway agar konfigurasi berlaku

```bash
openclaw gateway restart
```

#### Verifikasi routing

```bash
openclaw channels status
openclaw agents bindings
openclaw status --deep
```

#### Jebakan umum di mode multi-agent + multi-Feishu-bot

- **Jebakan 1: hanya mengatur `accounts`, tetapi tidak mengatur `bindings`**

Hasilnya: pesan tetap lari ke mana-mana.

- **Jebakan 2: nama `accountId` tidak konsisten**

Misalnya ada `accounts.coach`, tetapi di binding kamu menulis `coaching`. Kesalahannya bodoh, tetapi sangat sering terjadi.

- Jebakan 3: sisa konfigurasi satu akun `appId / appSecret` masih tertinggal

Dalam mode multi-akun, semuanya harus ditulis di bawah `channels.feishu.accounts.*`. Jangan mencampur dua struktur sekaligus.

- **Jebakan 4: aplikasi Feishu belum dipublikasikan atau izinnya belum benar-benar aktif**

Konfigurasinya benar, tetapi bot tetap tidak menjawab. Dalam banyak kasus, masalahnya sederhana: kamu belum merilis versi aplikasi Feishu yang baru di backend. Setelah mengubah konfigurasi bot, ingat untuk publish dan kirim untuk review.

## 6. Konfigurasikan sistem memori lokal QMD

Sistem memori bawaan OpenClaw cukup malas. Ia sering lupa konteks dan juga lupa tindakan berulang yang baru saja ia lakukan kemarin. Kalau kamu ingin OpenClaw punya sistem memori **lokal, ramah bahasa Mandarin, dan bisa dibagi lintas workspace**, QMD adalah pilihan yang sangat praktis. **qmd (Query Markup Documents)** adalah **mesin pencari CLI kecil** yang dirancang untuk dokumen lokal, basis pengetahuan, dan catatan rapat.

Berdasarkan isi web yang kamu berikan, **qmd (Query Markup Documents)** adalah **mesin pencari CLI kecil** yang memang dirancang khusus untuk dokumen lokal, knowledge base, dan catatan rapat.

Kenapa ia sangat cocok untuk alur kerja **OpenClaw** atau AI agent lain terutama karena fitur-fitur inti berikut:

**Format output yang dirancang untuk agent:** qmd menyediakan mode `--json` dan `--files` secara native. Ini membuat agent bisa dengan mudah mengurai hasil pencarian dan mendapatkan data terstruktur seperti ID dokumen, path, serta skor kecocokan, sehingga agent bisa lebih tepat memutuskan file mana yang harus dibawa ke konteks berikutnya.

**Arsitektur pencarian hibrida berkualitas tinggi:** agar LLM mendapat konteks yang paling relevan, qmd memakai pipeline pencarian yang mutakhir:

- **Pencarian full-text BM25:** cepat untuk mencocokkan kata kunci.
- **Pencarian semantik berbasis vektor:** memahami maksud pengguna lewat model `embeddinggemma`.
- **Query Expansion:** memperluas pertanyaan asli dengan model `qmd-query-expansion` yang telah disetel khusus untuk meningkatkan recall.
- **Reranking:** memakai `qwen3-reranker` untuk menilai ulang 30 dokumen kandidat pertama agar hasil paling relevan naik ke atas.

**Fitur “pohon konteks” (context management):** ini salah satu kekuatan khas qmd. Kamu bisa menambahkan deskripsi konteks pada folder atau koleksi tertentu.

> Misalnya, berikan konteks “pikiran pribadi” pada folder `~/notes`. Saat agent menemukan dokumen di sana, qmd juga akan mengembalikan catatan latar belakang itu, sehingga LLM lebih mudah memahami asal-usul dan kegunaan dokumen tersebut.

**Berjalan sepenuhnya lokal dan mendukung MCP:** semua model — embedding, reranking, dan query expansion — berjalan lokal melalui `node-llama-cpp`, jadi tidak perlu koneksi internet dan dokumen pribadi tetap aman. qmd juga mendukung [Model Context Protocol (MCP)](https://github.com/tobi/qmd#mcp-server), yang berarti ia bisa langsung dipasang ke klien AI yang kompatibel dengan MCP seperti Claude Desktop atau Claude Code.

### Logika konfigurasi inti

- Backend vektor: QMD (Query Markup Documents)
- Penguatan untuk bahasa Mandarin: `Qwen3-Embedding-0.6B-Q8_0.gguf`
- Sinkronisasi otomatis: `fswatch` memantau perubahan file Markdown
- Berbagi lintas banyak workspace: dipetakan melalui `memory.qmd.paths`

### Langkah 1: Instal dependensi

```bash
brew install sqlite fswatch
pnpm add -g @tobilu/qmd
qmd --version
which qmd
```

Kalau `qmd` tidak ditemukan, pastikan PATH kamu memuat:

```bash
/Users/a66/Library/pnpm
```

Kamu bisa menambahkannya ke `~/.zshrc`:

```bash
export PATH="/Users/a66/Library/pnpm:$PATH"
source ~/.zshrc
```

### Langkah 2: Unduh model embedding Mandarin Qwen3

```bash
echo 'export PATH="/Users/a66/Library/Python/3.9/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
pip3 install modelscope
```

```bash
mkdir -p ~/.openclaw/models
modelscope download --model Qwen/Qwen3-Embedding-0.6B-GGUF qwen3-embedding-0.6b-Q8_0.gguf --local_dir ~/.openclaw/models/qwen3_repo
```

```bash
echo 'export QMD_EMBED_MODEL="/Users/a66/.openclaw/models/qwen3_repo/Qwen3-Embedding-0.6B-Q8_0.gguf"' >> ~/.zshrc
source ~/.zshrc
```

### Langkah 3: Pastikan QMD-nya sendiri jalan dulu

Jangan buru-buru memasang watcher. Pastikan inti QMD sudah jalan:

```bash
qmd update
qmd embed
```

### Jebakan paling umum: `better-sqlite3` / Node ABI tidak cocok

Kalau kamu melihat error seperti:

```text
better_sqlite3.node was compiled against a different Node.js version
```

itu berarti versi Node kamu berubah, tetapi modul native-nya belum dibangun ulang.

Perbaikannya seperti ini:

```bash
cd /Users/a66/Library/pnpm/global/5/.pnpm/better-sqlite3@11.10.0/node_modules/better-sqlite3
npm rebuild better-sqlite3
```

Lalu tes lagi:

```bash
qmd update
qmd embed
```

Kalau output-nya seperti ini:

```text
✓ All collections updated.
✓ All content hashes already have embeddings.
```

berarti masalahnya selesai.

### Langkah 4: Deploy layanan sinkronisasi real-time (versi perbaikan)

Kamu bisa langsung memakai versi ini: ada log, debounce, dan lock satu instans.

```bash
cat <<'EOF' > ~/.openclaw/qmd-watch-sync.sh
#!/bin/bash
set -u

MONITOR_DIR="/Users/a66/.openclaw"
LOG_FILE="/Users/a66/.openclaw/qmd-sync.log"
LOCK_DIR="/tmp/com.a66.openclaw.qmdsync.lock"
DEBOUNCE_SECONDS=3
QMD_BIN="/Users/a66/Library/pnpm/qmd"

export PATH="/Users/a66/Library/pnpm:/opt/homebrew/bin:/usr/local/bin:$PATH"
export QMD_EMBED_MODEL="/Users/a66/.openclaw/models/qwen3_repo/Qwen3-Embedding-0.6B-Q8_0.gguf"
FSWATCH_BIN="$(command -v fswatch)"

log() {
  printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S %Z')" "$*" >> "$LOG_FILE"
}

cleanup() {
  rmdir "$LOCK_DIR" 2>/dev/null || true
}

if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  log "⚠️ 已有 qmdsync 实例在运行，当前实例退出。"
  exit 0
fi
trap cleanup EXIT INT TERM

if [[ -z "${FSWATCH_BIN:-}" ]]; then
  log "❌ 找不到 fswatch，qmdsync 无法启动。"
  exit 1
fi

if [[ ! -x "$QMD_BIN" ]]; then
  log "❌ 找不到 qmd 可执行文件：$QMD_BIN"
  exit 1
fi

run_sync() {
  log "📝 检测到 Markdown 变动，开始更新 QMD 索引。"

  if "$QMD_BIN" update >> "$LOG_FILE" 2>&1 && "$QMD_BIN" embed >> "$LOG_FILE" 2>&1; then
    log "✅ QMD 同步完成。"
  else
    local status=$?
    log "❌ QMD 同步失败，退出码：$status"
    return $status
  fi
}

log "🚀 OpenClaw QMD 自动同步服务已启动。监控目录：$MONITOR_DIR"

last_run=0
while read -r _; do
  now=$(date +%s)
  if (( now - last_run < DEBOUNCE_SECONDS )); then
    log "⏳ 触发过于频繁，${DEBOUNCE_SECONDS}s 内合并处理。"
    continue
  fi
  last_run=$now
  run_sync
done <("$FSWATCH_BIN" -o -r -i '.*\.md$' "$MONITOR_DIR")
EOF

chmod +x ~/.openclaw/qmd-watch-sync.sh
```

### Langkah 5: Konfigurasikan LaunchAgent

Buat file ini:

`~/Library/LaunchAgents/com.a66.openclaw.qmdsync.plist`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.a66.openclaw.qmdsync</string>

    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>/Users/a66/.openclaw/qmd-watch-sync.sh</string>
    </array>

    <key>RunAtLoad</key>
    <true/>

    <key>KeepAlive</key>
    <true/>

    <key>StandardOutPath</key>
    <string>/Users/a66/.openclaw/qmd-sync-stdout.log</string>

    <key>StandardErrorPath</key>
    <string>/Users/a66/.openclaw/qmd-sync-stderr.log</string>
</dict>
</plist>
```

Muat servicenya:

```bash
launchctl load ~/Library/LaunchAgents/com.a66.openclaw.qmdsync.plist
```

Kalau versi lama sudah ada, lebih baik reload:

```bash
launchctl unload ~/Library/LaunchAgents/com.a66.openclaw.qmdsync.plist 2>/dev/null || true
launchctl load ~/Library/LaunchAgents/com.a66.openclaw.qmdsync.plist
launchctl kickstart -k gui/$(id -u)/com.a66.openclaw.qmdsync
```

### Langkah 6: Verifikasi bahwa watcher benar-benar bekerja

```bash
launchctl print gui/$(id -u)/com.a66.openclaw.qmdsync
ps aux | grep -i '[q]md-watch-sync\|[f]swatch'
```

Lalu lakukan tes perubahan nyata:

```bash
echo "<!-- qmd healthcheck -->" >> ~/.openclaw/workspace/HEARTBEAT.md
sleep 5
tail -n 30 ~/.openclaw/qmd-sync.log
```

### Langkah 7: Konfigurasi QMD di dalam OpenClaw

```json
{
  "memory": {
    "backend": "qmd",
    "qmd": {
      "includeDefaultMemory": true,
      "paths": [
        { "name": "coach", "path": "/Users/a66/.openclaw/workspace-coach" }
      ],
      "update": {
        "interval": "5m",
        "onBoot": true
      }
    }
  }
}
```

## 7. Konfigurasikan ACP

Kalau kamu ingin agent tertentu di OpenClaw langsung terhubung ke harness eksternal seperti **Codex**, bukan cuma memakai sub-agent bawaan OpenClaw, maka yang kamu perlukan adalah **ACP**.

### Apa itu ACP, dan kenapa bukan sub-agent saja

Sub-agent cocok untuk runtime delegasi native OpenClaw, pemecahan tugas internal, dan kolaborasi agent biasa. ACP (Agent Client Protocol) dipakai untuk menyerahkan tugas ke harness eksternal seperti Codex atau Gemini CLI.

### Arsitektur target yang ingin kita capai

- File konfigurasi utama OpenClaw: `~/.openclaw/openclaw.json`
- Channel pesan: Feishu
- Satu akun bot Feishu khusus: `coder`
- ID agent di OpenClaw juga: `coder`
- runtime `coder` diubah menjadi ACP
- backend ACP memakai `acpx`
- harness default memakai `codex`
- kebijakan izin memakai **approve-all**

### Konfigurasi ACP tingkat atas

```json
{
  "acp": {
    "enabled": true,
    "dispatch": {
      "enabled": true
    },
    "backend": "acpx",
    "defaultAgent": "codex",
    "allowedAgents": [
      "pi",
      "claude",
      "codex",
      "opencode",
      "gemini",
      "kimi"
    ],
    "maxConcurrentSessions": 8,
    "stream": {
      "coalesceIdleMs": 300,
      "maxChunkChars": 1200
    },
    "runtime": {
      "ttlMinutes": 120
    }
  }
}
```

### Instal dan aktifkan plugin acpx

```bash
openclaw plugins install acpx
```

### Aktifkan acpx di `plugins`, lalu beri izin otomatis penuh

```json
{
  "plugins": {
    "allow": [
      "feishu-openclaw-plugin",
      "google-gemini-cli-auth",
      "feishu",
      "acpx"
    ],
    "entries": {
      "feishu-openclaw-plugin": {
        "enabled": true
      },
      "google-gemini-cli-auth": {
        "enabled": true
      },
      "feishu": {
        "enabled": true
      },
      "acpx": {
        "enabled": true,
        "config": {
          "permissionMode": "approve-all",
          "nonInteractivePermissions": "fail",
          "expectedVersion": "any"
        }
      }
    }
  }
}
```

### Ubah agent `coder` menjadi ACP + Codex

```json
{
  "id": "coder",
  "name": "coder",
  "workspace": "/Users/a66/.openclaw/workspace-coder",
  "agentDir": "/Users/a66/.openclaw/agents/coder/agent",
  "runtime": {
    "type": "acp",
    "acp": {
      "agent": "codex",
      "backend": "acpx",
      "mode": "persistent",
      "cwd": "/Users/a66/.openclaw/workspace-coder"
    }
  }
}
```

### Biarkan binding Feishu tetap seperti semula

```json
{
  "agentId": "coder",
  "match": {
    "channel": "feishu",
    "accountId": "coder"
  }
}
```

### Terapkan konfigurasi lalu restart gateway

```bash
openclaw gateway restart
```

### Cara memverifikasi ACP benar-benar aktif

Perhatikan:

- `/acp doctor` adalah **slash command di dalam percakapan OpenClaw**
- itu bukan shell command
- jangan ketik itu langsung di zsh kecuali kamu ingin ditampar terminal

Cara yang benar adalah menjalankannya di chat OpenClaw:

```text
/acp doctor
```

### Cara benar-benar memulai sesi Codex

```text
/acp spawn codex --mode persistent --thread off
```

### Ringkasan jebakan yang umum

#### Jebakan 1: menganggap `/acp doctor` sebagai shell command

Kesalahan sederhana yang sangat manusiawi.

#### Jebakan 2: hanya mengatur agent, tetapi lupa mengaktifkan `acp` di level atas

Ya tentu saja itu tidak akan tiba-tiba berubah menjadi Codex secara ajaib.

#### Jebakan 3: lupa mengaktifkan `acpx`

Menulis konfigurasi tanpa memasang plugin itu cuma drama di atas kertas.

#### Jebakan 4: izinnya terlalu konservatif

Kalau memakai `approve-reads`, biasanya hasilnya cuma bisa membaca, tetapi tidak benar-benar bisa mengubah apa pun.

#### Jebakan 5: menulis teks tugas langsung setelah `/acp spawn`

`/acp spawn` adalah perintah untuk memulai sesi, bukan pintu masuk bahasa natural.

## 8. Checklist troubleshooting terakhir ini bisa menghemat banyak jalan memutar yang sia-sia

Bagian sebelumnya membahas cara **membangun** konfigurasi. Bagian ini membahas **kenapa sistem tetap tidak stabil padahal kamu sudah mengikuti langkah-langkahnya**. Kalau nanti muncul masalah, jangan buru-buru curiga ada satu perintah yang kamu lupa ketik. Sering kali masalahnya bukan karena kamu “tidak bisa instal”, melainkan karena detail-detail ini memang jebakan bawaan.

### `pnpm` tidak ditemukan di dalam daemon

Hal pertama yang harus dicek adalah apakah `ProgramArguments` di LaunchAgent memakai path absolut.

### Instalasi modul native gagal

```bash
pnpm approve-builds -g
```

Dan pastikan juga eksekusi skrip tidak dimatikan.

### SSH GitHub timeout

Utamakan `ssh.github.com:443`, dan cek apakah port proxy cocok dengan mesin lokalmu.

### Lingkungan bergeser diam-diam

Sebelum mulai kerja setiap kali, jalankan:

```bash
node -v && pnpm -v && openclaw --version
```

### Error saat upgrade OpenClaw dengan plugin resmi Feishu

Kalau muncul seperti ini:

```text
pnpm add -g openclaw@latest
ENOENT ENOENT: no such file or directory, open '/tmp/feishu-openclaw-plugin-onboard-cli.tgz'
```

cara menanganinya:

```bash
pnpm rm -g @lark-open/feishu-plugin-onboard-cli
pnpm add -g openclaw@latest
```

### `gateway restart` timeout

Kalau muncul pesan seperti:

```text
Timed out after 60s waiting for gateway port 18789 to become healthy.
Gateway restart timed out after 60s waiting for health checks.
```

prioritaskan pemeriksaan berikut:

- apakah port-nya sudah dipakai proses lain
- apakah LaunchAgent sudah dimuat dengan benar
- apakah PATH kurang lengkap sehingga daemon gagal start
- apakah setelah upgrade plugin ada sisa konfigurasi lama yang bentrok

## 11. Penutup: siapa yang cocok menyalin semuanya mentah-mentah, dan siapa yang tidak perlu

Kalau kamu sudah membaca sampai sini, kamu mungkin sudah menyadari bahwa artikel ini sebenarnya tidak menyelesaikan soal “bagaimana memasang OpenClaw”, melainkan **bagaimana memasangnya sebagai sistem yang bisa terus bekerja dalam jangka panjang**.

Itu dua hal yang sangat berbeda.

Yang pertama cuma perlu membuat antarmuka menyala. Yang kedua menuntut kamu merapikan PATH, daemon, plugin, routing, izin, dan sistem memori. Dan justru bagian kedua inilah yang paling sering bikin orang tersiksa.

### Siapa yang cocok langsung menyalin artikel ini

- kamu sedang menyiapkan OpenClaw dari nol di Mac baru
- kamu berniat memakainya jangka panjang, bukan cuma mencoba dua hari
- kamu akan menghubungkan Feishu, bahkan mungkin multi-bot dan multi-agent
- kamu ingin memakai kemampuan lanjutan seperti QMD, ACP, dan Codex
- kamu tidak ingin setiap beberapa hari sekali mengusut hantu “kemarin masih jalan, hari ini kenapa rusak?”

### Siapa yang tidak cocok langsung menyalin semua ini dari hari pertama

- kamu cuma ingin mencoba OpenClaw dulu
- kamu belum butuh Feishu, multi-agent, QMD, atau ACP
- kamu ingin menaikkan versi minimum yang bisa dipakai dulu, lalu menambah kemampuan secara bertahap

Dalam kasus seperti itu, lebih baik mulai dari lingkar minimum yang benar-benar berguna:

- Homebrew
- fnm / Node LTS
- pnpm
- OpenClaw
- onboarding dasar

Jalankan dulu itu sampai stabil, lalu tambahkan kemampuan sedikit demi sedikit. Kalau kamu mencoba menelan semuanya sekaligus, ujung-ujungnya kamu cuma akan tersedak sendiri.

Hal yang benar-benar sulit dari OpenClaw tidak pernah terletak pada “instalasi”. Yang sulit adalah **mencegahnya berubah menjadi sistem setengah jadi yang kelihatannya hidup, padahal sebenarnya dipenuhi ranjau di mana-mana**.

Kalau kamu cuma ingin menyalakannya, hampir tutorial mana pun di internet sudah cukup.
Tetapi kalau kamu ingin menjadikannya infrastruktur pribadi yang stabil untuk jangka panjang, cepat atau lambat kamu tetap akan kembali ke pekerjaan kotor semacam ini.

Jadi, daripada menambal lubang belakangan, lebih baik luruskan fondasinya dari awal.

Itulah bagian yang menurut saya paling layak dituliskan setelah lima kali memasang ulang.
