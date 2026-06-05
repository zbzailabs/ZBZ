---
title: "تثبيت مكون تعليق Waline لـ Gatsby"
description: "نظرًا لأن Waline ليس لديه مكون Gatsby بعد، أضف وظيفة تعليق Waline إلى موقع Gatsby عن طريق تثبيت مكتبة عميل Waline، وإنشاء مكون React، وإدخال المكون في الموقع المناسب."
category: "life"
tags:
  - "roam"
pubDate: 2021-11-17
heroImage: "https://cos.zbz.ai/images/202310181512145.avif"
heroImageAlt: "ZBZ-تثبيت مكون تعليق Waline لـ Gatsby"
heroImageWidth: 1960
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "ar"
---

Gatsby هو إطار عمل لبناء مواقع ويب ثابتة يعتمد على react، والذي يمكن استخدامه لنشر المتاجر عبر الإنترنت والمواقع الرسمية والمدونات. باستخدام المكونات الإضافية الغنية، يمكن تحقيق وظائف مثل التحميل الكسول للصور، ودعم مستندات Markdown، وتعليقات الزوار. تشمل أنظمة التعليقات الموصى بها رسميًا من قبل Gatsby Disqus و Gitalk وما إلى ذلك. تتمتع أنظمة التعليقات هذه بخصائصها الخاصة، لكنها لا تستطيع تلبية الاحتياجات. تحاول هذه المقالة تثبيت نظام تعليق Waline الشهير مؤخرًا في مشروع Gatsby. نظرًا لأن تطوير Gatsby يتمتع بدرجة كبيرة من الحرية وكل مشروع مختلف، من أجل تسهيل التعبير عن الأفكار، يتم استخدام سمة المدونة الرسمية `gatsby-starter-blog` كمثال.

## فكرة

نظرًا لأن Waline ليس لديه مكون Gatsby بعد، نحتاج إلى تنفيذ الوظيفة عن طريق تثبيت مكتبة عميل Waline، وإنشاء مكون React، وإدخال المكون في الموقع المناسب.

## التكوين الأساسي

انشر مشروع [Gatsby](https://gatsbyjs.com) وفقًا للمتطلبات، وقم بتكوين الخادم وجانب البيانات لنظام تعليق Waline وفقًا لـ [البرنامج التعليمي الرسمي لـ Waline](https://waline.js.org).

## تثبيت مكتبة Waline

في الدليل الجذر للمشروع، قم بتثبيت مكتبة Waline عبر إدارة الحزم.

```bash
yarn add -D @waline/client
```

بعد ذلك، يمكنك إدخال مكون Waline عبر عبارة `import` في مكون التعليق.

## إنشاء مكون التعليق

قم بإنشاء مكون فئة Waline لتغليف وظيفة التعليق وإعادة استخدامها.

قم بإنشاء برنامج نصي جديد `comment.js` في دليل `src/components`

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

- نظرًا لأننا نحتاج فقط إلى المكون لإنشاء كائن `Waline` عند تحميله، وتحديد أنه لن يخضع لتغييرات متكررة في الحالة، فإننا نحدد `Comment` كمكون فئة بدلاً من مكون وظيفة، ونرث `PureComponent`، مما قد يقلل من فقدان الأداء.

- في وظيفة `render()`، نقوم بإنشاء `<div>` كعنصر حاوية، والذي يستخدم لتحميل عقد DOM التي تم إنشاؤها ديناميكيًا بواسطة `Waline`.
- أضف `prop` باسم `slug` إلى مكون `Comment`، والذي يتم تمريره بواسطة المكون الخارجي لضمان عرض التعليقات المقابلة فقط في صفحة ثابتة.

## إضافة مكون إلى صفحة المقالة

افتح ملف `src/templates/blog-post.js` وأضف أولاً إعلان استيراد:

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

في نهاية وظيفة `BlogPostTemplate`، أدخل علامة `<Comment>` وقم بتعيين سمة `slug` قبل علامة الإغلاق `</Layout>`:

```jsx
import Comment from '../components/comment' // استيراد مكوننا الجديد

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

## إنشاء نسخة التطوير

```bash
gatsby build
```
