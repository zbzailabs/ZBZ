---
title: "Implantar projetos Astro com Dokploy e Nixpacks e ativar cache para otimizar a velocidade de construção"
description: "Implante rapidamente sites estáticos Astro usando Dokploy e Nixpacks, ativando totalmente os mecanismos de cache para melhorar significativamente a velocidade de construção. O tutorial abrange a configuração do Astro, as configurações de variáveis de ambiente do Dokploy e as estratégias de otimização de cache do Nixpacks, adequadas para práticas de integração e implantação contínuas para sites orientados a conteúdo."
category: "startup"
tags:
  - "innovation"
pubDate: 2025-07-14
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20250714082742453.avif"
heroImageAlt: "ZBZ-Implantar projetos Astro com Dokploy e Nixpacks e ativar cache para otimizar a velocidade de construção"
heroImageWidth: 1960
heroImageHeight: 1102
draft: false
featured: false
locale: pt
---

## I. Configuração do Dokploy

Dokploy é uma plataforma de implantação de código aberto e auto-hospedável, projetada como uma alternativa gratuita ao Heroku, Vercel e Netlify, construída sobre Docker e Traefik.

### 1. Criar novo projeto e conectar repositório GitHub

### 2. Definir variáveis de ambiente

```bash
NIXPACKS_NODE_VERSION=22
NIXPACKS_PNPM_STORE_PATH=/root/.local/share/pnpm/store/v3
NIXPACKS_INSTALL_CACHE_DIRS=/app/node_modules
NIXPACKS_BUILD_CACHE_DIRS=/app/node_modules/.cache,/app/astro_cache
```

### 3. Desativar limpeza de cache

- Serviço do Projeto → **Clean Cache**: Desativar
- Servidor Web → **Daily Docker Cleanup**: Desativar

---

## II. Mecanismo de construção Nixpacks

Nixpacks é uma ferramenta de construção de código aberto lançada pela Railway que constrói código-fonte em imagens Docker padrão. O Dokploy usa o Nixpacks como mecanismo de construção padrão e suporta a especificação de configurações de construção em arquivos `nixpacks.toml` ou `nixpacks.json`. Crie um arquivo `nixpacks.toml` no diretório raiz do projeto e configure os diretórios de cache relevantes.

### Prioridade de configuração (Baixa → Alta):

1. Lógica padrão do provedor
2. `nixpacks.toml`
3. Variáveis de ambiente
4. Argumentos da CLI

### Variáveis de ambiente comuns

| Nome da variável              | Descrição                                 |
| :---------------------------- | :---------------------------------------- |
| `NIXPACKS_INSTALL_CMD`        | Comando de instalação personalizado       |
| `NIXPACKS_BUILD_CMD`          | Comando de construção personalizado       |
| `NIXPACKS_START_CMD`          | Comando de início personalizado           |
| `NIXPACKS_PKGS`               | Instalar pacotes Nix adicionais           |
| `NIXPACKS_APT_PKGS`           | Instalar pacotes Apt adicionais           |
| `NIXPACKS_INSTALL_CACHE_DIRS` | Diretórios de cache da fase de instalação |
| `NIXPACKS_BUILD_CACHE_DIRS`   | Diretórios de cache da fase de construção |
| `NIXPACKS_NO_CACHE`           | Desativar cache (não recomendado)         |
| `NIXPACKS_CONFIG_FILE`        | Especificar arquivo de configuração       |
| `NIXPACKS_DEBIAN`             | Ativar imagem base Debian                 |

## III. Configuração do projeto Astro

Astro é uma estrutura da Web moderna para sites de conteúdo, especialmente adequada para sites estáticos como blogs, páginas de marketing e comércio eletrônico. Quando um site tem um grande número de imagens e recursos estáticos, a velocidade de construção pode ser afetada. Ao ativar os mecanismos de cache, a eficiência da construção pode ser significativamente melhorada.

### 1. Configurar diretório de artefatos de cache de construção:

Os projetos Astro precisam especificar um diretório de cache no arquivo de configuração para reutilizar artefatos de construção anteriores em construções subsequentes. Os arquivos neste diretório serão usados em construções subsequentes para acelerar o tempo de construção.
Este valor pode ser um caminho absoluto ou um caminho relativo.

```js
//`astro.config.mjs`
export default defineConfig({
  cacheDir: "./astro_cache",
});
```

---

### 2. Arquivo de configuração de cache do Nixpacks

Crie um arquivo `nixpacks.toml` no diretório raiz do projeto Astro e configure os diretórios de cache e os comandos de construção.

```toml
# Usar versões especificadas de Node.js e pnpm
[phases.setup]
nixPkgs = ["nodejs_22", "pnpm"]

# Instalar dependências e ativar cache pnpm
[phases.install]
cmds = ["pnpm install --frozen-lockfile"]
cacheDirectories = ["/root/.local/share/pnpm/store/v3"]

# Construir projeto Astro e armazenar em cache node_modules/.cache e astro_cache
[phases.build]
cmds = ["pnpm run build"]
cacheDirectories = [
  "node_modules/.cache",
  "astro_cache"
]

# Comando de início (você usa NGINX para servir o diretório estático dist, isso é apenas um espaço reservado)
[start]
cmd = "echo 'Construção concluída, acesse o diretório dist via NGINX'"
```

---

## 3. Otimizar o contexto de construção do Docker

Adicione `.dockerignore` ao diretório raiz do projeto Astro:

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

## IV. Implantação e verificação

Após a implantação automática do Dokploy, verifique os logs de construção para o seguinte conteúdo para confirmar se o cache é eficaz:

### 1. O comando de construção usou cache montado

```bash
RUN --mount=type=cache,id=xxxx-node_modules/cache,target=/app/node_modules/.cache \
    --mount=type=cache,id=xxxx-astro_cache,target=/app/astro_cache \
    pnpm run build
```

### 2. A construção do Astro reutilizou entradas de cache (especialmente otimização de imagem)

```bash
▶ /_astro/202409272055577_Z2smeTW.avif (reused cache entry)
▶ /_astro/202409272055575_Z2wPyJN.avif (reused cache entry)
▶ /_astro/202409272055577_1IgP6g.avif (reused cache entry)
```

✅ Se você vir os logs de cache de montagem acima e o texto "reused cache entry", significa que o mecanismo de cache foi ativado com sucesso e a construção alcançou aceleração incremental.

🎉 Na guia Deployments do projeto Dokploy, você também pode ver que, sem as configurações de cache, a construção do projeto leva 31 minutos, enquanto com as configurações de cache ativadas, leva apenas 3 minutos, reduzindo muito o tempo de construção e economizando tráfego e largura de banda.

## V. Acelerar o site com Tencent EdgeOne

## Antecedentes: O "Triângulo Impossível" da transmissão transfronteiriça

Implantação de servidores em Cingapura. Esta solução é econômica e não requer processos de registro complicados, mas para usuários na China continental, a experiência de acesso geralmente enfrenta grandes desafios:

1. **Alta latência física**: O RTT (Round Trip Time) de Cingapura para a China continental geralmente flutua entre 50ms - 200ms.
2. **Perda severa de pacotes**: Interferido pelo firewall GFW, os handshakes TCP geralmente expiram, fazendo com que as imagens fiquem presas carregando pela metade (Pending).
3. **Atraso de salto**: Aplicativos de várias páginas exigem longas esperas de tela branca ao clicar em links.

Para resolver esse problema, usamos o **Tencent Cloud EdgeOne** em conjunto com a configuração refinada do **Traefik** para criar um "combo", alcançando uma experiência de abertura quase instantânea próxima aos sites registrados localmente.

### Ideia de arquitetura principal

Nossa estratégia de otimização gira em torno de três palavras-chave: **Anti-Perda de Pacotes**, **Descarga de Compressão** e **Cache em Camadas**.

1. **Camada de Protocolo (EdgeOne)**: Utilize o protocolo **HTTP/3 (QUIC)** baseado em características UDP para resolver completamente as interrupções de carregamento de conteúdo causadas pela perda de pacotes transfronteiriços TCP.
2. **Camada de Transporte (Traefik -> EdgeOne)**: Desligue a compressão de origem do Traefik e deixe os nós de borda do EdgeOne serem responsáveis por uma compressão inteligente **Brotli** mais eficiente para reduzir o volume de transmissão.
3. **Camada de Cache (Estratégia)**: Use `s-maxage` para obter a separação de "Cache CDN de longo prazo" e "Cache de navegador de curto prazo", garantindo tanto a taxa de acerto da CDN quanto a pontualidade da atualização de conteúdo.

### I. Configuração global do EdgeOne (Ativar modo "Anti-Perda de Pacotes")

Embora o EdgeOne não possa fornecer nós domésticos para domínios não registrados, seus nós de borda (Hong Kong/Cingapura) para as linhas domésticas são otimizados e suportam o protocolo QUIC, que é a chave para resolver o "atraso de rede".

Entre no console EdgeOne -> **Aceleração do site** -> **Configuração de recursos**:

### 1. Ativar HTTP/3 (QUIC) ✅

Este é o passo mais crítico. Em redes transfronteiriças com altas taxas de perda de pacotes, o protocolo QUIC pode evitar efetivamente o bloqueio de cabeça de linha TCP. Após a ativação, o fenômeno de imagens "girando" ou "carregando pela metade" desaparecerá completamente.

### 2. Ativar compressão inteligente (Brotli + Gzip) ✅

Recomenda-se ativar Brotli e Gzip. O EdgeOne priorizará o retorno do formato **Brotli (`br`)** para navegadores suportados, que tem uma taxa de compressão de 15% a 20% maior que o Gzip. Quanto menor o volume, mais rápido ele passa pela parede.

### 3. Ativar pré-atualização de cache (90%) ✅

Defina a taxa de pré-atualização para **90%**. Isso significa que nos últimos 10% do tempo antes que o cache expire, a CDN voltará assincronamente à fonte para atualização. Os usuários nunca encontrarão atrasos causados por "expiração de cache levando ao retorno à fonte", alcançando uma experiência de acerto de 100%.

## II. Otimização da configuração do Traefik (Estratégia de origem)

Precisamos modificar o `dynamic_conf.yml` do Traefik (ou rótulos do Docker) para fazer duas coisas: **Descarregar compressão** e **Injetar cabeçalhos de cache refinados**.

### 1. Desativar compressão de origem

Verifique sua configuração de roteadores e **remova** todos os middlewares `compress` (Gzip).

- **Razão**: O EdgeOne já é responsável pela compressão Brotli. Fazer Gzip na origem novamente desperdiçará CPU e pode causar problemas de dupla compressão.

### 2. Definir estratégia de cache em camadas (Código principal)

Este é o núcleo para resolver a contradição entre "os usuários não podem ver novos conteúdos após a publicação de artigos" e "a velocidade de retorno direto à fonte é muito lenta".

Definimos um middleware especificamente para páginas HTML no Traefik:

```yaml
http:
  routers:
    # Forçar redirecionamento HTTPS
    idimi-uygy0r-redirect-https:
      entryPoints:
        - web
      rule: Host(`realrip.com`)
      middlewares:
        - idimi-uygy0r-to-https
      service: noop@internal
      priority: 1000

    # Service Worker (Núcleo PWA) - Sem compressão, manipulado pelo EdgeOne
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

    # Recursos estáticos principais do Astro (Impressão digital Hash) - Sem compressão, manipulado pelo EdgeOne
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

    # Arquivos WASM do Pagefind - Sem compressão, manipulado pelo EdgeOne
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

    # Arquivos de índice do Pagefind - Sem compressão, manipulado pelo EdgeOne
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

    # Sitemap / Robots / RSS - Sem compressão, manipulado pelo EdgeOne
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

    # Manifest - Sem compressão, manipulado pelo EdgeOne
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

    # Outros arquivos estáticos (Imagens/Vídeos etc.) - Sem compressão, manipulado pelo EdgeOne
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

    # Páginas HTML (Regra de fallback) - Sem compressão, manipulado pelo EdgeOne
    # Estratégia de separação s-maxage=3600 aplicada
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

    # --- Definição de middleware de compressão retida, mas não chamada (removida dos roteadores) ---
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

    # Modificação chave: Estratégia de cache HTML
    # O navegador armazena em cache por 5 minutos (300s), a CDN armazena em cache por 1 hora (3600s)
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

**Explicação da configuração:**

- **`s-maxage=3600`**: Esta é uma diretiva escrita especificamente para a CDN. O EdgeOne vê isso e armazena em cache a página HTML por 1 hora.
- **`max-age=300`**: Quando o EdgeOne o envia para o usuário, ele remove `s-maxage`, e o navegador do usuário vê apenas 300 segundos (5 minutos).
- **Efeito**: A CDN lida com o tráfego por 1 hora, enquanto os usuários só precisam esperar 5 minutos para ver os artigos recém-publicados.

## III. Mecanismo de regras do EdgeOne

Devido à estrutura de URL do Astro (sem sufixo) e ao serviço de imagem dinâmica (`/_image`), regras precisas são necessárias para atingir o cache.

No **Mecanismo de regras** do EdgeOne, configure as seguintes regras estritamente **em ordem**:

### Regra 1: Recursos estáticos principais do Astro (Cache permanente)

Os ativos do Astro, artefatos de construção e serviço de imagem dinâmica, conteúdo que nunca muda ou consome muita CPU, devem ser armazenados em cache à força.

- **Condição de correspondência**: `Caminho da URL` -> `Correspondência Regex`
- **Valor de correspondência**: `^/(_astro|assets|pagefind|_image)/`
- _Nota: `_image` é adicionado aqui, otimizando especificamente as imagens otimizadas dinâmicas geradas pelo componente `<Image />` do Astro._
- **Ação**:
  - Cache do nó: **365 dias** (Forçar)
  - Cache do navegador: **365 dias**

### Regra 2: Arquivos estáticos regulares

- **Condição de correspondência**: `Extensão de arquivo` igual a `png, jpg, jpeg, webp, css, js`, etc.
- **Ação**: Cache do nó **30 dias** (Forçar).

### Regra 3: Service Worker (Núcleo PWA)

- **Condição de correspondência**: `Caminho da URL` igual a `/sw.js` ou `/service-worker.js`.
- **Ação**: Cache do nó **1 hora** (Forçar).
- _Aviso: Não armazene em cache por muito tempo, caso contrário, o PWA não poderá ser atualizado a tempo após o lançamento._

### Regra 4: Regra de fallback (Páginas HTML)

- **Condição de correspondência**: (Sem condição / Corresponde a todas as solicitações restantes)
- **Ação**:
  - Cache do nó: **Seguir origem** (ou seja, ler `s-maxage=3600` do Traefik).
  - Cache do navegador: **Seguir origem** (ou seja, ler `max-age=300` do Traefik).

## IV. Otimização no nível do código Astro (Aceleração percebida)

Para tornar as transições de página tão suaves quanto "aplicativos nativos" e eliminar completamente a espera de tela branca durante os saltos, precisamos utilizar o **Client Router (anteriormente View Transitions)** do Astro.

### 1. Ativar Client Router

Adicione no `<head>` de `src/layouts/MainLayout.astro`:

```js
import { ClientRouter } from 'astro:transitions';

<head>
  <!-- Outras tags meta -->
  <ClientRouter />
</head>
```

### 2. Ativar pré-carregamento (Prefetch)

Configure a estratégia de pré-carregamento em `astro.config.mjs`:

```js
export default defineConfig({
  // 'viewport': Baixar quando o link entra na janela de visualização (equilíbrio de tráfego e velocidade)
  // 'load': Baixar todos os links imediatamente após o carregamento da página (velocidade extrema, mas consome largura de banda)
  prefetch: {
    defaultStrategy: "viewport",
  },
  // ...
});
```
