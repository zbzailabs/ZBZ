---
title: "使用 Obsidian 作为 CMS"
description: "Obsidian 作为博客的 CMS 太方便了"
category: "startup"
tags:
  - "management"
  - "allocation"
pubDate: 2024-09-11
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20241213102812622.avif"
heroImageAlt: "ZBZ-使用 Obsidian 作为 CMS"
heroImageWidth: 1960
heroImageHeight: 1102
draft: false
featured: false
locale: zh
---

## 基于内容网格的内容管理系统

最早接触到内容网格（content mesh）一词是在2018年的时候，那时如日中天的网站框架 Gatsby 的 CTO 最先提出了该词，它弥补了单一工具短板影响项目整体性能的问题。具体来讲，内容网格是一种内容管理方法，利用各种模块化内容管理工具，构建灵活、高效的内容收集、加工、创作和发布流程。基于内容网格理念，选择各类最佳工具，可以快速构建本地写作，快速发布，迅速上线项目，并使访问者获得极致体验。这种方法允许内容创作者选择最合适的工具来替代 All In One 的内容管理系统。

随着 Markdown，离线笔记工具，前端框架，CI/CD 等技术的成熟，可以通过简单的集成各类工具，搭建一套简单、高效、快速的内容管理系统。

## 核心诉求

1. 写作是根本目的，工具只起到辅助作用，要尽量采用有专业团队或开源社区长期维护的基础工具，并且部署方式也应尽可能简单，无需过多二次开发。
2. 本地和网络要有合适的内容器，方便内容生产。
3. 网络访问体验要快速极致，并天然适应移动端。
4. 内容生产、管理和分发彼此独立，一个环节微调，不必全局调整，内容便于整理、存储和迁移。
5. 资源复用：对于文字、图片、视频等内容，可实现复用、节约空间。
6. 各种微系统配置和文件备份、恢复方便，便于后期生产工具迁移。

## 架构组成

```bash
[ Obsidian ]
    ↓ (Markdown 文件)
[ GitHub (代码托管，版本控制与触发器) ]
    ↓ (webhook 触发)
[ Astro (静态站点生成) ]
    ↓ (构建后的静态文件)
[ Vercel/Netlify/CDN ]
    ↓ (内容分发)
[ 用户访问博客 ]
```

### 1. 内容层（Content Layer）

• **工具**：Obsidian:Obsidian 是当前流行的知识管理软件，支持 Markdown 双链笔记和卡片日记应用，支持本地部署，保护数据隐私。它有丰富的插件功能，个人用户可免费使用，非常适合作为第二大脑，管理密集的网络化知识。

要安装 Obsidian ，直接从[obsidian 官网](https://obsidian.md)下载即可。 安装后的配置可以在官方 help 中找到答案。如果需要 iPhone 、iPad 和 Mac 三端同步，且希望备份到版本管理工具 GitHub 的话，可以按如下操作。

1.  通过 iOS 新建 Obsidian 库，并选择同步到 iCloud ，自动同步到 Mac 后，可以在 iCloud云盘中看到 Obsidian 文件夹。里面有刚在 iOS 端创建的文件夹

2.  在 Mac iCloud 库 Obsidian 文件夹中删除在 iOS 端创建的文件夹，为建立 GitHub 本地库初始化做准备，GitHub 本地库只能在空文件夹中建立。

3.  通过终端，进入 Mac 端 iCloud 库 Obsidian 文件夹。可以使用下文推荐的超级右键，在 Obsidian 文件夹上右键新建终端窗口。

**功能**

**文本**： 在 Obsidian 中使用 Markdown 语言编写文章，利用 Frontmatter 定义元信息（如标题、日期、标签）。

**图像**： 博客的图像托管在腾讯云 COS，使用 Picgo 进行图片管理，可以使用插件 `Image auto upload Plugin` 快速上传图片。这里可以使用 Picgo.app 也可以使用 Picgo-core，如果使用 Picgo-core，可使用 `picgo set uploader`进行配置，如果上传不成功，可以尝试 Obsidian 插件中开启 `修正PATH变量`。

### 2. 存储与版本控制层（Storage & Version Control Layer）

• **工具**：Git + GitHub

**功能**：

**内容同步**：利用Obsidian插件 [obsidian-git](https://github.com/Vinzent03/obsidian-git) 将 Obsidian 笔记文件夹与 Git 仓库关联，通过 GitHub 托管内容。

**版本控制**：通过 Git 提供历史追溯功能，记录每次更新或更改。

**自动化触发**：通过 GitHub Actions 自动触发 Astro 的构建和部署流程。

### 3. 渲染与发布层（Rendering & Publishing Layer）

• **工具**：Astro

• **功能**：

    • **静态站点生成**：

    	• 将存储在 GitHub 上的 Markdown 文件转换为静态 HTML 页面。
    	• 支持 Frontmatter 解析，用于设置页面标题、日期、标签等元信息。

    • **自定义主题**：
    	• 定制网站的外观和布局。
    	• 支持响应式设计，提升移动端用户体验。

    • **SEO 优化**：
    	• 集成 SEO 插件，自动生成站点地图、元描述等。

### 4. 部署与交付层（Deployment & Delivery Layer）

**工具**：Dokploy：Dokploy 是一款开源的自托管平台即服务（PaaS）解决方案，旨在简化应用程序和数据库的部署与管理。它可被视为 Vercel、Netlify 和 Heroku 等平台的免费替代品。

**功能**：

**开源与自托管**：用户可完全掌控基础设施，避免供应商锁定。

**灵活性**：支持 Nixpacks、Heroku Buildpacks 或自定义 Dockerfile，满足不同技术栈的需求。

**无供应商锁定**：用户可自由修改、扩展和定制 Dokploy，以满足特定需求。

### 5. 内容备份

根据 3-2-1 原则对文件进行备份。

• 至少保留 3 份副本（1 份原始文件 + 2 份备份）。

• 存储在2 种不同的介质（如本地硬盘和云存储）。

• 至少有1 份异地备份（防范本地硬件故障或自然灾害）。

1. 本地电脑硬盘存储文件。
2. 把文件存储在 Nas。
3. 把 Obsidian 文件夹放置在 iCloud 或 OneDrive，进行云端备份。
4. 将代码托管在 GitHub 也是对内容的备份。

### 补充功能

- **评论系统**：知名 Blogger [Pat Flynn](https://patflynn.com/) 说“Without comments, a blog isn’t really a blog. To me, blogging is not just about publishing content, but also the two-way communication and community building aspects behind it.”（没有评论系统的博客不是真正的博客，对我而言，博客不仅是发布内容，还有背后的互动交流和社群建设）。内容网格需要的评论系统要适配静态托管，有评论数据存储、管理、导出等功能，还要有通知支持，及时通知评论者和博主评论情况，满足要求的有 [Valine](https://valine.js.org/)、 [Commento](https://commento.io/)等。
