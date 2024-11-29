
# ![logo-full](https://github.com/user-attachments/assets/50180f88-9899-494b-850a-6e989343f76d)

> 배포주소 :
 ##  👩‍💻팀원 소개👨‍💻
|[팀장/FE] 황초희|[CTO/FE] 김지훈|[FE] 한지현|[FE] 하진희|[FE] 문정환|
|:---:|:---:|:---:|:---:|:---:|
|<img  src = "https://github.com/user-attachments/assets/e3bd02b4-6603-4793-aae1-d36b41880a5e"  width="120px"  height="120px"  />|<img  src = "https://github.com/user-attachments/assets/4cd763d9-43c9-46e5-8f0d-c30a02f53c79"  width="120px"  height="120px"  />|<img  src = "https://github.com/user-attachments/assets/4b0c408f-ba1b-418b-b2e4-1c3eb1f1a1f7"  width="120px"  height="120px"  />|<img  src = "https://github.com/user-attachments/assets/8cacdbbb-aee4-43cf-9c3c-cb905e557f33"  width="120px"  height="120px"  />|<img  src = "https://github.com/user-attachments/assets/7064a6e8-dcee-4122-8abe-0ae854f5417f"  width="120px"  height="120px"  />|
|[chochohee](https://github.com/chochohee)|[김지훈](https://github.com/jihun-io)|[hanj33](https://github.com/hanj33)|[jini0012](https://github.com/jini0012)|[BusyCranis](https://github.com/BusyCranis)|

## 📅 데일리 스크럼(Daily Scrum)
팀의 원활한 커뮤니케이션과 진행 상황의 공유를 위해 아래와 같이 데일리 스크럼을 진행합니다.
- 진행 일정
	- 시간 : 평일 오전 9시, 오후 4시 or 5시 (일 2회 진행)
- 진행 방식
	- 오전 : 하루 목표 및 진행 계획을 논의하고 ISSUE 및 PROJECT 작성합니다.
	- 오후 : 진행상황을 보고하고 문제점이나 버그 등을 논의합니다.
- 참여 방법
	- Discord 사용.
- 목표
	- 팀원 간 업무 진행 상황 공유
	- 신속한 문제점 파악 및 해결방안 논의
	- 생산성과 협업의 효율성 극대화

## 📑 목차
[Ⅰ. 기술 스택](#Ⅰ.-기술-스택)

[Ⅱ. 컨벤션](#Ⅱ.-컨벤션)

[Ⅲ. 프로젝트의 목표와 기능](#Ⅲ.-프로젝트의-목표와-기능)

[Ⅳ. 요구사항과 기능명세](#Ⅳ.-요구사항과-기능명세)

[Ⅴ. 프로젝트 구조와 개발 일정](#Ⅴ.-프로젝트-구조와-개발-일정)

[Ⅵ. 와이어프레임 / UI](#Ⅵ.-와이어프레임-/-UI)

[Ⅶ. 개발하며 느낀점](#Ⅶ.-개발하며-느낀점)

##  Ⅰ. 기술 스택
### 1. 공통
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white)
### 2. IDE
![](https://img.shields.io/badge/Visual%20Studio%20Code-007ACC?style=flat-square&logo=Visual%20Studio%20Code&logoColor=white)
### 3. 사용 언어
![리액트]( https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black ) ![다음.js]( https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=Nextdotjs&logoColor=white ) ![CSS 모듈]( https://img.shields.io/badge/CSS%20Modules-000000?style=for-the-badge&logo=CSSModules&logoColor=white ) ![Firebase](https://img.shields.io/badge/Firebase-DD2C00?style=for-the-badge&logo=Firebase&logoColor=white)
## Ⅱ. 컨벤션
###  Git 컨벤션
#### 1. Commit 메시지
- 깃모지 사용 : commit 유형에 따라 아래 표에 따라 이모지를 사용합니다.

|icon|code|설명|원문|
|:---:|:---:|:---:|:---:|
|:tada:|: tada :|프로젝트 시작|Begin a project|
|:memo:|: memo :|문서추가/수정(마크업)|Add or update documentation.|
|:lipstick:|: lipstick :|UI/스타일 파일 추가/수정(CSS)|Add or update the UI and style files.|
|:sparkles:|: sparkles :|새 기능(JS)|Introduce new features.|
|:art:|: art :|코드의 구조/형태 개선(JS 수정)|Improve structure / format of the code.|
|:fire:|: fire :|코드/파일 삭제|Remove code or files.|
|:bulb:|: bulb :|주석 추가/수정/삭제|Add or update comments in source code.|
|:bug:|: bug :| 버그 수정|Fix a bug.|
|:truck:|: truck :|파일 및 폴더 이동, 이름 변경|Move or rename resources(e.g..:files paths routes).|
|:twisted_rightwards_arrows:|: twisted_rightwards_arrows :|GIT 브랜치 합병|Merge branches.|
|:rewind:|: rewind :| GIT 변경 내용 되돌리기 | Revert changes.|
|:zap:|: zap :|[QA/QC] 성능 개선| Improve performance.|
|:recycle:|: recycle :|[QA/QC] 코드 리팩토링|Refactor code.|

- commit 메시지 작성 규칙
	1. 메시지는 한 줄로 간결하고 명확하게 작성.
	2. 가능한 작업 단위로 세분화하여 커밋.
	3. 관련 작업이 있을 경우 이슈 번호를 함께 기재.
#### 2. Merge 규칙
- 팀원들과 협력하여 Merge 진행
- Merge 고정일 : 매주 월,수,금 (주 3회 진행)
	- 월요일은 오전 데일리 스크럼시간, 수,금은 오후 시간에 진행합니다.
	- 단, 작업 속도 및 양에 따라 유동적으로 변경될 수 있습니다. (회의를 통해 결정)

### 코드 컨벤션
#### 1. 컴포넌트 및 파일/폴더 네이밍
- 컴포넌트명 : `PascalCase` (예: `Header`, `Profile`)
- 폴더명 : `camelCase` (예: `components`,`hooks`)
- 함수 및 변수명: `camelCase`(예: `handleSubmit`,`openModal`)
- 마크업 클래스명: `kebab-case`(예: `header-title`,`submit-btn`)
#### 2. CSS 작성 규칙
- 각 컴퓨넌트에 대응되는 CSS 모듈 파일을 사용.
	- 컴포넌트 파일과 CSS 모듈 파일은 동일한 이름으로 작성.
		- 예: `Header` →`Header.module.css`
	
## Ⅲ. 프로젝트의 목표와 기능

###  1.1 프로젝트의 목표
- 우리는 꿈을 꿉니다. 꿈을 기록하고 모두와 함께 공유해보세요.
- 꿈 내용을 기록하고, 타인과 공유할수있는 SNS형식의 웹사이트 구현 프로젝트.


###  1.2 구현하고자하는 기능
- 홈페이지
	- 구글 로그인
	- 이메일 로그인
- 회원가입 진행페이지
	- 필수입력사항 / 선택입력사항 총 2페이지
- 메인페이지
	- 게시글을 스크롤 해서 볼 수 있는 페이지. 커서 위치에따라 추가 게시글 랜딩
	-  좌측 header(nav)를 통해서 화면모드 변경과 글쓰기 등의 작업이 가능
- 마이페이지
	- 선택한 유저가 작성한 게시글을 모아서 볼 수 있는 페이지.
	- 본인페이지일경우 프로필 편집이 가능
	
## Ⅳ. 요구사항과 기능명세
### 4.1 요구사항
머메이드

### 4.2 기능명세
명세서

## Ⅴ. 프로젝트 구조와 개발 일정
### 5.1 프로젝트 구조
폴더구조

### 5.2 개발 일정
타임라인

## Ⅵ. 와이어프레임 / UI
### 6.1 와이어프레임
피그마 사진

### 6.2 UI
시현영상 gif 삽입

## Ⅶ. 개발하며 느낀점
### [FE]황초희
``` 3차프로젝트 진행하면서 느낀점 ```

### [FE]김지훈
``` 3차프로젝트 진행하면서 느낀점 ```

### [FE]한지현
``` 3차프로젝트 진행하면서 느낀점 ```

### [FE]하진희
``` 3차프로젝트 진행하면서 느낀점 ```

### [FE]문정환
``` 3차프로젝트 진행하면서 느낀점 ```