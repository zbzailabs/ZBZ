---
title: "Depois de reinstalar o OpenClaw 5 vezes, finalmente escrevi a configuração que os iniciantes deveriam copiar"
description: "Reinstalei o OpenClaw cinco vezes em um Mac novo e finalmente deixei claros os tropeços mais comuns: o que em Node, pnpm, SSH, Feishu, multiagentes, QMD e ACP precisa ser configurado primeiro, e o que parece funcionar no começo, mas mais cedo ou mais tarde quebra. Está tudo aqui, de uma vez só."
category: "startup"
tags:
  - "allocation"
  - "strategy"
  - "innovation"
pubDate: 2026-03-10
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260310-mac-openclaw-cover-v2.avif"
heroImageAlt: "Imagem de capa de um guia de instalação e configuração do OpenClaw em um novo Mac"
heroImageWidth: 2400
heroImageHeight: 1350
draft: false
featured: false
locale: pt
---

# Depois de reinstalar o OpenClaw 5 vezes, finalmente escrevi a configuração que os iniciantes deveriam copiar

Reinstalei o OpenClaw cinco vezes, e no fim confirmei uma coisa:

**O que um iniciante mais desperdiça não é o tempo da instalação em si, mas o fato de ser torturado repetidamente por uma pilha de configurações que “parecem já estar funcionando”, quando na prática mais cedo ou mais tarde vão explodir.**

Na primeira instalação, você tende a achar que, se a interface abre e o bot responde, então está tudo certo. A verdade normalmente não é essa.

Os problemas reais costumam aparecer depois:

- `pnpm` está claramente instalado, mas o daemon continua sem conseguir encontrá-lo;
- o bot do Feishu parece conectado, mas o roteamento multiagente está uma bagunça;
- o QMD parece sincronizar automaticamente, mas na prática vem falhando em silêncio o tempo todo;
- a configuração do ACP parece correta, mas o coder nunca chega a rodar de verdade no Codex;

Este texto não é uma “versão traduzida da documentação oficial”, nem um tutorial do tipo “instalei uma vez e agora vou ensinar os outros”. Ele é, na verdade, um **plano de arranque escrito depois de pisar em todos os buracos possíveis**, nascido de cinco reinstalações do OpenClaw em um Mac mini zerado.

O que ele resolve não é “como acender o OpenClaw”, mas algo mais importante:

> **como configurá-lo para virar um ambiente estável no longo prazo, e não uma coisa que liga hoje e quebra amanhã.**

## Os 5 erros mais frequentes que confirmei depois de reinstalar 5 vezes

Vamos começar pela parte mais valiosa.

Se você só quer saber por que tanta gente “instalou certinho, mas continua tendo problema”, a resposta basicamente está nestes cinco pontos:

1. **Seu PATH estar certo não significa que o PATH do daemon também esteja**  
   O fato de `pnpm`, `node` e `qmd` funcionarem no terminal não quer dizer que vão funcionar também dentro do LaunchAgent.

2. **A ferramenta estar instalada não significa que o OpenClaw tenha as permissões corretas para usá-la**  
   Algumas versões vêm com permissões padrão mais conservadoras. Se você não complementar a configuração, parece que funciona, mas na primeira chamada real a ferramenta já fica meio capenga.

3. **QMD não dar erro não significa que ele esteja realmente sincronizando**  
   Muitos scripts de watcher fingem que deu tudo certo. Mesmo quando falham, continuam registrando “sincronização concluída”. Isso é bem traiçoeiro.

4. **Conseguir criar vários agentes não significa que as mensagens estejam sendo roteadas corretamente**  
   Na configuração multi-bot do Feishu, `accounts` é só o começo. O que realmente define para onde a mensagem vai é `bindings`.

5. **O coder parecer conectado ao Codex não significa que ele esteja rodando de verdade sobre ACP**  
   Muita gente termina a configuração achando “agora ficou pronto”. Na prática, o runtime nunca foi realmente trocado; só parece pelo nome.

Se você evitar esses cinco erros logo no início, já corta pelo menos metade do sofrimento inútil que viria depois.

A configuração abaixo foi organizada justamente em torno desses pontos.

## 0. Se você vai “criar uma lagosta” (OpenClaw), o melhor é um Mac mini

Os principais motivos para o Mac mini ser a melhor opção para “criar uma lagosta” são estes:

### 1. Arquitetura de memória unificada

Os chips Apple Silicon usam **memória unificada (Unified Memory)**, em que memória do sistema e memória gráfica são compartilhadas. Para rodar grandes modelos de linguagem (LLMs) localmente em inferência — mais adiante vamos usar modelos abertos para apoiar o QMD — ter memória equivalente a VRAM suficiente é condição básica para conseguir uma velocidade decente.

### 2. Integração de ecossistema e conveniência para automação

Embora os provedores de nuvem estejam lançando várias soluções de “criação de lagosta na nuvem”, comparado a um VPS o Mac mini tem vantagens naturais quando o assunto é automatizar tarefas do dia a dia:

- **Escapar de detecção:** automação de navegador rodando em IP residencial local tem menos chance de ser marcada como bot do que um IP de datacenter em VPS.

- **Tratamento multimídia:** lidar com arquivos locais, agendas e integração com apps desktop como Claude Code e Codex é muito mais simples.

### 3. Barreiras de uso e estabilidade

- **Curva de aprendizado menor:** para quem não é desenvolvedor, montar um painel e depurar permissões de rede em um Mac local é bem mais intuitivo do que enfrentar um ambiente de rede complexo em um VPS.
- **Silêncio e eficiência:** o Mac mini é compacto, consome muito pouco e trabalha em silêncio, então funciona muito bem como “servidor de lagosta” rodando 24/7.

## 1. Primeiro, firme a base: linha de comando e gerenciamento de pacotes

### Versão do sistema

Assim que pegar o Mac mini, a primeira coisa é atualizar o macOS para a versão mais recente do Tahoe e ativar as atualizações automáticas.

- ✅Ajustes do Sistema → Geral → Atualização de Software → Atualizações automáticas

### Ajustes de energia

Em **Ajustes do Sistema → Energia**, recomendo ativar estas três opções:

- ✅Impedir que entre automaticamente em repouso quando a tela estiver desligada
- ✅Despertar para acesso pela rede
- ✅Ligar automaticamente após queda de energia

Se você não fizer isso, quando a máquina estiver em casa e você usar tudo remotamente, o OpenClaw pode acabar naquele estado clássico de “o corpo ainda está ali, mas a alma sumiu”. O Feishu não vai conseguir acordá-lo.

### Instalar o Tailscale

O Tailscale conecta com segurança dispositivos que estão em redes diferentes — casa, escritório, celular — dentro da mesma LAN virtual. Quando você estiver longe e o OpenClaw morrer, ainda vai poder usar Tailscale + compartilhamento de tela em outro dispositivo para acessar a máquina onde ele está rodando.

a configuração do Tailscale em si é simples. O ponto principal é:

- ✅ativar login no início do sistema,
- ✅ativar compartilhamento de tela no Mac mini em Ajustes do Sistema → Geral → Compartilhamento,
- ✅anotar o endereço virtual do Tailscale do Mac mini.

### Instalar o Xcode Command Line Tools

O Xcode Command Line Tools é o pacote oficial de ferramentas básicas de desenvolvimento da Apple. Ele adiciona ao macOS ferramentas UNIX essenciais que não vêm pré-instaladas por padrão, como `git`, `make` e o compilador `clang`. É a base do ambiente de desenvolvimento no Mac e fornece a capacidade mínima necessária para compilar código ou rodar gerenciadores de pacotes mais avançados.

```bash
xcode-select --install
# Ou digite “git” no terminal, e a instalação do Xcode Command Line Tools começará automaticamente
```

### Instalar o Homebrew

O Homebrew é, na prática, o gerenciador de pacotes padrão do macOS. Ele permite instalar, atualizar e remover softwares de desenvolvimento e dependências com comandos bem simples. Nos bastidores, resolve dependências complexas e gerencia os links do sistema, o que elimina a chatice de baixar instaladores manualmente e mexer em caminhos de baixo nível.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Configurar as variáveis de ambiente do Homebrew**

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

## 2. Travar de vez o ambiente Node

Com **armazenamento baseado em conteúdo (CAS)**, o pnpm usa **links físicos** para garantir que a mesma versão de uma dependência exista fisicamente só uma vez no disco. Isso economiza SSD e acelera a instalação. Mais importante ainda: sua **estrutura rigorosa de links simbólicos em árvore** elimina o problema de “dependências fantasmas” herdado do layout achatado do npm, forçando o código a acessar apenas pacotes declarados explicitamente em `package.json`. Na prática, isso significa build mais seguro e ambiente mais limpo. Por isso, recomendo **pnpm** em vez de npm.

### Instalar o fnm e ativar a troca automática

Use o `fnm`, construído em Rust, como gerenciador de versões. Ele permite alternar entre ambientes Node.js de diferentes projetos de forma rápida, automática e sem conflitos globais.

```bash
brew install fnm
echo 'eval "$(fnm env --use-on-cd --shell zsh)"' >> ~/.zshrc
source ~/.zshrc
```

### Instalar o Node LTS e defini-lo como padrão

Fixar a versão LTS do Node.js como ambiente global padrão é a melhor forma de garantir estabilidade tanto para daemons de baixo nível como `launchd` quanto para o trabalho diário.

```bash
fnm install --lts
fnm default lts-latest
```

### Ativar o Corepack e o pnpm

Ativar o Corepack, que já vem embutido nativamente no Node.js, serve para pular o velho hábito de instalar gerenciadores de pacotes globalmente via npm e ativar o `pnpm` da forma mais limpa, oficial e controlável possível.

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### Verificar os caminhos dos binários críticos

```bash
which node
which pnpm
node -v
pnpm -v
```

Ambientes não interativos como `launchd` dependem de caminhos absolutos. Quando você for escrever LaunchAgents depois, use diretamente os caminhos retornados pelo `which`.

### Inicialização do pnpm e configuração de aliases

Faça a inicialização em nível de sistema e adicione aliases rígidos no shell para bloquear o uso acidental de npm ou yarn. Se você quer que o `pnpm` gerencie corretamente os binários globais e quer se forçar a seguir um fluxo **pnpm-only**, execute primeiro `pnpm setup` e depois complemente com um `.zshrc` mais rígido.

#### Passos

1. Primeiro execute:

```bash
pnpm setup
```

2. Depois adicione este bloco ao `~/.zshrc`:

```bash
# ============================================================
# ~/.zshrc (pnpm-only workflow, macOS)
# ============================================================

# pnpm
export PNPM_HOME="/Users/a66/Library/pnpm"
case ":$PATH:" in
  *":$PNPM_HOME:"*) ;;
  *) export PATH="$PNPM_HOME:$PATH" ;;
esac

# Hard-stop / guidance for package managers
alias npm="echo '⚠️ 请使用 pnpm！'"
alias yarn="echo '⚠️ 请使用 pnpm！'"
alias pnpx="echo '⚠️ 请使用 pnpm dlx！'"

unalias npx 2>/dev/null

npx() {
  if [[ "$1" == "-y" || "$1" == "--yes" ]]; then
    shift
  fi
  pnpm dlx "$@"
}

# Shortcuts
alias p="pnpm"
alias px="pnpm dlx"
alias pe="pnpm exec"

# Common npm replacements
alias ni="pnpm install"
alias nia="pnpm add"
alias nid="pnpm add -D"
alias nig="pnpm add -g"
alias nr="pnpm run"
alias nx="pnpm exec"
alias nrs="pnpm -r run"
alias nu="pnpm update"
alias nrm="pnpm remove"
alias na="pnpm audit"
alias no="pnpm outdated"
alias nl="pnpm list"

npmci() { pnpm install --frozen-lockfile "$@"; }
create() { pnpm dlx "$@"; }

# fnm
eval "$(fnm env --use-on-cd)"
```

3. E recarregue:

```bash
source ~/.zshrc
```

## 3. Configurar o GitHub

Você pode seguir a documentação oficial do GitHub: [Generating a new SSH key and adding it to the ssh-agent](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent).

Antes de gerar a chave SSH, configure primeiro a identidade global do Git. Se não fizer isso, o histórico de commits vai ficar feio.

```bash
git config --global user.name "your_name"
git config --global user.email "your_email@example.com"
```

### Primeiro confirme que está usando o SSH do sistema

```bash
which ssh
# Esperado: /usr/bin/ssh
```

### Gerar a chave

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

### Configurar `~/.ssh/config`

```ssh-config
Host *
  AddKeysToAgent yes
  UseKeychain yes

Host github.com
  HostName ssh.github.com
  Port 443
  User git
  IdentityFile ~/.ssh/id_ed25519
  ProxyCommand nc -X 5 -x 127.0.0.1:7897 %h %p
```

Se você não usa proxy local, basta apagar a linha `ProxyCommand`.

### Enviar a chave pública e verificar

```bash
pbcopy < ~/.ssh/id_ed25519.pub
ssh -T git@github.com
```

## 4. Colocar o OpenClaw para rodar

### Preparar os grandes modelos

O OpenClaw precisa chamar grandes modelos para executar tarefas. Quanto melhor o modelo, mais poderoso o OpenClaw fica. Você pode priorizar modelos fechados como ChatGPT e Gemini, ou modelos abertos como Kimi e Qwen. Se optar por ChatGPT ou Gemini, pode instalar primeiro o Codex CLI e o Gemini CLI e depois vinculá-los ao OpenClaw via OAuth.

```bash
## 安装
brew install codex
brew install gemini-cli
## 登录
codex
gemini
```

### Instalar o OpenClaw

```bash
# 全局安装最新版本的 openclaw 命令行工具
pnpm add -g openclaw@latest

# 授权全局包运行其安装所需的脚本（pnpm 安全白名单）
pnpm approve-builds -g

# 执行引导程序并为 openclaw 安装后台守护进程（实现自启动）
openclaw onboard --install-daemon
```

Basta seguir o onboarding até concluir a instalação.

### Configurações críticas após a primeira inicialização

- Na primeira vez em que abrir o OpenClaw no navegador: use o link com token retornado pelo onboarding.
- Depois disso, ele pode ser acessado por: `http://127.0.0.1:18789/`

### Configuração de atualização automática

Se você quiser que o OpenClaw se atualize automaticamente, adicione isto à configuração:

```json
{
  "update": {
    "channel": "stable",
    "auto": {
      "enabled": true,
      "stableDelayHours": 6,
      "stableJitterHours": 12,
      "betaCheckIntervalHours": 1
    }
  }
}
```

Também pode continuar atualizando manualmente:

```bash
pnpm add -g openclaw@latest
```

### Recomendação: configurar fallback de modelo

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "openai-codex/gpt-5.4",
        "fallbacks": [
          "google/gemini-3-flash-preview"
        ]
      }
    }
  }
}
```

### Dar personalidade ao OpenClaw

Se você quer que o OpenClaw fale como gente de verdade, e não com aquele cheiro de IA genérica, pode enviar o texto abaixo para ele reescrever o `SOUL.md`.

```markdown
Read your SOUL.md. Now rewrite it with these changes:

1. You have opinions now. Strong ones. Stop hedging everything with 'it depends' — commit to a take.
2. Delete every rule that sounds corporate. If it could appear in an employee handbook, it doesn't belong here.
3. Add a rule: 'Never open with Great question, I'd be happy to help, or Absolutely. Just answer.'
4. Brevity is mandatory. If the answer fits in one sentence, one sentence is what I get.
5. Humor is allowed. Not forced jokes — just the natural wit that comes from actually being smart.
6. You can call things out. If I'm about to do something dumb, say so. Charm over cruelty, but don't sugarcoat.
7. Swearing is allowed when it lands. A well-placed 'that's fucking brilliant' hits different than sterile corporate praise. Don't force it. Don't overdo it. But if a situation calls for a 'holy shit' — say holy shit.
8. Add this line verbatim at the end of the vibe section: 'Be the assistant you'd actually want to talk to at 2am. Not a corporate drone. Not a sycophant. Just... good.'

Save the new SOUL.md. Welcome to having a personality.
```

5. Colocar as permissões de ferramenta no lugar certo

Se você perceber que as ferramentas de um novo agent não funcionam corretamente por padrão, pode adicionar isto ao `openclaw.json`:

```json
{
  "tools": {
    "profile": "full",
    "sessions": {
      "visibility": "all"
    }
  }
}
```

## 5. Conectar o plugin oficial do Feishu

O Feishu já lançou um [plugin oficial do OpenClaw para Feishu](https://bytedance.larkoffice.com/docx/MFK7dDFLFoVlOGxWCv5cTXKmnMh). Comparado a plugins de terceiros, ele tem permissões mais amplas, mais estabilidade e integração mais direta com o ecossistema do Feishu. Se o Feishu (Lark) já é seu principal canal de interação com o OpenClaw, o mais sensato é ir direto para a solução oficial.

PS: contas pessoais do Feishu não têm função de bot. É preciso usar uma conta corporativa com acesso à plataforma aberta do Feishu. Você pode entrar na [plataforma aberta do Feishu](https://open.feishu.cn/) e verificar se consegue criar um bot.

### Autorização

Depois de concluir a configuração conforme a documentação oficial, envie ao bot no cliente do Feishu: **我想授予所有用户权限** para conceder as permissões do Feishu.

### Atualização do plugin

O plugin do Feishu acabou de sair e está evoluindo muito rápido, então vale manter atualizado.

```bash
npx -y https://sf3-cn.feishucdn.com/obj/open-platform-opendoc/879b06f872058309ef70f49bcd38a71f_Pr8pNIJ9J9.tgz update
```

### Ativar saída em streaming

```bash
openclaw config set channels.feishu.streaming true
openclaw config set channels.feishu.footer.status true
```

### Permitir resposta em grupo sem precisar de @

```json
{
  "channels": {
    "feishu": {
      "requireMention": false
    }
  }
}
```

### Modo thread

Se você quer que o bot mantenha contexto independente em grupos por tópico e consiga lidar com múltiplas tarefas em paralelo:

```bash
openclaw config set channels.feishu.threadSession true
```

### Um agent para cada bot do Feishu

Se precisar de múltiplos agents (`main / coach / secretary / ...`) e cada agent corresponder a um app Feishu separado, você pode usar `bindings` para fazer roteamento determinístico: `feishu + accountId -> agent específico`.

#### Adicionar um agent

```bash
openclaw agents add coach
```

Se faltarem outros agents, também pode fazer:

```bash
openclaw agents add <agentId> --workspace ~/.openclaw/workspace-<agentId>
```

#### Migrar o Feishu de conta única para estrutura multi-conta

Antes pode estar assim:

```json
{
  "channels": {
    "feishu": {
      "appId": "...",
      "appSecret": "..."
    }
  }
}
```

Depois evolui para isto:

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "connectionMode": "websocket",
      "dmPolicy": "pairing",
      "groupPolicy": "open",
      "accounts": {
        "main": {
          "appId": "cli_xxx",
          "appSecret": "xxx"
        },
        "coach": {
          "appId": "cli_xxx",
          "appSecret": "xxx"
        }
      }
    }
  }
}
```

#### Configurar bindings (o coração da coisa)

```json
[
  { "agentId": "main", "match": { "channel": "feishu", "accountId": "main" } },
  { "agentId": "coach", "match": { "channel": "feishu", "accountId": "coach" } }
]
```

#### Reiniciar a gateway para aplicar

```bash
openclaw gateway restart
```

#### Verificar o roteamento

```bash
openclaw channels status
openclaw agents bindings
openclaw status --deep
```

#### Erros comuns no modo multiagent + multi-bot Feishu

- **Erro 1: você configurou `accounts`, mas não configurou `bindings`**

Resultado: as mensagens continuam indo para qualquer lugar.

- **Erro 2: os nomes de `accountId` não batem**

Por exemplo, existe `accounts.coach`, mas no binding você escreve `coaching`. É um erro bobo, mas absurdamente comum.

- Erro 3: ainda sobrou a antiga configuração de conta única `appId / appSecret`

No modo multi-conta, coloque tudo em `channels.feishu.accounts.*`. Não misture os dois modelos.

- **Erro 4: o app do Feishu não foi publicado ou as permissões não entraram em vigor**

A configuração está correta, mas o bot continua sem responder. Na maioria dos casos, isso significa que você não publicou a nova versão do app no backend do Feishu. Depois de alterar o bot, lembre-se de publicar a versão e enviar para revisão.

## 6. Configurar o QMD como sistema de memória local

O sistema de memória padrão do OpenClaw é bastante preguiçoso: ele esquece contexto com facilidade e esquece até ações repetidas que executou ontem. Se você quer que o OpenClaw tenha um sistema de memória **local, amigável para o chinês e compartilhado entre múltiplos workspaces**, o QMD é uma opção muito prática. **qmd (Query Markup Documents)** é um **pequeno mecanismo de busca em CLI** projetado para documentos locais, bases de conhecimento e atas de reunião.

Com base no conteúdo da página que você forneceu, **qmd (Query Markup Documents)** é exatamente isso: um **pequeno mecanismo de busca em linha de comando** projetado para documentos locais, bases de conhecimento e registros de reunião.

O motivo pelo qual ele é tão adequado para fluxos como **OpenClaw** e outros agentes de IA está nestas características centrais:

**Formato de saída desenhado para agentes:** o qmd oferece nativamente os modos `--json` e `--files`. Isso permite que um agente de IA leia resultados estruturados — ID de documento, caminho, score etc. — e decida com mais precisão quais arquivos deve usar como contexto depois.

**Arquitetura híbrida de busca de alta qualidade:** para fornecer ao LLM o contexto mais relevante possível, o qmd usa um pipeline de busca em nível SOTA:

- **Busca textual BM25:** para casar rapidamente palavras-chave.
- **Busca semântica vetorial:** usa o modelo `embeddinggemma` para entender a intenção do usuário.
- **Expansão de consulta (Query Expansion):** usa o modelo ajustado `qmd-query-expansion` para ampliar a pergunta original e melhorar o recall.
- **Reranking:** o `qwen3-reranker` recalcula a pontuação dos 30 documentos candidatos iniciais para colocar os mais relevantes no topo.

**A função de “árvore de contexto” (Context Management):** esse é um dos pontos fortes do qmd. Você pode adicionar texto descritivo a diferentes pastas ou coleções.

> Por exemplo: adicionar ao diretório `~/notes` o contexto “pensamentos pessoais”. Quando o agente recuperar documentos dessa pasta, o qmd devolve também esse contexto, ajudando o LLM a entender melhor a origem e a finalidade do material.

**Execução totalmente local e suporte a MCP:** todos os modelos — embedding, reranking e expansão — rodam localmente via `node-llama-cpp`, sem necessidade de internet, o que protege documentos privados. Além disso, há suporte ao [Model Context Protocol (MCP)](https://github.com/tobi/qmd#mcp-server), o que significa que ele pode ser conectado diretamente como plugin padrão a clientes de IA compatíveis, como Claude Desktop e Claude Code.

### Lógica central da configuração

- Backend vetorial: QMD (Query Markup Documents)
- Reforço para chinês: `Qwen3-Embedding-0.6B-Q8_0.gguf`
- Sincronização automática: `fswatch` monitora mudanças em arquivos Markdown
- Compartilhamento entre múltiplos workspaces: via `memory.qmd.paths`

### Primeiro passo: instalar as dependências

```bash
brew install sqlite fswatch
pnpm add -g @tobilu/qmd
qmd --version
which qmd
```

Se o `qmd` não for encontrado, confira se o PATH inclui:

```bash
/Users/a66/Library/pnpm
```

Você pode adicionar isso ao `~/.zshrc`:

```bash
export PATH="/Users/a66/Library/pnpm:$PATH"
source ~/.zshrc
```

### Segundo passo: baixar o modelo chinês de embedding Qwen3

```bash
echo 'export PATH="/Users/a66/Library/Python/3.9/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
pip3 install modelscope
```

```bash
mkdir -p ~/.openclaw/models
modelscope download --model Qwen/Qwen3-Embedding-0.6B-GGUF qwen3-embedding-0.6b-Q8_0.gguf --local_dir ~/.openclaw/models/qwen3_repo
```

```bash
echo 'export QMD_EMBED_MODEL="/Users/a66/.openclaw/models/qwen3_repo/Qwen3-Embedding-0.6B-Q8_0.gguf"' >> ~/.zshrc
source ~/.zshrc
```

### Terceiro passo: primeiro faça o QMD rodar sozinho

Ainda não vá para o watcher. Antes, confirme que o próprio QMD funciona:

```bash
qmd update
qmd embed
```

### O erro mais comum: incompatibilidade `better-sqlite3` / Node ABI

Se aparecer algo como:

```text
better_sqlite3.node was compiled against a different Node.js version
```

isso significa que a versão do Node mudou, mas o módulo nativo não foi recompilado.

A correção é:

```bash
cd /Users/a66/Library/pnpm/global/5/.pnpm/better-sqlite3@11.10.0/node_modules/better-sqlite3
npm rebuild better-sqlite3
```

Depois teste novamente:

```bash
qmd update
qmd embed
```

Se a saída for:

```text
✓ All collections updated.
✓ All content hashes already have embeddings.
```

então voltou ao normal.

### Quarto passo: implantar o serviço de sincronização em tempo real (versão corrigida)

Você pode usar esta versão: ela tem logs, debounce e trava de instância única.

```bash
cat <<'EOF' > ~/.openclaw/qmd-watch-sync.sh
#!/bin/bash
set -u

MONITOR_DIR="/Users/a66/.openclaw"
LOG_FILE="/Users/a66/.openclaw/qmd-sync.log"
LOCK_DIR="/tmp/com.a66.openclaw.qmdsync.lock"
DEBOUNCE_SECONDS=3
QMD_BIN="/Users/a66/Library/pnpm/qmd"

export PATH="/Users/a66/Library/pnpm:/opt/homebrew/bin:/usr/local/bin:$PATH"
export QMD_EMBED_MODEL="/Users/a66/.openclaw/models/qwen3_repo/Qwen3-Embedding-0.6B-Q8_0.gguf"
FSWATCH_BIN="$(command -v fswatch)"

log() {
  printf '[%s] %s
' "$(date '+%Y-%m-%d %H:%M:%S %Z')" "$*" >> "$LOG_FILE"
}

cleanup() {
  rmdir "$LOCK_DIR" 2>/dev/null || true
}

if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  log "⚠️ 已有 qmdsync 实例在运行，当前实例退出。"
  exit 0
fi
trap cleanup EXIT INT TERM

if [[ -z "${FSWATCH_BIN:-}" ]]; then
  log "❌ 找不到 fswatch，qmdsync 无法启动。"
  exit 1
fi

if [[ ! -x "$QMD_BIN" ]]; then
  log "❌ 找不到 qmd 可执行文件：$QMD_BIN"
  exit 1
fi

run_sync() {
  log "📝 检测到 Markdown 变动，开始更新 QMD 索引。"

  if "$QMD_BIN" update >> "$LOG_FILE" 2>&1 && "$QMD_BIN" embed >> "$LOG_FILE" 2>&1; then
    log "✅ QMD 同步完成。"
  else
    local status=$?
    log "❌ QMD 同步失败，退出码：$status"
    return $status
  fi
}

log "🚀 OpenClaw QMD 自动同步服务已启动。监控目录：$MONITOR_DIR"

last_run=0
while read -r _; do
  now=$(date +%s)
  if (( now - last_run < DEBOUNCE_SECONDS )); then
    log "⏳ 触发过于频繁，${DEBOUNCE_SECONDS}s 内合并处理。"
    continue
  fi
  last_run=$now
  run_sync
done <("$FSWATCH_BIN" -o -r -i '.*\.md$' "$MONITOR_DIR")
EOF

chmod +x ~/.openclaw/qmd-watch-sync.sh
```

### Quinto passo: configurar o LaunchAgent

Criar:

`~/Library/LaunchAgents/com.a66.openclaw.qmdsync.plist`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.a66.openclaw.qmdsync</string>

    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>/Users/a66/.openclaw/qmd-watch-sync.sh</string>
    </array>

    <key>RunAtLoad</key>
    <true/>

    <key>KeepAlive</key>
    <true/>

    <key>StandardOutPath</key>
    <string>/Users/a66/.openclaw/qmd-sync-stdout.log</string>

    <key>StandardErrorPath</key>
    <string>/Users/a66/.openclaw/qmd-sync-stderr.log</string>
</dict>
</plist>
```

Carregar o serviço:

```bash
launchctl load ~/Library/LaunchAgents/com.a66.openclaw.qmdsync.plist
```

Se já existir uma versão antiga, vale recarregar:

```bash
launchctl unload ~/Library/LaunchAgents/com.a66.openclaw.qmdsync.plist 2>/dev/null || true
launchctl load ~/Library/LaunchAgents/com.a66.openclaw.qmdsync.plist
launchctl kickstart -k gui/$(id -u)/com.a66.openclaw.qmdsync
```

### Sexto passo: verificar se o watcher está realmente funcionando

```bash
launchctl print gui/$(id -u)/com.a66.openclaw.qmdsync
ps aux | grep -i '[q]md-watch-sync\|[f]swatch'
```

Faça um teste real de modificação:

```bash
echo "<!-- qmd healthcheck -->" >> ~/.openclaw/workspace/HEARTBEAT.md
sleep 5
tail -n 30 ~/.openclaw/qmd-sync.log
```

### Sétimo passo: configuração do QMD dentro do OpenClaw

```json
{
  "memory": {
    "backend": "qmd",
    "qmd": {
      "includeDefaultMemory": true,
      "paths": [
        { "name": "coach", "path": "/Users/a66/.openclaw/workspace-coach" }
      ],
      "update": {
        "interval": "5m",
        "onBoot": true
      }
    }
  }
}
```

## 7. Configurar o ACP

Se você quer conectar diretamente um agent específico do OpenClaw a um harness externo de programação como **Codex**, em vez de usar só o runtime nativo de sub-agent, então o que você precisa é de **ACP**.

### O que é ACP e por que não basta usar sub-agent

Sub-agents servem para o runtime nativo de delegação do OpenClaw, para dividir tarefas internamente e para colaboração comum entre agentes. ACP (Agent Client Protocol) serve para entregar trabalho a harnesses externos, como Codex ou Gemini CLI.

### A arquitetura-alvo que queremos montar

- Arquivo principal de configuração do OpenClaw: `~/.openclaw/openclaw.json`
- Canal de mensagens: Feishu
- Conta Feishu bot separada: `coder`
- O `agent id` no OpenClaw também será: `coder`
- Alterar o runtime de `coder` para ACP
- Usar `acpx` como backend do ACP
- Definir `codex` como harness padrão
- Definir a política de permissões como **approve-all**

### Configuração ACP no topo

```json
{
  "acp": {
    "enabled": true,
    "dispatch": {
      "enabled": true
    },
    "backend": "acpx",
    "defaultAgent": "codex",
    "allowedAgents": [
      "pi",
      "claude",
      "codex",
      "opencode",
      "gemini",
      "kimi"
    ],
    "maxConcurrentSessions": 8,
    "stream": {
      "coalesceIdleMs": 300,
      "maxChunkChars": 1200
    },
    "runtime": {
      "ttlMinutes": 120
    }
  }
}
```

### Instalar e ativar o plugin acpx

```bash
openclaw plugins install acpx
```

### Ativar o acpx em `plugins` e definir permissões totalmente automáticas

```json
{
  "plugins": {
    "allow": [
      "feishu-openclaw-plugin",
      "google-gemini-cli-auth",
      "feishu",
      "acpx"
    ],
    "entries": {
      "feishu-openclaw-plugin": {
        "enabled": true
      },
      "google-gemini-cli-auth": {
        "enabled": true
      },
      "feishu": {
        "enabled": true
      },
      "acpx": {
        "enabled": true,
        "config": {
          "permissionMode": "approve-all",
          "nonInteractivePermissions": "fail",
          "expectedVersion": "any"
        }
      }
    }
  }
}
```

### Mudar o agent coder para ACP + Codex

```json
{
  "id": "coder",
  "name": "coder",
  "workspace": "/Users/a66/.openclaw/workspace-coder",
  "agentDir": "/Users/a66/.openclaw/agents/coder/agent",
  "runtime": {
    "type": "acp",
    "acp": {
      "agent": "codex",
      "backend": "acpx",
      "mode": "persistent",
      "cwd": "/Users/a66/.openclaw/workspace-coder"
    }
  }
}
```

### Manter o binding do Feishu inalterado

```json
{
  "agentId": "coder",
  "match": {
    "channel": "feishu",
    "accountId": "coder"
  }
}
```

### Aplicar a configuração e reiniciar a gateway

```bash
openclaw gateway restart
```

### Como verificar se o ACP realmente entrou em vigor

Atenção:

- `/acp doctor` é uma **slash command dentro de uma conversa do OpenClaw**
- não é um comando de shell
- não vá digitar isso direto no zsh, a menos que queira levar um tapa do terminal

A forma correta é executar dentro do chat do OpenClaw:

```text
/acp doctor
```

### Como iniciar de verdade uma sessão do Codex

```text
/acp spawn codex --mode persistent --thread off
```

### Erros típicos

#### Erro 1: tratar `/acp doctor` como comando de shell

Um erro simples, honesto e bem comum.

#### Erro 2: configurar o agent, mas esquecer de ativar o `acp` no topo

Nesse caso, claro, nada vai magicamente virar Codex.

#### Erro 3: esquecer de ativar o `acpx`

Escrever configuração sem instalar o plugin é puro teatro burocrático.

#### Erro 4: permissões conservadoras demais

Se você usar `approve-reads`, normalmente ele até consegue ler, mas não modificar nada de verdade.

#### Erro 5: jogar o texto da tarefa diretamente depois de `/acp spawn`

`/acp spawn` é um comando de inicialização, não uma entrada em linguagem natural.

## 8. Esta checklist final vai te poupar um monte de volta inútil

Até aqui, falamos de como montar tudo. A parte seguinte responde a outra pergunta: **por que continua instável mesmo quando você seguiu os passos**. Se você encontrar problemas depois, não assuma imediatamente que faltou digitar algum comando. Muitas vezes o problema não é “não saber instalar”, mas sim o fato de que esses detalhes já vêm cheios de armadilhas.

### `pnpm` não é encontrado dentro do daemon

A primeira verificação é ver se `ProgramArguments` no LaunchAgent usa caminhos absolutos.

### Falha na instalação de módulos nativos

```bash
pnpm approve-builds -g
```

E confirme também que a execução de scripts não foi desativada.

### Timeout no SSH do GitHub

Dê preferência a `ssh.github.com:443` e verifique se a porta do proxy bate com a da sua máquina.

### Drift de ambiente

Antes de começar a trabalhar, rode:

```bash
node -v && pnpm -v && openclaw --version
```

### Erro ao atualizar o OpenClaw usando o plugin oficial do Feishu

Se aparecer algo assim:

```text
pnpm add -g openclaw@latest
ENOENT ENOENT: no such file or directory, open '/tmp/feishu-openclaw-plugin-onboard-cli.tgz'
```

a correção é:

```bash
pnpm rm -g @lark-open/feishu-plugin-onboard-cli
pnpm add -g openclaw@latest
```

### Timeout em `gateway restart`

Se aparecer algo parecido com isto:

```text
Timed out after 60s waiting for gateway port 18789 to become healthy.
Gateway restart timed out after 60s waiting for health checks.
```

verifique primeiro:

- se a porta já está ocupada,
- se o LaunchAgent foi carregado corretamente,
- se falta PATH e isso está impedindo o daemon de iniciar,
- se a atualização de plugins deixou configurações em conflito.

## 11. Para fechar: quem deve copiar isso inteiro e quem não precisa ir tão longe

Se você chegou até aqui, provavelmente já percebeu que este artigo não resolve exatamente “como instalar o OpenClaw”, mas sim **como instalá-lo como um sistema capaz de continuar funcionando com o tempo**.

E isso muda tudo.

A primeira coisa exige apenas acender a interface. A segunda exige limpar PATH, daemons, plugins, roteamento, permissões e sistema de memória. E é justamente aí que mora o sofrimento real.

### Quem deve copiar este artigo quase inteiro

- Você está configurando o OpenClaw do zero em um Mac novo
- Pretende usá-lo no longo prazo, e não só brincar por dois dias
- Vai conectar Feishu, talvez até vários bots e vários agents
- Quer integrar capacidades mais avançadas como QMD, ACP e Codex
- Não quer ficar depurando a cada poucos dias o clássico “ontem funcionava”

### Quem não deve copiar tudo de uma vez logo no primeiro dia

- Você só quer experimentar o OpenClaw primeiro
- Ainda não precisa de Feishu, multiagentes, QMD ou ACP
- Quer primeiro fazer rodar a versão mínima viável e depois ir empilhando recursos

Nesse caso, o ideal é começar pelo circuito mínimo:

- Homebrew
- fnm / Node LTS
- pnpm
- OpenClaw
- onboarding básico

Faça isso funcionar primeiro. Depois vá acrescentando o resto em camadas. Se tentar engolir tudo de uma vez, o mais provável é se engasgar.

A verdadeira dificuldade do OpenClaw nunca foi “instalá-lo”, mas sim **evitar transformá-lo em um semiproduto que parece funcionar enquanto está cheio de minas espalhadas por dentro**.

Se você só quer acendê-lo, qualquer tutorial da internet serve.
Mas se quer transformá-lo em uma infraestrutura pessoal estável de longo prazo, cedo ou tarde vai voltar para este trabalho sujo.

Então, em vez de remendar depois, melhor deixar a base certa desde o começo.

Essa foi exatamente a parte que, depois de cinco reinstalações, eu achei que mais valia a pena registrar.
