---
title: "为 Gatsby 安装 Waline 评论组件"
description: "由于 Waline 还没有 Gatsby 组件，通过安装 Waline 客户端库，创建 React 组件，并在合适的位置引入组件，在 gatsby 站点上添加 waline 评论功能。"
category: "life"
tags:
  - "roam"
pubDate: 2021-11-17
heroImage: https://cos.zbz.ai/images/202310181512145.avif
heroImageAlt: "ZBZ-为 Gatsby 安装 Waline 评论组件"
heroImageWidth: 1960
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: zh
---

Gatsby 是基于 reac t的静态网站构建框架，可以用来部署网上商城、官网和博客，利用丰富的插件可以实现图片懒加载、Markdown 文档支持、访客评论等功能。Gatsby 官方推荐的评论系统有 Disqus、Gitalk 等。这些评论系统都有自己的特色，但并不能满足需求，本文尝试把最近流行的 Waline 评论系统安装到 Gatsby 项目。由于 Gatsby 开发有很大的自由度，每个项目不尽相同，为方便表达思路，以官方博客主题`gatsby-starter-blog`为例。

## 思路

由于 Waline 还没有 Gatsby 组件，我们需要通过安装 Waline 客户端库，创建 React 组件，并在合适的位置引入组件实现功能。

## 基础配置

根据需求部署 [Gatsby](https://gatsbyjs.com)项目，并根据 [Waline 官方教程](https://waline.js.org)配置 Waline 评论系统的服务端和数据端。

## 安装 Waline 库

在项目根目录中，通过包管理的方式安装 Waline 库。

```bash
yarn add -D @waline/client
```

之后便可以在评论组件中通过`import`语句引入 Waline 组件使用了。

## 创建评论组件

创建 Waline 类组件，实现评论功能封装和重复使用。

在`src/components`目录下创建一个新的脚本`comment.js`

```jsx
import React, { PureComponent } from "react";

export default class Comment extends PureComponent {
  constructor(props) {
    super(props);
    this._commentRef = React.createRef();
  }
  async componentDidMount() {
    if (typeof window === "undefined") {
      return;
    }
    if (!this._commentRef.current) {
      return;
    }
    const Waline = await (await import("@waline/client")).default;
    this.Waline = new Waline({
      el: this._commentRef.current,
      serverURL: "https://your.waline.url",
      visitor: true,
      path: this.props.slug,
    });
  }
  render() {
    return <div ref={this._commentRef} />;
  }
}
```

- 因为我们仅需要该组件在加载时创建`Waline`对象， 并且确定它不会发生频繁的状态变化，因此定义`Comment`为类组件而非函数组件，且继承`PureComponent`，这样能够减少性能损耗，

- 在`render()`函数中我们创建一个`<div>`作为容器元素，它用来装载通过`Waline`动态生成的 DOM 节点。
- 为`Comment`组件添加一个名为`slug`的`prop`，并由外层组件传入，确保在固定页面只显示对应评论。

## 在文章页面添加组件

打开`src/templates/blog-post.js`文件，首先添加一行导入声明：

```jsx
import Comment from "../components/comment";

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      fields {
        slug
      }

      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`;
```

在`BlogPostTemplate`函数的末尾，结束标签`</Layout>`之前插入`<Comment>`标签并设置`slug`属性：

```jsx
import Comment from '../components/comment' // 导入我们的新组件

const BlogPostTemplate = ({ data, pageContext, location }) => {
  const post = data.markdownRemark
  ...
  return (
    <Layout location={location} title={siteTitle}>
      <Comment slug={post.fields.slug} />
    </Layout>
  )
}
```

## 创建开发版本

```bash
gatsby build
```
