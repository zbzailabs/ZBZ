---
title: "Obsidian을 CMS로 사용하기"
description: "Obsidian은 블로그 CMS로서 매우 편리합니다"
category: "startup"
tags:
  - "management"
  - "allocation"
pubDate: 2024-09-11
authors:
  - default
heroImage: "https://cos.zbz.ai/images/202309151438569.avif"
heroImageAlt: "RealRip-Obsidian을 CMS로 사용하기"
heroImageWidth: 1960
heroImageHeight: 1102
draft: false
featured: false
locale: ko
---

드디어 블로그 플랫폼 프레임워크를 Astro로 변경했습니다. 로딩 속도가 빨라졌고, 업데이트 및 유지보수가 편리해졌습니다. Markdown 파일을 직접 동기화하기만 하면 됩니다. 원래는 Typora를 Markdown 편집 도구로 사용하고 있었으며, WYSIWYG 방식으로 단일 파일 관리는 매우 가벼웠습니다. 하지만 Typora에는 파일 관리자가 없어서 여러 파일을 관리하기가 불편했기 때문에, Markdown 편집기를 Obsidian으로 변경했습니다. 자세히 살펴보니, Obsidian은 블로그 CMS로 매우 편리하다는 것을 알게 되었습니다.

- **파일 관리자**: Obsidian의 검색 기능을 사용하면 파일을 쉽게 추가, 삭제, 수정, 조회할 수 있습니다.
- **문서 속성**: Obsidian 1.4부터 문서 속성 기능이 추가되었으며, Markdown 파일의 Frontmatter를 고정 형식으로 포맷할 수 있습니다. 템플릿 기능과 결합하면 Frontmatter를 매우 쉽게 작성할 수 있습니다. 이전에 Typora를 사용할 때는 Frontmatter 형식이 엄격해서 자주 오류가 발생했지만, 이제는 Obsidian의 문서 속성을 사용하여 거의 오류 없이 작업할 수 있습니다.
- **이미지**: 블로그 이미지가 Tencent Cloud COS에 호스팅되어 있으며, Picgo를 사용하여 이미지를 관리합니다. `Image auto upload Plugin` 플러그인을 사용하여 이미지를 빠르게 업로드할 수 있습니다. Picgo.app을 사용할 수도 있고, Picgo-core를 사용할 수도 있습니다. Picgo-core를 사용하는 경우 [`picgo set uploader`]로 설정하고, 업로드가 실패하면 Obsidian 플러그인에서 `PATH 변수 수정`을 활성화해 보십시오.
- **동기화**: Obsidian 라이브러리를 iCloud에 저장하면 여러 기기에서 동기화할 수 있어 언제 어디서나 문서를 편집할 수 있습니다.
- **출판**: Git 플러그인을 사용하여 예약된 출판을 설정한 후, 기사를 작성하면 자동으로 호스팅 플랫폼에 게시됩니다.
