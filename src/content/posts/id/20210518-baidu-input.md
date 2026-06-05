---
title: "Perjalanan Plagiarisme Kulit Baidu Peniru"
description: "Sebagai metode input pribadi, jangan menemukan kembali roda. Salin (plagiarisme/pinjam) file sumber kulit metode input yang ada dan kembangkan dalam waktu singkat."
category: "life"
tags:
  - "roam"
pubDate: 2021-05-18
heroImage: "https://cos.zbz.ai/images/202310181257285.avif"
heroImageAlt: "RealRip-"
heroImageWidth: 1960
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "id"
---

Kulit metode input Baidu untuk macOS, gaya minimalis, sangat dapat disesuaikan.

## Fitur Kulit

1. Cocok untuk Metode Input Baidu untuk Mac.
2. Diadaptasi dengan sempurna untuk macOS Monterey.
3. Gaya minimalis, fokus pada input.
4. Sorot pilihan pertama, lebih fokus pada pemilihan kata.
5. Sangat dapat disesuaikan, dapat dipersonalisasi sesuai kebutuhan.

## Log Pembaruan

### `V1.1` 2021-11-05

1. Aturan penamaan file terpadu.
2. Menambahkan komentar untuk penyesuaian yang mudah.
3. Menghapus ikon pembalik halaman di sebelah kanan, membuat keseluruhan lebih sederhana.
4. Menambahkan file `global.ini`.
5. Menambahkan kulit grafit.
6. Memperbarui contoh kulit.

### `V1.0` 2021-05-18

1. Kulit dirilis.

## Petunjuk Penggunaan

1. Jika tidak ada kebutuhan khusus, Anda dapat langsung mengunduh paket kulit format `.bdskk` di folder `examples` dan klik dua kali untuk menginstal dan menggunakan.
2. Jika penyesuaian diperlukan, file dapat dimodifikasi.
3. Kompres konten dalam folder sumber daya kulit menjadi paket terkompresi format `.zip`, jangan kompres seluruh folder.
4. Ubah paket terkompresi menjadi paket kulit format `.bdskk`.
5. Klik dua kali paket instalasi untuk mengimpornya ke Metode Input Baidu.

## Struktur File

```json
└── src
    ├── global.ini
    ├── horizontal.ini
    ├── single.ini
    ├── statusbar.ini
    └── *.png
└── examples
└── README.md
└── LICENSE
```

1. `src`: Folder sumber daya.

2. `globe.ini`: File definisi global, dapat menentukan nama kulit, jenis kulit, deskripsi kulit, ID penulis, email, situs web, dll. Informasi yang relevan akan ditampilkan di halaman pengaturan tampilan Metode Input Baidu Mac.

3. `horizontal.ini`: File konfigurasi mode baris ganda. Kulit baris ganda mengacu pada mode yang menampilkan kode input dan kata kandidat secara bersamaan.

   **Area input & Area kata kandidat**: Bingkai rentang gambar latar belakang mode baris ganda, seperti yang ditunjukkan pada gambar. Prinsip pengaturan setiap parameter di kedua area adalah sama.

   **Area sembilan kotak**: Latar belakang bilah kandidat beradaptasi dengan panjang kata kandidat yang berbeda dengan cara ekspansi sembilan kotak. Empat parameter X / Y / Lebar / Tinggi menentukan area hijau pada gambar di bawah ini, yang merupakan istana tengah dari kisi sembilan kotak.

   **Margin konten**: Jarak antara kode input dan tepi irisan latar belakang. Kira-kira

   **Font & Warna**: Warna font dan kata kandidat menggunakan format RGB heksadesimal. Elemen yang dirujuk oleh setiap bidang ditunjukkan pada gambar di bawah ini:

   **Simbol interval**: Atur simbol interval antara nomor seri digital dan kata kandidat. Spasi adalah SPACE (huruf besar), dan karakter lain dimasukkan secara langsung.

4. `single.ini`: File konfigurasi mode satu baris. Kulit satu baris mengacu pada mode yang hanya menampilkan kata kandidat, yang terlihat lebih bersih dan lebih sederhana di Mac. Mode satu baris hanya perlu mengatur parameter area kata kandidat. Prinsip pengaturan parameter yang berlaku sama dengan kulit baris ganda.

5. `statusbar.ini`: File konfigurasi bilah status. Ikon pada bilah status dapat diatur di mana saja pada gambar latar belakang bilah status, Anda hanya perlu mengatur koordinat horizontal dan vertikalnya. Semua nilai koordinat didasarkan pada sudut kiri atas.

6. `*.png`: File irisan kulit, Anda dapat mengganti file yang sesuai dengan irisan Anda sendiri.

7. `examples`: Contoh kulit, dapat diunduh dan digunakan secara langsung.

8. `README.md`: File readme proyek.

9. `LICENSE`: Proyek ini mengikuti [lisensi MIT](https://github.com/xiyizhou/BaiduIM-Skin/blob/main/LICENSE). Anda dapat menggunakan, menyalin, memodifikasi, menggabungkan, menerbitkan, mendistribusikan, mensublisensikan, dan menjual perangkat lunak dan salinan perangkat lunak, dan Anda juga dapat memodifikasi persyaratan lisensi ke konten yang sesuai dengan kebutuhan program.

## Kontribusi

Jika Anda memiliki pertanyaan, keraguan, atau saran, jangan ragu untuk bertanya.

Set kulit ini masih memiliki masalah berikut yang harus diselesaikan. Karena saya tidak mengerti kode program Metode Input Baidu, pengembang ini tidak dapat mengimplementasikannya dalam waktu singkat. Jika Anda memiliki cara untuk mengimplementasikannya, Anda dipersilakan untuk berkontribusi.

- [ ] Menyempurnakan bilah status dan kulit baris ganda.

- [ ] Pemusatan vertikal font area kandidat dan warna latar belakang.

- [ ] Dapat menyesuaikan mesin terbang, ukuran font, dan warna nomor seri digital kata kandidat untuk mencapai efek tampilan yang mirip dengan metode input bawaan Mac untuk menyorot kata kandidat.

- [ ] Format kulit saat ini adalah `.bdskk`, perlu beralih ke format kulit default Metode Input Baidu Mac `.bpsm`.

- [ ] Mengembangkan kulit iPhone dan iPad yang mirip dengan kulit yang dapat menyesuaikan warna latar belakang kata yang disukai.
