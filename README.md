# 👟 **SWIVEE**

![swivee-mockup](https://user-images.githubusercontent.com/82587107/207751153-d6e53b27-0853-4bac-8082-9c4f54f22c3e.jpg)

- 프로젝트 기간 : 2022.11.18 ~ 2022.11.28
- 파이어베이스 무료 요금제를 쓰고 있어 읽기 할당량 하루 초과시 제대로 접속이 되지 않을 수 있습니다. (오후 5시 리셋됩니다.)

🔗 [배포링크](http://swivee.shop/)

🔗 [시연영상 유튜브](https://www.youtube.com/watch?v=i2lWnXUfahQ)

<br/>

### 소개

- **사용자들이 작성한 리뷰**를 통해 **브랜드 별 신발**과 **사용자**간의 **연결고리**가 되어주는 서비스입니다.
- 신발을 구매할 때 리뷰가 구매 사이트별로 나뉘어져 있어 원하는 정보를 한 번에 얻기 힘들다는 점에서 서비스를 착안했습니다.
- **SWIVEE** 라는 프로젝트 이름은 받침이라는 뜻을 가진 단어 `Swivel`에서 모티브를 얻었습니다.
- **바닐라 자바스크립트**를 이용해 `SPA`로 구현했으며 메인페이지를 포함 일정부분 반응형으로 구현되어 있습니다.

<br/>
<br/>

## 🙌 팀원 소개

| 이름   | 깃허브                                       |
| ------ | -------------------------------------------- |
| 이유정 | [@yujleee](https://github.com/yujleee)       |
| 김태욱 | [@rlaxodnr30](https://github.com/rlaxodnr30) |
| 정다인 | [@dada992](https://github.com/dada992)       |
| 조성아 | [@Jocooh](https://github.com/Jocooh)         |
| 최희라 | [@heerachoi](https://github.com/heerachoi)   |

역할 분담 관련해서는 프로젝트 노션을 참고해주세요.

📑 [프로젝트 노션](https://yjworking.notion.site/JS-98b418dd84c44d82a0f27f2b4d424e31)

<br/>
<br/>

## 🖥 기술 스택

### Front-end

`HTML5` `CSS3` `JavaScript`

### Back-end

`firebase`

### Deploy

`AWS S3`

<br/>
<br/>

## 🗂 디렉토리 구조

```
📦assets
 ┗ 📂favicon
📦css
📦js
 ┣ 📂pages
 ┃ ┣ 📜auth.js
 ┃ ┣ 📜board.js
 ┃ ┣ 📜home.js
 ┃ ┣ 📜mypage.js
 ┃ ┗ 📜review.js
 ┣ 📜firebase.js
 ┣ 📜main.js
 ┣ 📜router.js
 ┗ 📜utill.js
📦pages
📜index.html
```

- assets: 파비콘과 아이콘, 로고 등 이미지 파일들
- css: reset,common 등 공통적인 부분 이외의 각 페이지별 css
- js
  - pages: 각 페이지별 스크립트
  - firebase.js: 파이어베이스 관련 설정 스크립트
  - main.js: 공통적으로 사용하는 함수들이 모여있습니다.
  - router.js: SPA을 위한 라우터 관련 코드들이 모여있습니다.
- pages: 각 페이지별 html 파일들

<br/>
<br/>

## 🤝 규칙


- **커밋 컨벤션 (유다시티 커밋 컨벤션 참고!)**
    | 키워드 | 설명 |
    | --- | --- |
    | feat | 새로운 기능을 추가한 경우 |
    | fix | 버그를 고친 경우 |
    | design | UI를 추가/변경 하거나 스타일(CSS) 관련 작업을 했을 경우 |
    | refactor | 코드 리팩토링 |
    | comment | 필요한 주석 추가 및 변경 |
    | docs | 문서를 수정한 경우 |
    | rename | 파일 혹은 폴더명을 수정하거나 옮기는 작업만인 경우 |
    | update | 코드를 보완하기 위해 수정한 경우 |

- **코딩 컨벤션**
    - Camelcase로 변수, 함수, 클래스명(css) 사용

<br/>
<br/>

## 👥 깃허브 협업 방식

Git Flow 방식을 일부 활용했습니다.

- `main` : `dev` 브랜치에서 테스트를 거친 코드들이 합쳐지는 메인 브랜치
- `dev` : 주된 작업들이 합쳐지는 브랜치
- `dev`에서 뻗어나온 개인 브랜치 : 각자의 작업이 진행되는 브랜치

<br/>
<br/>

## 💡 구현 기능

- login, join
  * 이메일 회원가입, 로그인
  * 이메일 로그인, 회원가입 유효성 검사
  * 소셜 로그인 (구글, 깃허브)
- main
  * 브랜드별 신발 목록
  * 인기 브랜드(리뷰 많이 쓰인 순)
  * 실시간 리뷰
  * 페이지 위로 이동하기
- board
  * 신발 관련 유튜브 영상 링크 이동
  * 좋아요
  * 이미지 첨부하여 리뷰 작성
  * 리뷰 작성시 유효성 검사 (버튼 disabled 처리)
  * 신발별 리뷰 모음
- review
  * 리뷰 수정, 삭제
  * 댓글 입력, 수정, 삭제
- mypage
  * 프로필 이미지, 닉네임, 비밀번호 변경
  * 유저가 작성한 리뷰글 목록 노출


<br/>
<br/>

## 🔥 트러블 슈팅

프로젝트 노션의 마지막 항목을 참고해주세요.

📑 [프로젝트 노션](https://yjworking.notion.site/JS-98b418dd84c44d82a0f27f2b4d424e31)

<br/>
<br/>

## 📝 회고 및 관련 블로그 기록

🎉 [프로젝트 S.A](https://i-ten.tistory.com/215)

📑 [프로젝트 진행 관련 기록](https://i-ten.tistory.com/217)

📓 [프로젝트를 마치며, KPT 회고](https://i-ten.tistory.com/229)
