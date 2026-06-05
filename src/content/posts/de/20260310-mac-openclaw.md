---
title: "Nach 5 Neuinstallationen von OpenClaw habe ich endlich die Konfiguration aufgeschrieben, die Einsteiger einfach kopieren sollten"
description: "Ich habe OpenClaw auf einem neuen Mac fünfmal neu installiert und dabei endlich die häufigsten Stolperfallen sauber herausgearbeitet: Was man bei Node, pnpm, SSH, Feishu, Multi-Agenten, QMD und ACP zuerst richtig setzen muss – und was am Anfang nur so aussieht, als würde es funktionieren, später aber sicher explodiert. Hier steht alles gesammelt an einem Ort."
category: "startup"
tags:
  - "allocation"
  - "strategy"
  - "innovation"
pubDate: 2026-03-10
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260310-mac-openclaw-cover-v2.avif"
heroImageAlt: "Titelbild für einen OpenClaw-Einrichtungs- und Installationsleitfaden auf einem neuen Mac"
heroImageWidth: 2400
heroImageHeight: 1350
draft: false
featured: false
locale: de
---

# Nach 5 Neuinstallationen von OpenClaw habe ich endlich die Konfiguration aufgeschrieben, die Einsteiger einfach kopieren sollten

Ich habe OpenClaw insgesamt fünfmal neu installiert. Am Ende war eine Sache glasklar:

**Was Einsteiger am meisten Zeit kostet, ist nicht die Installation selbst, sondern dass sie immer wieder von einer Menge Konfigurationen gequält werden, die „schon zu laufen scheinen“, in Wahrheit aber früher oder später explodieren.**

Beim ersten Setup denkt man leicht: Solange die Oberfläche aufgeht und der Bot antwortet, ist alles erledigt. Die Wahrheit ist meistens eine andere.

Die eigentlichen Fallen verstecken sich oft weiter hinten:

- `pnpm` ist eindeutig installiert, aber im Daemon wird es trotzdem nicht gefunden;
- der Feishu-Bot ist zwar verbunden, aber das Routing mehrerer Agenten ist in Wahrheit chaotisch;
- QMD sieht so aus, als würde es automatisch synchronisieren, scheitert aber die ganze Zeit still im Hintergrund;
- die ACP-Konfiguration sieht sauber aus, aber der coder läuft in Wirklichkeit gar nicht wirklich auf Codex;

Dieser Text ist weder eine „übersetzte Version der offiziellen Doku“ noch ein Tutorial nach dem Motto „Ich habe es einmal installiert und erkläre jetzt allen die Welt“. Es ist mein **Startplan nach fünf Neuinstallationen samt Fallgruben-Postmortem**, zusammengestellt auf einem komplett neuen Mac mini.

Er beantwortet nicht die Frage „Wie kriege ich OpenClaw überhaupt zum Leuchten?“, sondern die wichtigere:

> **Wie richtet man es so ein, dass es langfristig stabil läuft, statt heute zu funktionieren und morgen zu zerbrechen?**

## Die 5 häufigsten Fallen, die ich nach 5 Neuinstallationen bestätigt habe

Der wertvollste Teil gehört nach vorn.

Wenn du nur wissen willst, warum so viele Leute „es doch installiert haben und trotzdem dauernd Probleme haben“, steckt die Antwort im Grunde in diesen fünf Punkten:

1. **Nur weil dein PATH stimmt, heißt das nicht, dass auch der PATH des Daemons stimmt**  
   Dass `pnpm`, `node` und `qmd` im Terminal laufen, bedeutet nicht, dass sie auch im LaunchAgent laufen.

2. **Nur weil ein Tool installiert ist, heißt das nicht, dass OpenClaw die richtigen Rechte dafür hat**  
   Manche Versionen sind standardmäßig konservativer. Wenn du die Konfiguration nicht nachziehst, wirkt alles benutzbar – bis beim ersten Aufruf nur noch eine halbe Leiche übrig ist.

3. **Nur weil QMD keinen Fehler wirft, heißt das nicht, dass es wirklich synchronisiert**  
   Viele Watcher-Skripte tun so, als hätten sie erfolgreich gearbeitet. Selbst wenn etwas scheitert, schreiben sie weiter „Synchronisierung abgeschlossen“. Das ist richtig mies.

4. **Nur weil mehrere Agenten erstellt werden können, heißt das nicht, dass Nachrichten korrekt geroutet werden**  
   In einer Feishu-Konfiguration mit mehreren Bots ist `accounts` nur der Anfang. Was die Nachrichten wirklich steuert, ist `bindings`.

5. **Nur weil der coder so aussieht, als hänge er an Codex, heißt das nicht, dass er wirklich auf ACP läuft**  
   Viele Leute denken nach der Konfiguration: „Das müsste jetzt passen.“ In Wirklichkeit wurde die Runtime nie sauber umgestellt. Es sieht nur dem Namen nach richtig aus.

Wenn du diese fünf Fallen vorher umgehst, sparst du dir später mindestens die Hälfte des sinnlosen Herumprobierens.

Die folgende Konfiguration ist genau um diese Punkte herum aufgebaut.

## 0. Wenn du einen Hummer großziehen willst (OpenClaw), nimm bevorzugt einen Mac mini

Die Kernargumente für einen Mac mini als Maschine zum „Hummerzüchten“ sind schlicht diese:

### 1. Einheitliche Speicherarchitektur

Macs mit Apple Silicon verwenden eine **Unified Memory Architecture**, also einen gemeinsamen Speicher für System und Grafik. Wenn du große Sprachmodelle (LLMs) lokal inferieren lassen willst – später brauchen wir Open-Source-Modelle zur Unterstützung von QMD –, ist ausreichend geteilter Speicher die Grundvoraussetzung für vernünftige Geschwindigkeit.

### 2. Tiefe Ökosystem-Integration und bequemere Automatisierung

Zwar bieten Cloud-Anbieter inzwischen reihenweise cloudbasierte „Lobster Farming“-Lösungen an, aber gegenüber einem VPS hat ein Mac mini bei täglicher Automatisierung natürliche Vorteile:

- **Erkennung umgehen:** Browser-Automatisierung auf einer lokalen Wohn-IP wird von Websites seltener als Bot erkannt als dieselbe Automatisierung auf einer Rechenzentrums-IP eines VPS.

- **Multimedia-Verarbeitung:** Lokale Dateien verarbeiten, Kalender verwalten und Desktop-Apps wie Claude Code oder Codex einbinden ist deutlich einfacher.

### 3. Geringere Einstiegshürde und mehr Stabilität

- **Flachere Lernkurve:** Für Nicht-Entwickler ist es viel intuitiver, auf einem lokalen Mac ein Dashboard einzurichten und Netzwerkrechte zu debuggen, als sich auf einem VPS durch komplexe Netzwerkumgebungen zu kämpfen.
- **Leise und effizient:** Ein Mac mini ist klein, stromsparend und fast lautlos – ideal als 24/7 laufender „Hummer-Server“.

## 1. Erst das Fundament stabil machen: Kommandozeile und Paketverwaltung

### Systemversion

Wenn du den Mac mini bekommst, aktualisiere macOS zuerst auf die neueste Tahoe-Version. Danach automatische Updates einschalten.

- ✅Systemeinstellungen → Allgemein → Softwareupdate → Automatische Updates

### Energieeinstellungen

Unter **Systemeinstellungen → Energie** solltest du beim Mac mini diese drei Schalter aktivieren:

- ✅Ruhezustand verhindern, wenn das Display ausgeschaltet ist
- ✅Für Netzwerkzugriff aufwecken
- ✅Nach Stromausfall automatisch starten

Sonst steht die Maschine zwar zu Hause, aber wenn du aus der Ferne darauf zugreifst, ist OpenClaw schnell in einem Zustand von „Körper noch da, Seele weg“. Feishu weckt sie dann nicht mehr auf.

### Tailscale installieren

Tailscale verbindet Geräte in unterschiedlichen Netzen – Zuhause, Büro, Smartphone – sicher zu einem virtuellen LAN. Wenn du weit weg bist und OpenClaw hängt oder abgestürzt ist, kannst du über ein anderes Gerät mit Tailscale plus Bildschirmfreigabe trotzdem auf die Maschine zugreifen.

das Tailscale-Setup selbst ist simpel. Wichtig sind vor allem diese Punkte:

- ✅Anmeldung beim Systemstart aktivieren,
- ✅auf dem Mac mini unter Systemeinstellungen → Allgemein → Freigaben die Bildschirmfreigabe einschalten.
- ✅die virtuelle Tailscale-Adresse des Mac mini notieren

### Xcode Command Line Tools installieren

Die Xcode Command Line Tools sind Apples offizielles Low-Level-Entwicklerpaket. Es ergänzt zentrale UNIX-Werkzeuge, die macOS standardmäßig nicht vollständig mitliefert – darunter `git`, `make` und den `clang`-Compiler. Sie bilden das Fundament der Entwicklungsumgebung auf dem Mac und liefern die unverzichtbare Build-Basis für spätere Quellcode-Kompilation oder anspruchsvollere Paketmanager.

```bash
xcode-select --install
# Oder im Terminal einfach „git“ eingeben, dann werden die Xcode Command Line Tools automatisch installiert
```

### Homebrew installieren

Homebrew ist der faktische Standard-Paketmanager auf macOS. Damit kannst du per minimalistischen Terminalbefehlen Entwicklungssoftware und Abhängigkeiten installieren, aktualisieren und entfernen. Im Hintergrund kümmert sich Homebrew um komplizierte Abhängigkeitsbeziehungen und verwaltet Symlinks zentral, sodass dir das manuelle Herunterladen von Installern und das Gefrickel mit Pfaden erspart bleibt.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Homebrew-Umgebungsvariablen setzen**

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

## 2. Die Node-Umgebung endgültig festnageln

pnpm nutzt **Content-Addressable Storage (CAS)** und **Hardlinks**, damit jede Abhängigkeitsversion physisch nur einmal auf der Platte liegt. Das spart SSD-Speicher und beschleunigt Installationen. Noch wichtiger: Durch seine strenge **symlink-basierte Baumstruktur** verhindert pnpm konsequent das Problem sogenannter „Phantom-Abhängigkeiten“, das durch das flache Layout von npm entsteht. Code kann nur auf Pakete zugreifen, die tatsächlich in `package.json` deklariert wurden. Genau deshalb empfehle ich **pnpm** statt npm als Paketmanager.

### fnm installieren und automatisches Umschalten aktivieren

Nutze `fnm`, den in Rust gebauten Versionsmanager. Damit kannst du zwischen verschiedenen Node.js-Umgebungen schnell, sauber und automatisch wechseln, ohne dir globale Versionskonflikte einzuhandeln.

```bash
brew install fnm
echo 'eval "$(fnm env --use-on-cd --shell zsh)"' >> ~/.zshrc
source ~/.zshrc
```

### Node LTS installieren und als Standard setzen

Die Long-Term-Support-Version von Node.js als globalen Standard festzulegen, ist die beste Basis dafür, dass sowohl Low-Level-Daemons wie `launchd` als auch der tägliche Entwicklungsbetrieb maximal stabil bleiben.

```bash
fnm install --lts
fnm default lts-latest
```

### Corepack aktivieren und pnpm scharf schalten

Mit Corepack – direkt in Node.js eingebaut – umgehst du die alte Unsitte, Paketmanager global per npm zu installieren. Das ist der sauberste, offiziellste und am besten kontrollierbare Weg, deine `pnpm`-Umgebung zu aktivieren und zu verwalten.

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### Wichtige Binärpfade verifizieren

```bash
which node
which pnpm
node -v
pnpm -v
```

Nicht-interaktive Umgebungen wie `launchd` sind auf absolute Pfade angewiesen. Wenn du später LaunchAgents schreibst, nimm direkt die Ergebnisse von `which`.

### pnpm initialisieren und Aliasse setzen

Führe die systemweite Initialisierung aus und setze strikte Shell-Aliasse als harte Leitplanke, damit du nicht versehentlich npm oder yarn benutzt. Wenn `pnpm` globale Binärdateien sauber verwalten soll und du dir einen echten **pnpm-only**-Workflow aufzwingen willst, führe erst `pnpm setup` aus und ergänze dann eine strengere `.zshrc`.

#### Vorgehen

1. Erst ausführen:

```bash
pnpm setup
```

2. Danach diesen Block in `~/.zshrc` einfügen:

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

3. Aktivieren:

```bash
source ~/.zshrc
```

## 3. GitHub konfigurieren

Dazu kannst du der offiziellen GitHub-Doku folgen: [Generating a new SSH key and adding it to the ssh-agent](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent).

Bevor du den SSH-Schlüssel erzeugst, solltest du zuerst deine globale Git-Identität setzen – sonst sehen deine Commits später ziemlich übel aus.

```bash
git config --global user.name "your_name"
git config --global user.email "your_email@example.com"
```

### Zuerst prüfen, dass du das System-SSH benutzt

```bash
which ssh
# Erwartet: /usr/bin/ssh
```

### Schlüssel erzeugen

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

### `~/.ssh/config` konfigurieren

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

Wenn du keinen lokalen Proxy nutzt, lösch einfach die Zeile mit `ProxyCommand`.

### Öffentlichen Schlüssel hochladen und Verbindung testen

```bash
pbcopy < ~/.ssh/id_ed25519.pub
ssh -T git@github.com
```

## 4. OpenClaw zum Laufen bringen

### Große Modelle vorbereiten

OpenClaw braucht große Modelle, um Aufgaben auszuführen. Je stärker das Modell, desto stärker OpenClaw. Geschlossene Modelle wie ChatGPT oder Gemini sind die erste Wahl, offene Modelle wie Kimi oder Qwen gehen ebenfalls. Wenn du ChatGPT oder Gemini nutzen willst, installiere zuerst Codex CLI bzw. Gemini CLI und verbinde sie später per OAuth mit OpenClaw.

```bash
## 安装
brew install codex
brew install gemini-cli
## 登录
codex
gemini
```

### OpenClaw installieren

```bash
# 全局安装最新版本的 openclaw 命令行工具
pnpm add -g openclaw@latest

# 授权全局包运行其安装所需的脚本（pnpm 安全白名单）
pnpm approve-builds -g

# 执行引导程序并为 openclaw 安装后台守护进程（实现自启动）
openclaw onboard --install-daemon
```

Die Installation dann einfach entlang des Onboardings abschließen.

### Kritische Einstellungen nach dem ersten Start

- Beim allerersten Öffnen von OpenClaw im Browser: den tokenisierten Link aus dem Onboarding verwenden.
- Danach erreichst du es über: `http://127.0.0.1:18789/`

### Automatische Updates konfigurieren

Wenn OpenClaw sich automatisch aktualisieren soll, füge das in die Konfiguration ein:

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

Du kannst natürlich auch weiter manuell aktualisieren:

```bash
pnpm add -g openclaw@latest
```

### Modell-Fallbacks sauber setzen

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

### OpenClaw menschlicher machen

Wenn OpenClaw klingen soll wie ein Mensch und nicht wie eine AI mit Büroluft, kannst du ihm den folgenden Text schicken und ihn `SOUL.md` umschreiben lassen.

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

5. Die Tool-Berechtigungen an die richtige Stelle setzen

Wenn neu angelegte Agenten standardmäßig keine Tools sauber aufrufen können, kannst du in `openclaw.json` Folgendes ergänzen:

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

## 5. Das offizielle Feishu-Plugin anbinden

Feishu hat bereits ein [offizielles OpenClaw-Feishu-Plugin](https://bytedance.larkoffice.com/docx/MFK7dDFLFoVlOGxWCv5cTXKmnMh) veröffentlicht. Gegenüber Drittanbieter-Plugins hat es breitere Rechte, läuft stabiler und integriert sich sauberer in das Feishu-Ökosystem. Wenn Feishu (Lark) ohnehin dein Haupteinstieg für OpenClaw ist, nimm direkt die offizielle Variante.

PS: Mit einem privaten Feishu-Konto kannst du keine Feishu-Bots nutzen. Dafür brauchst du ein Unternehmenskonto mit Zugriff auf die Feishu Open Platform. Melde dich bei der [Feishu Open Platform](https://open.feishu.cn/) an und prüfe, ob du überhaupt einen Bot anlegen kannst.

### Autorisierung

Nachdem du die Einrichtung nach offizieller Doku abgeschlossen hast, schick dem Bot im Feishu-Client diese Nachricht: **我想授予所有用户权限**. Damit erteilst du die Feishu-Berechtigungen.

### Plugin aktualisieren

Das Feishu-Plugin ist noch frisch und entwickelt sich schnell. Also regelmäßig aktualisieren.

```bash
npx -y https://sf3-cn.feishucdn.com/obj/open-platform-opendoc/879b06f872058309ef70f49bcd38a71f_Pr8pNIJ9J9.tgz update
```

### Streaming-Ausgabe einschalten

```bash
openclaw config set channels.feishu.streaming true
openclaw config set channels.feishu.footer.status true
```

### In Gruppen auch ohne @ direkt antworten

```json
{
  "channels": {
    "feishu": {
      "requireMention": false
    }
  }
}
```

### Thread-Modus

Wenn der Bot in Themen-Gruppen einen eigenen Kontext behalten und mehrere Aufgaben parallel unterstützen soll:

```bash
openclaw config set channels.feishu.threadSession true
```

### Mehrere Agenten, mehrere Feishu-Bots

Wenn du mehrere Agenten brauchst (`main / coach / secretary / ...`) und jeder Agent eine eigene Feishu-App bekommen soll, dann nutze `bindings` für deterministisches Routing: `feishu + accountId -> bestimmter Agent`

#### Agent hinzufügen

```bash
openclaw agents add coach
```

Wenn dir weitere Agenten fehlen, geht auch:

```bash
openclaw agents add <agentId> --workspace ~/.openclaw/workspace-<agentId>
```

#### Feishu von Einzelkonto-Struktur auf Mehrkonten-Struktur umstellen

Vorher sieht es oft so aus:

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

Danach so:

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

#### bindings konfigurieren (der Kern)

```json
[
  { "agentId": "main", "match": { "channel": "feishu", "accountId": "main" } },
  { "agentId": "coach", "match": { "channel": "feishu", "accountId": "coach" } }
]
```

#### Gateway neu starten, damit es greift

```bash
openclaw gateway restart
```

#### Routing verifizieren

```bash
openclaw channels status
openclaw agents bindings
openclaw status --deep
```

#### Häufige Fallen im Modus „mehrere Agenten + mehrere Feishu-Bots“

- **Falle 1: Nur `accounts` konfiguriert, aber keine `bindings`**

Ergebnis: Nachrichten fliegen immer noch chaotisch herum.

- **Falle 2: Der `accountId`-Name stimmt nicht exakt**

Zum Beispiel gibt es `accounts.coach`, aber im Binding steht `coaching`. Ein dummer Fehler – und trotzdem erstaunlich häufig.

- Falle 3: Alte Einzelkonto-Felder `appId / appSecret` liegen noch herum

Im Mehrkontenmodus gehört alles unter `channels.feishu.accounts.*`. Nicht beide Strukturen mischen.

- **Falle 4: Die Feishu-App wurde nicht veröffentlicht oder die Rechte wurden nicht wirksam**

Die Konfiguration stimmt, aber der Bot antwortet trotzdem nicht. Sehr oft hast du in Feishu einfach keine neue Version veröffentlicht. Nach Änderungen an der Bot-Konfiguration also veröffentlichen und zur Prüfung einreichen.

## 6. Das lokale QMD-Gedächtnissystem konfigurieren

Das Standard-Gedächtnis von OpenClaw ist eher faul. Es vergisst oft Kontext – und gern auch wiederkehrende Aktionen, die es gestern noch erledigt hat. Wenn du OpenClaw ein **lokales, chinesisch-freundliches, arbeitsbereichsübergreifend geteiltes** Gedächtnis geben willst, ist QMD eine ziemlich praktische Lösung. **qmd (Query Markup Documents)** ist eine **kleine CLI-Suchmaschine** für lokale Dokumente, Wissensbestände und Besprechungsnotizen.

Basierend auf dem von dir bereitgestellten Webinhalt ist **qmd (Query Markup Documents)** eine **kleine CLI-Suchmaschine**, die speziell für lokale Dokumente, Wissensbasen und Meeting-Notizen gebaut wurde.

Warum sie besonders gut zu **OpenClaw** oder anderen KI-Agenten-Workflows passt, liegt vor allem an diesen Eigenschaften:

**Ausgabeformate speziell für Agenten:** qmd bietet native Modi wie `--json` und `--files`. Dadurch können Agenten Suchergebnisse leicht parsen und strukturierte Daten wie Dokument-IDs, Pfade und Relevanzwerte erhalten, um präziser zu entscheiden, welche Dateien als Kontext nachgeladen werden sollen.

**Hochwertige hybride Sucharchitektur:** Damit LLMs den relevantesten Kontext bekommen, nutzt qmd eine Pipeline nach aktuellem Spitzenstandard:

- **BM25-Volltextsuche:** schnelle Keyword-Treffer.
- **Vektorbasierte semantische Suche:** versteht Nutzerintentionen mit dem Modell `embeddinggemma`.
- **Query Expansion:** erweitert die ursprüngliche Frage mit dem feinjustierten Modell `qmd-query-expansion`, um die Trefferquote zu verbessern.
- **Reranking:** nutzt `qwen3-reranker`, um die ersten 30 Kandidatendokumente neu zu bewerten und die relevantesten nach oben zu ziehen.

**Die „Kontextbaum“-Funktion (Context Management):** Das ist eine der stärksten Besonderheiten von qmd. Du kannst verschiedenen Ordnern oder Sammlungen beschreibenden Kontext hinzufügen.

> Beispiel: Dem Ordner `~/notes` gibst du den Kontext „persönliche Gedanken“. Wenn ein Agent daraus ein Dokument zieht, liefert qmd diesen Hintergrund gleich mit zurück. Das hilft dem LLM, Herkunft und Zweck des Dokuments besser zu verstehen.

**Komplett lokal plus MCP-Unterstützung:** Alle Modelle – Embedding, Reranking und Query Expansion – laufen lokal über `node-llama-cpp`. Es braucht also keine Netzwerkverbindung, und private Dokumente bleiben privat. Zusätzlich unterstützt qmd [Model Context Protocol (MCP)](https://github.com/tobi/qmd#mcp-server), wodurch es sich direkt in MCP-kompatible KI-Clients wie Claude Desktop oder Claude Code einklinken lässt.

### Zentrale Konfigurationslogik

- Vektor-Backend: QMD (Query Markup Documents)
- Chinesische Verstärkung: `Qwen3-Embedding-0.6B-Q8_0.gguf`
- Automatische Synchronisierung: `fswatch` überwacht Markdown-Dateien
- Mehrere Workspaces gemeinsam nutzen: über `memory.qmd.paths`

### Erster Schritt: Abhängigkeiten installieren

```bash
brew install sqlite fswatch
pnpm add -g @tobilu/qmd
qmd --version
which qmd
```

Wenn `qmd` nicht gefunden wird, prüfe, ob dein PATH Folgendes enthält:

```bash
/Users/a66/Library/pnpm
```

Das kannst du in `~/.zshrc` ergänzen:

```bash
export PATH="/Users/a66/Library/pnpm:$PATH"
source ~/.zshrc
```

### Zweiter Schritt: Das chinesische Qwen3-Embedding-Modell herunterladen

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

### Dritter Schritt: Erst QMD selbst sauber zum Laufen bringen

Bevor du Watcher konfigurierst, erst sicherstellen, dass QMD selbst läuft:

```bash
qmd update
qmd embed
```

### Die häufigste Falle: `better-sqlite3` / Node-ABI passt nicht

Wenn du einen Fehler siehst wie:

```text
better_sqlite3.node was compiled against a different Node.js version
```

dann hat sich deine Node-Version geändert, aber das native Modul wurde nicht neu gebaut.

So reparierst du es:

```bash
cd /Users/a66/Library/pnpm/global/5/.pnpm/better-sqlite3@11.10.0/node_modules/better-sqlite3
npm rebuild better-sqlite3
```

Danach erneut testen:

```bash
qmd update
qmd embed
```

Wenn die Ausgabe so aussieht:

```text
✓ All collections updated.
✓ All content hashes already have embeddings.
```

ist das Problem behoben.

### Vierter Schritt: Den Echtzeit-Sync-Dienst bereitstellen (reparierte Version)

Du kannst die folgende Version direkt verwenden: mit Logs, Debounce und Einzelinstanz-Sperre.

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

### Fünfter Schritt: LaunchAgent konfigurieren

Anlegen:

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

Dienst laden:

```bash
launchctl load ~/Library/LaunchAgents/com.a66.openclaw.qmdsync.plist
```

Wenn schon eine alte Version existiert, besser neu laden:

```bash
launchctl unload ~/Library/LaunchAgents/com.a66.openclaw.qmdsync.plist 2>/dev/null || true
launchctl load ~/Library/LaunchAgents/com.a66.openclaw.qmdsync.plist
launchctl kickstart -k gui/$(id -u)/com.a66.openclaw.qmdsync
```

### Sechster Schritt: Prüfen, ob der Watcher wirklich arbeitet

```bash
launchctl print gui/$(id -u)/com.a66.openclaw.qmdsync
ps aux | grep -i '[q]md-watch-sync\|[f]swatch'
```

Dann eine echte Änderung testen:

```bash
echo "<!-- qmd healthcheck -->" >> ~/.openclaw/workspace/HEARTBEAT.md
sleep 5
tail -n 30 ~/.openclaw/qmd-sync.log
```

### Siebter Schritt: QMD-Konfiguration in OpenClaw

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

## 7. ACP konfigurieren

Wenn du in OpenClaw einen bestimmten Agenten direkt an ein externes Coding-Harness wie **Codex** hängen willst, statt nur OpenClaws eingebauten Sub-Agent-Mechanismus zu nutzen, dann brauchst du **ACP**.

### Was ACP ist – und warum nicht einfach Sub-Agenten

Sub-Agenten passen gut zu OpenClaws nativer Delegation, zur internen Aufgabenzerlegung und zur normalen Zusammenarbeit zwischen Agenten. ACP (Agent Client Protocol) ist dagegen dafür da, Arbeit an externe Harnesses wie Codex oder Gemini CLI zu übergeben.

### Die Zielarchitektur, die wir erreichen wollen

- OpenClaw-Hauptkonfiguration: `~/.openclaw/openclaw.json`
- Nachrichtenkanal: Feishu
- Eigenes Feishu-Bot-Konto: `coder`
- Die Agent-ID in OpenClaw heißt ebenfalls: `coder`
- Die Runtime von `coder` wird auf ACP umgestellt
- Das ACP-Backend ist `acpx`
- Das Standard-Harness ist `codex`
- Die Berechtigungsstrategie ist **approve-all**

### ACP-Konfiguration auf Top-Level

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

### acpx-Plugin installieren und aktivieren

```bash
openclaw plugins install acpx
```

### acpx unter `plugins` aktivieren und volle automatische Rechte setzen

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

### Den `coder`-Agenten auf ACP + Codex umstellen

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

### Feishu-Binding unverändert lassen

```json
{
  "agentId": "coder",
  "match": {
    "channel": "feishu",
    "accountId": "coder"
  }
}
```

### Konfiguration anwenden und Gateway neu starten

```bash
openclaw gateway restart
```

### Wie du prüfst, ob ACP wirklich aktiv ist

Wichtig:

- `/acp doctor` ist ein **Slash-Command innerhalb eines OpenClaw-Chats**
- kein Shell-Befehl
- also nicht stumpf in zsh eintippen, außer du willst dir vom Terminal eine Ohrfeige abholen

Der richtige Weg ist, diesen Befehl in einem OpenClaw-Chat auszuführen:

```text
/acp doctor
```

### Wie du wirklich eine Codex-Sitzung startest

```text
/acp spawn codex --mode persistent --thread off
```

### Typische Fallen

#### Falle 1: `/acp doctor` wie einen Shell-Befehl behandeln

Herrlich schlichter Fehler.

#### Falle 2: Den Agenten konfigurieren, aber `acp` auf Top-Level nicht aktivieren

Dann wird es natürlich nicht plötzlich magisch zu Codex.

#### Falle 3: `acpx` vergessen zu aktivieren

Nur Konfiguration hinzuschreiben, ohne das Plugin zu installieren, ist Theater auf Papier.

#### Falle 4: Zu konservative Rechte

Wenn du `approve-reads` nutzt, heißt das meistens: lesen ja, wirklich ändern nein.

#### Falle 5: Die Aufgabenbeschreibung direkt hinter `/acp spawn` schreiben

`/acp spawn` ist ein Startbefehl, kein natürlicher Spracheingang.

## 8. Diese letzte Checkliste für die Fehlersuche spart dir eine Menge sinnlosen Schmerz

Vorher ging es darum, **wie** du die Umgebung aufbaust. Dieser Teil erklärt, **warum sie trotz aller Schritte oft trotzdem nicht stabil läuft**. Wenn später Probleme auftauchen, geh nicht sofort davon aus, dass du irgendeinen Befehl vergessen hast. Häufiger liegt das Problem nicht an „falsch installiert“, sondern daran, dass diese Details von Haus aus Minenfelder sind.

### `pnpm` wird im Daemon nicht gefunden

Als Erstes prüfen, ob in den `ProgramArguments` des LaunchAgent absolute Pfade verwendet werden.

### Installation nativer Module schlägt fehl

```bash
pnpm approve-builds -g
```

Außerdem sicherstellen, dass die Ausführung von Skripten nicht deaktiviert wurde.

### GitHub-SSH-Timeout

Am besten `ssh.github.com:443` verwenden und prüfen, ob der Proxy-Port mit deiner lokalen Maschine übereinstimmt.

### Umgebungsdrift

Vor jeder Arbeitssitzung zuerst ausführen:

```bash
node -v && pnpm -v && openclaw --version
```

### Fehler beim Upgrade von OpenClaw mit offiziellem Feishu-Plugin

Wenn Folgendes erscheint:

```text
pnpm add -g openclaw@latest
ENOENT ENOENT: no such file or directory, open '/tmp/feishu-openclaw-plugin-onboard-cli.tgz'
```

so behebst du es:

```bash
pnpm rm -g @lark-open/feishu-plugin-onboard-cli
pnpm add -g openclaw@latest
```

### `gateway restart` läuft in ein Timeout

Wenn du so etwas siehst:

```text
Timed out after 60s waiting for gateway port 18789 to become healthy.
Gateway restart timed out after 60s waiting for health checks.
```

prüfe zuerst:

- ob der Port bereits belegt ist
- ob der LaunchAgent korrekt geladen wurde
- ob PATH-Einträge fehlen und deshalb der Daemon nicht startet
- ob nach Plugin-Upgrades alte Konfigurationsreste Konflikte verursachen

## 11. Zum Schluss: Wer diese Konfiguration komplett kopieren sollte – und wer lieber nicht

Wenn du bis hier gelesen hast, ist dir wahrscheinlich schon aufgefallen: Dieser Artikel löst nicht eigentlich das Problem „Wie installiere ich OpenClaw?“, sondern **wie man es als System installiert, das langfristig weiterarbeitet**.

Das sind zwei sehr verschiedene Dinge.

Für das erste reicht es, die Oberfläche ans Laufen zu bringen. Für das zweite musst du PATH, Daemons, Plugins, Routing, Rechte und Gedächtnissystem sauber aufräumen. Und genau diese zweite Schicht macht den Leuten später das Leben schwer.

### Für wen sich dieser Artikel zum direkten Nachbauen eignet

- Du richtest OpenClaw auf einem neuen Mac von Grund auf ein
- Du willst es langfristig nutzen und nicht nur zwei Tage damit spielen
- Du willst Feishu anbinden, vielleicht sogar mehrere Bots und mehrere Agenten
- Du willst fortgeschrittene Fähigkeiten wie QMD, ACP und Codex einbauen
- Du hast keine Lust, alle paar Tage „Warum ging es gestern noch?“ zu debuggen

### Für wen es keine gute Idee ist, gleich alles komplett zu kopieren

- Du willst OpenClaw erst einmal nur ausprobieren
- Du brauchst vorerst weder Feishu noch Multi-Agent, QMD oder ACP
- Du willst erst die kleinste lauffähige Version hinstellen und dann schrittweise erweitern

Dann ist der bessere Weg: Starte mit dem kleinsten geschlossenen Kreis:

- Homebrew
- fnm / Node LTS
- pnpm
- OpenClaw
- grundlegendes Onboarding

Erst das stabil zum Laufen bringen, dann nach und nach erweitern. Wenn du direkt alles auf einmal schlucken willst, verschluckst du dich am Ende nur selbst.

Das eigentlich Schwierige an OpenClaw war nie die „Installation“. Schwierig ist es, **zu verhindern, dass daraus ein halbfertiges System wird, das zwar funktional aussieht, aber überall versteckte Minen hat**.

Wenn du es nur kurz zum Leuchten bringen willst, reicht fast jede Anleitung im Netz.
Wenn du es aber zu einer persönlichen Infrastruktur machen willst, die langfristig stabil arbeitet, kommst du früher oder später sowieso wieder bei genau diesen Drecksarbeiten an.

Also lieber das Fundament am Anfang sauber setzen, statt später Löcher zu stopfen.

Genau das war nach fünf Neuinstallationen der Teil, den ich am meisten aufschreiben wollte.
