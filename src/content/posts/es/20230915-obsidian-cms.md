---
title: "Usar Obsidian como CMS"
description: "Obsidian es increíblemente conveniente como CMS para blogs"
category: "startup"
tags:
  - "management"
  - "allocation"
pubDate: 2024-09-11
authors:
  - default
heroImage: "https://cos.zbz.ai/images/202309151438569.avif"
heroImageAlt: "RealRip-Usar Obsidian como CMS"
heroImageWidth: 1960
heroImageHeight: 1102
draft: false
featured: false
locale: es
---

Finalmente, cambié el marco de mi plataforma de blog a Astro, lo que no solo proporciona velocidades de carga más rápidas, sino que también hace que las actualizaciones y el mantenimiento sean más fáciles. Los archivos Markdown se pueden sincronizar directamente. Solía usar Typora como editor de Markdown, que ofrece una experiencia WYSIWYG, y es muy fácil de mantener archivos individuales. Sin embargo, Typora carece de un gestor de archivos, lo que hace que la gestión de múltiples archivos sea inconveniente. Por lo tanto, cambié a Obsidian como editor de Markdown. Después de explorar un poco, me di cuenta de que Obsidian es increíblemente conveniente como CMS para blogs.

- **Gestor de archivos**: Con la función de búsqueda de Obsidian, puedes agregar, eliminar, modificar y consultar archivos fácilmente.
- **Propiedades del documento**: A partir de Obsidian 1.4, se introdujeron las propiedades del documento, lo que te permite formatear el Frontmatter de los archivos Markdown en un formato fijo. Combinado con la función de plantillas, escribir Frontmatter es muy conveniente. Anteriormente, al usar Typora, el formato de Frontmatter era estricto, y escribirlo a mano a menudo provocaba errores. Ahora, con las propiedades del documento de Obsidian, casi no se pueden cometer errores.
- **Imágenes**: Las imágenes del blog están alojadas en Tencent Cloud COS y Picgo se utiliza para la gestión de imágenes. El plugin `Image auto upload` puede cargar rápidamente imágenes. Puedes usar Picgo.app o Picgo-core. Si usas Picgo-core, puedes configurarlo usando [`picgo set uploader`](https://picgo.github.io/PicGo-Core-Doc/zh/guide/config.html#%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90). Si las cargas fallan, intenta habilitar la opción `Corregir variable PATH` en el plugin de Obsidian.
- **Sincronización**: Coloca el almacén de Obsidian en iCloud para sincronizarlo entre varios dispositivos y editar documentos en cualquier momento y lugar.
- **Publicación**: Con el plugin Git, una vez configurada la publicación programada, los artículos se publicarán automáticamente en la plataforma de alojamiento una vez escritos.
