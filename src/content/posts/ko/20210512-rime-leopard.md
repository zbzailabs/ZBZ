---
title: "Rime 입력기 멀티 디바이스 설정"
description: "최근 공업정보화부는 거의 모든 주류 클라우드 입력기가 규정을 위반하여 사용자 개인 정보 데이터를 수집하고 있다는 데이터를 발표했습니다. 안전하고 안심하고 입력하려면 오프라인 입력기만 사용할 수 있습니다. 현재 최고의 오프라인 입력기는 의심할 여지 없이 Rime입니다."
category: "startup"
tags:
  - "management"
pubDate: 2021-05-09
heroImage: "https://cos.zbz.ai/images/202310031635857.avif"
heroImageAlt: "ZBZ-"
heroImageWidth: 1944
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "ko"
---

최근 공업정보화부는 거의 모든 주류 클라우드 입력기가 규정을 위반하여 사용자 개인 정보 데이터를 수집하고 있다는 데이터를 발표했습니다. 안전하고 안심하고 입력하려면 오프라인 입력기만 사용할 수 있습니다. 현재 최고의 오프라인 입력기는 의심할 여지 없이 [Rime](https://github.com/rime/home/wiki/Introduction)입니다.

정확히 말하면 Rime은 오픈 소스 크로스 플랫폼 입력기 엔진입니다. 코드는 오픈 소스이며 완전히 오프라인입니다. 극도의 사용자 정의 및 튜닝을 통해 사용자는 모든 사람에게 적합한 입력기를 사용자 정의할 수 있습니다. 장점은 안전하고 여러 입력 체계를 지원한다는 것입니다. 단점은 동의어 사전이 충분히 강력하지 않고 구성이 복잡하며 동의어 사전 동기화는 반수동으로 수행해야 한다는 것입니다.

### Mac 버전 설치

Rime의 저자인 [Lotem](https://github.com/lotem)이 원래 개발한 번체 중국어 버전입니다. 간체 버전을 사용하려면 [Yifang](https://github.com/maomiui/rime)의 튜토리얼에 따라 구성할 수 있습니다. 구성 과정에서 다음 사항에 유의하십시오.

- 현재 버전(2021-05-12)에 버그가 있습니다. `luna_pinyin_simp.custom.yaml`에서 활성화된 경우
  `- derive/^([zcs])h/$1/ # zh, ch, sh => z, c, s`
  `- derive/^([zcs])([^h])/$1h$2/ # z, c, s => zh, ch, sh`
  퍼지 사운드 후 이모티콘 및 동적 시간이 유효하지 않게 됩니다.

- 저자는 다양한 입력 체계를 준비했습니다. Xiaohe Shuangpin 등을 사용하지 않는 경우 해당 구성 파일을 삭제할 수 있습니다.

- Luna Pinyin Traditional을 사용하지 않더라도 `luna_pinyin.zonghe.dict.yaml` 및 `luna_pinyin.dict.yaml`과 같은 파일을 삭제하지 마십시오. 삭제하면 필요한 단어가 부족할 수 있습니다.

- 이메일 및 주소와 같은 일반 정보는 `custom_phrase.txt`에서 설정할 수 있습니다.

- `squirrel.custom.yaml` 파일에서 테마를 수정하고 변경할 수 있습니다. 예를 들어 `macos_light` 테마를 기반으로 저자는 Google Pinyin 입력기 "Pink World" 테마를 모방했습니다.

### Win10 버전 설치

Rime Weasel의 Win10 버전의 경우 [공식 튜토리얼](https://github.com/rime/weasel)에 따라 설치하면 됩니다. 설치가 완료되면 Mac 구성 파일을 복사하여 사용할 수 있습니다. 주의해야 할 사항

- `squirrel.custom.yaml`의 이름을 `weasel.custom.yaml`로 지정해야 합니다.

- 스킨 단일 및 이중 라인, 병음 단일 라인 표시 등은 다음과 같이 `weasel.custom.yaml`에서 사용자 정의됩니다.

  ```yaml
  # 텍스트 가로 배열
  style/horizontal: true

  # 한 줄 표시
  style/inline_preedit: true

  # 스킨 변경
  style/color_scheme: win10
  ```

- `installation.yaml`의 동기화 경로는 Win과 Mac에서 다릅니다. Win에서는 작은따옴표나 큰따옴표가 필요하지 않습니다.

  ```yaml
  # win 동기화 경로 형식
  sync_dir: C:\Users\Username\iCloudDrive\Rime

  # mac 동기화 경로 형식
  sync_dir: "/Users/Username/Library/Mobile Documents/com~apple~CloudDocs/Rime"
  ```

- win10에서는 win10 작업 스케줄러를 사용하여 데이터를 [자동으로](https://www.cnblogs.com/cstylex/p/Rime_on_Linux_Android_Mac_Windows_iOS_sync.html) 동기화할 수 있습니다. Mac에서는 아직 자동 동기화를 달성할 방법이 없습니다.

Android 휴대폰의 경우 [Trime](https://github.com/osfans/trime)을 설치하여 사용할 수 있으며 iOS 휴대폰의 경우 [iRime](https://apps.apple.com/cn/app/irime%E8%BE%93%E5%85%A5%E6%B3%95/id1142623977)을 설치하여 사용할 수 있습니다.
