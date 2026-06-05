---
title: "Usando Obsidian como CMS"
description: "O Obsidian é extremamente conveniente como CMS para blogs"
category: "startup"
tags:
  - "management"
pubDate: 2024-09-11
authors:
  - default
heroImage: "https://cos.zbz.ai/images/202309151438569.avif"
heroImageAlt: "ZBZ-Usando Obsidian como CMS"
heroImageWidth: 1960
heroImageHeight: 1102
draft: false
featured: false
locale: pt
---

Finalmente, mudei a estrutura da plataforma de blog para Astro, o que não só melhorou a velocidade de carregamento, mas também facilitou a atualização e manutenção. Basta sincronizar os arquivos Markdown diretamente. Antes, eu usava o Typora como ferramenta de edição de Markdown, pois era WYSIWYG e muito leve para gerenciar arquivos individuais. No entanto, o Typora não tem um gerenciador de arquivos, o que torna difícil gerenciar vários arquivos, então mudei o editor Markdown para o Obsidian. Após uma análise mais detalhada, percebi que o Obsidian é extremamente conveniente como CMS para blogs.

- **Gerenciador de Arquivos**: Com a pesquisa do Obsidian, é fácil adicionar, excluir, modificar e procurar arquivos.
- **Propriedades do Documento**: A partir do Obsidian 1.4, foram introduzidas as propriedades do documento, o que permite formatar o Frontmatter do arquivo Markdown em um formato fixo. Combinando isso com a função de modelo, torna-se muito fácil criar o Frontmatter. Quando eu usava o Typora, frequentemente cometia erros ao escrever o Frontmatter manualmente devido ao formato rigoroso, mas agora, com as propriedades do documento do Obsidian, quase não cometo erros.
- **Imagens**: As imagens do blog são hospedadas no Tencent Cloud COS, e uso o Picgo para gerenciar as imagens. Usando o plugin `Image auto upload Plugin`, é possível enviar imagens rapidamente. Você pode usar o Picgo.app ou o Picgo-core; se usar o Picgo-core, configure com o comando [`picgo set uploader`], e se o upload falhar, tente ativar `Corrigir variável PATH` no plugin do Obsidian.
- **Sincronização**: Ao colocar a biblioteca do Obsidian no iCloud, posso sincronizar em vários dispositivos, permitindo editar documentos em qualquer lugar e a qualquer momento.
- **Publicação**: Usando o plugin Git, posso configurar publicações agendadas e, após terminar de escrever o artigo, ele será publicado automaticamente na plataforma de hospedagem.
