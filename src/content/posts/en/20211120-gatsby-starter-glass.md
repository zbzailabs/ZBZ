---
title: "A Gatsby Blog Template"
description: "This site is a static website built using Gatsby, welcome to try it out."
category: "life"
tags:
  - "roam"
pubDate: 2021-11-20
heroImage: "https://cos.zbz.ai/images/202310181512144.avif"
heroImageAlt: "RealRip-"
heroImageWidth: 1960
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "en"
---

A template for building static websites using Gatsby.

The source code is at **[gatsby-starter-glass](https://github.com/xiyizhou/gatsby-starter-glass)**, welcome to try it out.

## Features

- Out of the box
- Fully localized
- Includes [Waline](https://waline.js.org) comments
- Includes Google Analytics
- Markdown editing

## Local Deployment

```bash
# 1. Clone to local
git clone https://github.com/xiyizhou/gatsby-starter-glass.git

# 2. cd to directory
cd gatsby-starter-glass

# 3. Install dependencies
yarn install

# 4. Start development mode
yarn start

# 5. Build production version
yarn  build
```

## Configuration

- Configure website information, Google Analytics ID, etc. in `gatsby-config.js`.
- Configure top navigation bar information in `src/components/header.js`.
- Configure bottom navigation bar information in `src/components/footer.js`.

- Configure Waline information in `src/components/comment.js`.

## Article Publishing

### Blog Posts

Blog posts are located in `content/blog`. The template is as follows:

```md
---
title: Install Waline Comment Component for Gatsby
date: 2021-11-17 08:08
slug: gatsby-waline
category: Life
tags:
  - Life
description: Since Waline does not yet have a Gatsby component, add Waline comment functionality to the Gatsby site by installing the Waline client library, creating a React component, and introducing the component in the appropriate location.
---

Gatsby is a static website building framework based on react, which can be used to deploy online stores, official websites, and blogs. Using rich plugins, functions such as image lazy loading, Markdown document support, and visitor comments can be realized. The comment systems officially recommended by Gatsby include Disqus, Gitalk, etc.
```

### Pages

Page content is located in `content/pages`.

## Notes

- This starter is based on Gatsby V3, pay attention to version compatibility when installing plugins.
- The main framework is localized from [gatsby-starter-glass](https://github.com/yinkakun/gatsby-starter-glass), thanks to [yinkakun](https://github.com/yinkakun).
