---
title: "Guia de atualização automática de dependências com Renovate"
description: "Usar o Renovate para automatizar completamente as atualizações de dependências do repositório GitHub sem intervenção manual"
category: "startup"
tags:
  - "management"
  - "innovation"
pubDate: 2026-02-06
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260206-renovate-guide.avif"
heroImageAlt: "Atualização automática de dependências com Renovate"
heroImageWidth: 2752
heroImageHeight: 1536
draft: false
featured: false
locale: pt
---

## Introdução

A manutenção das dependências do projeto é parte do trabalho diário dos desenvolvedores. Verificar, atualizar e testar manualmente as versões das dependências não só consome tempo, mas também é propenso a omissões. Este artigo explica como usar o **Renovate** para automatizar completamente as atualizações de dependências.

## Objetivos

- Verificar automaticamente as atualizações de dependências todos os dias ao amanhecer
- Criar PRs automaticamente e fundi-los (após passar no CI)
- Sem intervenção manual, funcionando em segundo plano
- Gestão unificada em vários repositórios

## Instalação do Renovate

1. Visite [GitHub Apps - Renovate](https://github.com/apps/renovate)
2. Clique em **Instalar**
3. Selecione os repositórios a ativar (todos ou específicos)
4. Complete a autorização

## Arquivo de configuração

Crie `renovate.json` na raiz do repositório:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:recommended",
    ":automergeAll",
    ":disableDependencyDashboard"
  ],
  "timezone": "Asia/Shanghai",
  "schedule": ["before 3:00am"]
}
```

Commit e push:

```bash
git add renovate.json
git commit -m "chore: configure Renovate for automated dependency updates"
git push
```

## Detalhes da configuração

| Opção | Descrição |
|-------|-----------|
| `config:recommended` | Configuração base oficialmente recomendada pelo Renovate |
| `:automergeAll` | **Opção principal** — fusão automática de todas as atualizações (incluindo versões principais) |
| `:disableDependencyDashboard` | Desativar o painel de problemas para funcionamento em segundo plano |
| `timezone` | Definir o fuso horário para Ásia/Xangai |
| `schedule` | Executar verificações antes das 3:00 da manhã diariamente |

## Fluxo de trabalho

```
3:00 da manhã diariamente
    ↓
Renovate verifica as dependências do package.json
    ↓
Atualizações disponíveis detectadas
    ↓
Criação automática de Pull Request
    ↓
Acionamento de verificações CI
    ↓
CI aprovado → Fusão automática para o branch main
    ↓
Ver dependências atualizadas na manhã seguinte
```

## Configuração multi-repositório

Para vários projetos, copie o mesmo arquivo de configuração:

```bash
# Criar configuração universal
cat > renovate.json << 'EOF'
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended", ":automergeAll", ":disableDependencyDashboard"],
  "timezone": "Asia/Shanghai",
  "schedule": ["before 3:00am"]
}
EOF

# Aplicar a vários repositórios
for repo in repo1 repo2 repo3; do
  cp renovate.json $repo/
  cd $repo && git add . && git commit -m "chore: configure Renovate" && git push
  cd ..
done
```

## Perguntas frequentes

### O PR não está se fundindo automaticamente?

Verifique o status do CI. O Renovate só funde após a aprovação de todas as verificações CI. Se o CI falhar, corrija manualmente o problema e execute novamente.

### Como acionar atualizações imediatamente?

- Se o painel estiver ativado: Vá para Issues → Dependency Dashboard → Marque os pacotes para atualizar → Clique em Rebase
- Ou aguarde o horário programado para execução automática

### Como excluir dependências específicas?

Adicione regras de exclusão na configuração:

```json
{
  "packageRules": [{
    "matchPackageNames": ["package-name"],
    "enabled": false
  }]
}
```

### Suporte para pnpm / yarn / npm?

O Renovate detecta automaticamente os tipos de arquivos de bloqueio, não é necessária configuração adicional.

## Verificação

Após enviar a configuração, o Renovate será executado automaticamente (ou aguardará o horário programado). Passos de verificação:

1. Vá para a página **Pull requests** do repositório
2. Veja os PRs criados pelo Renovate (formato do título: `chore(deps): update ...`)
3. Confirme que a fusão automática está ativada para o PR
4. Fusão automática após aprovação do CI

## Resumo

Apenas 5 linhas de configuração principal:

```json
{
  "extends": [
    "config:recommended",
    "automergeAll",
    "disableDependencyDashboard"
  ],
  "timezone": "Asia/Shanghai",
  "schedule": ["before 3:00am"]
}
```

Realize a gestão totalmente automatizada de dependências, permitindo que os desenvolvedores se concentrem no código de negócio.
