---
title: "Déployer des projets Astro avec Dokploy et Nixpacks et activer le cache pour optimiser la vitesse de construction"
description: "Déployez rapidement des sites web statiques Astro en utilisant Dokploy et Nixpacks, en activant pleinement les mécanismes de mise en cache pour améliorer considérablement la vitesse de construction. Le tutoriel couvre la configuration d'Astro, les paramètres des variables d'environnement Dokploy et les stratégies d'optimisation du cache Nixpacks, adaptés aux pratiques d'intégration et de déploiement continus pour les sites web axés sur le contenu."
category: "startup"
tags:
  - "innovation"
pubDate: 2025-07-14
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20250714082742453.avif"
heroImageAlt: "ZBZ-Déployer des projets Astro avec Dokploy et Nixpacks et activer le cache pour optimiser la vitesse de construction"
heroImageWidth: 1960
heroImageHeight: 1102
draft: false
featured: false
locale: fr
---

## I. Configuration de Dokploy

Dokploy est une plateforme de déploiement open-source et auto-hébergeable, conçue comme une alternative gratuite à Heroku, Vercel et Netlify, construite sur Docker et Traefik.

### 1. Créer un nouveau projet et connecter le dépôt GitHub

### 2. Définir les variables d'environnement

```bash
NIXPACKS_NODE_VERSION=22
NIXPACKS_PNPM_STORE_PATH=/root/.local/share/pnpm/store/v3
NIXPACKS_INSTALL_CACHE_DIRS=/app/node_modules
NIXPACKS_BUILD_CACHE_DIRS=/app/node_modules/.cache,/app/astro_cache
```

### 3. Désactiver le nettoyage du cache

- Service de projet → **Clean Cache** : Désactiver
- Serveur Web → **Daily Docker Cleanup** : Désactiver

---

## II. Moteur de construction Nixpacks

Nixpacks est un outil de construction open-source lancé par Railway qui construit le code source en images Docker standard. Dokploy utilise Nixpacks comme moteur de construction par défaut et prend en charge la spécification des configurations de construction dans les fichiers `nixpacks.toml` ou `nixpacks.json`. Créez un fichier `nixpacks.toml` à la racine du projet et configurez les répertoires de cache pertinents.

### Priorité de configuration (Bas → Haut) :

1. Logique par défaut du fournisseur
2. `nixpacks.toml`
3. Variables d'environnement
4. Arguments CLI

### Variables d'environnement courantes

| Nom de la variable            | Description                                      |
| :---------------------------- | :----------------------------------------------- |
| `NIXPACKS_INSTALL_CMD`        | Commande d'installation personnalisée            |
| `NIXPACKS_BUILD_CMD`          | Commande de construction personnalisée           |
| `NIXPACKS_START_CMD`          | Commande de démarrage personnalisée              |
| `NIXPACKS_PKGS`               | Installer des paquets Nix supplémentaires        |
| `NIXPACKS_APT_PKGS`           | Installer des paquets Apt supplémentaires        |
| `NIXPACKS_INSTALL_CACHE_DIRS` | Répertoires de cache de la phase d'installation  |
| `NIXPACKS_BUILD_CACHE_DIRS`   | Répertoires de cache de la phase de construction |
| `NIXPACKS_NO_CACHE`           | Désactiver le cache (non recommandé)             |
| `NIXPACKS_CONFIG_FILE`        | Spécifier le fichier de configuration            |
| `NIXPACKS_DEBIAN`             | Activer l'image de base Debian                   |

## III. Configuration du projet Astro

Astro est un framework Web moderne pour les sites de contenu, particulièrement adapté aux sites statiques comme les blogs, les pages marketing et le commerce électronique. Lorsqu'un site Web contient un grand nombre d'images et de ressources statiques, la vitesse de construction peut être affectée. En activant les mécanismes de mise en cache, l'efficacité de la construction peut être considérablement améliorée.

### 1. Configurer le répertoire des artefacts de cache de construction :

Les projets Astro doivent spécifier un répertoire de cache dans le fichier de configuration pour réutiliser les artefacts de construction précédents lors des constructions ultérieures. Les fichiers de ce répertoire seront utilisés dans les constructions ultérieures pour accélérer le temps de construction.
Cette valeur peut être un chemin absolu ou un chemin relatif.

```js
//`astro.config.mjs`
export default defineConfig({
  cacheDir: "./astro_cache",
});
```

---

### 2. Fichier de configuration du cache Nixpacks

Créez un fichier `nixpacks.toml` à la racine du projet Astro et configurez les répertoires de cache et les commandes de construction.

```toml
# Utiliser les versions spécifiées de Node.js et pnpm
[phases.setup]
nixPkgs = ["nodejs_22", "pnpm"]

# Installer les dépendances et activer le cache pnpm
[phases.install]
cmds = ["pnpm install --frozen-lockfile"]
cacheDirectories = ["/root/.local/share/pnpm/store/v3"]

# Construire le projet Astro et mettre en cache node_modules/.cache et astro_cache
[phases.build]
cmds = ["pnpm run build"]
cacheDirectories = [
  "node_modules/.cache",
  "astro_cache"
]

# Commande de démarrage (vous utilisez NGINX pour servir le répertoire statique dist, ceci est juste un espace réservé)
[start]
cmd = "echo 'Construction terminée, veuillez accéder au répertoire dist via NGINX'"
```

---

## 3. Optimiser le contexte de construction Docker

Ajoutez `.dockerignore` à la racine du projet Astro :

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

## IV. Déploiement et vérification

Après le déploiement automatique de Dokploy, veuillez vérifier les journaux de construction pour le contenu suivant afin de confirmer que la mise en cache est efficace :

### 1. La commande de construction a utilisé le cache monté

```bash
RUN --mount=type=cache,id=xxxx-node_modules/cache,target=/app/node_modules/.cache \
    --mount=type=cache,id=xxxx-astro_cache,target=/app/astro_cache \
    pnpm run build
```

### 2. La construction Astro a réutilisé les entrées de cache (en particulier l'optimisation des images)

```bash
▶ /_astro/202409272055577_Z2smeTW.avif (reused cache entry)
▶ /_astro/202409272055575_Z2wPyJN.avif (reused cache entry)
▶ /_astro/202409272055577_1IgP6g.avif (reused cache entry)
```

✅ Si vous voyez les journaux de cache de montage ci-dessus et le texte "reused cache entry", cela signifie que le mécanisme de mise en cache a été activé avec succès et que la construction a atteint une accélération incrémentielle.

🎉 Depuis l'onglet Deployments du projet Dokploy, vous pouvez également voir que sans les paramètres de cache, la construction du projet prend 31 minutes, tandis qu'avec les paramètres de cache activés, cela ne prend que 3 minutes, ce qui réduit considérablement le temps de construction et économise du trafic et de la bande passante.

## V. Accélérer le site avec Tencent EdgeOne

## Contexte : Le "Triangle Impossible" de la transmission transfrontalière

Déploiement de serveurs à Singapour. Cette solution est rentable et ne nécessite pas de processus d'enregistrement fastidieux, mais pour les utilisateurs en Chine continentale, l'expérience d'accès est souvent confrontée à d'énormes défis :

1. **Latence physique élevée** : Le RTT (Round Trip Time) de Singapour à la Chine continentale fluctue généralement entre 50 ms et 200 ms.
2. **Perte de paquets sévère** : Interféré par le pare-feu GFW, les poignées de main TCP expirent souvent, ce qui fait que les images se bloquent à mi-chargement (Pending).
3. **Décalage de saut** : Les applications multi-pages nécessitent de longues attentes sur écran blanc lors du clic sur des liens.

Pour résoudre ce problème, nous avons utilisé **Tencent Cloud EdgeOne** en conjonction avec la configuration raffinée de **Traefik** pour créer un "combo", réalisant une expérience d'ouverture quasi instantanée proche des sites Web enregistrés localement.

### Idée d'architecture de base

Notre stratégie d'optimisation s'articule autour de trois mots-clés : **Anti-Perte de Paquets**, **Déchargement de la Compression**, et **Mise en Cache par Couches**.

1. **Couche Protocole (EdgeOne)** : Utiliser le protocole **HTTP/3 (QUIC)** basé sur les caractéristiques UDP pour résoudre complètement les interruptions de chargement de contenu causées par la perte de paquets transfrontaliers TCP.
2. **Couche Transport (Traefik -> EdgeOne)** : Désactiver la compression d'origine Traefik et laisser les nœuds de périphérie EdgeOne être responsables d'une compression intelligente **Brotli** plus efficace pour réduire le volume de transmission.
3. **Couche Cache (Stratégie)** : Utiliser `s-maxage` pour réaliser la séparation du "Cache CDN à long terme" et du "Cache navigateur à court terme", assurant à la fois le taux de réussite CDN et la rapidité de mise à jour du contenu.

### I. Configuration globale EdgeOne (Activer le mode "Anti-Perte de Paquets")

Bien qu'EdgeOne ne puisse pas fournir de nœuds domestiques pour les domaines non enregistrés, ses nœuds de périphérie (Hong Kong/Singapour) vers les lignes domestiques sont optimisés et prennent en charge le protocole QUIC, qui est la clé pour résoudre le "décalage réseau".

Entrez dans la console EdgeOne -> **Accélération de site** -> **Configuration des fonctionnalités** :

### 1. Activer HTTP/3 (QUIC) ✅

C'est l'étape la plus critique. Dans les réseaux transfrontaliers avec des taux de perte de paquets élevés, le protocole QUIC peut éviter efficacement le blocage de tête de ligne TCP. Après l'activation, le phénomène d'images qui "tournent" ou "chargent à moitié" disparaîtra complètement.

### 2. Activer la compression intelligente (Brotli + Gzip) ✅

Il est recommandé d'activer à la fois Brotli et Gzip. EdgeOne donnera la priorité au retour du format **Brotli (`br`)** aux navigateurs pris en charge, qui a un taux de compression de 15 % à 20 % supérieur à Gzip. Plus le volume est petit, plus il traverse le mur rapidement.

### 3. Activer le pré-rafraîchissement du cache (90%) ✅

Réglez le rapport de pré-rafraîchissement sur **90%**. Cela signifie que dans les derniers 10 % du temps avant l'expiration du cache, le CDN retournera de manière asynchrone à la source pour la mise à jour. Les utilisateurs ne rencontreront jamais de décalage causé par "l'expiration du cache entraînant un retour à la source", réalisant une expérience de réussite à 100 %.

## II. Optimisation de la configuration Traefik (Stratégie d'origine)

Nous devons modifier le `dynamic_conf.yml` de Traefik (ou les étiquettes Docker) pour faire deux choses : **Décharger la compression** et **Injecter des en-têtes de cache raffinés**.

### 1. Désactiver la compression d'origine

Veuillez vérifier votre configuration de routeurs et **supprimer** tous les middlewares `compress` (Gzip).

- **Raison** : EdgeOne est déjà responsable de la compression Brotli. Faire Gzip à l'origine à nouveau gaspillera du CPU et peut causer des problèmes de double compression.

### 2. Définir la stratégie de cache par couches (Code principal)

C'est le cœur pour résoudre la contradiction entre "les utilisateurs ne peuvent pas voir le nouveau contenu après la publication d'articles" et "la vitesse de retour direct à la source est trop lente".

Nous définissons un middleware spécifiquement pour les pages HTML dans Traefik :

```yaml
http:
  routers:
    # Forcer la redirection HTTPS
    idimi-uygy0r-redirect-https:
      entryPoints:
        - web
      rule: Host(`realrip.com`)
      middlewares:
        - idimi-uygy0r-to-https
      service: noop@internal
      priority: 1000

    # Service Worker (Cœur PWA) - Pas de compression, géré par EdgeOne
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

    # Ressources statiques principales Astro (Empreinte Hash) - Pas de compression, géré par EdgeOne
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

    # Fichiers WASM Pagefind - Pas de compression, géré par EdgeOne
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

    # Fichiers d'index Pagefind - Pas de compression, géré par EdgeOne
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

    # Sitemap / Robots / RSS - Pas de compression, géré par EdgeOne
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

    # Manifest - Pas de compression, géré par EdgeOne
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

    # Autres fichiers statiques (Images/Vidéos etc.) - Pas de compression, géré par EdgeOne
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

    # Pages HTML (Règle de repli) - Pas de compression, géré par EdgeOne
    # Stratégie de séparation s-maxage=3600 appliquée
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

    # --- Définition du middleware de compression conservée mais non appelée (supprimée des routeurs) ---
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

    # Modification clé : Stratégie de cache HTML
    # Le navigateur met en cache pendant 5 minutes (300s), le CDN met en cache pendant 1 heure (3600s)
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

**Explication de la configuration :**

- **`s-maxage=3600`** : C'est une directive spécifiquement écrite pour le CDN. EdgeOne voit cela et met en cache la page HTML pendant 1 heure.
- **`max-age=300`** : Lorsque EdgeOne l'envoie à l'utilisateur, il supprime `s-maxage`, et le navigateur de l'utilisateur ne voit que 300 secondes (5 minutes).
- **Effet** : Le CDN gère le trafic pendant 1 heure, tandis que les utilisateurs n'ont besoin d'attendre que 5 minutes pour voir les articles nouvellement publiés.

## III. Moteur de règles EdgeOne

En raison de la structure d'URL d'Astro (pas de suffixe) et du service d'image dynamique (`/_image`), des règles précises sont nécessaires pour atteindre le cache.

Dans le **Moteur de règles** EdgeOne, configurez les règles suivantes strictement **dans l'ordre** :

### Règle 1 : Ressources statiques principales Astro (Cache permanent)

Les actifs d'Astro, les artefacts de construction et le service d'image dynamique, le contenu qui ne change jamais ou consomme énormément de CPU, doivent être mis en cache de force.

- **Condition de correspondance** : `Chemin URL` -> `Correspondance Regex`
- **Valeur de correspondance** : `^/(_astro|assets|pagefind|_image)/`
- _Remarque : `_image` est ajouté ici, optimisant spécifiquement les images optimisées dynamiques générées par le composant `<Image />` d'Astro._
- **Action** :
  - Cache de nœud : **365 jours** (Forcer)
  - Cache du navigateur : **365 jours**

### Règle 2 : Fichiers statiques réguliers

- **Condition de correspondance** : `Extension de fichier` égale à `png, jpg, jpeg, webp, css, js`, etc.
- **Action** : Cache de nœud **30 jours** (Forcer).

### Règle 3 : Service Worker (Cœur PWA)

- **Condition de correspondance** : `Chemin URL` égal à `/sw.js` ou `/service-worker.js`.
- **Action** : Cache de nœud **1 heure** (Forcer).
- _Avertissement : Ne mettez pas en cache trop longtemps, sinon la PWA ne pourra pas être mise à jour à temps après la publication._

### Règle 4 : Règle de repli (Pages HTML)

- **Condition de correspondance** : (Pas de condition / Correspond à toutes les demandes restantes)
- **Action** :
  - Cache de nœud : **Suivre l'origine** (c'est-à-dire lire `s-maxage=3600` de Traefik).
  - Cache du navigateur : **Suivre l'origine** (c'est-à-dire lire `max-age=300` de Traefik).

## IV. Optimisation au niveau du code Astro (Accélération perçue)

Pour rendre les transitions de page aussi fluides que les "applications natives" et éliminer complètement l'attente sur écran blanc pendant les sauts, nous devons utiliser le **Client Router (anciennement View Transitions)** d'Astro.

### 1. Activer le Client Router

Ajoutez dans le `<head>` de `src/layouts/MainLayout.astro` :

```js
import { ClientRouter } from 'astro:transitions';

<head>
  <!-- Autres balises meta -->
  <ClientRouter />
</head>
```

### 2. Activer le préchargement (Prefetch)

Configurez la stratégie de préchargement dans `astro.config.mjs` :

```js
export default defineConfig({
  // 'viewport' : Télécharger lorsque le lien entre dans la fenêtre d'affichage (équilibre trafic et vitesse)
  // 'load' : Télécharger tous les liens immédiatement après le chargement de la page (vitesse extrême, mais consomme de la bande passante)
  prefetch: {
    defaultStrategy: "viewport",
  },
  // ...
});
```
