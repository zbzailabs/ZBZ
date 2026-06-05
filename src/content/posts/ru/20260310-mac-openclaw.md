---
title: "После 5 переустановок OpenClaw я наконец-то записал конфигурацию, которую новичкам стоит просто скопировать"
description: "Я пять раз переустанавливал OpenClaw на новом Mac и наконец разобрался, где находятся самые частые ловушки: что в Node, pnpm, SSH, Feishu, мультиагентной схеме, QMD и ACP нужно настроить сразу, а что только выглядит рабочим, но потом неизбежно ломается. В этой статье всё собрано в одном месте."
category: "startup"
tags:
  - "allocation"
  - "strategy"
  - "innovation"
pubDate: 2026-03-10
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260310-mac-openclaw-cover-v2.avif"
heroImageAlt: "Обложка руководства по установке и настройке OpenClaw на новом Mac"
heroImageWidth: 2400
heroImageHeight: 1350
draft: false
featured: false
locale: ru
---

# После 5 переустановок OpenClaw я наконец-то записал конфигурацию, которую новичкам стоит просто скопировать

Я переустанавливал OpenClaw в общей сложности пять раз. И в итоге убедился в одной вещи:

**Новички больше всего теряют не на самой установке, а на бесконечных мучениях с конфигурациями, которые «вроде уже работают», но на деле рано или поздно обязательно взрываются.**

Когда ставишь всё впервые, легко решить, что если интерфейс открылся, а бот умеет отвечать, то дело сделано. Обычно это не так.

Настоящие ловушки прячутся дальше:

- `pnpm` вроде бы установлен, но демон всё равно его не видит;
- бот Feishu вроде бы подключён, но маршрутизация между несколькими агентами на самом деле устроена криво;
- QMD выглядит так, будто синхронизируется автоматически, но в фоне всё это время тихо падает;
- ACP на вид настроен правильно, но coder в реальности вообще не работает через Codex;

Это не «перевод официальной документации» и не руководство из серии «я один раз поставил — теперь научу всех остальных». Это **стартовая схема после пяти переустановок и разбором всех граблей**, которую я собрал на совершенно новом Mac mini.

Она отвечает не на вопрос «как вообще зажечь OpenClaw», а на куда более важный:

> **Как собрать такую среду, которая будет стабильно работать долго, а не просто включится сегодня и развалится завтра.**

## 5 самых частых ловушек, которые я подтвердил после 5 переустановок

Самое ценное — сразу вперёд.

Если тебе нужно понять, почему у стольких людей «вроде всё установлено, а проблемы всё равно не заканчиваются», ответ по сути сводится к этим пяти пунктам:

1. **Если PATH правильный в терминале, это ещё не значит, что он правильный и у демона**  
   То, что `pnpm`, `node` и `qmd` запускаются у тебя в терминале, не значит, что они запустятся и внутри LaunchAgent.

2. **Если инструмент установлен, это ещё не значит, что у OpenClaw есть правильные права для его использования**  
   В некоторых версиях права по умолчанию выставлены слишком консервативно. Если не дописать конфиг, всё выглядит рабочим, но при первом реальном вызове инструмент превращается в полутруп.

3. **Если QMD не ругается ошибкой, это ещё не значит, что он реально синхронизируется**  
   Многие watcher-скрипты умеют очень убедительно делать вид, что всё прошло успешно. Даже после падения они продолжают писать «синхронизация завершена». Это крайне мерзкая ловушка.

4. **Если можно создать несколько агентов, это ещё не значит, что сообщения маршрутизируются правильно**  
   В мультиботовой конфигурации Feishu `accounts` — только начало. По-настоящему маршрут сообщений определяет `bindings`.

5. **Если coder выглядит подключённым к Codex, это ещё не значит, что он реально работает через ACP**  
   Многие заканчивают настройку и думают: «ну всё, должно быть готово». На деле runtime так и не был правильно переключён — просто название выглядит похоже.

Если заранее обойти эти пять ловушек, дальше можно сэкономить как минимум половину бессмысленной возни.

Вся схема ниже как раз выстроена вокруг этих проблем.

## 0. Если уж разводить лобстера (OpenClaw), то лучше на Mac mini

Главные причины, по которым Mac mini — лучший вариант для «разведения лобстера», просты:

### 1. Единая архитектура памяти

Чипы Apple Silicon используют **Unified Memory**, то есть общую память для системы и графики. Если ты собираешься запускать большие языковые модели (LLM) локально — а позже мы будем использовать open-source-модели для поддержки QMD, — то достаточный объём общей памяти является базовым условием нормальной скорости работы.

### 2. Интеграция с экосистемой и удобство автоматизации

Да, облачные провайдеры уже наперебой предлагают облачные схемы для «разведения лобстера», но по сравнению с VPS у Mac mini есть естественные преимущества в ежедневной автоматизации:

- **Обход антибот-защиты:** браузерная автоматизация на локальном домашнем IP гораздо реже определяется сайтами как бот, чем та же автоматизация на IP дата-центра у VPS.

- **Работа с мультимедиа:** обрабатывать локальные файлы, управлять календарями и связывать десктопные приложения вроде Claude Code или Codex заметно проще.

### 3. Порог входа и стабильность

- **Ниже кривая обучения:** для не-разработчика настроить дашборд и разбираться с сетевыми разрешениями на локальном Mac куда понятнее, чем ковыряться с сетевой средой на VPS.
- **Тихий и энергоэффективный:** Mac mini маленький, почти бесшумный и потребляет мало энергии — идеальная машина для круглосуточного «сервера-лобстера».

## 1. Сначала укрепи фундамент: командная строка и пакетный менеджмент

### Версия системы

Получив Mac mini, сначала обнови macOS до последней версии Tahoe. И включи автоматические обновления.

- ✅Настройки системы → Основные → Обновление ПО → Автообновления

### Питание

В разделе **Настройки системы → Энергия** на Mac mini рекомендуется включить все три переключателя ниже:

- ✅Не переводить компьютер в сон при выключенном дисплее
- ✅Пробуждать для сетевого доступа
- ✅Автоматически включать после сбоя питания

Иначе машина будет стоять дома, а при удалённом доступе OpenClaw легко окажется в состоянии «тело вроде здесь, а душа уже ушла». Feishu его после этого не разбудит.

### Установи Tailscale

Tailscale безопасно связывает устройства из разных сетевых сред — дома, в офисе, на телефоне — в одну виртуальную локальную сеть. Если ты окажешься далеко, а OpenClaw внезапно повиснет, можно будет зайти на эту машину через другое устройство с Tailscale и экранным доступом.

сама настройка Tailscale довольно простая. Главное — не забыть вот это:

- ✅включить вход при запуске,
- ✅на Mac mini в Настройки системы → Основные → Общий доступ включить доступ к экрану.
- ✅записать виртуальный Tailscale-адрес Mac mini

### Установи Xcode Command Line Tools

Xcode Command Line Tools — это официальный низкоуровневый набор разработчика от Apple. Он добавляет в macOS базовые UNIX-инструменты, которых по умолчанию может не хватать: `git`, `make`, компилятор `clang` и так далее. Это фундамент всей среды разработки на Mac и обязательная база для последующей сборки исходников и работы продвинутых пакетных менеджеров.

```bash
xcode-select --install
# Или просто ввести в терминале “git” — Xcode Command Line Tools установятся автоматически
```

### Установи Homebrew

Homebrew — фактически стандартный пакетный менеджер на macOS. Он позволяет через несколько коротких команд ставить, обновлять и удалять самые разные инструменты и зависимости. В фоне он сам разруливает сложные зависимости и управляет системными симлинками, избавляя тебя от ручного скачивания установщиков и возни с путями.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Настрой переменные окружения Homebrew**

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

## 2. Жёстко зафиксируй среду Node

pnpm использует **content-addressable storage (CAS)** и **жёсткие ссылки**, чтобы одна и та же версия зависимости физически хранилась на диске только в одном экземпляре. Это экономит SSD и ускоряет установку. Ещё важнее другое: строгая **древовидная структура симлинков** в pnpm убирает проблему «призрачных зависимостей», которую порождает плоская раскладка npm. Код может обращаться только к тем пакетам, которые явно объявлены в `package.json`. Поэтому я рекомендую именно **pnpm**, а не npm.

### Установи fnm и включи автоматическое переключение

Используй `fnm`, менеджер версий на Rust. Он позволяет быстро, бесшовно и автоматически переключаться между версиями Node.js в разных проектах, не устраивая глобальный конфликт версий.

```bash
brew install fnm
echo 'eval "$(fnm env --use-on-cd --shell zsh)"' >> ~/.zshrc
source ~/.zshrc
```

### Установи Node LTS и сделай её версией по умолчанию

Закрепить Long-Term Support-версию Node.js как глобальный стандарт — значит обеспечить максимальную стабильность и для низкоуровневых демонов вроде `launchd`, и для ежедневной разработки.

```bash
fnm install --lts
fnm default lts-latest
```

### Включи Corepack и активируй pnpm

Corepack встроен прямо в Node.js и позволяет обойти старую громоздкую схему, когда пакетные менеджеры ставятся глобально через npm. Это самый чистый, официальный и контролируемый способ активировать и держать под контролем среду `pnpm`.

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### Проверь ключевые пути бинарников

```bash
which node
which pnpm
node -v
pnpm -v
```

Неитерактивные среды вроде `launchd` зависят от абсолютных путей. Когда позже будешь писать LaunchAgent, используй именно те пути, которые вернул `which`.

### Инициализация pnpm и настройка алиасов

Выполни системную инициализацию и жёстко поставь shell-алиасы как ограничитель от случайного использования npm или yarn. Если ты хочешь, чтобы `pnpm` корректно управлял глобальными бинарниками и заставил тебя жить в режиме **pnpm-only**, сначала запусти `pnpm setup`, а затем добавь более строгую конфигурацию `.zshrc`.

#### Шаги

1. Сначала выполни:

```bash
pnpm setup
```

2. Потом добавь этот блок в `~/.zshrc`:

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

3. Примени изменения:

```bash
source ~/.zshrc
```

## 3. Настрой GitHub

Можно просто следовать официальной инструкции GitHub: [Generating a new SSH key and adding it to the ssh-agent](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent).

Перед генерацией SSH-ключа сначала задай глобальную идентичность Git, иначе история коммитов будет выглядеть довольно жалко.

```bash
git config --global user.name "your_name"
git config --global user.email "your_email@example.com"
```

### Сначала убедись, что используешь системный SSH

```bash
which ssh
# Ожидается: /usr/bin/ssh
```

### Сгенерируй ключ

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

### Настрой `~/.ssh/config`

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

Если локального прокси у тебя нет, просто удали строку `ProxyCommand`.

### Залей публичный ключ и проверь подключение

```bash
pbcopy < ~/.ssh/id_ed25519.pub
ssh -T git@github.com
```

## 4. Подними OpenClaw

### Подготовь большие модели

OpenClaw нужны большие модели для выполнения задач. Чем сильнее модель, тем сильнее сам OpenClaw. Сначала лучше использовать закрытые модели вроде ChatGPT и Gemini, но подойдут и open-source-варианты вроде Kimi или Qwen. Если выбираешь ChatGPT или Gemini, сначала поставь Codex CLI или Gemini CLI, а потом подключи их к OpenClaw через OAuth.

```bash
## 安装
brew install codex
brew install gemini-cli
## 登录
codex
gemini
```

### Установи OpenClaw

```bash
# 全局安装最新版本的 openclaw 命令行工具
pnpm add -g openclaw@latest

# 授权全局包运行其安装所需的脚本（pnpm 安全白名单）
pnpm approve-builds -g

# 执行引导程序并为 openclaw 安装后台守护进程（实现自启动）
openclaw onboard --install-daemon
```

Дальше просто заверши установку по шагам из onboarding.

### Критические настройки после первого запуска

- Первый раз открывай OpenClaw в браузере по ссылке с токеном, которую вернул onboarding.
- Потом можно заходить по адресу: `http://127.0.0.1:18789/`

### Настрой автообновления

Если хочешь, чтобы OpenClaw обновлялся сам, добавь в конфиг это:

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

Можно и дальше обновлять вручную:

```bash
pnpm add -g openclaw@latest
```

### Рекомендуемая конфигурация fallback-моделей

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

### Сделай OpenClaw более человечным

Если хочешь, чтобы OpenClaw разговаривал как человек, а не пах типичным ИИ-шным канцеляритом, можно отправить ему следующий текст и попросить переписать `SOUL.md`.

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

5. Поставь права инструментов в правильное место

Если у нового агента по умолчанию инструменты вызываются криво, можно добавить в `openclaw.json` вот это:

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

## 5. Подключи официальный плагин Feishu

Feishu уже выпустил [официальный плагин OpenClaw для Feishu](https://bytedance.larkoffice.com/docx/MFK7dDFLFoVlOGxWCv5cTXKmnMh). По сравнению со сторонними плагинами у него шире права, выше стабильность и лучше интеграция с экосистемой Feishu. Если Feishu (Lark) и так является для тебя главным каналом взаимодействия с OpenClaw, разумнее сразу идти в официальный вариант.

P.S. Личный аккаунт Feishu не умеет работать с ботами Feishu. Для этого нужен корпоративный аккаунт с доступом к открытому платформенному кабинету. Зайди в [Feishu Open Platform](https://open.feishu.cn/) и проверь, можешь ли ты вообще создать бота.

### Авторизация

После настройки по официальной документации отправь боту в клиенте Feishu сообщение: **我想授予所有用户权限**. Так ты выдашь нужные разрешения Feishu.

### Обновление плагина

Плагин Feishu только появился и очень быстро меняется, так что обновлять его надо регулярно.

```bash
npx -y https://sf3-cn.feishucdn.com/obj/open-platform-opendoc/879b06f872058309ef70f49bcd38a71f_Pr8pNIJ9J9.tgz update
```

### Включи потоковый вывод

```bash
openclaw config set channels.feishu.streaming true
openclaw config set channels.feishu.footer.status true
```

### Разреши ответы в группе без обязательного @

```json
{
  "channels": {
    "feishu": {
      "requireMention": false
    }
  }
}
```

### Режим тредов

Если хочешь, чтобы у бота был отдельный контекст внутри групп с тредами и чтобы он поддерживал параллельные задачи:

```bash
openclaw config set channels.feishu.threadSession true
```

### Несколько агентов — несколько Feishu-ботов

Если тебе нужны несколько агентов (`main / coach / secretary / ...`) и у каждого должен быть свой отдельный Feishu-app, используй `bindings` для жёсткой маршрутизации: `feishu + accountId -> конкретный agent`

#### Добавь агента

```bash
openclaw agents add coach
```

Если нужны и другие агенты, можно так:

```bash
openclaw agents add <agentId> --workspace ~/.openclaw/workspace-<agentId>
```

#### Переведи Feishu с одноаккаунтной структуры на многоаккаунтную

Изначально у тебя может быть так:

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

А должно стать так:

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

#### Настрой `bindings` (это главное)

```json
[
  { "agentId": "main", "match": { "channel": "feishu", "accountId": "main" } },
  { "agentId": "coach", "match": { "channel": "feishu", "accountId": "coach" } }
]
```

#### Перезапусти gateway, чтобы конфиг применился

```bash
openclaw gateway restart
```

#### Проверь маршрутизацию

```bash
openclaw channels status
openclaw agents bindings
openclaw status --deep
```

#### Типичные ловушки в режиме «мультиагенты + несколько Feishu-ботов»

- **Ловушка 1: настроил только `accounts`, но не настроил `bindings`**

Итог: сообщения по-прежнему летят куда попало.

- **Ловушка 2: имена `accountId` не совпадают**

Например, у тебя есть `accounts.coach`, а в binding написано `coaching`. Ошибка тупая, но встречается постоянно.

- Ловушка 3: остались старые поля одноаккаунтного режима `appId / appSecret`

В мультиаккаунтном режиме всё должно лежать под `channels.feishu.accounts.*`. Не смешивай обе схемы.

- **Ловушка 4: Feishu-приложение не опубликовано или права не вступили в силу**

Конфигурация правильная, но бот не отвечает. Очень часто причина банальна: ты не выпустил новую версию приложения в панели Feishu. После изменения настроек бота не забудь опубликовать версию и отправить её на проверку.

## 6. Настрой локальную систему памяти QMD

Стандартная память OpenClaw довольно ленивая. Она часто забывает контекст и повторяющиеся действия, которые выполняла ещё вчера. Если хочешь дать OpenClaw **локальную, дружелюбную к китайскому языку и общую для нескольких workspace** систему памяти, QMD — очень практичный вариант. **qmd (Query Markup Documents)** — это **небольшой CLI-поисковик**, предназначенный для локальных документов, баз знаний и заметок встреч.

Судя по предоставленному тобой описанию, **qmd (Query Markup Documents)** — это **небольшой CLI-поисковик**, специально созданный для локальных документов, баз знаний и заметок совещаний.

Он особенно хорошо подходит для **OpenClaw** и других агентных AI-процессов по нескольким причинам:

**Форматы вывода, удобные для агентов:** qmd поддерживает режимы `--json` и `--files`. Благодаря этому агент может легко разобрать результаты поиска и получить структурированные данные — ID документа, путь, оценку релевантности и так далее, чтобы точнее решить, какие файлы подгружать в контекст.

**Качественная гибридная поисковая архитектура:** чтобы LLM получала максимально релевантный контекст, qmd использует современный конвейер поиска:

- **BM25 полнотекстовый поиск:** быстрое совпадение по ключевым словам.
- **Векторный семантический поиск:** понимает намерение пользователя через модель `embeddinggemma`.
- **Query Expansion:** расширяет исходный запрос с помощью специально дообученной модели `qmd-query-expansion`, чтобы повысить полноту выдачи.
- **Reranking:** использует `qwen3-reranker`, чтобы заново оценить первые 30 кандидатов и поднять самые релевантные документы наверх.

**Функция «дерева контекста» (Context Management):** одна из главных фишек qmd. Для разных папок и коллекций можно задавать поясняющий контекст.

> Например, добавить папке `~/notes` контекст «личные мысли». Когда агент найдёт документ из этой директории, qmd вернёт и это пояснение, помогая LLM лучше понять происхождение и назначение документа.

**Полностью локальная работа и поддержка MCP:** все модели — эмбеддинги, реранкер и расширение запросов — работают локально через `node-llama-cpp`, без сетевого доступа, поэтому приватные документы не покидают машину. Плюс qmd поддерживает [Model Context Protocol (MCP)](https://github.com/tobi/qmd#mcp-server), а значит, может напрямую подключаться к MCP-совместимым клиентам вроде Claude Desktop или Claude Code.

### Ключевая логика конфигурации

- Векторный backend: QMD (Query Markup Documents)
- Усиление для китайского языка: `Qwen3-Embedding-0.6B-Q8_0.gguf`
- Автосинхронизация: `fswatch` отслеживает изменения Markdown-файлов
- Общая память для нескольких workspace: через `memory.qmd.paths`

### Шаг 1: Установи зависимости

```bash
brew install sqlite fswatch
pnpm add -g @tobilu/qmd
qmd --version
which qmd
```

Если `qmd` не находится, проверь, что PATH включает:

```bash
/Users/a66/Library/pnpm
```

Можно добавить это в `~/.zshrc`:

```bash
export PATH="/Users/a66/Library/pnpm:$PATH"
source ~/.zshrc
```

### Шаг 2: Скачай китайскую embedding-модель Qwen3

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

### Шаг 3: Сначала добейся, чтобы сам QMD работал

Не спеши подключать watcher. Сначала убедись, что сам QMD запускается нормально:

```bash
qmd update
qmd embed
```

### Самая частая ловушка: `better-sqlite3` / несовпадение Node ABI

Если видишь ошибку вроде:

```text
better_sqlite3.node was compiled against a different Node.js version
```

значит версия Node изменилась, а нативный модуль не был пересобран.

Чинится так:

```bash
cd /Users/a66/Library/pnpm/global/5/.pnpm/better-sqlite3@11.10.0/node_modules/better-sqlite3
npm rebuild better-sqlite3
```

Потом тестируем заново:

```bash
qmd update
qmd embed
```

Если видишь вывод:

```text
✓ All collections updated.
✓ All content hashes already have embeddings.
```

значит всё снова в порядке.

### Шаг 4: Разверни сервис синхронизации в реальном времени (исправленная версия)

Можно использовать вот эту версию: с логами, debounce и блокировкой единственного экземпляра.

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
  printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S %Z')" "$*" >> "$LOG_FILE"
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

### Шаг 5: Настрой LaunchAgent

Создай:

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

Загрузи сервис:

```bash
launchctl load ~/Library/LaunchAgents/com.a66.openclaw.qmdsync.plist
```

Если старая версия уже есть, лучше перезагрузить:

```bash
launchctl unload ~/Library/LaunchAgents/com.a66.openclaw.qmdsync.plist 2>/dev/null || true
launchctl load ~/Library/LaunchAgents/com.a66.openclaw.qmdsync.plist
launchctl kickstart -k gui/$(id -u)/com.a66.openclaw.qmdsync
```

### Шаг 6: Убедись, что watcher реально работает

```bash
launchctl print gui/$(id -u)/com.a66.openclaw.qmdsync
ps aux | grep -i '[q]md-watch-sync\|[f]swatch'
```

Сделай настоящее тестовое изменение:

```bash
echo "<!-- qmd healthcheck -->" >> ~/.openclaw/workspace/HEARTBEAT.md
sleep 5
tail -n 30 ~/.openclaw/qmd-sync.log
```

### Шаг 7: Конфигурация QMD внутри OpenClaw

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

## 7. Настрой ACP

Если ты хочешь, чтобы какой-то агент внутри OpenClaw был напрямую подключён к внешнему coding-harness вроде **Codex**, а не работал только через встроенный sub-agent-механизм OpenClaw, тебе нужен **ACP**.

### Что такое ACP и почему не sub-agent

Sub-agent хорошо подходит для нативной делегации внутри OpenClaw, внутреннего разбиения задач и обычного взаимодействия агентов. ACP (Agent Client Protocol) нужен для передачи задач внешним harness-средам вроде Codex или Gemini CLI.

### Целевая архитектура, которую мы хотим получить

- Главный конфиг OpenClaw: `~/.openclaw/openclaw.json`
- Канал сообщений: Feishu
- Отдельный аккаунт Feishu-бота: `coder`
- ID агента в OpenClaw тоже: `coder`
- runtime `coder` переключается на ACP
- ACP backend — `acpx`
- Стандартный harness — `codex`
- Политика прав — **approve-all**

### Верхнеуровневая конфигурация ACP

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

### Установи и включи плагин acpx

```bash
openclaw plugins install acpx
```

### Включи acpx в `plugins` и задай полностью автоматические права

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

### Переключи агента `coder` на ACP + Codex

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

### Привязку Feishu не меняй

```json
{
  "agentId": "coder",
  "match": {
    "channel": "feishu",
    "accountId": "coder"
  }
}
```

### Примени конфиг и перезапусти gateway

```bash
openclaw gateway restart
```

### Как проверить, что ACP реально включился

Важно:

- `/acp doctor` — это **slash-команда внутри диалога OpenClaw**
- это не shell-команда
- не надо бездумно вводить её в zsh, если не хочешь получить пощёчину от терминала

Правильный способ — выполнить её внутри чата OpenClaw:

```text
/acp doctor
```

### Как реально запустить сессию Codex

```text
/acp spawn codex --mode persistent --thread off
```

### Типичные ловушки

#### Ловушка 1: воспринимать `/acp doctor` как shell-команду

Прекрасно простая ошибка.

#### Ловушка 2: настроить агента, но не включить верхнеуровневый `acp`

Тогда, разумеется, оно само собой магически не превратится в Codex.

#### Ловушка 3: забыть включить `acpx`

Если ты просто написал конфиг, но не поставил и не включил плагин, это театр на бумаге.

#### Ловушка 4: слишком консервативные права

Если стоит `approve-reads`, то обычно это значит: читать может, реально менять — нет.

#### Ловушка 5: писать текст задачи прямо после `/acp spawn`

`/acp spawn` — команда запуска, а не интерфейс естественного языка.

## 8. Этот финальный чеклист поможет не тратить кучу времени впустую

Выше речь шла о том, **как** всё собрать. А этот раздел — о том, **почему даже при выполнении всех шагов система всё равно может не работать стабильно**. Если потом появятся проблемы, не спеши думать, что ты где-то не ввёл одну команду. Чаще беда не в том, что ты «не умеешь ставить», а в том, что в этих деталях мины заложены по умолчанию.

### `pnpm` не находится внутри демона

В первую очередь проверь, используются ли абсолютные пути в `ProgramArguments` у LaunchAgent.

### Не ставятся нативные модули

```bash
pnpm approve-builds -g
```

И заодно проверь, что выполнение скриптов не запрещено.

### Таймаут GitHub SSH

Лучше использовать `ssh.github.com:443` и убедиться, что порт прокси совпадает с локальной машиной.

### Дрейф окружения

Перед каждой рабочей сессией запускай:

```bash
node -v && pnpm -v && openclaw --version
```

### Ошибка при обновлении OpenClaw с официальным плагином Feishu

Если видишь такое:

```text
pnpm add -g openclaw@latest
ENOENT ENOENT: no such file or directory, open '/tmp/feishu-openclaw-plugin-onboard-cli.tgz'
```

исправляется это так:

```bash
pnpm rm -g @lark-open/feishu-plugin-onboard-cli
pnpm add -g openclaw@latest
```

### Таймаут на `gateway restart`

Если появляется что-то вроде:

```text
Timed out after 60s waiting for gateway port 18789 to become healthy.
Gateway restart timed out after 60s waiting for health checks.
```

проверь в первую очередь:

- не занят ли уже порт
- корректно ли загружен LaunchAgent
- не развалился ли запуск демона из-за отсутствующих путей в PATH
- не остались ли после обновления плагина конфликтующие хвосты старой конфигурации

## 11. И напоследок: кому стоит просто копировать всё целиком, а кому — нет

Если ты дочитал до этого места, то наверняка уже заметил: эта статья на самом деле решает не проблему «как установить OpenClaw», а вопрос, **как установить его как систему, которая будет работать в долгую**.

Это две очень разные задачи.

Для первого достаточно просто зажечь интерфейс. Для второго нужно привести в порядок PATH, демоны, плагины, маршрутизацию, права и систему памяти. И именно эта вторая часть обычно и выматывает людей сильнее всего.

### Кому стоит прямо брать и копировать эту статью

- ты настраиваешь OpenClaw с нуля на новом Mac
- ты собираешься пользоваться им долго, а не просто поиграться пару дней
- ты будешь подключать Feishu, а возможно и несколько ботов с несколькими агентами
- ты хочешь подключить продвинутые возможности вроде QMD, ACP и Codex
- ты не хочешь потом каждые несколько дней чинить «вчера же всё работало, что опять сломалось»

### Кому не стоит с первого дня копировать всё настолько полно

- ты просто хочешь сначала попробовать OpenClaw
- тебе пока не нужны Feishu, multi-agent, QMD и ACP
- ты хочешь сначала поднять минимально рабочую версию, а потом постепенно навешивать возможности

В таком случае лучше идти по минимальному контуру:

- Homebrew
- fnm / Node LTS
- pnpm
- OpenClaw
- базовый onboarding

Сначала доведи это до рабочего состояния, а потом уже наращивай сверху. Если пытаться проглотить всё сразу, в итоге просто подавишься.

По-настоящему сложное в OpenClaw — это никогда не сама «установка». Сложность в том, **чтобы не превратить его в наполовину готовую систему, которая выглядит рабочей, но под завязку набита скрытыми минами**.

Если тебе нужно просто зажечь его, почти любой туториал из интернета подойдёт.
Но если ты хочешь превратить OpenClaw в личную инфраструктуру, которая будет стабильно работать долго, рано или поздно ты всё равно вернёшься к этой грязной работе.

Так что лучше сразу ровно залить фундамент, чем потом бесконечно латать дыры.

Именно это после пяти переустановок показалось мне самым достойным того, чтобы записать.
