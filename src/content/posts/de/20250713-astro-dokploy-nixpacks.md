---
title: "Astro-Projekte mit Dokploy und Nixpacks bereitstellen und Caching aktivieren, um die Build-Geschwindigkeit zu optimieren"
description: "Stellen Sie statische Astro-Websites schnell mit Dokploy und Nixpacks bereit und aktivieren Sie Caching-Mechanismen vollständig, um die Build-Geschwindigkeit erheblich zu verbessern. Das Tutorial behandelt die Astro-Konfiguration, die Dokploy-Umgebungsvariableneinstellungen und die Nixpacks-Cache-Optimierungsstrategien, die für kontinuierliche Integrations- und Bereitstellungspraktiken für inhaltsgesteuerte Websites geeignet sind."
category: "startup"
tags:
  - "innovation"
pubDate: 2025-07-14
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20250714082742453.avif"
heroImageAlt: "ZBZ-Astro-Projekte mit Dokploy und Nixpacks bereitstellen und Caching aktivieren, um die Build-Geschwindigkeit zu optimieren"
heroImageWidth: 1960
heroImageHeight: 1102
draft: false
featured: false
locale: de
---

## I. Dokploy-Konfiguration

Dokploy ist eine Open-Source-, selbst hostbare Bereitstellungsplattform, die als kostenlose Alternative zu Heroku, Vercel und Netlify konzipiert wurde und auf Docker und Traefik aufbaut.

### 1. Neues Projekt erstellen und GitHub-Repository verbinden

### 2. Umgebungsvariablen festlegen

```bash
NIXPACKS_NODE_VERSION=22
NIXPACKS_PNPM_STORE_PATH=/root/.local/share/pnpm/store/v3
NIXPACKS_INSTALL_CACHE_DIRS=/app/node_modules
NIXPACKS_BUILD_CACHE_DIRS=/app/node_modules/.cache,/app/astro_cache
```

### 3. Cache-Bereinigung deaktivieren

- Projektdienst → **Clean Cache**: Deaktivieren
- Webserver → **Daily Docker Cleanup**: Deaktivieren

---

## II. Nixpacks Build Engine

Nixpacks ist ein von Railway eingeführtes Open-Source-Build-Tool, das Quellcode in Standard-Docker-Images erstellt. Dokploy verwendet Nixpacks als Standard-Build-Engine und unterstützt die Angabe von Build-Konfigurationen in `nixpacks.toml`- oder `nixpacks.json`-Dateien. Erstellen Sie eine `nixpacks.toml`-Datei im Projektstammverzeichnis und konfigurieren Sie die entsprechenden Cache-Verzeichnisse.

### Konfigurationspriorität (Niedrig → Hoch):

1. Standardlogik des Anbieters
2. `nixpacks.toml`
3. Umgebungsvariablen
4. CLI-Argumente

### Häufige Umgebungsvariablen

| Variablenname                 | Beschreibung                               |
| :---------------------------- | :----------------------------------------- |
| `NIXPACKS_INSTALL_CMD`        | Benutzerdefinierter Installationsbefehl    |
| `NIXPACKS_BUILD_CMD`          | Benutzerdefinierter Build-Befehl           |
| `NIXPACKS_START_CMD`          | Benutzerdefinierter Startbefehl            |
| `NIXPACKS_PKGS`               | Zusätzliche Nix-Pakete installieren        |
| `NIXPACKS_APT_PKGS`           | Zusätzliche Apt-Pakete installieren        |
| `NIXPACKS_INSTALL_CACHE_DIRS` | Cache-Verzeichnisse der Installationsphase |
| `NIXPACKS_BUILD_CACHE_DIRS`   | Cache-Verzeichnisse der Build-Phase        |
| `NIXPACKS_NO_CACHE`           | Cache deaktivieren (nicht empfohlen)       |
| `NIXPACKS_CONFIG_FILE`        | Konfigurationsdatei angeben                |
| `NIXPACKS_DEBIAN`             | Debian-Basisimage aktivieren               |

## III. Astro-Projektkonfiguration

Astro ist ein modernes Web-Framework für Content-Websites, das sich besonders für statische Websites wie Blogs, Marketingseiten und E-Commerce eignet. Wenn eine Website eine große Anzahl von Bildern und statischen Ressourcen enthält, kann die Build-Geschwindigkeit beeinträchtigt werden. Durch die Aktivierung von Caching-Mechanismen kann die Build-Effizienz erheblich verbessert werden.

### 1. Build-Cache-Artefaktverzeichnis konfigurieren:

Astro-Projekte müssen in der Konfigurationsdatei ein Cache-Verzeichnis angeben, um frühere Build-Artefakte in nachfolgenden Builds wiederzuverwenden. Dateien in diesem Verzeichnis werden in nachfolgenden Builds verwendet, um die Build-Zeit zu verkürzen.
Dieser Wert kann ein absoluter Pfad oder ein relativer Pfad sein.

```js
//`astro.config.mjs`
export default defineConfig({
  cacheDir: "./astro_cache",
});
```

---

### 2. Nixpacks-Cache-Konfigurationsdatei

Erstellen Sie eine `nixpacks.toml`-Datei im Astro-Projektstammverzeichnis und konfigurieren Sie Cache-Verzeichnisse und Build-Befehle.

```toml
# Verwenden Sie die angegebenen Node.js- und pnpm-Versionen
[phases.setup]
nixPkgs = ["nodejs_22", "pnpm"]

# Abhängigkeiten installieren und pnpm-Cache aktivieren
[phases.install]
cmds = ["pnpm install --frozen-lockfile"]
cacheDirectories = ["/root/.local/share/pnpm/store/v3"]

# Astro-Projekt erstellen und node_modules/.cache und astro_cache zwischenspeichern
[phases.build]
cmds = ["pnpm run build"]
cacheDirectories = [
  "node_modules/.cache",
  "astro_cache"
]

# Startbefehl (Sie verwenden NGINX, um das statische dist-Verzeichnis bereitzustellen, dies ist nur ein Platzhalter)
[start]
cmd = "echo 'Build abgeschlossen, bitte greifen Sie über NGINX auf das dist-Verzeichnis zu'"
```

---

## 3. Docker-Build-Kontext optimieren

Fügen Sie `.dockerignore` zum Astro-Projektstammverzeichnis hinzu:

```
node_modules
astro_cache
dist
*.log
.DS_Store
.vscode
.env*
```

---

## IV. Bereitstellung und Überprüfung

Überprüfen Sie nach der automatischen Bereitstellung von Dokploy die Build-Protokolle auf den folgenden Inhalt, um sicherzustellen, dass das Caching wirksam ist:

### 1. Der Build-Befehl verwendete den gemounteten Cache

```bash
RUN --mount=type=cache,id=xxxx-node_modules/cache,target=/app/node_modules/.cache \
    --mount=type=cache,id=xxxx-astro_cache,target=/app/astro_cache \
    pnpm run build
```

### 2. Astro-Build hat Cache-Einträge wiederverwendet (insbesondere Bildoptimierung)

```bash
▶ /_astro/202409272055577_Z2smeTW.avif (reused cache entry)
▶ /_astro/202409272055575_Z2wPyJN.avif (reused cache entry)
▶ /_astro/202409272055577_1IgP6g.avif (reused cache entry)
```

✅ Wenn Sie die obigen Mount-Cache-Protokolle und den Text "reused cache entry" sehen, bedeutet dies, dass der Caching-Mechanismus erfolgreich aktiviert wurde und der Build eine inkrementelle Beschleunigung erreicht hat.

🎉 Auf der Registerkarte Deployments des Dokploy-Projekts können Sie auch sehen, dass das Erstellen des Projekts ohne Cache-Einstellungen 31 Minuten dauert, während es bei aktivierten Cache-Einstellungen nur 3 Minuten dauert, was die Build-Zeit erheblich verkürzt und Datenverkehr und Bandbreite spart.

## V. Website mit Tencent EdgeOne beschleunigen

## Hintergrund: Das "Unmögliche Dreieck" der grenzüberschreitenden Übertragung

Bereitstellung von Servern in Singapur. Diese Lösung ist kostengünstig und erfordert keine umständlichen Registrierungsprozesse, aber für Benutzer auf dem chinesischen Festland steht das Zugriffserlebnis oft vor großen Herausforderungen:

1. **Hohe physische Latenz**: Die RTT (Round Trip Time) von Singapur zum chinesischen Festland schwankt normalerweise zwischen 50 ms und 200 ms.
2. **Schwerer Paketverlust**: Durch die GFW-Firewall gestört, kommt es bei TCP-Handshakes häufig zu Zeitüberschreitungen, was dazu führt, dass Bilder beim Laden hängen bleiben (Pending).
3. **Sprungverzögerung**: Mehrseitige Anwendungen erfordern beim Klicken auf Links lange Wartezeiten auf einem weißen Bildschirm.

Um dieses Problem zu lösen, haben wir **Tencent Cloud EdgeOne** in Verbindung mit der verfeinerten Konfiguration von **Traefik** verwendet, um eine "Kombination" zu erstellen, die ein fast sofortiges Öffnungserlebnis nahe an lokal registrierten Websites erzielt.

### Kernarchitekturidee

Unsere Optimierungsstrategie dreht sich um drei Schlüsselwörter: **Anti-Paketverlust**, **Komprimierungs-Offloading** und **Schicht-Caching**.

1. **Protokollschicht (EdgeOne)**: Nutzen Sie das **HTTP/3 (QUIC)**-Protokoll basierend auf UDP-Eigenschaften, um Unterbrechungen beim Laden von Inhalten, die durch grenzüberschreitenden TCP-Paketverlust verursacht werden, vollständig zu lösen.
2. **Transportschicht (Traefik -> EdgeOne)**: Schalten Sie die Traefik-Ursprungskomprimierung aus und lassen Sie EdgeOne-Edge-Knoten für eine effizientere intelligente **Brotli**-Komprimierung verantwortlich sein, um das Übertragungsvolumen zu reduzieren.
3. **Cache-Schicht (Strategie)**: Verwenden Sie `s-maxage`, um die Trennung von "Langfristigem CDN-Cache" und "Kurzfristigem Browser-Cache" zu erreichen und sowohl die CDN-Trefferquote als auch die Aktualität der Inhalte sicherzustellen.

### I. Globale EdgeOne-Konfiguration (Modus "Anti-Paketverlust" aktivieren)

Obwohl EdgeOne keine inländischen Knoten für nicht registrierte Domains bereitstellen kann, sind seine Edge-Knoten (Hongkong/Singapur) zu inländischen Leitungen optimiert und unterstützen das QUIC-Protokoll, das der Schlüssel zur Lösung von "Netzwerkverzögerungen" ist.

Rufen Sie die EdgeOne-Konsole auf -> **Website-Beschleunigung** -> **Funktionskonfiguration**:

### 1. HTTP/3 (QUIC) aktivieren ✅

Dies ist der kritischste Schritt. In grenzüberschreitenden Netzwerken mit hohen Paketverlustraten kann das QUIC-Protokoll TCP-Head-of-Line-Blocking effektiv vermeiden. Nach der Aktivierung verschwindet das Phänomen von "sich drehenden" oder "halb geladenen" Bildern vollständig.

### 2. Intelligente Komprimierung aktivieren (Brotli + Gzip) ✅

Es wird empfohlen, sowohl Brotli als auch Gzip zu aktivieren. EdgeOne priorisiert die Rückgabe des **Brotli (`br`)**-Formats an unterstützte Browser, das eine um 15 % bis 20 % höhere Komprimierungsrate als Gzip aufweist. Je kleiner das Volumen, desto schneller passiert es die Wand.

### 3. Cache-Vorabaktualisierung aktivieren (90%) ✅

Stellen Sie das Vorabaktualisierungsverhältnis auf **90%** ein. Dies bedeutet, dass das CDN in den letzten 10 % der Zeit vor Ablauf des Caches asynchron zur Quelle zurückkehrt, um es zu aktualisieren. Benutzer werden niemals auf Verzögerungen stoßen, die durch "Cache-Ablauf, der zur Rückkehr zur Quelle führt" verursacht werden, und erzielen ein 100%iges Treffererlebnis.

## II. Optimierung der Traefik-Konfiguration (Ursprungsstrategie)

Wir müssen die `dynamic_conf.yml` von Traefik (oder Docker-Labels) ändern, um zwei Dinge zu tun: **Komprimierung auslagern** und **Verfeinerte Cache-Header einfügen**.

### 1. Ursprungskomprimierung deaktivieren

Bitte überprüfen Sie Ihre Router-Konfiguration und **entfernen** Sie alle `compress` (Gzip)-Middleware.

- **Grund**: EdgeOne ist bereits für die Brotli-Komprimierung verantwortlich. Wenn Sie Gzip am Ursprung erneut ausführen, wird CPU verschwendet und es können Probleme mit doppelter Komprimierung auftreten.

### 2. Schicht-Caching-Strategie definieren (Kerncode)

Dies ist der Kern zur Lösung des Widerspruchs zwischen "Benutzer können nach der Veröffentlichung von Artikeln keine neuen Inhalte sehen" und "Die direkte Rückkehrgeschwindigkeit zur Quelle ist zu langsam".

Wir definieren eine Middleware speziell für HTML-Seiten in Traefik:

```yaml
http:
  routers:
    # HTTPS-Umleitung erzwingen
    idimi-uygy0r-redirect-https:
      entryPoints:
        - web
      rule: Host(`realrip.com`)
      middlewares:
        - idimi-uygy0r-to-https
      service: noop@internal
      priority: 1000

    # Service Worker (PWA-Kern) - Keine Komprimierung, von EdgeOne verarbeitet
    idimi-uygy0r-sw:
      rule: >
        Host(`realrip.com`) &&
        ( Path(`/service-worker.js`) || Path(`/sw.js`) )
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-no-store
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 900

    # Astro-Kernstatische Ressourcen (Hash-Fingerabdruck) - Keine Komprimierung, von EdgeOne verarbeitet
    idimi-uygy0r-static-immutable:
      rule: >
        Host(`realrip.com`) &&
        ( PathPrefix(`/_astro`) || PathPrefix(`/assets`) )
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-cache-static-immutable
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 800

    # Pagefind WASM-Dateien - Keine Komprimierung, von EdgeOne verarbeitet
    idimi-uygy0r-pagefind-wasm-ctype:
      rule: >
        Host(`realrip.com`) &&
        PathRegexp(`^/pagefind/.*\\.wasm$`)
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-set-wasm-ctype
        - idimi-uygy0r-cache-static-immutable
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 760

    # Pagefind-Indexdateien - Keine Komprimierung, von EdgeOne verarbeitet
    idimi-uygy0r-pagefind-immutable:
      rule: >
        Host(`realrip.com`) &&
        PathPrefix(`/pagefind`)
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-cache-static-immutable
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 750

    # Sitemap / Robots / RSS - Keine Komprimierung, von EdgeOne verarbeitet
    idimi-uygy0r-meta-short:
      rule: >
        Host(`realrip.com`) &&
        ( Path(`/sitemap.xml`) ||
          Path(`/robots.txt`) ||
          Path(`/sitemap-index.xml`) ||
          Path(`/atom.xml`) || Path(`/rss.xml`) || Path(`/feed.xml`) )
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-cache-short
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 700

    # Manifest - Keine Komprimierung, von EdgeOne verarbeitet
    idimi-uygy0r-manifest:
      rule: >
        Host(`realrip.com`) &&
        ( Path(`/manifest.webmanifest`) ||
          Path(`/site.webmanifest`) ||
          Path(`/browserconfig.xml`) )
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-cache-1d
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 650

    # Andere statische Dateien (Bilder/Videos usw.) - Keine Komprimierung, von EdgeOne verarbeitet
    idimi-uygy0r-public-30d:
      rule: >
        Host(`realrip.com`) &&
        PathRegexp(`.+\\..+`)
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-cache-30d-swr
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 600

    # HTML-Seiten (Fallback-Regel) - Keine Komprimierung, von EdgeOne verarbeitet
    # s-maxage=3600 Trennungsstrategie angewendet
    idimi-uygy0r-pages:
      rule: Host(`realrip.com`)
      service: idimi-uygy0r-app
      middlewares:
        - idimi-uygy0r-cache-html
        - idimi-uygy0r-security-headers
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 100

  services:
    idimi-uygy0r-app:
      loadBalancer:
        servers:
          - url: http://idimi-idimi-uygy0r:80
        passHostHeader: true

  middlewares:
    idimi-uygy0r-to-https:
      redirectScheme:
        scheme: https
        permanent: true

    # --- Komprimierungs-Middleware-Definition beibehalten, aber nicht aufgerufen (aus Routern entfernt) ---
    idimi-uygy0r-gzip-compress:
      compress:
        minResponseBodyBytes: 1024
        excludedContentTypes:
          - "image/png"
          - "image/jpeg"
          - "image/gif"
          - "image/webp"
          - "image/avif"
          - "font/*"

    idimi-uygy0r-security-headers:
      headers:
        addVaryHeader: true
        stsSeconds: 31536000
        stsIncludeSubdomains: true
        stsPreload: true
        contentTypeNosniff: true
        browserXssFilter: true
        referrerPolicy: "strict-origin-when-cross-origin"
        permissionsPolicy: "geolocation=(), microphone=(), camera=()"
        frameDeny: true
        customResponseHeaders:
          Timing-Allow-Origin: "*"

    idimi-uygy0r-no-store:
      headers:
        customResponseHeaders:
          Cache-Control: "no-cache, no-store, must-revalidate"

    idimi-uygy0r-cache-short:
      headers:
        customResponseHeaders:
          Cache-Control: "public, max-age=600, stale-while-revalidate=600"
          Vary: "Accept-Encoding"

    idimi-uygy0r-cache-1d:
      headers:
        customResponseHeaders:
          Cache-Control: "public, max-age=86400, stale-while-revalidate=86400"
          Vary: "Accept-Encoding"

    idimi-uygy0r-cache-30d-swr:
      headers:
        customResponseHeaders:
          Cache-Control: "public, max-age=2592000, stale-while-revalidate=604800"
          Vary: "Accept-Encoding"

    idimi-uygy0r-cache-static-immutable:
      headers:
        customResponseHeaders:
          Cache-Control: "public, max-age=31536000, immutable"
          Vary: "Accept-Encoding"

    # Wichtige Änderung: HTML-Cache-Strategie
    # Browser speichert 5 Minuten (300s), CDN speichert 1 Stunde (3600s)
    idimi-uygy0r-cache-html:
      headers:
        customResponseHeaders:
          Cache-Control: "public, max-age=300, s-maxage=3600, stale-while-revalidate=600"
          Vary: "Accept-Encoding"

    idimi-uygy0r-set-wasm-ctype:
      headers:
        customResponseHeaders:
          Content-Type: "application/wasm"
```

**Erklärung der Konfiguration:**

- **`s-maxage=3600`**: Dies ist eine Anweisung, die speziell für das CDN geschrieben wurde. EdgeOne sieht dies und speichert die HTML-Seite 1 Stunde lang zwischen.
- **`max-age=300`**: Wenn EdgeOne es an den Benutzer sendet, wird `s-maxage` entfernt, und der Browser des Benutzers sieht nur 300 Sekunden (5 Minuten).
- **Effekt**: Das CDN verarbeitet den Datenverkehr 1 Stunde lang, während Benutzer nur 5 Minuten warten müssen, um neu veröffentlichte Artikel zu sehen.

## III. EdgeOne-Regel-Engine

Aufgrund der URL-Struktur von Astro (kein Suffix) und des dynamischen Bilddienstes (`/_image`) sind genaue Regeln erforderlich, um den Cache zu treffen.

Konfigurieren Sie in der EdgeOne **Regel-Engine** die folgenden Regeln strikt **in der Reihenfolge**:

### Regel 1: Astro-Kernstatische Ressourcen (Permanenter Cache)

Astro-Assets, Build-Artefakte und dynamischer Bilddienst, Inhalte, die sich nie ändern oder extrem viel CPU verbrauchen, müssen zwangsweise zwischengespeichert werden.

- **Übereinstimmungsbedingung**: `URL-Pfad` -> `Regex-Übereinstimmung`
- **Übereinstimmungswert**: `^/(_astro|assets|pagefind|_image)/`
- _Hinweis: `_image` wird hier hinzugefügt, um speziell dynamische optimierte Bilder zu optimieren, die von der `<Image />`-Komponente von Astro generiert werden._
- **Aktion**:
  - Knoten-Cache: **365 Tage** (Erzwingen)
  - Browser-Cache: **365 Tage**

### Regel 2: Reguläre statische Dateien

- **Übereinstimmungsbedingung**: `Dateierweiterung` entspricht `png, jpg, jpeg, webp, css, js` usw.
- **Aktion**: Knoten-Cache **30 Tage** (Erzwingen).

### Regel 3: Service Worker (PWA-Kern)

- **Übereinstimmungsbedingung**: `URL-Pfad` entspricht `/sw.js` oder `/service-worker.js`.
- **Aktion**: Knoten-Cache **1 Stunde** (Erzwingen).
- _Warnung: Nicht zu lange zwischenspeichern, da PWA sonst nach der Veröffentlichung nicht rechtzeitig aktualisiert werden kann._

### Regel 4: Fallback-Regel (HTML-Seiten)

- **Übereinstimmungsbedingung**: (Keine Bedingung / Entspricht allen verbleibenden Anfragen)
- **Aktion**:
  - Knoten-Cache: **Ursprung folgen** (d. h. `s-maxage=3600` von Traefik lesen).
  - Browser-Cache: **Ursprung folgen** (d. h. `max-age=300` von Traefik lesen).

## IV. Optimierung auf Astro-Codeebene (Wahrgenommene Beschleunigung)

Um Seitenübergänge so reibungslos wie "native Apps" zu gestalten und das Warten auf einen weißen Bildschirm während der Sprünge vollständig zu eliminieren, müssen wir den **Client Router (ehemals View Transitions)** von Astro nutzen.

### 1. Client Router aktivieren

Fügen Sie im `<head>` von `src/layouts/MainLayout.astro` hinzu:

```js
import { ClientRouter } from 'astro:transitions';

<head>
  <!-- Andere Meta-Tags -->
  <ClientRouter />
</head>
```

### 2. Vorabladen (Prefetch) aktivieren

Konfigurieren Sie die Vorabladestrategie in `astro.config.mjs`:

```js
export default defineConfig({
  // 'viewport': Herunterladen, wenn der Link in das Ansichtsfenster gelangt (Gleichgewicht zwischen Verkehr und Geschwindigkeit)
  // 'load': Alle Links sofort nach dem Laden der Seite herunterladen (extreme Geschwindigkeit, verbraucht aber Bandbreite)
  prefetch: {
    defaultStrategy: "viewport",
  },
  // ...
});
```
