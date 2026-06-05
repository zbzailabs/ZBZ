---
title: "重装 5 次 OpenClaw 后，我把新手最该抄的配置全写出来了"
description: "我把 OpenClaw 在新 Mac 上重装了 5 次，终于把最容易踩的坑摸清了：Node、pnpm、SSH、Feishu、多 Agent、QMD、ACP 哪些必须先配，哪些看起来能用其实迟早会炸，这篇一次写透。"
category: "startup"
tags:
  - "allocation"
  - "strategy"
  - "innovation"
pubDate: 2026-03-10
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260310-mac-openclaw-cover-v2.avif"
heroImageAlt: "新 Mac 上的 OpenClaw 配置与安装指南封面图"
heroImageWidth: 2400
heroImageHeight: 1350
draft: false
featured: false
locale: zh
---

# 重装 5 次 OpenClaw 后，我把新手最该抄的配置全写出来了

我前后重装了 5 次 OpenClaw，最后确认了一件事：

**新手最容易浪费的，不是安装本身的时间，而是被一堆“看起来已经跑起来、实际上迟早会炸”的配置反复折磨。**

第一次装的时候，你会觉得只要界面能打开、机器人能回话，就算成功了。真相通常不是这样。

真正的坑往往藏在后面：

- `pnpm` 明明装好了，但守护进程里就是找不到；
- Feishu bot 明明接上了，但多 Agent 路由其实是乱的；
- QMD 看起来在自动同步，实际上一直 silently fail；
- ACP 配置看着没问题，但 coder 根本没真正跑到 Codex；

这篇不是“官方文档翻译版”，也不是“我装了一次就来教别人”的教程。这是我在一台全新 Mac mini 上，重装 5 次 OpenClaw 后，整理出来的一份**踩坑复盘版开局方案**。

它解决的不是“怎么把 OpenClaw 点亮”，而是另一件更重要的事：

> **怎么把它配成一套能长期稳定运行，而不是今天能亮、明天就炸的环境。**

## 我重装 5 次后确认的 5 个高频坑

先把最值钱的部分放前面。

如果你只想知道为什么很多人“明明装好了，还是一直出问题”，答案基本都在这 5 条里：

1. **PATH 对了，不代表守护进程的 PATH 也对**  
   你在终端能跑 `pnpm`、`node`、`qmd`，不代表 LaunchAgent 里也能跑。

2. **工具装上了，不代表 OpenClaw 的工具权限是对的**  
   有些版本默认权限更保守，不补配置，看起来像能用，实际一调用就半残。

3. **QMD 不报错，不代表它真的在同步**  
   很多 watcher 脚本只会假装成功，失败了也照样写“同步完成”。这很坑。

4. **多 Agent 能创建，不代表消息一定路由正确**  
   Feishu 多 bot 配置里，`accounts` 只是开始，真正决定消息去向的是 `bindings`。

5. **coder 看起来接了 Codex，不代表它真的跑在 ACP 上**  
   很多人配完觉得“应该好了”，其实 runtime 根本没切对，只是名字像而已。

提前避开这 5 个坑，后面至少能少掉一半无效折腾。

下面这份配置，就是围绕这几个坑整理出来的。

## 0. 养龙虾（OpenClaw），优选Mac mini

“养龙虾”优选 Mac mini 的核心原因如下：

### 1. 统一内存架构

Mac 的 Apple Silicon 芯片采用**统一内存架构（Unified Memory）**，系统内存与显存共享。对于运行大型语言模型（LLM）进行本地推理（后面会用开源模型支持 QMD），足够的显存是获取合理运行速度的基础条件。

### 2. 生态集成与自动化便利性

虽然云厂商纷纷推出了云端养龙虾方案，但相比于 VPS，Mac mini 在处理日常任务自动化时具有天然优势：

- **绕过检测：** 在本地住宅 IP 上运行浏览器自动化，被网站识别为“机器人”的概率比数据中心 IP（VPS）更低。

- **多媒体处理：** 处理本地文件、管理日历、集成桌面版应用（如 Claude Code/Codex）更加简单。

### 3. 使用门槛与稳定性

- **低学习曲线：** 对于非开发者，在本地 Mac 上设置仪表板和排查网络权限问题，比在 VPS 上处理复杂的网络环境要直观得多。
- **静音与能效：** Mac mini 体积小、功耗极低且运行安静，非常适合作为 7x24 小时运行的“龙虾服务器”。

## 1. 先把系统地基打稳：命令行与包管理

### 系统版本

拿到 Mac mini 先把macOS 升级到最新 Tahoe 版本。并开启自动更新。

- ✅系统设置-通用-软件更新-自动更新

### 电源设置

Mac mini 在 **系统设置 → 能耗** 里，建议把下面三个开关都打开：

- ✅显示器关闭时，防止自动进入睡眠
- ✅唤醒以供网络访问
- ✅断电后自动启动

不然你把机器放家里远程用时，OpenClaw 很容易“人还在，魂没了”。飞书无法唤醒。

### 安装 Tailscale

Tailscale可将处于不同网络环境（如家里、公司、手机）的设备安全地连接到同一个虚拟局域网中。当你远在千里之外，OpenClaw 又挂掉时，就可以通过另一台设备上的 tailscale+屏幕共享，访问OpenClaw 所在设备。

tailscale 的设置比较简单，重点是

- ✅设置开机登录，
- ✅在 Mac mini 在系统设置-通用-共享中开启屏幕共享。
- ✅记下 Mac mini 的虚拟 tailscale

### 安装 Xcode Command Line Tools

Xcode Command Line Tools 是一套苹果官方提供的底层开发包，补充了 macOS 默认未预装的 `git`、`make` 和 `clang` 编译器等核心 UNIX 工具链。它是整个 Mac 开发环境的基石，为你后续编译源码或运行高级包管理器提供不可或缺的底层构建能力。

```bash
xcode-select --install
# 或者在终端输入“git”，会自动安装 Xcode Command Line Tools
```

### 安装 Homebrew

Homebrew 是 macOS 事实上的标准包管理器，能让你通过极简的终端命令自动化地安装、更新和卸载各类开发软件及依赖库。它在后台智能处理复杂的软件依赖关系并统一管理系统软链接，彻底免除了手动下载安装包和配置底层路径的繁琐工作。

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**配置 Homebrew 环境变量**

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

## 2.定死 Node 环境钉死

pnpm 通过 **基于内容的存储 (CAS)** 技术，利用 **硬链接** 确保同版本的依赖包在全局物理磁盘上仅存一份，极大地节省了 Mac 的 SSD 空间并提升了安装速度；而且pnpm 通过严谨的 **树状软链接结构** 彻底杜绝了 npm 扁平化布局带来的“幽灵依赖”问题，强制要求代码只能访问在 `package.json` 中明确声明的包，从而在底层保障了项目的构建安全与环境纯净。因此建议选择 **pnpm** 而非 npm作为包管理工具。

### 安装 fnm 并启用自动切换

使用基于 Rust 构建的 `fnm` 作为版本管理器，能让你在不同项目间实现 Node.js 环境的无缝、极速且自动化的切换，彻底告别全局版本冲突。

```bash
brew install fnm
echo 'eval "$(fnm env --use-on-cd --shell zsh)"' >> ~/.zshrc
source ~/.zshrc
```

### 安装 Node LTS 并设为默认

锁定 Node.js 的长期支持版（LTS）作为全局默认环境，是确保底层守护进程（如 `launchd`）与日常开发业务始终享有最高稳定性。

```bash
fnm install --lts
fnm default lts-latest
```

### 启用 Corepack 并激活 pnpm

启用 Node.js 原生内置的 Corepack，旨在完全绕过传统 npm 全局安装的冗余机制，以最纯净、官方且可锁定的方式直接激活并接管 `pnpm` 环境。

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### 验证关键二进制路径

```bash
which node
which pnpm
node -v
pnpm -v
```

`launchd` 等非交互环境依赖绝对路径。后续写 LaunchAgent 时，直接使用上面 `which` 的结果。

### pnpm 初始化与别名配置

执行系统级初始化并部署严格的 Shell 别名拦截，通过强约束机制彻底阻断误用 npm/yarn 的风险。为了让 `pnpm` 能全局管理二进制文件，并强制自己形成 **pnpm-only** 的习惯，可以执行 `pnpm setup`，再补一份更严格的 `.zshrc` 配置。

#### 操作步骤

1. 先执行：

```bash
pnpm setup
```

2. 再把下面这段加入 `~/.zshrc`：

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

3. 生效：

```bash
source ~/.zshrc
```

## 3.  配置 Github

可根据Github官方文档[Generating a new SSH key and adding it to the ssh-agent](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)执行。

在生成 SSH 密钥之前，先配置 Git 的全局身份信息，不然提交记录会很丑。

```bash
git config --global user.name "your_name"
git config --global user.email "your_email@example.com"
```

### 先确认使用系统 SSH

```bash
which ssh
# 预期：/usr/bin/ssh
```

### 生成密钥

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

### 配置 `~/.ssh/config`

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

如果你没有本地代理，删除 `ProxyCommand` 那一行即可。

### 上传公钥并验证

```bash
pbcopy < ~/.ssh/id_ed25519.pub
ssh -T git@github.com
```



## 4. 把 OpenClaw 跑起来

### 准备大模型

OpenClaw需要调用大模型执行任务，模型能力越强，OpenClaw越强，可以优先ChatGPT，Gemini等闭源模型或则kimi，qwen等开源模型。如果选择ChatGPT，Gemini，可先安装codex cli, geimini cli，然后等个 OAuth 方法绑定到 OpenClaw。

```bash
## 安装
brew install codex
brew install gemini-cli
## 登录
codex
gemini
```

### 安装 OpenClaw

```bash
# 全局安装最新版本的 openclaw 命令行工具
pnpm add -g openclaw@latest

# 授权全局包运行其安装所需的脚本（pnpm 安全白名单）
pnpm approve-builds -g

# 执行引导程序并为 openclaw 安装后台守护进程（实现自启动）
openclaw onboard --install-daemon
```

根据安装引导完成安装。

### 首次启动后的关键设置

- 初次在浏览器打OpenClaw：使用 onboarding 返回的带 token 链接访问。
- 后续可通过：`http://127.0.0.1:18789/`访问OpenClaw

### 自动更新配置

如果你想让 OpenClaw 自动更新，可以在配置里加上：

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

也可以继续用手动升级：

```bash
pnpm add -g openclaw@latest
```

### 建议配置模型 fallback

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

### OpenClaw 人格化

如果你想让 OpenClaw 说人话，而不是一股 AI 味儿，可以把下面这段文字发他，让它帮你重写 `SOUL.md`。

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

5. 放对工具权限

如果发现新 agent 工具默认调用不正常，可以在 `openclaw.json` 里加上：

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

## 5. 接入飞书官方插件

飞书官方已经出了 [OpenClaw 飞书官方插件](https://bytedance.larkoffice.com/docx/MFK7dDFLFoVlOGxWCv5cTXKmnMh)。相比第三方插件，它权限更全，性能更稳，和飞书生态集成更顺。如果你本来就用飞书（Lark）作为 OpenClaw 的主交互入口，建议直接上官方方案。

ps：个人飞书账号没有飞书 bot功能，企业认账账号才能使用飞书开放平台配置飞书机器人。可登录[飞书开放平台](https://open.feishu.cn/)，检查自己是否能创建飞书机器人。


### 授权

按官方文档完成配置后，在飞书客户端给机器人发送：**我想授予所有用户权限**获取飞书权限。

### 插件更新

飞书插件刚上线，迭代非常快，记得日常更新

```bash
npx -y https://sf3-cn.feishucdn.com/obj/open-platform-opendoc/879b06f872058309ef70f49bcd38a71f_Pr8pNIJ9J9.tgz update
```



### 开启流式输出

```bash
openclaw config set channels.feishu.streaming true
openclaw config set channels.feishu.footer.status true
```

### 设置群内免 @ 直接回复

```json
{
  "channels": {
    "feishu": {
      "requireMention": false
    }
  }
}
```

### 话题模式

如果你希望机器人在话题群里拥有独立上下文，并支持多任务并行：

```bash
openclaw config set channels.feishu.threadSession true
```

### 多 agent 对应多飞书机器人

如果需要多个 agent（main / coach / secretary / ...），并且每个 agent 对应 1 个独立飞书应用，可通过 `bindings` 做确定性路由：`feishu + accountId -> 指定 agent`

#### 添加 agent

```bash
openclaw agents add coach
```

如果缺其他 agent，也可以：

```bash
openclaw agents add <agentId> --workspace ~/.openclaw/workspace-<agentId>
```

#### 把飞书从单账号改成多账号结构

原来可能是这样：

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

升级成这样：

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

#### 配置 bindings（核心）

```json
[
  { "agentId": "main", "match": { "channel": "feishu", "accountId": "main" } },
  { "agentId": "coach", "match": { "channel": "feishu", "accountId": "coach" } }
]
```

#### 重启网关生效

```bash
openclaw gateway restart
```

#### 验证路由

```bash
openclaw channels status
openclaw agents bindings
openclaw status --deep
```

#### 多agent+多飞书机器人模式常见坑

- **坑 1：只配了 `accounts`，没配 `bindings`**

结果：消息还在乱跑。

- **坑 2：`accountId` 名字不一致**

例如 `accounts.coach`，但 binding 里写成 `coaching`。这种错很蠢，但特别常见。

- 坑 3：还残留旧单账号 `appId / appSecret`

多账号模式下，请统一写在 `channels.feishu.accounts.*` 里，不要混用。

- **坑 4：飞书应用没发布或权限没生效**

配置没错，但 bot 就是不回消息。大概率是你飞书后台没发版。记得更新飞书bot 配置后，点击发布版本并审核。

## 6. 配置 QMD 本地记忆系统

OpenClaw 的默认记忆系统比较懒，经常忘记上下文，忘记昨天刚执行过的重复动作，如果想让 OpenClaw 拥有一套 **本地、中文友好、多工作区共享** 的记忆系统，QMD 是个很实用的方案。**qmd (Query Markup Documents)** 是一个专为本地文档、知识库和会议记录设计的 **小型 CLI 搜索引擎**。

根据您提供的网页内容，**qmd (Query Markup Documents)** 是一个专为本地文档、知识库和会议记录设计的 **小型 CLI 搜索引擎**。

它之所以被认为非常适合像 **OpenClaw** 或其他 AI Agent（智能体）流程，主要归功于以下核心特性：

**专为 Agent 设计的输出格式**：qmd 提供原生的 `--json` 和 `--files` 输出模式。这使得 AI Agent 能够轻松解析搜索结果，获取结构化的数据（如文档 ID、路径、匹配分值等），从而更精准地决定后续调用哪些文件作为上下文。

**高质量的混合搜索架构**：为了让 LLM（大语言模型）获得最相关的上下文，qmd 采用了 SOTA（当前业界领先）的搜索流水线：

- **BM25 全文检索**：快速匹配关键词。
- **向量语义搜索**：基于 `embeddinggemma` 模型理解用户意图。
- **查询扩展（Query Expansion）**：使用专门微调的 `qmd-query-expansion` 模型将原始问题扩展，提高召回率。
- **重排序（Reranking）**：利用 `qwen3-reranker` 对初步筛选的 30 个候选文档进行二次打分，确保最相关的排在最前面。

**“上下文树” 功能 (Context Management)**：这是 qmd 的一大特色。你可以为不同的文件夹或集合添加描述性文字（Context）。

> 例如：给 `~/notes` 目录添加“个人想法”的上下文。当 Agent 检索到该目录下的文档时，qmd 会同时返回这段背景信息，帮助 LLM 更好地理解文档的来源和用途。

**纯本地运行与 MCP 支持**：所有模型（嵌入、重排、扩展）均通过 `node-llama-cpp` 在本地运行，无需联网，保护私密文档。支持 [Model Context Protocol (MCP)](https://github.com/tobi/qmd#mcp-server)，这意味着它可以作为标准插件直接接入支持 MCP 的 AI 客户端（如 Claude Desktop 或 Claude Code），实现“即插即用”。

### 核心配置逻辑

- 向量后端：QMD（Query Markup Documents）
- 中文增强：`Qwen3-Embedding-0.6B-Q8_0.gguf`
- 自动同步：`fswatch` 监听 Markdown 文件变动
- 多工作区共享：通过 `memory.qmd.paths` 映射多个 workspace

### 第一步：安装依赖

```bash
brew install sqlite fswatch
pnpm add -g @tobilu/qmd
qmd --version
which qmd
```

如果 `qmd` 找不到，确认 PATH 包含：

```bash
/Users/a66/Library/pnpm
```

可加入 `~/.zshrc`：

```bash
export PATH="/Users/a66/Library/pnpm:$PATH"
source ~/.zshrc
```

### 第二步：下载 Qwen3 中文向量模型

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

### 第三步：先让 QMD 本体跑通

先别急着配 watcher，先确认它本身能跑：

```bash
qmd update
qmd embed
```

### 最常见的坑：`better-sqlite3` / Node ABI 不匹配

如果看到类似错误：

```text
better_sqlite3.node was compiled against a different Node.js version
```

说明你的 Node 版本变了，但 native 模块还没重编译。

修复方式：

```bash
cd /Users/a66/Library/pnpm/global/5/.pnpm/better-sqlite3@11.10.0/node_modules/better-sqlite3
npm rebuild better-sqlite3
```

然后重新测试：

```bash
qmd update
qmd embed
```

如果输出：

```text
✓ All collections updated.
✓ All content hashes already have embeddings.
```

说明恢复正常。

### 第四步：部署实时同步服务（修正版）

可用用下面这个版本：有日志、有防抖、有单实例锁。

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

### 第五步：配置 LaunchAgent

创建：

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

加载服务：

```bash
launchctl load ~/Library/LaunchAgents/com.a66.openclaw.qmdsync.plist
```

如果已经有旧版本，建议重载：

```bash
launchctl unload ~/Library/LaunchAgents/com.a66.openclaw.qmdsync.plist 2>/dev/null || true
launchctl load ~/Library/LaunchAgents/com.a66.openclaw.qmdsync.plist
launchctl kickstart -k gui/$(id -u)/com.a66.openclaw.qmdsync
```

### 第六步：验证 watcher 真的在工作

```bash
launchctl print gui/$(id -u)/com.a66.openclaw.qmdsync
ps aux | grep -i '[q]md-watch-sync\|[f]swatch'
```

做一次真实变更测试：

```bash
echo "<!-- qmd healthcheck -->" >> ~/.openclaw/workspace/HEARTBEAT.md
sleep 5
tail -n 30 ~/.openclaw/qmd-sync.log
```

### 第七步：OpenClaw 里的 QMD 配置

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

## 7. 配置 ACP

如果你想在 OpenClaw 里把某个 agent 直接接到 **Codex** 这类外部 coding harness，而不是只跑 OpenClaw 自带的 sub-agent，那么你要用的是 **ACP**。

### ACP 是什么，为什么不用 sub-agent

sub-agent适合OpenClaw 原生的委派运行时，适合内部拆任务和普通代理协作。ACP（Agent Client Protocol）用于把任务交给外部 harness，比如：Codex、Gemini CLI。

### 我们要实现的目标架构

- OpenClaw 主配置文件：`~/.openclaw/openclaw.json`
- 消息渠道：Feishu
- 单独的 Feishu bot 账号：`coder`
- OpenClaw 中的 agent id 也是：`coder`
- `coder` 的 runtime 改成 ACP
- ACP backend 使用 `acpx`
- 默认 harness 为 `codex`
- 权限策略设为 **approve-all**

### 顶层 ACP 配置

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

### 安装并启用 acpx 插件

```bash
openclaw plugins install acpx
```

### 在 plugins 中启用 acpx，并设置全自动权限

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

### 把 coder agent 改成 ACP + Codex

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

### Feishu 绑定保持不变

```json
{
  "agentId": "coder",
  "match": {
    "channel": "feishu",
    "accountId": "coder"
  }
}
```

### 应用配置并重启 Gateway

```bash
openclaw gateway restart
```

### 如何验证 ACP 配置真的生效

注意：

- `/acp doctor` 是 **OpenClaw 对话里的 slash command**
- 不是 shell 命令
- 别在 zsh 里直接敲，不然只会得到一记耳光

正确方式是在 OpenClaw 对话里执行：

```text
/acp doctor
```

### 如何真正启动 Codex 会话

```text
/acp spawn codex --mode persistent --thread off
```

### 典型坑总结

#### 坑 1：把 `/acp doctor` 当成 shell 命令

错得非常朴实无华。

#### 坑 2：只配了 agent，没启用顶层 `acp`

那当然不会 magically 变成 Codex。

#### 坑 3：忘了启用 `acpx`

只写配置，不装插件，等于纸上谈兵。

#### 坑 4：权限太保守

如果是 `approve-reads`，那它通常只能读，不能真改。

#### 坑 5：把任务文本直接写在 `/acp spawn` 后面

`/acp spawn` 是启动命令，不是自然语言入口。

## 8. 最后这份排查清单，能帮你少走很多冤枉路

前面讲的是怎么搭，下面这部分讲的是：**为什么明明照着做了，最后还是跑不稳。**如果你后面遇到问题，别急着怀疑自己是不是哪条命令少敲了。更多时候，问题不是出在“不会装”，而是出在这些细节默认就容易埋雷。

### `pnpm` 在守护进程中找不到

优先排查 LaunchAgent 里的 `ProgramArguments` 是否使用了绝对路径。

### 原生模块安装失败

```bash
pnpm approve-builds -g
```

并确认没有禁用脚本执行。

### GitHub SSH 超时

优先用 `ssh.github.com:443`，并检查代理端口是否与本机一致。

### 环境漂移

每次开工前先跑：

```bash
node -v && pnpm -v && openclaw --version
```

### 使用飞书官方插件时，升级 OpenClaw 报错

如果出现：

```text
pnpm add -g openclaw@latest
ENOENT ENOENT: no such file or directory, open '/tmp/feishu-openclaw-plugin-onboard-cli.tgz'
```

处理方式：

```bash
pnpm rm -g @lark-open/feishu-plugin-onboard-cli
pnpm add -g openclaw@latest
```

### `gateway restart` 超时

如果出现类似：

```text
Timed out after 60s waiting for gateway port 18789 to become healthy.
Gateway restart timed out after 60s waiting for health checks.
```

优先检查：

- 端口是否被占用
- LaunchAgent 是否正确加载
- PATH 是否缺失导致守护进程启动失败
- 插件升级后是否存在残留配置冲突

## 11. 写在最后：谁适合直接照抄，谁不用抄这么全

如果你看到这里，应该已经发现了：这篇文章真正解决的，不是“怎么安装 OpenClaw”，而是**怎么把它装成一套能长期工作的系统**。

这两者差别很大。

前者只需要把界面点亮；后者要求你把 PATH、守护进程、插件、路由、权限和记忆系统都收拾干净。真正折腾人的，恰恰是后者。

### 适合直接照抄这篇的人

- 你正在一台新 Mac 上从零配置 OpenClaw
- 你打算长期使用，而不是只试玩两天
- 你会接飞书，甚至要上多 bot、多 Agent
- 你准备接入 QMD、ACP、Codex 这类进阶能力
- 你不想以后每隔几天就排查一次“明明昨天还能用”的鬼问题

### 不适合一上来就照抄这么全的人

- 你只是想先体验一下 OpenClaw
- 你暂时不用飞书、多 Agent、QMD、ACP
- 你希望先把最小可用版本跑起来，再逐步加能力

这种情况下，建议先装最小闭环：

- Homebrew
- fnm / Node LTS
- pnpm
- OpenClaw
- 基础 onboarding

先跑通，再慢慢往上叠，不然一口吃太多，最后只会把自己噎住。

OpenClaw 真正难的，从来不是“安装”，而是**避免把它装成一个看起来能跑、实际上到处埋雷的半成品**。

如果你只是想点亮它，网上随便找篇教程都够了。
但如果你想把它变成一套能长期稳定工作的个人基础设施，那你迟早还是会回到这些脏活上来。

所以与其以后补锅，不如一开始就把地基打正。

这也是我重装 5 次之后，觉得最值得写下来的部分。
