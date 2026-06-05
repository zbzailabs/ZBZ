---
title: "一个 Gatsby 博客模板"
description: "本站是利用 Gatsby 搭建的静态网站，欢迎试用。"
category: "life"
tags:
  - "roam"
pubDate: 2021-11-20
heroImage: https://cos.zbz.ai/images/202310181512144.avif
heroImageAlt: "ZBZ-"
heroImageWidth: 1960
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: zh
---

一个利用 Gatsby 搭建静态网站的模板。

源码在 **[gatsby-starter-glass](https://github.com/xiyizhou/gatsby-starter-glass)**，欢迎试用。

## 特色

- 开箱即用
- 完全汉化
- 包含 [Waline](https://waline.js.org) 评论
- 包含谷歌分析
- Markdown 编辑

## 本地部署

```bash
# 1. Clone 到本地
git clone https://github.com/xiyizhou/gatsby-starter-glass.git

# 2. cd 到目录
cd gatsby-starter-glass

# 3. 安装依赖
yarn install

# 4. 启动开发模式
yarn start

# 5. 构建生产版本
yarn  build
```

## 配置

- `gatsby-config.js` 中配置网站信息，Google 分析 ID 等。
- `src/components/header.js `中配置顶部导航栏信息。
- `src/components/footer.js `中配置底部导航栏信息。

- `src/components/comment.js` 中配置 Waline 信息。

## 文章发布

### 博客文章

博客文章位于 `content/blog`。模板如下：

```md
---
title: 为 Gatsby 安装 Waline 评论组件
date: 2021-11-17 08:08
slug: gatsby-waline
category: 生活
tags:
  - 生活
description: 由于 Waline 还没有 Gatsby 组件，通过安装 Waline 客户端库，创建 React 组件，并在合适的位置引入组件，在 gatsby 站点上添加 waline 评论功能。
---

Gatsby 是基于 reac t的静态网站构建框架，可以用来部署网上商城、官网和博客，利用丰富的插件可以实现图片懒加载、Markdown 文档支持、访客评论等功能。Gatsby 官方推荐的评论系统有 Disqus、Gitalk 等。
```

### 页面

页面内容位于 `content/pages`。

## 注意事项

- 本 starter 基于 Gatsby V3，安装插件时注意版本兼容性。
- 主框架汉化自 [gatsby-starter-glass](https://github.com/yinkakun/gatsby-starter-glass)，感谢 [yinkakun](https://github.com/yinkakun)。
