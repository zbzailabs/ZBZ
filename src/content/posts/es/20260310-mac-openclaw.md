---
title: "Después de reinstalar OpenClaw 5 veces, por fin escribí la configuración que los principiantes deberían copiar"
description: "Reinstalé OpenClaw cinco veces en un Mac nuevo y al final aclaré los tropiezos más comunes: qué hay que dejar bien desde el principio en Node, pnpm, SSH, Feishu, multiagente, QMD y ACP, y qué cosas parecen funcionar pero tarde o temprano explotan. Aquí lo dejo todo, de una vez."
category: "startup"
tags:
  - "allocation"
  - "strategy"
  - "innovation"
pubDate: 2026-03-10
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260310-mac-openclaw-cover-v2.avif"
heroImageAlt: "Imagen de portada de una guía de configuración e instalación de OpenClaw en un Mac nuevo"
heroImageWidth: 2400
heroImageHeight: 1350
draft: false
featured: false
locale: es
---

# Después de reinstalar OpenClaw 5 veces, por fin escribí la configuración que los principiantes deberían copiar

Reinstalé OpenClaw cinco veces, y al final confirmé una cosa:

**Lo que más tiempo desperdicia un principiante no es la instalación en sí, sino quedar atrapado una y otra vez en un montón de configuraciones que “parecen estar funcionando”, pero que en realidad tarde o temprano van a reventar.**

La primera vez que lo instalas, te parece que con que la interfaz abra y el bot responda ya está todo hecho. La verdad normalmente no es esa.

Los problemas de verdad suelen esconderse después:

- `pnpm` está claramente instalado, pero el daemon sigue sin encontrarlo;
- el bot de Feishu parece conectado, pero el enrutamiento multiagente es un caos;
- QMD da la impresión de sincronizarse solo, pero en realidad lleva tiempo fallando en silencio;
- ACP parece bien configurado, pero el coder nunca llega a correr de verdad sobre Codex;

Este texto no es una “versión traducida de la documentación oficial”, ni tampoco un tutorial del tipo “lo instalé una vez y ya vengo a enseñar a los demás”. Es más bien una **guía de arranque escrita después de pisar todos los charcos**, sacada de haber reinstalado OpenClaw cinco veces en un Mac mini completamente nuevo.

Lo que resuelve no es “cómo encender OpenClaw”, sino algo bastante más importante:

> **cómo dejarlo configurado como un entorno capaz de funcionar de forma estable a largo plazo, y no como algo que hoy enciende y mañana explota.**

## Los 5 errores más frecuentes que confirmé después de reinstalarlo 5 veces

Vamos primero con la parte más valiosa.

Si solo quieres saber por qué tanta gente “ya lo instaló, pero sigue teniendo problemas”, la respuesta básicamente está en estos cinco puntos:

1. **Que tu PATH esté bien no significa que el PATH del daemon también lo esté**  
   Que `pnpm`, `node` y `qmd` funcionen en tu terminal no significa que también vayan a funcionar dentro de LaunchAgent.

2. **Que una herramienta esté instalada no significa que OpenClaw tenga los permisos correctos para usarla**  
   Algunas versiones traen permisos por defecto más conservadores. Si no ajustas la configuración, parece que funciona, pero en cuanto llamas a la herramienta queda medio muerta.

3. **Que QMD no dé error no significa que realmente esté sincronizando**  
   Muchos scripts watcher fingen que todo salió bien. Aunque fallen, igual escriben “sincronización completada”. Eso es una trampa bastante sucia.

4. **Que puedas crear varios agentes no significa que los mensajes vayan a donde deben**  
   En la configuración multi-bot de Feishu, `accounts` es solo el principio. Lo que decide de verdad el destino del mensaje es `bindings`.

5. **Que coder parezca conectado a Codex no significa que realmente esté corriendo sobre ACP**  
   Mucha gente termina la configuración y piensa “esto ya debería estar”. En realidad, el runtime nunca se cambió bien; solo lo parece por el nombre.

Si esquivas estos cinco errores desde el principio, te ahorras al menos la mitad de las vueltas inútiles que vienen después.

La configuración que sigue está organizada precisamente alrededor de esos puntos.

## 0. Si vas a “criar una langosta” (OpenClaw), mejor un Mac mini

Las razones principales por las que un Mac mini es la mejor opción para “criar una langosta” son estas:

### 1. Arquitectura de memoria unificada

Los chips Apple Silicon usan una **arquitectura de memoria unificada (Unified Memory)**, en la que la memoria del sistema y la memoria gráfica se comparten. Si quieres ejecutar grandes modelos de lenguaje (LLM) en local para inferencia —más adelante usaremos modelos abiertos para apoyar QMD—, disponer de suficiente memoria equivalente a VRAM es una condición básica para lograr una velocidad razonable.

### 2. Integración del ecosistema y comodidad para la automatización

Aunque los proveedores cloud están sacando sus propias soluciones de “criar langostas en la nube”, comparado con un VPS, el Mac mini tiene ventajas naturales cuando se trata de automatizar tareas del día a día:

- **Evitar detección:** la automatización del navegador corriendo sobre una IP residencial local tiene menos probabilidades de ser detectada como bot que una IP de centro de datos en un VPS.

- **Multimedia y apps locales:** manejar archivos locales, gestionar calendarios e integrar aplicaciones de escritorio como Claude Code o Codex es mucho más sencillo.

### 3. Barrera de uso y estabilidad

- **Curva de aprendizaje más baja:** para alguien no técnico, montar un panel y revisar permisos de red en un Mac local es mucho más intuitivo que pelear con un entorno de red complejo en un VPS.
- **Silencio y eficiencia energética:** el Mac mini ocupa poco, consume muy poco y es silencioso, así que encaja perfecto como “servidor de langosta” funcionando 24/7.

## 1. Primero hay que dejar firme la base: línea de comandos y gestión de paquetes

### Versión del sistema

Cuando recibas el Mac mini, lo primero es actualizar macOS a la última versión Tahoe y activar las actualizaciones automáticas.

- ✅Ajustes del sistema → General → Actualización de software → Actualizaciones automáticas

### Ajustes de energía

En **Ajustes del sistema → Energía**, recomiendo activar estas tres opciones:

- ✅Evitar que entre en reposo automáticamente cuando la pantalla está apagada
- ✅Activar el acceso por red para despertarlo
- ✅Encender automáticamente tras un corte de energía

Si no lo haces, cuando la máquina esté en casa y tú la uses en remoto, OpenClaw puede acabar muy fácilmente en modo “el cuerpo sigue ahí, pero el alma ya no”. Feishu no lo va a despertar.

### Instalar Tailscale

Tailscale conecta de forma segura dispositivos que están en redes distintas —casa, oficina, móvil— dentro de la misma red local virtual. Cuando estés a miles de kilómetros y OpenClaw se haya caído, podrás entrar desde otro dispositivo usando Tailscale + compartir pantalla para acceder al equipo donde corre OpenClaw.

la configuración de Tailscale en sí es simple. Lo importante es:

- ✅activar el inicio de sesión al arrancar,
- ✅activar Compartir pantalla en el Mac mini desde Ajustes del sistema → General → Compartir,
- ✅anotar la dirección virtual de Tailscale del Mac mini.

### Instalar Xcode Command Line Tools

Xcode Command Line Tools es el paquete oficial de herramientas básicas de desarrollo de Apple. Añade al sistema herramientas UNIX esenciales que macOS no trae preinstaladas por defecto, como `git`, `make` y el compilador `clang`. Es el cimiento del entorno de desarrollo en Mac y te da la capacidad mínima necesaria para compilar código o usar gestores de paquetes avanzados.

```bash
xcode-select --install
# O escribe “git” en la terminal y se instalarán automáticamente las Xcode Command Line Tools
```

### Instalar Homebrew

Homebrew es el gestor de paquetes de facto en macOS. Te permite instalar, actualizar y desinstalar software de desarrollo y dependencias con comandos muy simples. Por debajo, resuelve relaciones complejas entre dependencias y gestiona enlaces del sistema, así que te evita descargar instaladores a mano y andar peleando con rutas.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Configurar las variables de entorno de Homebrew**

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

## 2. Dejar clavado el entorno Node

Gracias al **almacenamiento basado en contenido (CAS)**, pnpm usa **enlaces duros** para asegurar que una misma versión de dependencia exista físicamente una sola vez en el disco. Eso ahorra espacio SSD y acelera las instalaciones. Pero además, su estricta **estructura de enlaces simbólicos en árbol** elimina por completo el problema de las “dependencias fantasma” que trae el diseño aplanado de npm: obliga a que el código solo acceda a paquetes declarados explícitamente en `package.json`. En la práctica, eso significa un entorno más limpio y builds más seguros. Por eso recomiendo **pnpm** en vez de npm.

### Instalar fnm y activar el cambio automático

Usa `fnm`, construido en Rust, como gestor de versiones. Te permite cambiar de entorno Node.js entre proyectos de forma rápida, automática y sin conflictos globales.

```bash
brew install fnm
echo 'eval "$(fnm env --use-on-cd --shell zsh)"' >> ~/.zshrc
source ~/.zshrc
```

### Instalar Node LTS y dejarlo por defecto

Fijar la versión LTS de Node.js como entorno global por defecto es la mejor forma de asegurar estabilidad tanto para daemons como `launchd` como para tu trabajo diario.

```bash
fnm install --lts
fnm default lts-latest
```

### Activar Corepack y pnpm

Activar Corepack, que viene integrado de forma nativa en Node.js, sirve para saltarse el viejo esquema de instalar gestores de paquetes globalmente con npm y activar `pnpm` de una manera más limpia, oficial y controlable.

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### Verificar las rutas críticas de binarios

```bash
which node
which pnpm
node -v
pnpm -v
```

Entornos no interactivos como `launchd` dependen de rutas absolutas. Cuando más adelante escribas LaunchAgent, usa directamente las rutas que te devuelva `which`.

### Inicialización de pnpm y configuración de alias

Haz la inicialización a nivel de sistema y añade alias estrictos de shell para bloquear el uso accidental de npm o yarn. Si quieres que `pnpm` gestione correctamente binarios globales y obligarte a trabajar en modo **solo pnpm**, ejecuta primero `pnpm setup` y luego añade una configuración más dura en `.zshrc`.

#### Pasos

1. Primero ejecuta:

```bash
pnpm setup
```

2. Luego añade este bloque a `~/.zshrc`:

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

3. Y recarga:

```bash
source ~/.zshrc
```

## 3. Configurar GitHub

Puedes seguir la documentación oficial de GitHub: [Generating a new SSH key and adding it to the ssh-agent](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent).

Antes de generar una clave SSH, configura primero la identidad global de Git, porque si no el historial de commits queda feísimo.

```bash
git config --global user.name "your_name"
git config --global user.email "your_email@example.com"
```

### Primero confirma que estás usando el SSH del sistema

```bash
which ssh
# Esperado: /usr/bin/ssh
```

### Generar la clave

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

Si no usas proxy local, borra la línea `ProxyCommand`.

### Subir la clave pública y verificar

```bash
pbcopy < ~/.ssh/id_ed25519.pub
ssh -T git@github.com
```

## 4. Poner OpenClaw en marcha

### Preparar los grandes modelos

OpenClaw necesita llamar a grandes modelos para ejecutar tareas. Cuanto mejor sea el modelo, mejor funciona OpenClaw. Puedes priorizar modelos cerrados como ChatGPT y Gemini, o modelos abiertos como Kimi y Qwen. Si eliges ChatGPT o Gemini, puedes instalar primero Codex CLI y Gemini CLI, y luego vincularlos a OpenClaw mediante OAuth.

```bash
## 安装
brew install codex
brew install gemini-cli
## 登录
codex
gemini
```

### Instalar OpenClaw

```bash
# 全局安装最新版本的 openclaw 命令行工具
pnpm add -g openclaw@latest

# 授权全局包运行其安装所需的脚本（pnpm 安全白名单）
pnpm approve-builds -g

# 执行引导程序并为 openclaw 安装后台守护进程（实现自启动）
openclaw onboard --install-daemon
```

Sigue el proceso de onboarding hasta terminar la instalación.

### Ajustes clave tras el primer arranque

- La primera vez que abras OpenClaw en el navegador: usa el enlace con token que devuelve onboarding.
- Después, podrás entrar desde: `http://127.0.0.1:18789/`

### Configuración de actualización automática

Si quieres que OpenClaw se actualice solo, añade esto a la configuración:

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

También puedes seguir actualizando manualmente:

```bash
pnpm add -g openclaw@latest
```

### Recomendación: configurar fallback de modelo

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

### Darle personalidad a OpenClaw

Si quieres que OpenClaw hable como una persona de verdad y no con ese olor a IA genérica, puedes mandarle el texto de abajo para que reescriba `SOUL.md`.

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

5. Colocar bien los permisos de herramientas

Si ves que las herramientas de un agente nuevo no funcionan bien por defecto, puedes añadir esto a `openclaw.json`:

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

## 5. Conectar el plugin oficial de Feishu

Feishu ya publicó un [plugin oficial de OpenClaw para Feishu](https://bytedance.larkoffice.com/docx/MFK7dDFLFoVlOGxWCv5cTXKmnMh). Frente a los plugins de terceros, tiene más permisos, más estabilidad y una integración bastante mejor con el ecosistema de Feishu. Si ya usas Feishu (Lark) como canal principal de interacción con OpenClaw, lo más sensato es ir directamente por la opción oficial.

PD: una cuenta personal de Feishu no tiene función de bot. Necesitas una cuenta empresarial con acceso a la plataforma abierta de Feishu. Puedes entrar en la [plataforma abierta de Feishu](https://open.feishu.cn/) y comprobar si puedes crear un bot.

### Autorización

Después de completar la configuración según la documentación oficial, envía este mensaje al bot desde el cliente de Feishu: **我想授予所有用户权限** para otorgar los permisos de Feishu.

### Actualización del plugin

El plugin de Feishu acaba de salir y evoluciona rapidísimo, así que conviene mantenerlo actualizado.

```bash
npx -y https://sf3-cn.feishucdn.com/obj/open-platform-opendoc/879b06f872058309ef70f49bcd38a71f_Pr8pNIJ9J9.tgz update
```

### Activar salida en streaming

```bash
openclaw config set channels.feishu.streaming true
openclaw config set channels.feishu.footer.status true
```

### Permitir respuesta en grupos sin necesidad de @

```json
{
  "channels": {
    "feishu": {
      "requireMention": false
    }
  }
}
```

### Modo hilo

Si quieres que el bot mantenga contexto independiente dentro de grupos con temas y soporte varias tareas en paralelo:

```bash
openclaw config set channels.feishu.threadSession true
```

### Un agente por bot de Feishu

Si necesitas varios agentes (`main / coach / secretary / ...`) y cada uno corresponde a una aplicación Feishu distinta, puedes usar `bindings` para hacer un enrutamiento determinista: `feishu + accountId -> agente concreto`.

#### Añadir un agente

```bash
openclaw agents add coach
```

Si te faltan otros agentes, también puedes hacer:

```bash
openclaw agents add <agentId> --workspace ~/.openclaw/workspace-<agentId>
```

#### Pasar Feishu de estructura de cuenta única a multi-cuenta

Originalmente puede verse así:

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

Y luego se actualiza a esto:

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

#### Configurar bindings (la parte clave)

```json
[
  { "agentId": "main", "match": { "channel": "feishu", "accountId": "main" } },
  { "agentId": "coach", "match": { "channel": "feishu", "accountId": "coach" } }
]
```

#### Reiniciar la gateway para aplicar cambios

```bash
openclaw gateway restart
```

#### Verificar el enrutamiento

```bash
openclaw channels status
openclaw agents bindings
openclaw status --deep
```

#### Errores típicos en el modo multiagente + multi-bot Feishu

- **Error 1: solo configuraste `accounts`, pero no `bindings`**

Resultado: los mensajes siguen yéndose a cualquier parte.

- **Error 2: los nombres de `accountId` no coinciden**

Por ejemplo, tienes `accounts.coach`, pero en el binding escribes `coaching`. Es una tontería, pero es absurdamente común.

- Error 3: todavía quedan `appId / appSecret` de la vieja configuración de cuenta única

En modo multi-cuenta, pon todo dentro de `channels.feishu.accounts.*`. No mezcles ambos modelos.

- **Error 4: la aplicación de Feishu no se publicó o sus permisos no se aplicaron**

La configuración está bien, pero el bot no responde. Lo más probable es que no hayas publicado la nueva versión en el panel de Feishu. Después de cambiar la configuración del bot, acuérdate de publicar y enviar a revisión.

## 6. Configurar QMD como sistema de memoria local

El sistema de memoria por defecto de OpenClaw es bastante perezoso: olvida el contexto con frecuencia y se le escapan tareas repetidas que hizo ayer mismo. Si quieres que OpenClaw tenga un sistema de memoria **local, amigable con el chino y compartido entre varios workspaces**, QMD es una opción bastante práctica. **qmd (Query Markup Documents)** es un **pequeño motor de búsqueda en CLI** diseñado para documentos locales, bases de conocimiento y notas de reuniones.

Según el contenido web que proporcionaste, **qmd (Query Markup Documents)** es justamente eso: un **pequeño motor de búsqueda en línea de comandos** pensado para documentos locales, bases de conocimiento y registros de reuniones.

La razón por la que encaja tan bien con **OpenClaw** y otros flujos de agentes IA está en estas características clave:

**Formatos de salida pensados para agentes:** qmd ofrece de forma nativa `--json` y `--files`. Eso permite que un agente IA lea resultados estructurados —ID del documento, ruta, puntuación, etc.— y decida con mucha más precisión qué archivos cargar después como contexto.

**Arquitectura híbrida de búsqueda de alta calidad:** para dar a los LLM el contexto más relevante posible, qmd usa un pipeline de búsqueda de nivel SOTA:

- **Búsqueda BM25 de texto completo:** empareja palabras clave rápidamente.
- **Búsqueda semántica vectorial:** usa el modelo `embeddinggemma` para entender la intención del usuario.
- **Expansión de consulta (Query Expansion):** usa el modelo afinado `qmd-query-expansion` para ampliar la pregunta original y mejorar el recall.
- **Reordenamiento (Reranking):** `qwen3-reranker` vuelve a puntuar los 30 documentos candidatos iniciales para poner arriba los más relevantes.

**La función de “árbol de contexto” (gestión de contexto):** es uno de los puntos fuertes de qmd. Puedes añadir texto descriptivo a carpetas o colecciones.

> Por ejemplo: añadir al directorio `~/notes` el contexto “pensamientos personales”. Cuando el agente recupera documentos de esa carpeta, qmd devuelve también ese contexto, ayudando al LLM a entender mejor el origen y el uso del material.

**Funcionamiento totalmente local y soporte MCP:** todos los modelos —embedding, reranking y expansión— corren localmente mediante `node-llama-cpp`, sin necesidad de internet, lo que protege documentos privados. Además, soporta [Model Context Protocol (MCP)](https://github.com/tobi/qmd#mcp-server), así que puede conectarse directamente como plugin estándar a clientes IA compatibles como Claude Desktop o Claude Code.

### Lógica central de configuración

- Backend vectorial: QMD (Query Markup Documents)
- Refuerzo para chino: `Qwen3-Embedding-0.6B-Q8_0.gguf`
- Sincronización automática: `fswatch` vigila cambios en archivos Markdown
- Compartido entre múltiples workspaces: mediante `memory.qmd.paths`

### Primer paso: instalar dependencias

```bash
brew install sqlite fswatch
pnpm add -g @tobilu/qmd
qmd --version
which qmd
```

Si `qmd` no aparece, comprueba que el PATH incluya:

```bash
/Users/a66/Library/pnpm
```

Puedes añadirlo a `~/.zshrc`:

```bash
export PATH="/Users/a66/Library/pnpm:$PATH"
source ~/.zshrc
```

### Segundo paso: descargar el modelo chino de embeddings Qwen3

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

### Tercer paso: hacer que QMD corra por sí solo primero

No vayas todavía al watcher. Antes confirma que QMD en sí funciona:

```bash
qmd update
qmd embed
```

### El error más común: incompatibilidad `better-sqlite3` / Node ABI

Si ves algo como esto:

```text
better_sqlite3.node was compiled against a different Node.js version
```

significa que cambió tu versión de Node, pero el módulo nativo no se recompiló.

La forma de arreglarlo es:

```bash
cd /Users/a66/Library/pnpm/global/5/.pnpm/better-sqlite3@11.10.0/node_modules/better-sqlite3
npm rebuild better-sqlite3
```

Y luego probar otra vez:

```bash
qmd update
qmd embed
```

Si la salida es:

```text
✓ All collections updated.
✓ All content hashes already have embeddings.
```

entonces ya quedó bien.

### Cuarto paso: desplegar el servicio de sincronización en tiempo real (versión corregida)

Puedes usar esta versión: tiene logs, debounce y bloqueo de instancia única.

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

### Quinto paso: configurar LaunchAgent

Crear:

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

Cargar el servicio:

```bash
launchctl load ~/Library/LaunchAgents/com.a66.openclaw.qmdsync.plist
```

Si ya tenías una versión anterior, conviene recargarla:

```bash
launchctl unload ~/Library/LaunchAgents/com.a66.openclaw.qmdsync.plist 2>/dev/null || true
launchctl load ~/Library/LaunchAgents/com.a66.openclaw.qmdsync.plist
launchctl kickstart -k gui/$(id -u)/com.a66.openclaw.qmdsync
```

### Sexto paso: verificar que el watcher realmente funciona

```bash
launchctl print gui/$(id -u)/com.a66.openclaw.qmdsync
ps aux | grep -i '[q]md-watch-sync\|[f]swatch'
```

Haz una prueba real de cambio:

```bash
echo "<!-- qmd healthcheck -->" >> ~/.openclaw/workspace/HEARTBEAT.md
sleep 5
tail -n 30 ~/.openclaw/qmd-sync.log
```

### Séptimo paso: configuración de QMD dentro de OpenClaw

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

## 7. Configurar ACP

Si quieres que un agente concreto dentro de OpenClaw se conecte directamente a un harness externo de programación como **Codex**, en vez de limitarse al runtime nativo de sub-agent, entonces lo que necesitas es **ACP**.

### Qué es ACP y por qué no basta con usar un sub-agent

Los sub-agents sirven para el runtime nativo de delegación de OpenClaw, para dividir tareas internamente y para colaboraciones comunes entre agentes. ACP (Agent Client Protocol) sirve para entregar trabajo a harnesses externos como Codex o Gemini CLI.

### La arquitectura objetivo que queremos conseguir

- Archivo de configuración principal de OpenClaw: `~/.openclaw/openclaw.json`
- Canal de mensajes: Feishu
- Una cuenta Feishu bot separada: `coder`
- El `agent id` en OpenClaw también será: `coder`
- Cambiar el runtime de `coder` a ACP
- Usar `acpx` como backend ACP
- El harness por defecto será `codex`
- La política de permisos será **approve-all**

### Configuración ACP a nivel superior

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

### Instalar y activar el plugin acpx

```bash
openclaw plugins install acpx
```

### Activar acpx en `plugins` y definir permisos totalmente automáticos

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

### Cambiar el agente coder a ACP + Codex

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

### Mantener el binding de Feishu sin cambios

```json
{
  "agentId": "coder",
  "match": {
    "channel": "feishu",
    "accountId": "coder"
  }
}
```

### Aplicar la configuración y reiniciar la gateway

```bash
openclaw gateway restart
```

### Cómo verificar que ACP realmente está funcionando

Ojo:

- `/acp doctor` es una **slash command dentro de una conversación de OpenClaw**
- no es una orden de shell
- no la escribas directamente en zsh, a menos que quieras una bofetada de la terminal

La forma correcta es ejecutarla dentro del chat de OpenClaw:

```text
/acp doctor
```

### Cómo arrancar de verdad una sesión de Codex

```text
/acp spawn codex --mode persistent --thread off
```

### Errores típicos

#### Error 1: tratar `/acp doctor` como comando de shell

Un fallo simple y bastante humano.

#### Error 2: configurar el agente pero no activar `acp` a nivel global

Entonces, claro, eso no se va a convertir mágicamente en Codex.

#### Error 3: olvidarte de activar `acpx`

Escribir configuración sin instalar el plugin es puro teatro burocrático.

#### Error 4: permisos demasiado conservadores

Si eliges `approve-reads`, normalmente podrá leer, pero no cambiar nada de verdad.

#### Error 5: meter el texto de la tarea directamente detrás de `/acp spawn`

`/acp spawn` es una orden de arranque, no una entrada en lenguaje natural.

## 8. Esta lista final de comprobación te va a ahorrar muchos rodeos absurdos

Hasta aquí hemos hablado de cómo montarlo. La parte siguiente responde a otra pregunta: **por qué sigue sin ser estable incluso cuando haces todo “según los pasos”**. Si luego encuentras fallos, no asumas enseguida que te faltó escribir algún comando. Muchas veces el problema no es “no saber instalarlo”, sino que estos detalles vienen llenos de minas desde el principio.

### `pnpm` no aparece dentro del daemon

Lo primero es comprobar si `ProgramArguments` en LaunchAgent usa rutas absolutas.

### Fallo al instalar módulos nativos

```bash
pnpm approve-builds -g
```

Y comprueba también que la ejecución de scripts no esté desactivada.

### Timeout en SSH de GitHub

Prioriza `ssh.github.com:443` y verifica que el puerto del proxy coincida con el de tu máquina.

### Deriva del entorno

Antes de empezar a trabajar, ejecuta:

```bash
node -v && pnpm -v && openclaw --version
```

### Error al actualizar OpenClaw usando el plugin oficial de Feishu

Si aparece esto:

```text
pnpm add -g openclaw@latest
ENOENT ENOENT: no such file or directory, open '/tmp/feishu-openclaw-plugin-onboard-cli.tgz'
```

haz lo siguiente:

```bash
pnpm rm -g @lark-open/feishu-plugin-onboard-cli
pnpm add -g openclaw@latest
```

### Timeout en `gateway restart`

Si ves algo parecido a esto:

```text
Timed out after 60s waiting for gateway port 18789 to become healthy.
Gateway restart timed out after 60s waiting for health checks.
```

comprueba primero:

- si el puerto ya está ocupado,
- si LaunchAgent está cargado correctamente,
- si falta PATH y eso impide que el daemon arranque,
- si una actualización de plugins dejó configuraciones en conflicto.

## 11. Para cerrar: quién debería copiar todo esto tal cual y quién no

Si llegaste hasta aquí, ya habrás notado que este artículo en realidad no resuelve “cómo instalar OpenClaw”, sino **cómo instalarlo como un sistema capaz de seguir funcionando con el tiempo**.

Y esas dos cosas no son lo mismo.

La primera solo requiere encender la interfaz. La segunda exige dejar limpio el PATH, los daemons, los plugins, el enrutamiento, los permisos y el sistema de memoria. Y justo ahí es donde la mayoría se estampa.

### A quién sí le conviene copiar este artículo tal cual

- Estás configurando OpenClaw desde cero en un Mac nuevo
- Piensas usarlo a largo plazo, no solo probarlo dos días
- Vas a conectar Feishu, incluso varios bots y varios agentes
- Quieres integrar capacidades más avanzadas como QMD, ACP y Codex
- No quieres estar depurando cada pocos días el típico “ayer funcionaba”

### A quién no le conviene copiarlo todo desde el minuto uno

- Solo quieres probar OpenClaw primero
- Todavía no necesitas Feishu, multiagente, QMD ni ACP
- Prefieres sacar primero una versión mínima funcional e ir añadiendo capas poco a poco

En ese caso, lo recomendable es empezar por el circuito mínimo viable:

- Homebrew
- fnm / Node LTS
- pnpm
- OpenClaw
- onboarding básico

Haz que eso funcione primero y luego añade el resto por capas. Si intentas tragarte todo de una sola vez, lo único que vas a conseguir es atragantarte.

Lo realmente difícil de OpenClaw nunca ha sido “instalarlo”, sino **evitar dejarlo convertido en un semiproducto que parece funcionar mientras está lleno de trampas por dentro**.

Si solo quieres encenderlo, casi cualquier tutorial de internet te basta.
Pero si quieres convertirlo en una infraestructura personal estable a largo plazo, tarde o temprano vas a volver a este trabajo sucio.

Así que, en vez de andar parchando luego, mejor dejar bien la base desde el principio.

Esa es precisamente la parte que, después de reinstalarlo cinco veces, me pareció que más valía la pena dejar por escrito.
