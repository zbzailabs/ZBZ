---
title: "Configuração de vários dispositivos do método de entrada Rime"
description: "Recentemente, o Ministério da Indústria e Tecnologia da Informação divulgou dados mostrando que quase todos os principais métodos de entrada em nuvem estão coletando dados de privacidade do usuário em violação aos regulamentos. Para inserir com segurança, apenas métodos de entrada offline podem ser usados. O melhor método de entrada offline atualmente é, sem dúvida, o Rime."
category: "startup"
tags:
  - "management"
pubDate: 2021-05-09
heroImage: "https://cos.zbz.ai/images/202310031635857.avif"
heroImageAlt: "ZBZ-"
heroImageWidth: 1944
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "pt"
---

Recentemente, o Ministério da Indústria e Tecnologia da Informação divulgou dados mostrando que quase todos os principais métodos de entrada em nuvem estão coletando dados de privacidade do usuário em violação aos regulamentos. Para inserir com segurança, apenas métodos de entrada offline podem ser usados. O melhor método de entrada offline atualmente é, sem dúvida, o [Rime](https://github.com/rime/home/wiki/Introduction).

Falando com precisão, o Rime é um mecanismo de método de entrada de plataforma cruzada de código aberto. O código é de código aberto e totalmente offline. Por meio de personalização e ajuste extremos, os usuários podem personalizar um método de entrada adequado para todos. A vantagem é a segurança e o suporte para vários esquemas de entrada; a desvantagem é que o dicionário de sinônimos não é forte o suficiente, a configuração é complexa e a sincronização do dicionário de sinônimos precisa ser feita manualmente.

### Instalação da versão para Mac

A versão em chinês tradicional desenvolvida originalmente por [Lotem](https://github.com/lotem), o autor do Rime. Se você quiser usar a versão simplificada, pode configurá-la de acordo com o tutorial de [Yifang](https://github.com/maomiui/rime). Observe o seguinte durante o processo de configuração:

- Há um BUG na versão atual (2021-05-12). Se ativado em `luna_pinyin_simp.custom.yaml`
  `- derive/^([zcs])h/$1/ # zh, ch, sh => z, c, s`
  `- derive/^([zcs])([^h])/$1h$2/ # z, c, s => zh, ch, sh`
  Após o som difuso, Emoji e tempo dinâmico tornam-se inválidos.

- O autor preparou uma variedade de esquemas de entrada. Se você não usar Xiaohe Shuangpin, etc., poderá excluir os arquivos de configuração correspondentes.

- Mesmo que você não use o Luna Pinyin Traditional, não exclua arquivos como `luna_pinyin.zonghe.dict.yaml` e `luna_pinyin.dict.yaml`. A exclusão pode causar falta de palavras necessárias.

- Informações comuns, como e-mail e endereço, podem ser definidas em `custom_phrase.txt`.

- Você pode modificar e alterar o tema no arquivo `squirrel.custom.yaml`. Por exemplo, com base no tema `macos_light`, o autor imitou um tema "Pink World" do método de entrada Google Pinyin.

### Instalação da versão Win10

Para a versão Win10 do Rime Weasel, basta seguir o [tutorial oficial](https://github.com/rime/weasel) para instalar. Após a conclusão da instalação, você pode copiar o arquivo de configuração do Mac para uso. Precisa prestar atenção a

- Precisa nomear `squirrel.custom.yaml` como `weasel.custom.yaml`

- Linhas simples e duplas da pele, exibição de linha única Pinyin, etc. são personalizadas em `weasel.custom.yaml` da seguinte forma:

  ```yaml
  # Arranjo horizontal de texto
  style/horizontal: true

  # Exibição de linha única
  style/inline_preedit: true

  # Mudar de pele
  style/color_scheme: win10
  ```

- O caminho de sincronização em `installation.yaml` é diferente para Win e Mac. Aspas simples ou aspas duplas não são necessárias no Win.

  ```yaml
  # formato do caminho de sincronização win
  sync_dir: C:\Users\Nome de usuário\iCloudDrive\Rime

  # formato do caminho de sincronização mac
  sync_dir: "/Users/Nome de usuário/Library/Mobile Documents/com~apple~CloudDocs/Rime"
  ```

- No win10, você pode usar o agendador de tarefas do win10 para sincronizar [automaticamente](https://www.cnblogs.com/cstylex/p/Rime_on_Linux_Android_Mac_Windows_iOS_sync.html) os dados. Ainda não há como obter a sincronização automática no Mac.

Para telefones Android, você pode instalar e usar o [Trime](https://github.com/osfans/trime) e, para telefones iOS, pode instalar e usar o [iRime](https://apps.apple.com/cn/app/irime%E8%BE%93%E5%85%A5%E6%B3%95/id1142623977).
