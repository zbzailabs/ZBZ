---
title: "Using Obsidian as a CMS"
description: "Obsidian is incredibly convenient as a CMS for blogs"
category: "startup"
tags:
  - "management"
pubDate: 2024-09-11
authors:
  - default
heroImage: "https://cos.zbz.ai/images/20241213102812622.avif"
heroImageAlt: "ZBZ-Using Obsidian as a CMS"
heroImageWidth: 1960
heroImageHeight: 1102
draft: false
featured: false
locale: en
---

## Content Mesh-Based Content Management System

The term “content mesh” first caught my attention back in 2018, when it was introduced by the CTO of Gatsby, a then-popular website framework. This concept addresses the limitations of single tools that affect the overall performance of projects. In essence, a content mesh is a content management methodology that leverages various modular content management tools to build a flexible and efficient workflow for content collection, processing, creation, and publishing. Following this principle, you can select the best tools to enable local writing, fast publishing, rapid deployment, and an optimized visitor experience. This approach allows content creators to choose the most suitable tools instead of relying on all-in-one content management systems.

With advancements in Markdown, offline note-taking tools, frontend frameworks, and CI/CD technologies, it is now possible to create a simple, efficient, and fast content management system by integrating a variety of tools.

## Core Requirements

1. Writing is the primary goal, and tools should only serve as assistants. Prefer tools maintained by professional teams or open-source communities, and ensure deployment methods are as simple as possible, requiring minimal secondary development.

2. Both local and online environments need suitable content editors to facilitate content production.

3. Web access should be fast and provide an excellent user experience, natively supporting mobile devices.

4. Content production, management, and distribution should be independent of each other, enabling minor adjustments in one area without requiring global changes. Content should be easy to organize, store, and migrate.

5. Resource reuse: Text, images, and videos should be reusable to save space.

6. Micro-system configurations and file backups/restorations should be simple to enable future tool migration.

## System Architecture

```bash
[ Obsidian ]
    ↓ (Markdown files)
[ GitHub (code hosting, version control, triggers) ]
    ↓ (webhook trigger)
[ Astro (static site generation) ]
    ↓ (generated static files)
[ Vercel/Netlify/CDN ]
    ↓ (content delivery)
[ User visits blog ]
```

### 1. Content Layer

Tool: Obsidian

Obsidian is a popular knowledge management tool that supports Markdown-based linked notes and card-style journaling. It supports local deployment, ensuring data privacy. With its rich plugin ecosystem, it’s free for personal users and highly suitable as a second brain for managing complex, networked knowledge.

To install Obsidian, simply download it from the official website. Configuration details are available in the official help documentation. For seamless synchronization across iPhone, iPad, and Mac, and to back up data to GitHub, follow these steps:

1. Use iOS to create an Obsidian vault and sync it to iCloud. Once synced to Mac, you can locate the Obsidian folder in iCloud Drive.

2. Delete the folder created on iOS from the Mac’s iCloud Obsidian folder to prepare for GitHub repository initialization, which requires an empty folder.

3. Use Terminal to navigate to the Mac iCloud Obsidian folder. Open a new terminal window via a recommended tool such as the “Super Right-Click” plugin.

Functions:

Text: Write articles in Markdown using Obsidian, defining metadata (e.g., title, date, tags) with Frontmatter.

Images: Host blog images on Tencent Cloud COS, managed with Picgo. Use the Image auto upload Plugin to upload images directly. For Picgo-core, configure it via picgo set uploader. If uploads fail, enable the Fix PATH variable option in the Obsidian plugin.

### 2. Storage & Version Control Layer

Tool: Git + GitHub

Functions:
Content Synchronization: Use the obsidian-git plugin to sync Obsidian files with a GitHub repository.

Version Control: Git records every update or change for historical traceability.

Automation: Use GitHub Actions to trigger Astro’s build and deployment processes automatically.

### 3. Rendering & Publishing Layer

Tool: Astro

Functions:
Static Site Generation:

Convert Markdown files stored on GitHub into static HTML pages.

Parse Frontmatter for metadata like titles, dates, and tags.

Custom Themes:

Customize site appearance and layout.

Support responsive design to enhance mobile user experience.

SEO Optimization:

Integrate SEO plugins for automated sitemap and metadata generation.

### 4. Deployment & Delivery Layer

Tool: Dokploy

Dokploy is an open-source self-hosted PaaS solution designed to simplify application and database deployment and management. It serves as a free alternative to platforms like Vercel, Netlify, and Heroku.

Functions:Open Source & Self-Hosted: Users have full control over their infrastructure, avoiding vendor lock-in.

Flexibility: Supports Nixpacks, Heroku Buildpacks, or custom Dockerfiles to accommodate diverse tech stacks.

No Vendor Lock-In: Users can freely modify, extend, and customize Dokploy as needed.

### 5. Content Backup

Follow the 3-2-1 backup principle:

Maintain at least 3 copies (1 original + 2 backups).

Store backups on 2 different media types (e.g., local drive and cloud storage).

Keep 1 backup offsite to guard against local hardware failures or natural disasters.

1. Store files on a local computer drive.
2. Save files on a NAS.
3. Use iCloud or OneDrive to back up the Obsidian folder to the cloud.
4. Host code on GitHub for additional content backup.

Additional Features

Comment System: As renowned blogger Pat Flynn said, “Without comments, a blog isn’t really a blog. To me, blogging is not just about publishing content, but also the two-way communication and community-building aspects behind it.” The content mesh requires a comment system that supports static hosting with features like comment data storage, management, export, and notifications for both commenters and bloggers. Options like Valine and Commento meet these requirements.
