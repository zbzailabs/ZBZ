---
title: "Gatsby용 Waline 댓글 구성 요소 설치"
description: "Waline에는 아직 Gatsby 구성 요소가 없으므로 Waline 클라이언트 라이브러리를 설치하고 React 구성 요소를 만든 다음 적절한 위치에 구성 요소를 도입하여 Gatsby 사이트에 Waline 댓글 기능을 추가합니다."
category: "life"
tags:
  - "roam"
pubDate: 2021-11-17
heroImage: "https://cos.zbz.ai/images/202310181512145.avif"
heroImageAlt: "RealRip-Gatsby용 Waline 댓글 구성 요소 설치"
heroImageWidth: 1960
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "ko"
---

Gatsby는 반응 기반의 정적 웹 사이트 구축 프레임워크로, 온라인 상점, 공식 웹 사이트 및 블로그를 배포하는 데 사용할 수 있습니다. 풍부한 플러그인을 사용하여 이미지 지연 로딩, Markdown 문서 지원 및 방문자 댓글과 같은 기능을 실현할 수 있습니다. Gatsby에서 공식적으로 권장하는 댓글 시스템에는 Disqus, Gitalk 등이 있습니다. 이러한 댓글 시스템에는 고유한 특성이 있지만 요구 사항을 충족할 수 없습니다. 이 기사에서는 최근 인기 있는 Waline 댓글 시스템을 Gatsby 프로젝트에 설치하려고 합니다. Gatsby 개발은 자유도가 높고 프로젝트마다 다르기 때문에 아이디어 표현을 용이하게 하기 위해 공식 블로그 테마 `gatsby-starter-blog`를 예로 사용합니다.

## 아이디어

Waline에는 아직 Gatsby 구성 요소가 없으므로 Waline 클라이언트 라이브러리를 설치하고 React 구성 요소를 만든 다음 적절한 위치에 구성 요소를 도입하여 기능을 구현해야 합니다.

## 기본 구성

요구 사항에 따라 [Gatsby](https://gatsbyjs.com) 프로젝트를 배포하고 [Waline 공식 튜토리얼](https://waline.js.org)에 따라 Waline 댓글 시스템의 서버 및 데이터 측면을 구성합니다.

## Waline 라이브러리 설치

프로젝트 루트 디렉터리에서 패키지 관리를 통해 Waline 라이브러리를 설치합니다.

```bash
yarn add -D @waline/client
```

그 후 댓글 구성 요소의 `import` 문을 통해 Waline 구성 요소를 도입할 수 있습니다.

## 댓글 구성 요소 만들기

댓글 기능을 캡슐화하고 재사용하기 위해 Waline 클래스 구성 요소를 만듭니다.

`src/components` 디렉터리에 새 스크립트 `comment.js`를 만듭니다.

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

- 로드할 때 구성 요소가 `Waline` 객체를 생성하기만 하면 되고 잦은 상태 변경을 겪지 않을 것이라고 판단하기 때문에 `Comment`를 함수 구성 요소 대신 클래스 구성 요소로 정의하고 `PureComponent`를 상속하여 성능 손실을 줄일 수 있습니다.

- `render()` 함수에서 컨테이너 요소로 `<div>`를 만듭니다. 이는 `Waline`에 의해 동적으로 생성된 DOM 노드를 로드하는 데 사용됩니다.
- `Comment` 구성 요소에 `slug`라는 이름의 `prop`를 추가합니다. 이는 외부 구성 요소에 의해 전달되어 해당 댓글만 고정 페이지에 표시되도록 합니다.

## 기사 페이지에 구성 요소 추가

`src/templates/blog-post.js` 파일을 열고 먼저 가져오기 선언을 추가합니다.

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

`BlogPostTemplate` 함수의 끝에 `<Comment>` 태그를 삽입하고 닫는 태그 `</Layout>` 앞에 `slug` 속성을 설정합니다.

```jsx
import Comment from '../components/comment' // 새 구성 요소 가져오기

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

## 개발 버전 만들기

```bash
gatsby build
```
