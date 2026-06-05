---
title: "Après 5 réinstallations d’OpenClaw, j’ai enfin écrit la configuration que les débutants devraient copier"
description: "J’ai réinstallé OpenClaw cinq fois sur un nouveau Mac, et j’ai fini par clarifier les pièges les plus courants : ce qu’il faut vraiment configurer d’abord pour Node, pnpm, SSH, Feishu, le multi-agent, QMD et ACP, et ce qui a l’air de marcher alors que ça explosera tôt ou tard. Cette fois, je mets tout à plat."
category: "startup"
tags:
  - "allocation"
  - "strategy"
  - "innovation"
pubDate: 2026-03-10
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260310-mac-openclaw-cover-v2.avif"
heroImageAlt: "Image de couverture d’un guide d’installation et de configuration d’OpenClaw sur un nouveau Mac"
heroImageWidth: 2400
heroImageHeight: 1350
draft: false
featured: false
locale: fr
---

# Après 5 réinstallations d’OpenClaw, j’ai enfin écrit la configuration que les débutants devraient copier

J’ai réinstallé OpenClaw cinq fois au total, et j’ai fini par confirmer une chose :

**Ce que les débutants gaspillent le plus, ce n’est pas le temps d’installation en lui-même, mais le fait de se faire torturer encore et encore par une pile de configurations qui “semblent déjà fonctionner”, alors qu’en réalité elles finiront tôt ou tard par casser.**

La première fois que tu l’installes, tu as l’impression que tant que l’interface s’ouvre et que le bot répond, c’est gagné. En général, ce n’est pas vrai.

Les vrais pièges arrivent souvent après :

- `pnpm` est bien installé, mais le daemon reste incapable de le trouver ;
- le bot Feishu est bien connecté, mais le routage multi-agent est en réalité en vrac ;
- QMD a l’air de se synchroniser automatiquement, alors qu’en pratique il échoue en silence en permanence ;
- la configuration ACP semble correcte, mais le coder ne tourne en fait jamais vraiment sur Codex ;

Cet article n’est ni une “version traduite de la doc officielle”, ni un tutoriel du genre “je l’ai installé une fois, donc je vais maintenant apprendre ça aux autres”. C’est plutôt une **version post-mortem des pièges de départ**, tirée de cinq réinstallations d’OpenClaw sur un Mac mini flambant neuf.

Ce qu’il résout, ce n’est pas “comment allumer OpenClaw”, mais quelque chose de bien plus important :

> **comment le configurer pour obtenir un environnement stable sur la durée, et pas juste un truc qui s’allume aujourd’hui pour exploser demain.**

## Les 5 pièges les plus fréquents que j’ai confirmés après 5 réinstallations

Je mets d’abord la partie la plus rentable.

Si tu veux juste comprendre pourquoi tant de gens “l’ont pourtant bien installé, mais ça continue à merder”, la réponse tient globalement dans ces 5 points :

1. **Ce n’est pas parce que ton PATH est correct que le PATH du daemon l’est aussi**  
   Le fait que `pnpm`, `node` et `qmd` fonctionnent dans ton terminal ne veut pas dire qu’ils fonctionneront aussi dans LaunchAgent.

2. **Ce n’est pas parce qu’un outil est installé qu’OpenClaw a les bonnes permissions pour l’utiliser**  
   Certaines versions ont des permissions par défaut plus conservatrices. Si tu ne complètes pas la config, ça donne l’impression de marcher, mais au premier vrai appel d’outil, c’est à moitié mort.

3. **QMD n’affiche pas d’erreur, ça ne veut pas dire qu’il synchronise vraiment**  
   Beaucoup de scripts watcher font semblant d’avoir réussi. Même quand ça échoue, ils écrivent quand même “synchronisation terminée”. C’est un piège vicieux.

4. **Pouvoir créer plusieurs agents ne veut pas dire que les messages seront correctement routés**  
   Dans la config multi-bot de Feishu, `accounts` n’est que le début. Ce qui décide réellement de la destination des messages, c’est `bindings`.

5. **Ce n’est pas parce que coder semble connecté à Codex qu’il tourne vraiment sur ACP**  
   Beaucoup de gens finissent la config en pensant “ça devrait être bon”. En réalité, le runtime n’a jamais été correctement basculé ; seul le nom donne cette impression.

Si tu évites ces 5 pièges dès le départ, tu t’épargnes au moins la moitié des galères inutiles qui viennent après.

La configuration ci-dessous est organisée précisément autour de ces points-là.

## 0. Si tu veux “élever un homard” (OpenClaw), le meilleur choix, c’est le Mac mini

Les raisons principales pour lesquelles le Mac mini est le meilleur choix pour “élever un homard” sont les suivantes :

### 1. Architecture mémoire unifiée

Les puces Apple Silicon des Mac utilisent une **architecture mémoire unifiée (Unified Memory)**, où la mémoire système et la mémoire vidéo sont partagées. Pour exécuter localement de grands modèles de langage (LLM) en inférence — on utilisera plus tard des modèles open source pour prendre en charge QMD — disposer d’assez de mémoire vidéo équivalente est la condition de base pour obtenir une vitesse raisonnable.

### 2. Intégration de l’écosystème et simplicité de l’automatisation

Même si les fournisseurs cloud sortent tous leurs solutions “d’élevage de homard dans le cloud”, un Mac mini garde des avantages naturels face à un VPS dès qu’il s’agit d’automatiser des tâches du quotidien :

- **Contournement de la détection :** faire tourner l’automatisation navigateur sur une IP résidentielle locale a moins de chances d’être détecté comme “bot” que sur une IP de datacenter (VPS).

- **Traitement multimédia :** manipuler des fichiers locaux, gérer l’agenda ou intégrer des applis desktop (comme Claude Code ou Codex) est nettement plus simple.

### 3. Seuil d’usage et stabilité

- **Courbe d’apprentissage plus douce :** pour les non-développeurs, configurer un tableau de bord et déboguer les permissions réseau sur un Mac local est bien plus intuitif que de jongler avec un environnement réseau compliqué sur un VPS.
- **Silencieux et économe :** le Mac mini est compact, consomme très peu et reste discret, ce qui en fait un excellent “serveur à homard” en 24/7.

## 1. Poser d’abord des fondations stables : ligne de commande et gestionnaire de paquets

### Version du système

Quand tu récupères ton Mac mini, commence par mettre macOS à jour vers la dernière version Tahoe. Puis active les mises à jour automatiques.

- ✅Réglages Système → Général → Mise à jour logicielle → Mises à jour automatiques

### Réglages d’alimentation

Dans **Réglages Système → Énergie**, je recommande d’activer les trois options suivantes :

- ✅Empêcher la mise en veille automatique lorsque l’écran est éteint
- ✅Réveiller pour l’accès réseau
- ✅Redémarrer automatiquement après une coupure de courant

Sinon, quand la machine est posée chez toi et que tu l’utilises à distance, OpenClaw finit facilement en mode “le corps est là, mais l’âme a disparu”. Feishu ne pourra pas le réveiller.

### Installer Tailscale

Tailscale permet de connecter en toute sécurité des appareils situés sur des réseaux différents — maison, bureau, téléphone — dans un même réseau local virtuel. Quand tu es à des milliers de kilomètres et qu’OpenClaw est planté, tu peux toujours utiliser Tailscale + partage d’écran depuis un autre appareil pour accéder à la machine où il tourne.

globalement, la configuration de Tailscale est simple. L’important, c’est :

- ✅d’activer la connexion au démarrage,
- ✅d’activer le partage d’écran sur le Mac mini dans Réglages Système → Général → Partage,
- ✅de noter l’adresse virtuelle Tailscale du Mac mini.

### Installer Xcode Command Line Tools

Xcode Command Line Tools est un ensemble d’outils bas niveau fourni officiellement par Apple. Il complète macOS avec des éléments essentiels non préinstallés par défaut, comme `git`, `make` ou le compilateur `clang`. C’est la base de l’environnement de développement sur Mac : sans lui, tu seras vite bloqué pour compiler du code source ou faire tourner des gestionnaires de paquets avancés.

```bash
xcode-select --install
# Ou tape simplement “git” dans le terminal : l’installation des Xcode Command Line Tools se lancera automatiquement
```

### Installer Homebrew

Homebrew est de fait le gestionnaire de paquets standard sur macOS. Il permet d’installer, mettre à jour et supprimer toutes sortes d’outils de développement et de dépendances avec des commandes terminal ultra simples. En arrière-plan, il gère intelligemment les dépendances et uniformise les liens système, ce qui évite de télécharger des paquets à la main ou de bricoler les chemins système.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Configurer les variables d’environnement Homebrew**

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

## 2. Verrouiller définitivement l’environnement Node

Grâce au **stockage adressé par le contenu (CAS)**, pnpm utilise des **liens physiques** pour garantir qu’une même version de paquet ne soit stockée qu’une seule fois sur le disque. Résultat : tu économises de l’espace SSD sur ton Mac et tu accélères les installations. Surtout, sa **structure stricte d’arborescence par liens symboliques** élimine le problème des “dépendances fantômes” hérité du layout aplati de npm : ton code ne peut accéder qu’aux paquets explicitement déclarés dans `package.json`. En clair : environnement plus propre, build plus sûr. Donc oui, je recommande **pnpm** plutôt que npm.

### Installer fnm et activer le switch automatique

Utilise `fnm`, construit en Rust, comme gestionnaire de versions. Ça te permet de basculer de manière fluide, rapide et automatique entre différentes versions de Node.js selon les projets, sans te coltiner des conflits globaux.

```bash
brew install fnm
echo 'eval "$(fnm env --use-on-cd --shell zsh)"' >> ~/.zshrc
source ~/.zshrc
```

### Installer Node LTS et le définir par défaut

Verrouiller la version LTS de Node.js comme environnement global par défaut est le meilleur moyen d’assurer une base stable, autant pour les daemons système comme `launchd` que pour ton travail quotidien.

```bash
fnm install --lts
fnm default lts-latest
```

### Activer Corepack et pnpm

Activer Corepack, intégré nativement à Node.js, permet de contourner complètement l’ancien schéma bancal d’installation globale via npm, et d’activer `pnpm` d’une manière plus propre, plus officielle et plus contrôlable.

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### Vérifier les chemins des binaires critiques

```bash
which node
which pnpm
node -v
pnpm -v
```

Les environnements non interactifs comme `launchd` dépendent de chemins absolus. Quand tu écriras tes LaunchAgent plus tard, utilise directement les chemins renvoyés par `which`.

### Initialisation de pnpm et configuration des alias

Exécute l’initialisation système, puis mets en place des alias shell stricts pour empêcher toute rechute vers npm ou yarn. Si tu veux que `pnpm` gère proprement les binaires globaux et t’imposer un vrai workflow **pnpm-only**, exécute d’abord `pnpm setup`, puis ajoute une version plus stricte de `.zshrc`.

#### Étapes

1. Commence par exécuter :

```bash
pnpm setup
```

2. Puis ajoute ce bloc dans `~/.zshrc` :

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

3. Puis recharge :

```bash
source ~/.zshrc
```

## 3. Configurer GitHub

Tu peux suivre la documentation officielle de GitHub : [Generating a new SSH key and adding it to the ssh-agent](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent).

Avant de générer une clé SSH, commence par configurer l’identité globale de Git, sinon ton historique de commits sera moche.

```bash
git config --global user.name "your_name"
git config --global user.email "your_email@example.com"
```

### Vérifier d’abord que tu utilises le SSH système

```bash
which ssh
# Attendu : /usr/bin/ssh
```

### Générer la clé

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

### Configurer `~/.ssh/config`

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

Si tu n’utilises pas de proxy local, supprime simplement la ligne `ProxyCommand`.

### Uploader la clé publique et vérifier

```bash
pbcopy < ~/.ssh/id_ed25519.pub
ssh -T git@github.com
```

## 4. Faire tourner OpenClaw

### Préparer les grands modèles

OpenClaw a besoin d’appeler de grands modèles pour exécuter ses tâches. Plus le modèle est fort, plus OpenClaw l’est aussi. Tu peux privilégier ChatGPT, Gemini et autres modèles fermés, ou bien des modèles ouverts comme Kimi et Qwen. Si tu choisis ChatGPT ou Gemini, tu peux d’abord installer Codex CLI et Gemini CLI, puis les relier à OpenClaw via OAuth.

```bash
## 安装
brew install codex
brew install gemini-cli
## 登录
codex
gemini
```

### Installer OpenClaw

```bash
# 全局安装最新版本的 openclaw 命令行工具
pnpm add -g openclaw@latest

# 授权全局包运行其安装所需的脚本（pnpm 安全白名单）
pnpm approve-builds -g

# 执行引导程序并为 openclaw 安装后台守护进程（实现自启动）
openclaw onboard --install-daemon
```

Suis simplement le parcours d’installation jusqu’au bout.

### Réglages clés après le premier démarrage

- La première fois que tu ouvres OpenClaw dans le navigateur : utilise l’URL avec token renvoyée par l’onboarding.
- Ensuite, tu peux y accéder via : `http://127.0.0.1:18789/`

### Configuration des mises à jour automatiques

Si tu veux qu’OpenClaw se mette à jour automatiquement, ajoute ceci dans la configuration :

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

Sinon, tu peux continuer à faire les mises à jour manuellement :

```bash
pnpm add -g openclaw@latest
```

### Recommandation : configurer un fallback de modèle

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

### Donner une vraie personnalité à OpenClaw

Si tu veux qu’OpenClaw parle comme un humain au lieu de sentir l’IA aseptisée, tu peux lui envoyer le texte ci-dessous pour qu’il réécrive `SOUL.md`.

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

5. Mettre les bonnes permissions d’outils

Si tu constates qu’un nouvel agent n’arrive pas à appeler correctement ses outils par défaut, tu peux ajouter ceci dans `openclaw.json` :

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

## 5. Brancher le plugin officiel Feishu

Feishu a déjà publié un [plugin officiel OpenClaw pour Feishu](https://bytedance.larkoffice.com/docx/MFK7dDFLFoVlOGxWCv5cTXKmnMh). Par rapport aux plugins tiers, il a plus de permissions, de meilleures performances et une intégration plus propre avec l’écosystème Feishu. Si Feishu (Lark) est déjà ton canal principal pour interagir avec OpenClaw, mieux vaut partir directement sur la solution officielle.

PS : un compte Feishu personnel ne permet pas d’utiliser la fonction bot. Il faut un compte d’entreprise capable d’utiliser la plateforme ouverte Feishu. Tu peux te connecter à la [plateforme ouverte Feishu](https://open.feishu.cn/) pour vérifier si tu peux créer un bot.

### Autorisation

Une fois la configuration terminée selon la doc officielle, envoie au bot dans le client Feishu : **我想授予所有用户权限** pour accorder les permissions Feishu.

### Mise à jour du plugin

Le plugin Feishu vient juste d’arriver et évolue très vite, donc pense à le mettre à jour régulièrement.

```bash
npx -y https://sf3-cn.feishucdn.com/obj/open-platform-opendoc/879b06f872058309ef70f49bcd38a71f_Pr8pNIJ9J9.tgz update
```

### Activer la sortie en streaming

```bash
openclaw config set channels.feishu.streaming true
openclaw config set channels.feishu.footer.status true
```

### Autoriser la réponse dans les groupes sans @

```json
{
  "channels": {
    "feishu": {
      "requireMention": false
    }
  }
}
```

### Mode thread

Si tu veux que le bot garde un contexte indépendant dans les groupes à sujets, avec parallélisation des tâches :

```bash
openclaw config set channels.feishu.threadSession true
```

### Un agent = un bot Feishu

Si tu as besoin de plusieurs agents (`main / coach / secretary / ...`) et que chaque agent correspond à une application Feishu distincte, tu peux utiliser `bindings` pour mettre en place un routage déterministe : `feishu + accountId -> agent précis`.

#### Ajouter un agent

```bash
openclaw agents add coach
```

S’il te faut d’autres agents, tu peux aussi faire :

```bash
openclaw agents add <agentId> --workspace ~/.openclaw/workspace-<agentId>
```

#### Faire évoluer Feishu d’un compte unique vers une structure multi-comptes

Au départ, ça peut ressembler à ça :

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

Puis tu passes à ceci :

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

#### Configurer les bindings (le vrai cœur du sujet)

```json
[
  { "agentId": "main", "match": { "channel": "feishu", "accountId": "main" } },
  { "agentId": "coach", "match": { "channel": "feishu", "accountId": "coach" } }
]
```

#### Redémarrer la gateway pour appliquer

```bash
openclaw gateway restart
```

#### Vérifier le routage

```bash
openclaw channels status
openclaw agents bindings
openclaw status --deep
```

#### Pièges fréquents du mode multi-agent + multi-bot Feishu

- **Piège 1 : tu as configuré `accounts`, mais pas `bindings`**

Résultat : les messages continuent à partir n’importe où.

- **Piège 2 : les noms de `accountId` ne correspondent pas**

Par exemple, tu as `accounts.coach`, mais tu écris `coaching` dans le binding. C’est une erreur bête, mais absurdement fréquente.

- Piège 3 : il reste l’ancienne config mono-compte `appId / appSecret`

En mode multi-comptes, mets tout dans `channels.feishu.accounts.*`. Ne mélange pas les deux modèles.

- **Piège 4 : l’application Feishu n’a pas été publiée ou les permissions n’ont pas pris effet**

La configuration est correcte, mais le bot ne répond toujours pas. Dans la majorité des cas, c’est parce que tu n’as pas publié la nouvelle version de l’application côté Feishu. Après chaque mise à jour du bot, pense à publier puis soumettre à validation.

## 6. Configurer QMD comme système de mémoire locale

Le système de mémoire par défaut d’OpenClaw est assez paresseux : il oublie souvent le contexte, et il oublie même des actions répétées exécutées la veille. Si tu veux qu’OpenClaw dispose d’une mémoire **locale, adaptée au chinois et partagée entre plusieurs workspaces**, QMD est une solution très pratique. **qmd (Query Markup Documents)** est un **petit moteur de recherche en ligne de commande** conçu pour les documents locaux, les bases de connaissances et les comptes rendus de réunion.

D’après le contenu web que tu as fourni, **qmd (Query Markup Documents)** est bien un **petit moteur de recherche CLI** spécialement conçu pour les documents locaux, les bases de connaissances et les notes de réunion.

S’il est particulièrement adapté à des workflows comme **OpenClaw** ou d’autres agents IA, c’est surtout grâce aux caractéristiques suivantes :

**Un format de sortie pensé pour les agents :** qmd fournit nativement les modes `--json` et `--files`. Cela permet à un agent IA de parser facilement les résultats et de récupérer des données structurées (ID de document, chemin, score de correspondance, etc.), afin de décider plus finement quels fichiers utiliser ensuite comme contexte.

**Une architecture de recherche hybride de haut niveau :** pour fournir au LLM le contexte le plus pertinent possible, qmd utilise un pipeline de recherche de niveau SOTA :

- **Recherche plein texte BM25 :** pour faire correspondre rapidement les mots-clés.
- **Recherche sémantique vectorielle :** basée sur le modèle `embeddinggemma` pour comprendre l’intention de l’utilisateur.
- **Expansion de requête (Query Expansion) :** utilisation du modèle spécialisé `qmd-query-expansion` pour enrichir la question initiale et améliorer le rappel.
- **Reranking :** `qwen3-reranker` rescrore les 30 documents candidats initiaux pour faire remonter les plus pertinents.

**La fonctionnalité “arbre de contexte” (gestion du contexte) :** c’est l’une des forces de qmd. Tu peux ajouter un texte descriptif à différents dossiers ou collections.

> Par exemple : ajouter au dossier `~/notes` le contexte “pensées personnelles”. Quand l’agent récupère un document de ce dossier, qmd renvoie aussi cette information de fond, ce qui aide le LLM à mieux comprendre l’origine et l’usage du document.

**Exécution 100 % locale et support MCP :** tous les modèles (embedding, reranking, expansion) tournent localement via `node-llama-cpp`, sans connexion réseau, ce qui protège les documents sensibles. Le support de [Model Context Protocol (MCP)](https://github.com/tobi/qmd#mcp-server) signifie aussi qu’il peut s’intégrer directement comme plugin standard dans des clients IA compatibles MCP comme Claude Desktop ou Claude Code.

### Logique centrale de configuration

- Backend vectoriel : QMD (Query Markup Documents)
- Renfort chinois : `Qwen3-Embedding-0.6B-Q8_0.gguf`
- Synchronisation automatique : `fswatch` surveille les changements de fichiers Markdown
- Partage entre plusieurs workspaces : via `memory.qmd.paths`

### Première étape : installer les dépendances

```bash
brew install sqlite fswatch
pnpm add -g @tobilu/qmd
qmd --version
which qmd
```

Si `qmd` est introuvable, vérifie que ton PATH contient bien :

```bash
/Users/a66/Library/pnpm
```

Tu peux l’ajouter à `~/.zshrc` :

```bash
export PATH="/Users/a66/Library/pnpm:$PATH"
source ~/.zshrc
```

### Deuxième étape : télécharger le modèle d’embedding chinois Qwen3

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

### Troisième étape : faire d’abord tourner QMD seul

Ne te précipite pas sur le watcher. Vérifie d’abord que QMD lui-même fonctionne :

```bash
qmd update
qmd embed
```

### Le piège le plus courant : incompatibilité `better-sqlite3` / ABI Node

Si tu vois un message du type :

```text
better_sqlite3.node was compiled against a different Node.js version
```

cela signifie que ta version de Node a changé, mais que le module natif n’a pas été recompilé.

Correctif :

```bash
cd /Users/a66/Library/pnpm/global/5/.pnpm/better-sqlite3@11.10.0/node_modules/better-sqlite3
npm rebuild better-sqlite3
```

Puis reteste :

```bash
qmd update
qmd embed
```

Si tu obtiens :

```text
✓ All collections updated.
✓ All content hashes already have embeddings.
```

alors c’est bon.

### Quatrième étape : déployer le service de synchronisation en temps réel (version corrigée)

Tu peux utiliser cette version : elle a des logs, un debounce, et un verrou de single instance.

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

### Cinquième étape : configurer LaunchAgent

Créer :

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

Charger le service :

```bash
launchctl load ~/Library/LaunchAgents/com.a66.openclaw.qmdsync.plist
```

S’il existe déjà une ancienne version, mieux vaut recharger proprement :

```bash
launchctl unload ~/Library/LaunchAgents/com.a66.openclaw.qmdsync.plist 2>/dev/null || true
launchctl load ~/Library/LaunchAgents/com.a66.openclaw.qmdsync.plist
launchctl kickstart -k gui/$(id -u)/com.a66.openclaw.qmdsync
```

### Sixième étape : vérifier que le watcher fonctionne vraiment

```bash
launchctl print gui/$(id -u)/com.a66.openclaw.qmdsync
ps aux | grep -i '[q]md-watch-sync\|[f]swatch'
```

Fais un vrai test de modification :

```bash
echo "<!-- qmd healthcheck -->" >> ~/.openclaw/workspace/HEARTBEAT.md
sleep 5
tail -n 30 ~/.openclaw/qmd-sync.log
```

### Septième étape : configuration QMD dans OpenClaw

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

## 7. Configurer ACP

Si tu veux connecter dans OpenClaw un agent donné directement à un harness de code externe comme **Codex**, au lieu de simplement utiliser le runtime natif de sub-agent, alors ce qu’il te faut, c’est **ACP**.

### ACP, c’est quoi — et pourquoi ne pas juste utiliser un sub-agent

Les sub-agents conviennent au runtime natif de délégation d’OpenClaw, au découpage interne des tâches et à la collaboration ordinaire entre agents. ACP (Agent Client Protocol) sert à déléguer le travail à des harness externes, comme Codex ou Gemini CLI.

### L’architecture cible qu’on cherche à obtenir

- Fichier de config principal OpenClaw : `~/.openclaw/openclaw.json`
- Canal de messagerie : Feishu
- Compte bot Feishu dédié : `coder`
- L’`agent id` dans OpenClaw est également : `coder`
- Le runtime de `coder` est basculé sur ACP
- Le backend ACP utilisé est `acpx`
- Le harness par défaut est `codex`
- La politique de permissions est **approve-all**

### Configuration ACP au niveau global

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

### Installer et activer le plugin acpx

```bash
openclaw plugins install acpx
```

### Activer acpx dans `plugins` et définir des permissions entièrement automatiques

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

### Basculer l’agent coder vers ACP + Codex

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

### Garder le binding Feishu inchangé

```json
{
  "agentId": "coder",
  "match": {
    "channel": "feishu",
    "accountId": "coder"
  }
}
```

### Appliquer la config et redémarrer la gateway

```bash
openclaw gateway restart
```

### Comment vérifier qu’ACP est réellement actif

Attention :

- `/acp doctor` est une **slash command à exécuter dans une conversation OpenClaw**
- ce n’est pas une commande shell
- si tu la tapes directement dans zsh, tu ne récolteras qu’une gifle terminale bien méritée

La bonne façon, c’est de l’exécuter dans une conversation OpenClaw :

```text
/acp doctor
```

### Comment lancer réellement une session Codex

```text
/acp spawn codex --mode persistent --thread off
```

### Les pièges typiques

#### Piège 1 : prendre `/acp doctor` pour une commande shell

Erreur simple, propre, presque élégante.

#### Piège 2 : ne configurer que l’agent sans activer `acp` au niveau global

Dans ce cas, évidemment, ça ne va pas se transformer magiquement en Codex.

#### Piège 3 : oublier d’activer `acpx`

Écrire de la config sans installer le plugin, c’est de la bureaucratie sans effet.

#### Piège 4 : permissions trop conservatrices

Si tu choisis `approve-reads`, en général ça veut dire qu’il peut lire, mais pas vraiment modifier quoi que ce soit.

#### Piège 5 : coller directement le texte de la tâche après `/acp spawn`

`/acp spawn` est une commande de lancement, pas une entrée en langage naturel.

## 8. Cette checklist finale de diagnostic t’évitera beaucoup de détours absurdes

Jusqu’ici, on a surtout parlé de la mise en place. La partie suivante répond à une autre question : **pourquoi ça reste instable alors même que tu as suivi les étapes**. Si tu rencontres un problème ensuite, ne pars pas tout de suite du principe qu’il te manque une commande. Bien souvent, le vrai souci ne vient pas d’un “mauvais install”, mais de détails qui sont minés par défaut.

### `pnpm` introuvable dans le daemon

Commence par vérifier si `ProgramArguments` dans le LaunchAgent utilise bien des chemins absolus.

### Échec d’installation d’un module natif

```bash
pnpm approve-builds -g
```

Et vérifie aussi que l’exécution des scripts n’a pas été désactivée.

### Timeout SSH GitHub

Privilégie `ssh.github.com:443`, et vérifie que le port du proxy correspond bien à celui de ta machine locale.

### Dérive d’environnement

Avant chaque session de travail, lance :

```bash
node -v && pnpm -v && openclaw --version
```

### Erreur lors de la mise à jour d’OpenClaw avec le plugin officiel Feishu

Si tu vois :

```text
pnpm add -g openclaw@latest
ENOENT ENOENT: no such file or directory, open '/tmp/feishu-openclaw-plugin-onboard-cli.tgz'
```

fais ceci :

```bash
pnpm rm -g @lark-open/feishu-plugin-onboard-cli
pnpm add -g openclaw@latest
```

### Timeout sur `gateway restart`

Si tu vois quelque chose comme :

```text
Timed out after 60s waiting for gateway port 18789 to become healthy.
Gateway restart timed out after 60s waiting for health checks.
```

vérifie d’abord :

- si le port est déjà occupé ;
- si le LaunchAgent est correctement chargé ;
- si un PATH incomplet empêche le démarrage du daemon ;
- si une mise à jour de plugin a laissé des conflits de configuration.

## 11. Pour finir : qui devrait copier ça tel quel, et qui n’a pas besoin d’aller aussi loin

Si tu es arrivé jusque-là, tu as sans doute déjà remarqué que cet article ne résout pas vraiment “comment installer OpenClaw”, mais plutôt **comment l’installer comme un système capable de tenir dans le temps**.

Ce n’est pas du tout la même chose.

Le premier sujet consiste juste à allumer l’interface. Le second exige de nettoyer le PATH, les daemons, les plugins, le routage, les permissions et le système de mémoire. Et ce sont précisément ces détails-là qui font souffrir.

### Ceux qui devraient copier cet article tel quel

- Tu configures OpenClaw de zéro sur un nouveau Mac
- Tu comptes l’utiliser sur le long terme, pas juste jouer avec deux jours
- Tu vas connecter Feishu, voire déployer plusieurs bots et plusieurs agents
- Tu veux intégrer des capacités avancées comme QMD, ACP ou Codex
- Tu n’as pas envie de déboguer tous les trois jours un “ça marchait hier pourtant”

### Ceux qui ne devraient pas tout copier d’un coup

- Tu veux juste essayer OpenClaw pour voir
- Tu n’as pas encore besoin de Feishu, du multi-agent, de QMD ou d’ACP
- Tu préfères d’abord faire tourner une version minimale viable, puis ajouter les briques une par une

Dans ce cas, mieux vaut commencer par le plus petit cycle fonctionnel :

- Homebrew
- fnm / Node LTS
- pnpm
- OpenClaw
- onboarding de base

Fais déjà tourner ça. Ensuite, tu empiles le reste progressivement. Si tu essaies d’avaler toute la pile d’un coup, tu vas juste t’étouffer.

La vraie difficulté d’OpenClaw n’a jamais été “l’installation”, mais **d’éviter d’en faire un demi-produit qui a l’air de tourner alors qu’il est truffé de mines partout**.

Si tu veux juste l’allumer, n’importe quel tutoriel sur Internet suffira.
Mais si tu veux en faire une infrastructure personnelle stable sur la durée, tu finiras tôt ou tard par revenir à tout ce sale boulot.

Donc plutôt que de reboucher les trous plus tard, autant poser la fondation correctement dès le début.

C’est aussi la partie qui, après cinq réinstallations, m’a paru la plus digne d’être écrite.
