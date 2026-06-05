---
title: "Uma Migração Forçada de Dados"
description: "Preste atenção à proteção da privacidade, os dados devem ter backup múltiplo e as contas devem habilitar a autenticação de dois fatores"
category: "life"
tags:
  - "roam"
pubDate: 2020-03-10
heroImage: "https://cos.zbz.ai/images/202310181512073.avif"
heroImageAlt: "RealRip-"
heroImageWidth: 1960
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "pt"
---

###

### Restauração de Eventos

Em 18 de fevereiro, recebi uma notificação da Taoluyun dizendo que a senha da conta do servidor estava em risco e deveria ser alterada o mais rápido possível. Como a conta tem verificação por SMS, além de haver muitas coisas para fazer após a retomada do trabalho, não levei a notificação a sério.

Em 7 de março, quando me preparava para atualizar o artigo, descobri que o servidor havia sido bloqueado pela Taoluyun. Perguntei o motivo e me disseram que o método de pagamento da conta estava em risco. Eu precisava fornecer meu cartão de identidade, cartão bancário vinculado e o extrato do mês passado antes de tentar desbloqueá-lo. Ao mesmo tempo, verificando a conta, descobri que a assinatura mensal do ECS tinha 2 dólares pendentes de pagamento este mês.

A Taoluyun International não oferece suporte a cartões bancários do continente e pagamentos de terceiros. Naquela época, eu só podia usar o Paypal dos EUA para comprar. Para evitar roubo, depois de comprar um ciclo de ECS, eu já havia desvinculado o PP e a Taoluyun, e a associação entre o PP e o cartão bancário. Agora, para concluir o desbloqueio do servidor e o pagamento da conta, devo vincular o PayPal e a Taoluyun novamente. Após muitas tentativas de revincular, o PP sempre avisa "Não é possível configurar o pagamento pré-aprovado temporariamente". Pesquisei no Google, descobri que muitas pessoas encontrariam o mesmo problema. O oficial do PP implementou o controle de risco na conta. Se pode ser vinculado depende do destino.

Após várias tentativas falhas, tive que comprar um novo servidor na Liangxinyun e reconstruí-lo. Graças ao backup de dados usual, demorou 3 horas para restaurar manualmente. Durante o processo de recuperação de dados, alguns amigos que assinaram este site receberam um grande número de pushes RSS de conteúdo antigo. Por favor, perdoem-me pelo inconveniente causado a vocês. Quanto ao Taoluyun bloqueado e à conta, só posso pensar em outras maneiras de resolver isso.

### Lição

**Os dados precisam de vários backups** Não importa se é um disco de rede em nuvem, um servidor ou um disco rígido local, há possibilidade de perda de dados. Dados importantes devem ter backup em pelo menos três locais diferentes. Preste atenção especial para que, se você fizer backup localmente, não use unidades de estado sólido SSD. Os dados da unidade de estado sólido não podem ser recuperados após a perda. Você pode usar discos rígidos mecânicos ou discos ópticos. Ao usar discos de rede em nuvem, verifique principalmente os anúncios oficiais. Como é difícil para os discos de rede em nuvem obter lucro, alguns provedores de serviços podem interromper os serviços a qualquer momento, portanto, baixe e transfira seus dados a tempo. No momento, os discos de rede mais conscienciosos, pessoalmente acho que são o He Caiyun e o Jianguoyun da China Mobile. O Jianguoyun pode ser usado para sincronização usual, e o He Caiyun é usado para armazenamento de dados. Para álbuns de fotos, você pode usar o Google Fotos.

**As contas precisam habilitar a autenticação de dois fatores** Todos os tipos de contas devem habilitar a autenticação de dois fatores. Geralmente, a autenticação de dois fatores tem dois tipos: SMS e autenticador MFA. Ao usar a verificação por SMS, seja claro sobre a área de operação do provedor de serviços. Algumas mensagens de provedores de serviços não suportam números de celular +86. Você também pode registrar um Google Voice para receber mensagens de verificação do provedor de serviços. Existem muitos autenticadores, e é recomendável usar o Authenticator da Microsoft, que é produzido por um grande fabricante e suporta sincronização e recuperação de contas. Ao usar o autenticador, o método do código QR deve ser usado para a primeira verificação, e o código QR deve ser mantido permanentemente. Este código QR é permanentemente válido. Quando o telefone é perdido ou o autenticador é reinstalado, ele pode ser usado novamente. Não é recomendável usar o Authy. Embora também suporte backup, ao fazer login novamente, a verificação por SMS é necessária e, às vezes, os telefones celulares +86 não conseguem receber o código de verificação.
