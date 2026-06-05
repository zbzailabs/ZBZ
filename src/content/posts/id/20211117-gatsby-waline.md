---
title: "Instal Komponen Komentar Waline untuk Gatsby"
description: "Karena Waline belum memiliki komponen Gatsby, tambahkan fungsionalitas komentar Waline ke situs Gatsby dengan menginstal pustaka klien Waline, membuat komponen React, dan memperkenalkan komponen di lokasi yang sesuai."
category: "life"
tags:
  - "roam"
pubDate: 2021-11-17
heroImage: "https://cos.zbz.ai/images/202310181512145.avif"
heroImageAlt: "ZBZ-Instal Komponen Komentar Waline untuk Gatsby"
heroImageWidth: 1960
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "id"
---

Gatsby adalah kerangka kerja pembuatan situs web statis berdasarkan react, yang dapat digunakan untuk menyebarkan toko online, situs web resmi, dan blog. Menggunakan plugin yang kaya, fungsi-fungsi seperti pemuatan gambar yang lambat, dukungan dokumen Markdown, dan komentar pengunjung dapat direalisasikan. Sistem komentar yang secara resmi direkomendasikan oleh Gatsby termasuk Disqus, Gitalk, dll. Sistem komentar ini memiliki karakteristiknya sendiri, tetapi tidak dapat memenuhi kebutuhan. Artikel ini mencoba menginstal sistem komentar Waline yang baru-baru ini populer ke dalam proyek Gatsby. Karena pengembangan Gatsby memiliki tingkat kebebasan yang besar dan setiap proyek berbeda, untuk memfasilitasi ekspresi ide, tema blog resmi `gatsby-starter-blog` digunakan sebagai contoh.

## Ide

Karena Waline belum memiliki komponen Gatsby, kita perlu mengimplementasikan fungsi dengan menginstal pustaka klien Waline, membuat komponen React, dan memperkenalkan komponen di lokasi yang sesuai.

## Konfigurasi Dasar

Terapkan proyek [Gatsby](https://gatsbyjs.com) sesuai dengan persyaratan, dan konfigurasikan server dan sisi data sistem komentar Waline sesuai dengan [tutorial resmi Waline](https://waline.js.org).

## Instal Pustaka Waline

Di direktori root proyek, instal pustaka Waline melalui manajemen paket.

```bash
yarn add -D @waline/client
```

Setelah itu, Anda dapat memperkenalkan komponen Waline melalui pernyataan `import` di komponen komentar.

## Buat Komponen Komentar

Buat komponen kelas Waline untuk merangkum dan menggunakan kembali fungsi komentar.

Buat skrip baru `comment.js` di direktori `src/components`

```jsx
import React, { PureComponent } from "react";

export default class Comment extends PureComponent {
  constructor(props) {
    super(props);
    this._commentRef = React.createRef();
  }
  async componentDidMount() {
    if (typeof window === "undefined") {
      return;
    }
    if (!this._commentRef.current) {
      return;
    }
    const Waline = await (await import("@waline/client")).default;
    this.Waline = new Waline({
      el: this._commentRef.current,
      serverURL: "https://your.waline.url",
      visitor: true,
      path: this.props.slug,
    });
  }
  render() {
    return <div ref={this._commentRef} />;
  }
}
```

- Karena kita hanya membutuhkan komponen untuk membuat objek `Waline` saat dimuat, dan menentukan bahwa itu tidak akan mengalami perubahan status yang sering, kita mendefinisikan `Comment` sebagai komponen kelas alih-alih komponen fungsi, dan mewarisi `PureComponent`, yang dapat mengurangi kehilangan kinerja.

- Dalam fungsi `render()`, kita membuat `<div>` sebagai elemen wadah, yang digunakan untuk memuat node DOM yang dibuat secara dinamis oleh `Waline`.
- Tambahkan `prop` bernama `slug` ke komponen `Comment`, yang diteruskan oleh komponen luar untuk memastikan bahwa hanya komentar yang sesuai yang ditampilkan pada halaman tetap.

## Tambahkan Komponen ke Halaman Artikel

Buka file `src/templates/blog-post.js` dan pertama-tama tambahkan deklarasi impor:

```jsx
import Comment from "../components/comment";

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      fields {
        slug
      }

      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`;
```

Di akhir fungsi `BlogPostTemplate`, masukkan tag `<Comment>` dan atur atribut `slug` sebelum tag penutup `</Layout>`:

```jsx
import Comment from '../components/comment' // Impor komponen baru kami

const BlogPostTemplate = ({ data, pageContext, location }) => {
  const post = data.markdownRemark
  ...
  return (
    <Layout location={location} title={siteTitle}>
      <Comment slug={post.fields.slug} />
    </Layout>
  )
}
```

## Buat Versi Pengembangan

```bash
gatsby build
```
