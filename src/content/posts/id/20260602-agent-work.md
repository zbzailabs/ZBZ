---
title: "Alur kerja kolaborasi AI saya"
description: "Cara saya menggunakan ChatGPT, Codex, Pulse, dan deep research dari OpenAI untuk proposal proyek dan pengembangan perangkat lunak"
category: "startup"
tags:
  - "allocation"
  - "strategy"
  - "innovation"
pubDate: 2026-06-02
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260603105442913.avif"
heroImageAlt: "Alur kerja kolaborasi AI saya"
heroImageWidth: 2400
heroImageHeight: 1350
draft: false
featured: false
locale: id
---

Saya telah menggunakan ChatGPT sejak 2023, dari pengguna biasa menjadi pengguna berbayar, lalu dari Plus ke Pro. Di paruh kedua 2025, ketika Gemini tiba-tiba naik pesat, saya sempat berpindah platform ke Gemini untuk sementara. Setelah GPT-5.5 dirilis, saya kembali ke ekosistem OpenAI. Ada dua alasan utama. Pertama, kemampuan model besar GPT-5.5 masih jauh memimpin dibanding model lain. Sebenarnya, perlombaan skor antarmodel besar tidak terlalu berarti bagi pengguna biasa. Pengguna biasa membutuhkan produktivitas yang nyata. Saat ini GPT benar-benar sudah mencapai tingkat produktivitas yang bisa menghasilkan keluaran siap pakai. Kedua, OpenAI telah melakukan banyak pekerjaan produk. Codex, Pulse, dan deep research masing-masing menurunkan hambatan penggunaan bagi pengguna.

Saat ini, saya terutama menggunakan produk OpenAI untuk dua jenis pekerjaan: membuat proposal proyek dan pemrograman. Alur kasar saya untuk membuat proposal proyek adalah sebagai berikut: menggunakan Feishu Minutes/Lark Minutes untuk mengubah audio dari survei lapangan dan komunikasi dengan klien menjadi notulen rapat; mengirim notulen yang sudah diperiksa serta bahan proyek lainnya ke ChatGPT; menggunakan deep research agar ChatGPT membuat draf awal proposal; mengekspor versi Word untuk pemeriksaan dan revisi; terakhir menggunakan Codex untuk menyesuaikan format teks. Jika masih perlu membuat PowerPoint, saya melanjutkan dengan plugin presentations milik Codex untuk membuat PPT. Tentu saja, PPT yang dibuat oleh presentations tidak sempurna, dan beberapa PowerPoint skills open source di GitHub dapat digunakan untuk memperbaikinya.

Untuk memperbaiki bug dan menyesuaikan fitur, Codex sudah sepenuhnya mampu. Jika ingin mengembangkan sistem besar yang lengkap dari nol, Codex masih menghadapi banyak tantangan, terutama risiko proses menjadi tidak terkendali. Pada saat itu, hal terpenting adalah menetapkan batas dengan jelas: stack teknologi, batas fungsi, dan lain-lain. Untuk proyek yang baru dimulai, pertama-tama pastikan dua file: `AGENTS.md` dan `DESIGN.md`. `AGENTS.md` digunakan untuk membatasi stack teknologi, aturan rekayasa, dan batas eksekusi. `DESIGN.md` digunakan untuk membatasi warna, font, gaya komponen, dan aturan visual lainnya. Langkah kedua adalah memilih stack teknologi. Pilih stack yang dikuasai AI dengan baik, seperti React + TypeScript, bukan stack yang lebih dikuasai manusia, seperti Java.

AI telah mengubah ritme kerja, dan masalah kesehatan tidak boleh diabaikan. AI Agent memang dapat sangat meningkatkan efisiensi kerja. Jika salah satu pekerjaan Anda belum selesai, Agent akan cepat menyelesaikan bagiannya lalu mendorong Anda maju, sehingga Anda terpaksa terus bekerja. Pekerjaan itu menjadi intens, tanpa ruang untuk bersantai. Otak terus berputar, dan dalam jangka panjang ini sangat melelahkan. Karena itu, Anda perlu cara eksternal untuk membuat diri sendiri berhenti. Cara terbaik adalah teknik Pomodoro: bekerja 25 menit, istirahat 5 menit, dan memberi otak kesempatan untuk rileks. Tentu saja, jika koordinasi Anda dengan agent berjalan baik, Anda sepenuhnya bisa beristirahat saat agent bekerja.
