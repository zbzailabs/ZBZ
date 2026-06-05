---
title: "Desplegar proyectos Astro con Dokploy y Nixpacks y habilitar caché para optimizar la velocidad de construcción"
description: "Despliegue rápidamente sitios web estáticos de Astro utilizando Dokploy y Nixpacks, habilitando completamente los mecanismos de caché para mejorar significativamente la velocidad de construcción. El tutorial cubre la configuración de Astro, la configuración de variables de entorno de Dokploy y las estrategias de optimización de caché de Nixpacks, adecuadas para prácticas de integración y despliegue continuo para sitios web basados en contenido."
category: "startup"
tags:
  - "innovation"
pubDate: 2025-07-14
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20250714082742453.avif"
heroImageAlt: "RealRip-Desplegar proyectos Astro con Dokploy y Nixpacks y habilitar caché para optimizar la velocidad de construcción"
heroImageWidth: 1960
heroImageHeight: 1102
draft: false
featured: false
locale: es
---

## I. Configuración de Dokploy

Dokploy es una plataforma de despliegue de código abierto y autoalojable, diseñada como una alternativa gratuita a Heroku, Vercel y Netlify, construida sobre Docker y Traefik.

### 1. Crear un nuevo proyecto y conectar el repositorio de GitHub

### 2. Establecer variables de entorno

```bash
NIXPACKS_NODE_VERSION=22
NIXPACKS_PNPM_STORE_PATH=/root/.local/share/pnpm/store/v3
NIXPACKS_INSTALL_CACHE_DIRS=/app/node_modules
NIXPACKS_BUILD_CACHE_DIRS=/app/node_modules/.cache,/app/astro_cache
```

### 3. Desactivar limpieza de caché

- Servicio del proyecto → **Clean Cache**: Desactivar
- Servidor web → **Daily Docker Cleanup**: Desactivar

---

## II. Motor de construcción Nixpacks

Nixpacks es una herramienta de construcción de código abierto lanzada por Railway que construye código fuente en imágenes Docker estándar. Dokploy utiliza Nixpacks como motor de construcción predeterminado y admite la especificación de configuraciones de construcción en archivos `nixpacks.toml` o `nixpacks.json`. Cree un archivo `nixpacks.toml` en el directorio raíz del proyecto y configure los directorios de caché relevantes.

### Prioridad de configuración (Baja → Alta):

1. Lógica predeterminada del proveedor
2. `nixpacks.toml`
3. Variables de entorno
4. Argumentos CLI

### Variables de entorno comunes

| Nombre de la variable         | Descripción                                     |
| :---------------------------- | :---------------------------------------------- |
| `NIXPACKS_INSTALL_CMD`        | Comando de instalación personalizado            |
| `NIXPACKS_BUILD_CMD`          | Comando de construcción personalizado           |
| `NIXPACKS_START_CMD`          | Comando de inicio personalizado                 |
| `NIXPACKS_PKGS`               | Instalar paquetes Nix adicionales               |
| `NIXPACKS_APT_PKGS`           | Instalar paquetes Apt adicionales               |
| `NIXPACKS_INSTALL_CACHE_DIRS` | Directorios de caché de la fase de instalación  |
| `NIXPACKS_BUILD_CACHE_DIRS`   | Directorios de caché de la fase de construcción |
| `NIXPACKS_NO_CACHE`           | Desactivar caché (no recomendado)               |
| `NIXPACKS_CONFIG_FILE`        | Especificar archivo de configuración            |
| `NIXPACKS_DEBIAN`             | Habilitar imagen base Debian                    |

## III. Configuración del proyecto Astro

Astro es un marco web moderno para sitios de contenido, especialmente adecuado para sitios web estáticos como blogs, páginas de marketing y comercio electrónico. Cuando un sitio web tiene una gran cantidad de imágenes y recursos estáticos, la velocidad de construcción puede verse afectada. Al habilitar los mecanismos de caché, la eficiencia de la construcción se puede mejorar significativamente.

### 1. Configurar el directorio de artefactos de caché de construcción:

Los proyectos Astro necesitan especificar un directorio de caché en el archivo de configuración para reutilizar artefactos de construcción anteriores en construcciones posteriores. Los archivos en este directorio se utilizarán en construcciones posteriores para acelerar el tiempo de construcción.
Este valor puede ser una ruta absoluta o una ruta relativa.

```js
//`astro.config.mjs`
export default defineConfig({
  cacheDir: "./astro_cache",
});
```

---

### 2. Archivo de configuración de caché de Nixpacks

Cree un archivo `nixpacks.toml` en el directorio raíz del proyecto Astro y configure los directorios de caché y los comandos de construcción.

```toml
# Usar versiones especificadas de Node.js y pnpm
[phases.setup]
nixPkgs = ["nodejs_22", "pnpm"]

# Instalar dependencias y habilitar caché de pnpm
[phases.install]
cmds = ["pnpm install --frozen-lockfile"]
cacheDirectories = ["/root/.local/share/pnpm/store/v3"]

# Construir proyecto Astro y almacenar en caché node_modules/.cache y astro_cache
[phases.build]
cmds = ["pnpm run build"]
cacheDirectories = [
  "node_modules/.cache",
  "astro_cache"
]

# Comando de inicio (usas NGINX para servir el directorio estático dist, esto es solo un marcador de posición)
[start]
cmd = "echo 'Construcción completa, por favor acceda al directorio dist a través de NGINX'"
```

---

## 3. Optimizar el contexto de construcción de Docker

Agregue `.dockerignore` al directorio raíz del proyecto Astro:

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

## IV. Despliegue y verificación

Después del despliegue automático de Dokploy, verifique los registros de construcción para el siguiente contenido para confirmar que el caché es efectivo:

### 1. El comando de construcción usó caché montado

```bash
RUN --mount=type=cache,id=xxxx-node_modules/cache,target=/app/node_modules/.cache \
    --mount=type=cache,id=xxxx-astro_cache,target=/app/astro_cache \
    pnpm run build
```

### 2. La construcción de Astro reutilizó entradas de caché (especialmente optimización de imágenes)

```bash
▶ /_astro/202409272055577_Z2smeTW.avif (reused cache entry)
▶ /_astro/202409272055575_Z2wPyJN.avif (reused cache entry)
▶ /_astro/202409272055577_1IgP6g.avif (reused cache entry)
```

✅ Si ve los registros de caché de montaje anteriores y el texto "reused cache entry", significa que el mecanismo de caché se ha habilitado con éxito y la construcción ha logrado una aceleración incremental.

🎉 Desde la pestaña Deployments del proyecto Dokploy, también puede ver que sin la configuración de caché, la construcción del proyecto tarda 31 minutos, mientras que con la configuración de caché habilitada, solo tarda 3 minutos, lo que reduce en gran medida el tiempo de construcción y ahorra tráfico y ancho de banda.

## V. Acelerar el sitio con Tencent EdgeOne

## Antecedentes: El "Triángulo Imposible" de la transmisión transfronteriza

Despliegue de servidores en Singapur. Esta solución es rentable y no requiere procesos de registro engorrosos, pero para los usuarios en China continental, la experiencia de acceso a menudo enfrenta enormes desafíos:

1. **Alta latencia física**: El RTT (Round Trip Time) de Singapur a China continental generalmente fluctúa entre 50 ms y 200 ms.
2. **Pérdida severa de paquetes**: Interferido por el firewall GFW, los apretones de manos TCP a menudo expiran, lo que hace que las imágenes se atasquen cargando a la mitad (Pending).
3. **Retraso de salto**: Las aplicaciones de múltiples páginas requieren largas esperas de pantalla blanca al hacer clic en enlaces.

Para resolver este problema, utilizamos **Tencent Cloud EdgeOne** junto con la configuración refinada de **Traefik** para crear un "combo", logrando una experiencia de apertura casi instantánea cercana a los sitios web registrados localmente.

### Idea de arquitectura central

Nuestra estrategia de optimización gira en torno a tres palabras clave: **Anti-Pérdida de Paquetes**, **Descarga de Compresión**, y **Caché por Capas**.

1. **Capa de Protocolo (EdgeOne)**: Utilizar el protocolo **HTTP/3 (QUIC)** basado en características UDP para resolver completamente las interrupciones de carga de contenido causadas por la pérdida de paquetes transfronterizos TCP.
2. **Capa de Transporte (Traefik -> EdgeOne)**: Desactivar la compresión de origen de Traefik y dejar que los nodos de borde de EdgeOne sean responsables de una compresión inteligente **Brotli** más eficiente para reducir el volumen de transmisión.
3. **Capa de Caché (Estrategia)**: Utilizar `s-maxage` para lograr la separación de "Caché CDN a largo plazo" y "Caché de navegador a corto plazo", asegurando tanto la tasa de aciertos de CDN como la puntualidad de actualización de contenido.

### I. Configuración global de EdgeOne (Habilitar modo "Anti-Pérdida de Paquetes")

Aunque EdgeOne no puede proporcionar nodos domésticos para dominios no registrados, sus nodos de borde (Hong Kong/Singapur) a las líneas domésticas están optimizados y admiten el protocolo QUIC, que es la clave para resolver el "retraso de red".

Ingrese a la consola de EdgeOne -> **Aceleración del sitio** -> **Configuración de funciones**:

### 1. Habilitar HTTP/3 (QUIC) ✅

Este es el paso más crítico. En redes transfronterizas con altas tasas de pérdida de paquetes, el protocolo QUIC puede evitar eficazmente el bloqueo de cabeza de línea TCP. Después de habilitar, el fenómeno de imágenes "girando" o "cargando a la mitad" desaparecerá por completo.

### 2. Habilitar compresión inteligente (Brotli + Gzip) ✅

Se recomienda habilitar tanto Brotli como Gzip. EdgeOne priorizará devolver el formato **Brotli (`br`)** a los navegadores compatibles, que tiene una tasa de compresión del 15% al 20% más alta que Gzip. Cuanto menor sea el volumen, más rápido pasará a través del muro.

### 3. Habilitar pre-actualización de caché (90%) ✅

Establezca la relación de pre-actualización en **90%**. Esto significa que en el último 10% del tiempo antes de que expire el caché, el CDN volverá asincrónicamente a la fuente para actualizar. Los usuarios nunca encontrarán retrasos causados por "caducidad de caché que conduce a retorno a la fuente", logrando una experiencia de acierto del 100%.

## II. Optimización de la configuración de Traefik (Estrategia de origen)

Necesitamos modificar el `dynamic_conf.yml` de Traefik (o las etiquetas de Docker) para hacer dos cosas: **Descargar compresión** e **Inyectar encabezados de caché refinados**.

### 1. Desactivar compresión de origen

Verifique su configuración de Routers y **elimine** todos los middlewares `compress` (Gzip).

- **Razón**: EdgeOne ya es responsable de la compresión Brotli. Hacer Gzip en el origen nuevamente desperdiciará CPU y puede causar problemas de doble compresión.

### 2. Definir estrategia de caché por capas (Código principal)

Este es el núcleo para resolver la contradicción entre "los usuarios no pueden ver contenido nuevo después de publicar artículos" y "la velocidad de retorno directo a la fuente es demasiado lenta".

Definimos un middleware específicamente para páginas HTML en Traefik:

```yaml
http:
  routers:
    # Forzar redirección HTTPS
    idimi-uygy0r-redirect-https:
      entryPoints:
        - web
      rule: Host(`realrip.com`)
      middlewares:
        - idimi-uygy0r-to-https
      service: noop@internal
      priority: 1000

    # Service Worker (Núcleo PWA) - Sin compresión, manejado por EdgeOne
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

    # Recursos estáticos principales de Astro (Huella digital Hash) - Sin compresión, manejado por EdgeOne
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

    # Archivos WASM de Pagefind - Sin compresión, manejado por EdgeOne
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

    # Archivos de índice de Pagefind - Sin compresión, manejado por EdgeOne
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

    # Sitemap / Robots / RSS - Sin compresión, manejado por EdgeOne
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

    # Manifest - Sin compresión, manejado por EdgeOne
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

    # Otros archivos estáticos (Imágenes/Videos, etc.) - Sin compresión, manejado por EdgeOne
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

    # Páginas HTML (Regla de respaldo) - Sin compresión, manejado por EdgeOne
    # Estrategia de separación s-maxage=3600 aplicada
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

    # --- Definición de middleware de compresión retenida pero no llamada (eliminada de Routers) ---
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

    # Modificación clave: Estrategia de caché HTML
    # El navegador almacena en caché durante 5 minutos (300s), el CDN almacena en caché durante 1 hora (3600s)
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

**Explicación de la configuración:**

- **`s-maxage=3600`**: Esta es una directiva escrita específicamente para el CDN. EdgeOne ve esto y almacena en caché la página HTML durante 1 hora.
- **`max-age=300`**: Cuando EdgeOne lo envía al usuario, elimina `s-maxage`, y el navegador del usuario solo ve 300 segundos (5 minutos).
- **Efecto**: El CDN maneja el tráfico durante 1 hora, mientras que los usuarios solo necesitan esperar 5 minutos para ver los artículos recién publicados.

## III. Motor de reglas de EdgeOne

Debido a la estructura de URL de Astro (sin sufijo) y al servicio de imágenes dinámicas (`/_image`), se necesitan reglas precisas para alcanzar el caché.

En el **Motor de reglas** de EdgeOne, configure las siguientes reglas estrictamente **en orden**:

### Regla 1: Recursos estáticos principales de Astro (Caché permanente)

Los activos de Astro, los artefactos de construcción y el servicio de imágenes dinámicas, el contenido que nunca cambia o consume mucha CPU, deben almacenarse en caché a la fuerza.

- **Condición de coincidencia**: `Ruta URL` -> `Coincidencia Regex`
- **Valor de coincidencia**: `^/(_astro|assets|pagefind|_image)/`
- _Nota: `_image` se agrega aquí, optimizando específicamente las imágenes optimizadas dinámicas generadas por el componente `<Image />` de Astro._
- **Acción**:
  - Caché de nodo: **365 días** (Forzar)
  - Caché del navegador: **365 días**

### Regla 2: Archivos estáticos regulares

- **Condición de coincidencia**: `Extensión de archivo` igual a `png, jpg, jpeg, webp, css, js`, etc.
- **Acción**: Caché de nodo **30 días** (Forzar).

### Regla 3: Service Worker (Núcleo PWA)

- **Condición de coincidencia**: `Ruta URL` igual a `/sw.js` o `/service-worker.js`.
- **Acción**: Caché de nodo **1 hora** (Forzar).
- _Advertencia: No almacene en caché durante demasiado tiempo, de lo contrario, la PWA no se podrá actualizar a tiempo después del lanzamiento._

### Regla 4: Regla de respaldo (Páginas HTML)

- **Condición de coincidencia**: (Sin condición / Coincide con todas las solicitudes restantes)
- **Acción**:
  - Caché de nodo: **Seguir origen** (es decir, leer `s-maxage=3600` de Traefik).
  - Caché del navegador: **Seguir origen** (es decir, leer `max-age=300` de Traefik).

## IV. Optimización a nivel de código de Astro (Aceleración percibida)

Para que las transiciones de página sean tan fluidas como las "aplicaciones nativas" y eliminar por completo la espera de pantalla blanca durante los saltos, necesitamos utilizar el **Client Router (anteriormente View Transitions)** de Astro.

### 1. Habilitar Client Router

Agregue en el `<head>` de `src/layouts/MainLayout.astro`:

```js
import { ClientRouter } from 'astro:transitions';

<head>
  <!-- Otras etiquetas meta -->
  <ClientRouter />
</head>
```

### 2. Habilitar precarga (Prefetch)

Configure la estrategia de precarga en `astro.config.mjs`:

```js
export default defineConfig({
  // 'viewport': Descargar cuando el enlace entra en la ventana gráfica (equilibrio de tráfico y velocidad)
  // 'load': Descargar todos los enlaces inmediatamente después de que se cargue la página (velocidad extrema, pero consume ancho de banda)
  prefetch: {
    defaultStrategy: "viewport",
  },
  // ...
});
```
