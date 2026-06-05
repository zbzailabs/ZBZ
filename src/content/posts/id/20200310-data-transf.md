---
title: "Migrasi Data Paksa"
description: "Perhatikan perlindungan privasi, data harus dicadangkan beberapa kali, dan akun harus mengaktifkan otentikasi dua faktor"
category: "life"
tags:
  - "roam"
pubDate: 2020-03-10
heroImage: "https://cos.zbz.ai/images/202310181512073.avif"
heroImageAlt: "ZBZ-"
heroImageWidth: 1960
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "id"
---

###

### Pemulihan Peristiwa

Pada tanggal 18 Februari, saya menerima pemberitahuan dari Taoluyun yang mengatakan bahwa kata sandi akun server berisiko dan harus diubah sesegera mungkin. Karena akun tersebut memiliki verifikasi SMS, ditambah ada banyak hal yang harus dilakukan setelah melanjutkan pekerjaan, saya tidak memasukkan pemberitahuan itu ke dalam hati.

Pada tanggal 7 Maret, ketika saya bersiap untuk memperbarui artikel, saya menemukan bahwa server telah dikunci oleh Taoluyun. Saya menanyakan alasannya dan diberitahu bahwa metode pembayaran akun berisiko. Saya perlu memberikan kartu identitas saya, kartu bank yang terikat, dan laporan bulan lalu sebelum mencoba membukanya. Pada saat yang sama, memeriksa tagihan, saya menemukan bahwa langganan bulanan ECS memiliki 2 dolar yang tertunda pembayarannya bulan ini.

Taoluyun International tidak mendukung kartu bank daratan dan pembayaran pihak ketiga. Saat itu, saya hanya bisa menggunakan Paypal AS untuk membeli. Untuk mencegah pencurian, setelah membeli satu siklus ECS, saya sudah melepaskan ikatan PP dan Taoluyun, dan hubungan antara PP dan kartu bank. Sekarang untuk menyelesaikan pembukaan kunci server dan membayar tagihan, saya harus mengikat PayPal dan Taoluyun lagi. Setelah banyak upaya untuk mengikat ulang, PP selalu meminta "Tidak dapat mengatur pembayaran yang disetujui sebelumnya untuk sementara". Googling, ternyata banyak orang akan mengalami masalah yang sama. Pejabat PP menerapkan kontrol risiko pada akun. Apakah itu bisa diikat tergantung pada nasib.

Setelah beberapa upaya gagal, saya harus membeli server baru di Liangxinyun dan membangunnya kembali. Berkat cadangan data yang biasa, butuh 3 jam untuk memulihkan secara manual. Selama proses pemulihan data, beberapa teman yang berlangganan situs ini menerima sejumlah besar dorongan RSS konten lama. Mohon maafkan saya atas ketidaknyamanan yang ditimbulkan kepada Anda. Adapun Taoluyun yang terkunci dan tagihannya, saya hanya bisa memikirkan cara lain untuk menyelesaikannya.

### Pelajaran

**Data membutuhkan banyak cadangan** Tidak peduli apakah itu disk jaringan cloud, server, atau hard disk lokal, ada kemungkinan kehilangan data. Data penting harus dicadangkan di setidaknya tiga lokasi berbeda. Berikan perhatian khusus bahwa jika Anda mencadangkan secara lokal, jangan gunakan drive solid-state SSD. Data drive solid-state tidak dapat dipulihkan setelah hilang. Anda dapat menggunakan hard drive mekanis atau cakram optik. Saat menggunakan disk jaringan cloud, periksa terutama pengumuman resmi. Karena sulit bagi disk jaringan cloud untuk mendapatkan keuntungan, beberapa penyedia layanan mungkin menghentikan layanan kapan saja, jadi unduh dan transfer data Anda tepat waktu. Saat ini, disk jaringan yang paling teliti, menurut saya pribadi adalah He Caiyun dan Jianguoyun dari China Mobile. Jianguoyun dapat digunakan untuk sinkronisasi biasa, dan He Caiyun digunakan untuk penyimpanan data. Untuk album foto, Anda dapat menggunakan Google Foto.

**Akun perlu mengaktifkan otentikasi dua faktor** Semua jenis akun harus mengaktifkan otentikasi dua faktor. Umumnya, otentikasi dua faktor memiliki dua jenis: SMS dan otentikator MFA. Saat menggunakan verifikasi SMS, perjelas tentang area operasi penyedia layanan. Beberapa pesan penyedia layanan tidak mendukung nomor ponsel +86. Anda juga dapat mendaftarkan Google Voice untuk menerima pesan verifikasi penyedia layanan. Ada banyak otentikator, dan disarankan untuk menggunakan Authenticator Microsoft, yang diproduksi oleh produsen besar dan mendukung sinkronisasi dan pemulihan akun. Saat menggunakan otentikator, metode kode QR harus digunakan untuk verifikasi pertama, dan kode QR harus disimpan secara permanen. Kode QR ini berlaku secara permanen. Ketika ponsel hilang atau otentikator diinstal ulang, itu dapat digunakan lagi. Tidak disarankan menggunakan Authy. Meskipun juga mendukung pencadangan, saat masuk lagi, verifikasi SMS diperlukan, dan terkadang ponsel +86 tidak dapat menerima kode verifikasi.
