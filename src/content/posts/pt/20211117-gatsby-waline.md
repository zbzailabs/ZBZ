---
title: "Instalar o componente de comentário Waline para Gatsby"
description: "Como o Waline ainda não possui um componente Gatsby, adicione a funcionalidade de comentário Waline ao site Gatsby instalando a biblioteca cliente Waline, criando um componente React e introduzindo o componente no local apropriado."
category: "life"
tags:
  - "roam"
pubDate: 2021-11-17
heroImage: "https://cos.zbz.ai/images/202310181512145.avif"
heroImageAlt: "RealRip-Instalar o componente de comentário Waline para Gatsby"
heroImageWidth: 1960
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "pt"
---

Gatsby é uma estrutura de construção de site estático baseada em react, que pode ser usada para implantar lojas online, sites oficiais e blogs. Usando plug-ins ricos, funções como carregamento lento de imagens, suporte a documentos Markdown e comentários de visitantes podem ser realizadas. Os sistemas de comentários oficialmente recomendados pelo Gatsby incluem Disqus, Gitalk, etc. Esses sistemas de comentários têm suas próprias características, mas não podem atender às necessidades. Este artigo tenta instalar o sistema de comentários Waline recentemente popular no projeto Gatsby. Como o desenvolvimento do Gatsby tem um grande grau de liberdade e cada projeto é diferente, para facilitar a expressão de ideias, o tema oficial do blog `gatsby-starter-blog` é usado como exemplo.

## Ideia

Como o Waline ainda não possui um componente Gatsby, precisamos implementar a função instalando a biblioteca cliente Waline, criando um componente React e introduzindo o componente no local apropriado.

## Configuração básica

Implante o projeto [Gatsby](https://gatsbyjs.com) de acordo com os requisitos e configure o servidor e o lado dos dados do sistema de comentários Waline de acordo com o [tutorial oficial do Waline](https://waline.js.org).

## Instalar a biblioteca Waline

No diretório raiz do projeto, instale a biblioteca Waline via gerenciamento de pacotes.

```bash
yarn add -D @waline/client
```

Depois disso, você pode introduzir o componente Waline através da instrução `import` no componente de comentário.

## Criar componente de comentário

Crie um componente de classe Waline para encapsular e reutilizar a função de comentário.

Crie um novo script `comment.js` no diretório `src/components`

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

- Como precisamos apenas do componente para criar o objeto `Waline` quando ele carrega e determinar que ele não sofrerá alterações frequentes de estado, definimos `Comment` como um componente de classe em vez de um componente de função e herdamos `PureComponent`, o que pode reduzir a perda de desempenho.

- Na função `render()`, criamos um `<div>` como um elemento de contêiner, que é usado para carregar os nós DOM gerados dinamicamente por `Waline`.
- Adicione um `prop` chamado `slug` ao componente `Comment`, que é passado pelo componente externo para garantir que apenas os comentários correspondentes sejam exibidos em uma página fixa.

## Adicionar componente à página do artigo

Abra o arquivo `src/templates/blog-post.js` e primeiro adicione uma declaração de importação:

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

No final da função `BlogPostTemplate`, insira a tag `<Comment>` e defina o atributo `slug` antes da tag de fechamento `</Layout>`:

```jsx
import Comment from '../components/comment' // Importar nosso novo componente

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

## Criar versão de desenvolvimento

```bash
gatsby build
```
