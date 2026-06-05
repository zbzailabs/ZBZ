---
title: "Renovate 自动依赖更新配置指南"
description: "使用 Renovate 实现 GitHub 仓库依赖全自动更新，无需人工干预"
category: "startup"
tags:
  - "management"
  - "innovation"
pubDate: 2026-02-06
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20260206-renovate-guide.avif"
heroImageAlt: "Renovate 自动依赖更新"
heroImageWidth: 2752
heroImageHeight: 1536
draft: false
featured: false
locale: zh
---

## 前言

维护项目依赖是开发者的日常工作之一。手动检查、更新、测试依赖版本不仅耗时，还容易遗漏。本文介绍如何使用 **Renovate** 实现依赖更新的完全自动化。

## 目标

- 每天凌晨自动检查依赖更新
- 自动创建 PR 并合并（CI 通过后）
- 无需人工干预，纯后台运行
- 多仓库统一管理

## 安装 Renovate

1. 访问 [GitHub Apps - Renovate](https://github.com/apps/renovate)
2. 点击 **Install**
3. 选择要启用的仓库（可选择所有仓库或指定仓库）
4. 完成授权

## 配置文件

在仓库根目录创建 `renovate.json`：

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:recommended",
    ":automergeAll",
    ":disableDependencyDashboard"
  ],
  "timezone": "Asia/Shanghai",
  "schedule": ["before 3:00am"]
}
```

提交并推送：

```bash
git add renovate.json
git commit -m "chore: configure Renovate for automated dependency updates"
git push
```

## 配置详解

| 配置项 | 说明 |
|--------|------|
| `config:recommended` | Renovate 官方推荐的基础配置 |
| `:automergeAll` | **核心配置**，自动合并所有更新（包括 major 版本） |
| `:disableDependencyDashboard` | 禁用 Dashboard Issue，实现纯后台运行 |
| `timezone` | 设置时区为亚洲/上海 |
| `schedule` | 每天凌晨 3 点前执行检查 |

## 工作流程

```
每天凌晨 3:00
    ↓
Renovate 检查 package.json 依赖
    ↓
发现可用更新
    ↓
自动创建 Pull Request
    ↓
触发 CI 检查
    ↓
CI 通过 → 自动合并到 main 分支
    ↓
第二天看到已更新的依赖
```

## 多仓库配置

对于多个项目，可以复制相同的配置文件：

```bash
# 创建通用配置
cat > renovate.json << 'EOF'
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended", ":automergeAll", ":disableDependencyDashboard"],
  "timezone": "Asia/Shanghai",
  "schedule": ["before 3:00am"]
}
EOF

# 应用到多个仓库
for repo in repo1 repo2 repo3; do
  cp renovate.json $repo/
  cd $repo && git add . && git commit -m "chore: configure Renovate" && git push
  cd ..
done
```

## 常见问题

### PR 没有自动合并？

检查 CI 状态。Renovate 只在 CI 全部通过后才合并。如果 CI 失败，需要手动修复问题后重新运行。

### 如何立即触发更新？

- 如果启用了 Dashboard：进入 Issues → Dependency Dashboard → 勾选要更新的包 → 点击 Rebase
- 或者等待到 schedule 时间自动运行

### 如何排除特定依赖？

在配置中添加排除规则：

```json
{
  "packageRules": [{
    "matchPackageNames": ["package-name"],
    "enabled": false
  }]
}
```

### pnpm / yarn / npm 支持？

Renovate 自动检测 lock 文件类型，无需额外配置。

## 验证配置

推送配置后，Renovate 会自动运行（或等待到 schedule 时间）。验证步骤：

1. 进入仓库 **Pull requests** 页面
2. 查看 Renovate 创建的 PR（标题格式：`chore(deps): update ...`）
3. 确认 PR 已启用 auto-merge
4. CI 通过后自动合并

## 总结

只需 5 行核心配置：

```json
{
  "extends": [
    "config:recommended",
    "automergeAll",
    "disableDependencyDashboard"
  ],
  "timezone": "Asia/Shanghai",
  "schedule": ["before 3:00am"]
}
```

实现依赖管理的完全自动化，让开发者专注于业务代码。
