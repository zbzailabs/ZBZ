---
title: "Um modelo de blog Gatsby"
description: "Este site é um site estático construído usando Gatsby, bem-vindo para experimentá-lo."
category: "life"
tags:
  - "roam"
pubDate: 2021-11-20
heroImage: "https://cos.zbz.ai/images/202310181512144.avif"
heroImageAlt: "ZBZ-Um modelo de blog Gatsby"
heroImageWidth: 1960
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "pt"
---

Um modelo para construir sites estáticos usando Gatsby.

O código-fonte está em **[gatsby-starter-glass](https://github.com/xiyizhou/gatsby-starter-glass)**, bem-vindo para experimentá-lo.

## Características

- Pronto para uso
- Totalmente localizado
- Inclui comentários [Waline](https://waline.js.org)
- Inclui Google Analytics
- Edição Markdown

## Implantação local

```bash
# 1. Clonar para local
git clone https://github.com/xiyizhou/gatsby-starter-glass.git

# 2. cd para o diretório
cd gatsby-starter-glass

# 3. Instalar dependências
yarn install

# 4. Iniciar modo de desenvolvimento
yarn start

# 5. Construir versão de produção
yarn  build
```

## Configuração

- Configure as informações do site, ID do Google Analytics, etc. em `gatsby-config.js`.
- Configure as informações da barra de navegação superior em `src/components/header.js`.
- Configure as informações da barra de navegação inferior em `src/components/footer.js`.

- Configure as informações do Waline em `src/components/comment.js`.

## Publicação de artigos

### Postagens do blog

As postagens do blog estão localizadas em `content/blog`. O modelo é o seguinte:

```md
---
title: Instalar o componente de comentário Waline para Gatsby
date: 2021-11-17 08:08
slug: gatsby-waline
category: Vida
tags:
  - Vida
description: Como o Waline ainda não possui um componente Gatsby, adicione a funcionalidade de comentário Waline ao site Gatsby instalando a biblioteca cliente Waline, criando um componente React e introduzindo o componente no local apropriado.
---

Gatsby é uma estrutura de construção de site estático baseada em react, que pode ser usada para implantar lojas online, sites oficiais e blogs. Usando plug-ins ricos, funções como carregamento lento de imagens, suporte a documentos Markdown e comentários de visitantes podem ser realizadas. Os sistemas de comentários oficialmente recomendados pelo Gatsby incluem Disqus, Gitalk, etc.
```

### Páginas

O conteúdo da página está localizado em `content/pages`.

## Notas

- Este iniciador é baseado no Gatsby V3, preste atenção à compatibilidade da versão ao instalar plug-ins.
- A estrutura principal é localizada de [gatsby-starter-glass](https://github.com/yinkakun/gatsby-starter-glass), obrigado a [yinkakun](https://github.com/yinkakun).
