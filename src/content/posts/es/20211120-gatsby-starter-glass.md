---
title: "Una plantilla de blog de Gatsby"
description: "Este sitio es un sitio web estático creado con Gatsby, bienvenido a probarlo."
category: "life"
tags:
  - "roam"
pubDate: 2021-11-20
heroImage: "https://cos.zbz.ai/images/202310181512144.avif"
heroImageAlt: "RealRip-"
heroImageWidth: 1960
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "es"
---

Una plantilla para crear sitios web estáticos utilizando Gatsby.

El código fuente está en **[gatsby-starter-glass](https://github.com/xiyizhou/gatsby-starter-glass)**, bienvenido a probarlo.

## Características

- Listo para usar
- Totalmente localizado
- Incluye comentarios de [Waline](https://waline.js.org)
- Incluye Google Analytics
- Edición Markdown

## Implementación local

```bash
# 1. Clonar a local
git clone https://github.com/xiyizhou/gatsby-starter-glass.git

# 2. cd al directorio
cd gatsby-starter-glass

# 3. Instalar dependencias
yarn install

# 4. Iniciar modo de desarrollo
yarn start

# 5. Construir versión de producción
yarn  build
```

## Configuración

- Configure la información del sitio web, ID de Google Analytics, etc. en `gatsby-config.js`.
- Configure la información de la barra de navegación superior en `src/components/header.js`.
- Configure la información de la barra de navegación inferior en `src/components/footer.js`.

- Configure la información de Waline en `src/components/comment.js`.

## Publicación de artículos

### Entradas de blog

Las entradas de blog se encuentran en `content/blog`. La plantilla es la siguiente:

```md
---
title: Instalar el componente de comentarios Waline para Gatsby
date: 2021-11-17 08:08
slug: gatsby-waline
category: Vida
tags:
  - Vida
description: Dado que Waline aún no tiene un componente Gatsby, agregue la funcionalidad de comentarios Waline al sitio Gatsby instalando la biblioteca cliente Waline, creando un componente React e introduciendo el componente en la ubicación adecuada.
---

Gatsby es un marco de construcción de sitios web estáticos basado en react, que se puede utilizar para implementar tiendas en línea, sitios web oficiales y blogs. Usando complementos ricos, se pueden realizar funciones como carga diferida de imágenes, soporte de documentos Markdown y comentarios de visitantes. Los sistemas de comentarios recomendados oficialmente por Gatsby incluyen Disqus, Gitalk, etc.
```

### Páginas

El contenido de la página se encuentra en `content/pages`.

## Notas

- Este iniciador se basa en Gatsby V3, preste atención a la compatibilidad de versiones al instalar complementos.
- El marco principal está localizado desde [gatsby-starter-glass](https://github.com/yinkakun/gatsby-starter-glass), gracias a [yinkakun](https://github.com/yinkakun).
