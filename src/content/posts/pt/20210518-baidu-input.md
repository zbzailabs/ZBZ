---
title: "Uma jornada de plágio de uma pele Baidu imitada"
description: "Como um método de entrada pessoal, não reinvente a roda. Copie (plagie/pegue emprestado) arquivos de origem de pele de método de entrada existentes e desenvolva no menor tempo possível."
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
locale: "pt"
---

Pele do método de entrada Baidu para macOS, estilo minimalista, altamente personalizável.

## Recursos da pele

1. Adequado para o método de entrada Baidu para Mac.
2. Perfeitamente adaptado ao macOS Monterey.
3. Estilo minimalista, foco na entrada.
4. Destaque a primeira escolha, concentre-se mais na seleção de palavras.
5. Altamente personalizável, pode ser personalizado de acordo com as necessidades.

## Log de atualização

### `V1.1` 2021-11-05

1. Regras de nomenclatura de arquivos unificadas.
2. Adicionadas observações para fácil personalização.
3. Removido o ícone de virar a página à direita, tornando o todo mais simples.
4. Adicionado arquivo `global.ini`.
5. Adicionada pele de grafite.
6. Exemplos de pele atualizados.

### `V1.0` 2021-05-18

1. Pele lançada.

## Instruções de uso

1. Quando não houver necessidades especiais, você pode baixar diretamente o pacote de pele no formato `.bdskk` na pasta `examples` e clicar duas vezes para instalar e usar.
2. Se a personalização for necessária, o arquivo pode ser modificado.
3. Comprima o conteúdo da pasta de recursos da pele em um pacote compactado no formato `.zip`, não comprima a pasta inteira.
4. Modifique o pacote compactado para um pacote de pele no formato `.bdskk`.
5. Clique duas vezes no pacote de instalação para importá-lo para o Método de Entrada Baidu.

## Estrutura de arquivo

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

1. `src`: Pasta de recursos.

2. `globe.ini`: Arquivo de definição global, pode definir nome da pele, tipo de pele, descrição da pele, ID do autor, e-mail, site, etc. As informações relevantes serão exibidas na página de configurações de aparência do Método de Entrada Baidu Mac.

3. `horizontal.ini`: Arquivo de configuração do modo de linha dupla. A pele de linha dupla refere-se ao modo que exibe códigos de entrada e palavras candidatas ao mesmo tempo.

   **Área de entrada e área de palavras candidatas**: Enquadre o intervalo da imagem de fundo do modo de linha dupla, conforme mostrado na figura. O princípio de configuração de cada parâmetro nas duas áreas é o mesmo.

   **Área de nove quadrados**: O fundo da barra de candidatos se adapta a diferentes comprimentos de palavras candidatas de uma maneira de expansão de nove quadrados. Os quatro parâmetros X / Y / Largura / Altura definem a área verde na figura abaixo, que é o palácio do meio da grade de nove quadrados.

   **Margem de conteúdo**: A distância entre o código de entrada e a borda da fatia de fundo. Aproximadamente

   **Fonte e Cor**: A cor da fonte e das palavras candidatas usa o formato RGB hexadecimal. Os elementos referidos por cada campo são mostrados na figura abaixo:

   **Símbolo de intervalo**: Defina o símbolo de intervalo entre o número de série digital e a palavra candidata. O espaço é SPACE (maiúsculas) e outros caracteres são inseridos diretamente.

4. `single.ini`: Arquivo de configuração do modo de linha única. A pele de linha única refere-se ao modo que exibe apenas palavras candidatas, o que parece mais limpo e simples no Mac. O modo de linha única só precisa definir os parâmetros da área de palavras candidatas. O princípio da configuração de parâmetros entrar em vigor é o mesmo da pele de linha dupla.

5. `statusbar.ini`: Arquivo de configuração da barra de status. Os ícones na barra de status podem ser organizados em qualquer lugar na imagem de fundo da barra de status, você só precisa definir suas coordenadas horizontais e verticais. Todos os valores de coordenadas são baseados no canto superior esquerdo.

6. `*.png`: Arquivo de fatia de pele, você pode substituir o arquivo correspondente por sua própria fatia.

7. `examples`: Exemplos de peles, podem ser baixados e usados diretamente.

8. `README.md`: Arquivo leia-me do projeto.

9. `LICENSE`: Este projeto segue a [licença MIT](https://github.com/xiyizhou/BaiduIM-Skin/blob/main/LICENSE). Você pode usar, copiar, modificar, mesclar, publicar, distribuir, sublicenciar e vender o software e cópias do software, e também pode modificar os termos da licença para o conteúdo apropriado de acordo com as necessidades do programa.

## Contribuição

Se você tiver alguma dúvida, dúvida ou sugestão, sinta-se à vontade para perguntar.

Este conjunto de peles ainda tem os seguintes problemas a serem resolvidos. Como não entendo o código do programa do Método de Entrada Baidu, este desenvolvedor não pode implementá-lo em pouco tempo. Se você tiver uma maneira de implementá-lo, sinta-se à vontade para contribuir.

- [ ] Aperfeiçoar a barra de status e a pele de linha dupla.

- [ ] Centralização vertical da fonte da área candidata e cor de fundo.

- [ ] Pode personalizar o glifo, o tamanho da fonte e a cor do número de série digital da palavra candidata para obter um efeito de exibição semelhante ao método de entrada integrado do Mac para destacar as palavras candidatas.

- [ ] O formato de pele atual é `.bdskk`, precisa mudar para o formato de pele padrão do Método de Entrada Baidu Mac `.bpsm`.

- [ ] Desenvolver peles para iPhone e iPad semelhantes a peles que podem personalizar a cor de fundo da palavra preferida.
