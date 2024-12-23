

# ![DreamerLogo](https://github.com/user-attachments/assets/96c445fd-727c-4a60-a93f-ca1bc00b6178)

>  [<img src = "https://github.com/user-attachments/assets/c26addd5-86c6-4bcb-8633-d2cdeb9a2ba4" width= "250px"/>](https://dreamer.today)  
>  배포환경 : Vercel


 ##  👩‍💻팀원 소개👨‍💻
|[팀장/FE] 황초희|[CTO/FE] 김지훈|[FE] 한지현|[FE] 하진희|
|:---:|:---:|:---:|:---:|
|<img  src = "https://github.com/user-attachments/assets/e3bd02b4-6603-4793-aae1-d36b41880a5e"  width="120px"  height="120px"  />|<img  src = "https://github.com/user-attachments/assets/4cd763d9-43c9-46e5-8f0d-c30a02f53c79"  width="120px"  height="120px"  />|<img  src = "https://github.com/user-attachments/assets/4b0c408f-ba1b-418b-b2e4-1c3eb1f1a1f7"  width="120px"  height="120px"  />|<img  src = "https://github.com/user-attachments/assets/8cacdbbb-aee4-43cf-9c3c-cb905e557f33"  width="120px"  height="120px"  />|
|[chochohee](https://github.com/chochohee)|[김지훈](https://github.com/jihun-io)|[hanj33](https://github.com/hanj33)|[jini0012](https://github.com/jini0012)|

## 📑 목차

- [Ⅰ. 기술 스택](#%E2%85%B0-%EA%B8%B0%EC%88%A0-%EC%8A%A4%ED%83%9D)
- [Ⅱ. 프로젝트의 목표와 기능](#%E2%85%B2-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%EC%9D%98-%EB%AA%A9%ED%91%9C%EC%99%80-%EA%B8%B0%EB%8A%A5)
- [Ⅲ. 프로젝트 구조와 개발 일정](#%E2%85%B4-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EA%B5%AC%EC%A1%B0%EC%99%80-%EA%B0%9C%EB%B0%9C-%EC%9D%BC%EC%A0%95)
- [Ⅳ. 와이어프레임 / UI](#%E2%85%B5-%EC%99%80%EC%9D%B4%EC%96%B4%ED%94%84%EB%A0%88%EC%9E%84--ui)
- [Ⅴ. 개발History](#%E2%85%B6-%EA%B0%9C%EB%B0%9C%ED%95%98%EB%A9%B0-%EB%8A%90%EB%82%80%EC%A0%90)


##  Ⅰ. 기술 스택
### 1. 공통
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white)
### 2. IDE
![](https://img.shields.io/badge/Visual%20Studio%20Code-007ACC?style=flat-square&logo=Visual%20Studio%20Code&logoColor=white)
### 3. 사용 기술
![리액트]( https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black ) ![다음.js]( https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=Nextdotjs&logoColor=white ) ![CSS 모듈]( https://img.shields.io/badge/CSS%20Modules-000000?style=for-the-badge&logo=CSSModules&logoColor=white ) ![Firebase](https://img.shields.io/badge/Firebase-DD2C00?style=for-the-badge&logo=Firebase&logoColor=white) ![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=Redux&logoColor=white)
![Algolia](https://img.shields.io/badge/Algolia-003DFF?style=for-the-badge&logo=Algolia&logoColor=white)

## Ⅱ. 프로젝트의 목표와 기능

###  2.1 프로젝트의 목표
- 우리는 꿈을 꿉니다. 꿈을 기록하고 모두와 함께 공유해보세요.
- 단순히 꿈을 기록하는 것을 넘어, 흥미로운 꿈을 타인과 공유하고 소통할 수 있는 공간을 제공합니다.
- 사용자들에게 AI를 이용해 맞춤형 해몽 서비스를 제공하여 재미와 정보를 동시에 전달하고, 차별화된 사용자 경험을 창출합니다.


###  2.2 기능
- 구글로그인, 개인이메일인증을 통한 가입을 통해서 가입 후 서비스이용 가능
- 내가 꾼 꿈의 장르,느낌 등을 체크하고 글과 사진을 통해 기록을 남겨 공유할수있는 다이어리형 SNS
- 앨런AI를 통해 작성한 꿈에 대한 해몽을 받고, 타인과 함께 공유 할 수 있는 플랫폼
- 비회원에게도 공개게게시글을 공유하여 함께 감상가능

## Ⅲ. 프로젝트 구조와 개발 일정
### 3.1 프로젝트 폴더 구조
<details>
<summary>접기 / 펼치기 </summary> 

📦dreamer  
 ┣ 📂public  
 ┃ ┣ 📂fonts  
 ┃ ┃ ┣ 📂NanumBarunPenB  
 ┃ ┃ ┗ 📂NanumBarunPenR  
 ┃ ┣ 📂images  
 ┃ ┣ 📂metadata  
 ┃ ┗ 📜robots.txt  
 ┣ 📂src  
 ┃ ┣ 📂app  
 ┃ ┃ ┣ 📂account  
 ┃ ┃ ┃ ┣ 📂modify-email  
 ┃ ┃ ┃ ┃ ┣ 📜ModifyEmail.module.css  
 ┃ ┃ ┃ ┃ ┗ 📜page.js  
 ┃ ┃ ┃ ┣ 📂modify-password  
 ┃ ┃ ┃ ┃ ┣ 📜ModifyPassword.module.css  
 ┃ ┃ ┃ ┃ ┗ 📜page.js  
 ┃ ┃ ┃ ┣ 📜Account.module.css  
 ┃ ┃ ┃ ┗ 📜page.js  
 ┃ ┃ ┣ 📂api  
 ┃ ┃ ┃ ┣ 📂account  
 ┃ ┃ ┃ ┃ ┣ 📂avatar  
 ┃ ┃ ┃ ┃ ┃ ┣ 📂[userId]  
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┃ ┣ 📂follow  
 ┃ ┃ ┃ ┃ ┃ ┗ 📂[userId]  
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┃ ┣ 📂followers  
 ┃ ┃ ┃ ┃ ┃ ┗ 📂[userId]  
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┃ ┣ 📂modify  
 ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┃ ┗ 📂theme  
 ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┣ 📂auth  
 ┃ ┃ ┃ ┃ ┣ 📂check-email  
 ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┃ ┣ 📂check-email-verification  
 ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┃ ┣ 📂login  
 ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┃ ┣ 📂logout  
 ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┃ ┣ 📂reset-password  
 ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┃ ┣ 📂send-email-verification  
 ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┃ ┣ 📂update-email  
 ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┃ ┣ 📂verify  
 ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┃ ┣ 📂verify-email  
 ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┃ ┗ 📂withdraw  
 ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┣ 📂comment  
 ┃ ┃ ┃ ┃ ┣ 📂create  
 ┃ ┃ ┃ ┃ ┃ ┗ 📂[postId]  
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┃ ┣ 📂delete  
 ┃ ┃ ┃ ┃ ┃ ┗ 📂[postId]  
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┃ ┗ 📂read  
 ┃ ┃ ┃ ┃ ┃ ┗ 📂[postId]  
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┣ 📂join  
 ┃ ┃ ┃ ┃ ┣ 📂check-userid  
 ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┣ 📂post  
 ┃ ┃ ┃ ┃ ┣ 📂create  
 ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┃ ┣ 📂delete  
 ┃ ┃ ┃ ┃ ┃ ┗ 📂[postId]  
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┃ ┣ 📂feeds  
 ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┃ ┣ 📂private  
 ┃ ┃ ┃ ┃ ┃ ┗ 📂[postId]  
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┃ ┣ 📂read  
 ┃ ┃ ┃ ┃ ┃ ┗ 📂[userId]  
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┃ ┣ 📂search  
 ┃ ┃ ┃ ┃ ┃ ┣ 📂[postId]  
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┃ ┣ 📂spark  
 ┃ ┃ ┃ ┃ ┃ ┗ 📂[postId]  
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┃ ┗ 📂update  
 ┃ ┃ ┃ ┃ ┃ ┗ 📂[postId]  
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┣ 📂recommends  
 ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┣ 📂report  
 ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┣ 📂today  
 ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┗ 📂tomong  
 ┃ ┃ ┃ ┃ ┣ 📂read  
 ┃ ┃ ┃ ┃ ┃ ┗ 📂[postId]  
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┃ ┣ 📂set  
 ┃ ┃ ┃ ┃ ┃ ┗ 📂[postId]  
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┃ ┣ 📂streaming-token  
 ┃ ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┃ ┃ ┗ 📜route.js  
 ┃ ┃ ┣ 📂join  
 ┃ ┃ ┃ ┣ 📂verify-email  
 ┃ ┃ ┃ ┃ ┣ 📜page.js  
 ┃ ┃ ┃ ┃ ┗ 📜page.module.css  
 ┃ ┃ ┃ ┣ 📜page.js  
 ┃ ┃ ┃ ┗ 📜page.module.css  
 ┃ ┃ ┣ 📂logout  
 ┃ ┃ ┃ ┗ 📜page.js  
 ┃ ┃ ┣ 📂post  
 ┃ ┃ ┃ ┗ 📂[postId]  
 ┃ ┃ ┃ ┃ ┣ 📜page.js  
 ┃ ┃ ┃ ┃ ┗ 📜page.module.css  
 ┃ ┃ ┣ 📂privacy  
 ┃ ┃ ┃ ┣ 📜page.js  
 ┃ ┃ ┃ ┗ 📜page.module.css  
 ┃ ┃ ┣ 📂search  
 ┃ ┃ ┃ ┣ 📜Search.module.css  
 ┃ ┃ ┃ ┗ 📜page.js  
 ┃ ┃ ┣ 📂signup  
 ┃ ┃ ┃ ┣ 📜page.js  
 ┃ ┃ ┃ ┗ 📜page.module.css  
 ┃ ┃ ┣ 📂terms  
 ┃ ┃ ┃ ┗ 📜page.js  
 ┃ ┃ ┣ 📂tomong  
 ┃ ┃ ┃ ┗ 📜page.js  
 ┃ ┃ ┣ 📂users  
 ┃ ┃ ┃ ┗ 📂[id]  
 ┃ ┃ ┃ ┃ ┗ 📜page.js  
 ┃ ┃ ┣ 📜globals.css  
 ┃ ┃ ┣ 📜layout.js  
 ┃ ┃ ┣ 📜not-found.js  
 ┃ ┃ ┣ 📜page.js  
 ┃ ┃ ┣ 📜page.module.css  
 ┃ ┃ ┣ 📜reset.css  
 ┃ ┃ ┗ 📜sitemap.js  
 ┃ ┣ 📂components  
 ┃ ┃ ┣ 📂auth  
 ┃ ┃ ┃ ┗ 📜AuthStateHandler.jsx  
 ┃ ┃ ┣ 📂dropDown  
 ┃ ┃ ┃ ┣ 📜DropDown.jsx  
 ┃ ┃ ┃ ┗ 📜DropDown.module.css  
 ┃ ┃ ┣ 📂error404  
 ┃ ┃ ┃ ┣ 📜Error404.jsx  
 ┃ ┃ ┃ ┗ 📜Error404.module.css  
 ┃ ┃ ┣ 📂footer  
 ┃ ┃ ┃ ┣ 📜Footer.jsx  
 ┃ ┃ ┃ ┣ 📜Footer.module.css  
 ┃ ┃ ┃ ┗ 📜Recommends.jsx  
 ┃ ┃ ┣ 📂header  
 ┃ ┃ ┃ ┣ 📜Header.jsx  
 ┃ ┃ ┃ ┣ 📜HeaderModal.jsx  
 ┃ ┃ ┃ ┣ 📜HeaderModal.module.css  
 ┃ ┃ ┃ ┣ 📜NarrowHeader.jsx  
 ┃ ┃ ┃ ┣ 📜NarrowHeader.module.css  
 ┃ ┃ ┃ ┣ 📜WideHeader.jsx  
 ┃ ┃ ┃ ┗ 📜WideHeader.module.css  
 ┃ ┃ ┣ 📂login  
 ┃ ┃ ┃ ┣ 📜EmailSignup.jsx  
 ┃ ┃ ┃ ┣ 📜EmailSignup.module.css  
 ┃ ┃ ┃ ┣ 📜FindPassword.jsx  
 ┃ ┃ ┃ ┣ 📜SocialLogin.jsx  
 ┃ ┃ ┃ ┗ 📜SocialLogin.module.css  
 ┃ ┃ ┣ 📂main  
 ┃ ┃ ┃ ┣ 📜MainList.jsx  
 ┃ ┃ ┃ ┣ 📜MainList.module.css  
 ┃ ┃ ┃ ┣ 📜Post.jsx  
 ┃ ┃ ┃ ┗ 📜Post.module.css  
 ┃ ┃ ┣ 📂modal  
 ┃ ┃ ┃ ┣ 📜CommentArticles.jsx  
 ┃ ┃ ┃ ┣ 📜CommentArticles.module.css  
 ┃ ┃ ┃ ┣ 📜PostModal.jsx  
 ┃ ┃ ┃ ┗ 📜PostModal.module.css  
 ┃ ┃ ┣ 📂post  
 ┃ ┃ ┃ ┣ 📜Post.jsx  
 ┃ ┃ ┃ ┗ 📜PostContent.jsx  
 ┃ ┃ ┣ 📂profile  
 ┃ ┃ ┃ ┣ 📜PostCard.jsx  
 ┃ ┃ ┃ ┣ 📜PostList.jsx  
 ┃ ┃ ┃ ┣ 📜Profile.jsx  
 ┃ ┃ ┃ ┣ 📜Profile.module.css  
 ┃ ┃ ┃ ┣ 📜ProfileEdit.jsx  
 ┃ ┃ ┃ ┣ 📜ProfileInfo.jsx  
 ┃ ┃ ┃ ┗ 📜SparkButton.jsx  
 ┃ ┃ ┣ 📂report  
 ┃ ┃ ┃ ┗ 📜Report.jsx  
 ┃ ┃ ┣ 📂signup  
 ┃ ┃ ┃ ┣ 📜BasicInfoForm.jsx  
 ┃ ┃ ┃ ┣ 📜BasicInfoForm.module.css  
 ┃ ┃ ┃ ┣ 📜ProfileForm.jsx  
 ┃ ┃ ┃ ┣ 📜ProfileForm.module.css  
 ┃ ┃ ┃ ┣ 📜SignupHeader.jsx  
 ┃ ┃ ┃ ┗ 📜SignupHeader.module.css  
 ┃ ┃ ┣ 📂theme  
 ┃ ┃ ┃ ┗ 📜ThemeHandler.jsx  
 ┃ ┃ ┣ 📂tomong  
 ┃ ┃ ┃ ┣ 📜Result.module.css  
 ┃ ┃ ┃ ┣ 📜Tomong.jsx  
 ┃ ┃ ┃ ┣ 📜Tomong.module.css  
 ┃ ┃ ┃ ┗ 📜TomongListItem.jsx  
 ┃ ┃ ┣ 📂write  
 ┃ ┃ ┃ ┣ 📜HashtagModal.jsx  
 ┃ ┃ ┃ ┣ 📜HashtagModal.module.css  
 ┃ ┃ ┃ ┣ 📜MoodModal.jsx  
 ┃ ┃ ┃ ┣ 📜MoodModal.module.css  
 ┃ ┃ ┃ ┣ 📜StopModal.jsx  
 ┃ ┃ ┃ ┣ 📜StopModal.module.css  
 ┃ ┃ ┃ ┣ 📜Uploading.jsx  
 ┃ ┃ ┃ ┣ 📜Uploading.module.css  
 ┃ ┃ ┃ ┣ 📜WritePost.jsx  
 ┃ ┃ ┃ ┗ 📜WritePost.module.css  
 ┃ ┃ ┣ 📜Controls.jsx  
 ┃ ┃ ┣ 📜Controls.module.css  
 ┃ ┃ ┣ 📜Loading.jsx  
 ┃ ┃ ┣ 📜Loading.module.css  
 ┃ ┃ ┣ 📜NavProvider.js  
 ┃ ┃ ┣ 📜NavProvider.module.css  
 ┃ ┃ ┗ 📜Providers.jsx  
 ┃ ┣ 📂hooks  
 ┃ ┃ ┣ 📂signup  
 ┃ ┃ ┃ ┣ 📜useSignupForm.js  
 ┃ ┃ ┃ ┗ 📜useSignupSubmit.js  
 ┃ ┃ ┗ 📂styling  
 ┃ ┃ ┃ ┣ 📜useMediaQuery.js  
 ┃ ┃ ┃ ┗ 📜useTheme.js  
 ┃ ┣ 📂lib  
 ┃ ┃ ┣ 📂api  
 ┃ ┃ ┃ ┣ 📜auth.js  
 ┃ ┃ ┃ ┣ 📜avatar.js  
 ┃ ┃ ┃ ┗ 📜tokenManager.js  
 ┃ ┃ ┣ 📜algolia.js  
 ┃ ┃ ┣ 📜firebase.js  
 ┃ ┃ ┗ 📜firebaseAdmin.js  
 ┃ ┣ 📂store  
 ┃ ┃ ┣ 📜activeStateSlice.js  
 ┃ ┃ ┣ 📜authSlice.js  
 ┃ ┃ ┣ 📜modalSlice.js  
 ┃ ┃ ┗ 📜store.js  
 ┃ ┣ 📂utils  
 ┃ ┃ ┣ 📂auth  
 ┃ ┃ ┃ ┣ 📜checkUser.js  
 ┃ ┃ ┃ ┣ 📜tokenUtils.js  
 ┃ ┃ ┃ ┣ 📜updateEmail.js  
 ┃ ┃ ┃ ┗ 📜verifyPassword.js  
 ┃ ┃ ┣ 📜calculateModalPosition.js  
 ┃ ┃ ┣ 📜constants.js  
 ┃ ┃ ┣ 📜highlightText.js  
 ┃ ┃ ┣ 📜isMyPost.js  
 ┃ ┃ ┣ 📜markdownToHtml.js  
 ┃ ┃ ┣ 📜metadata.js  
 ┃ ┃ ┣ 📜outsideClickModalClose.js  
 ┃ ┃ ┣ 📜postTime.js  
 ┃ ┃ ┣ 📜scrollHandler.js  
 ┃ ┃ ┣ 📜themeScript.js  
 ┃ ┃ ┗ 📜validation.js  
 ┣ 📜README.md  
 ┣ 📜build.sh  
 ┣ 📜jsconfig.json  
 ┣ 📜next.config.mjs  
 ┣ 📜package-lock.json  
 ┗ 📜package.json  
 
</details>




### 3.2 개발 일정
![image](https://github.com/user-attachments/assets/570dcd10-f256-4828-84d4-a79e75005c93)

## Ⅳ. 와이어프레임 / UI
### 4.1 와이어프레임

|LightMode|DarkMode|
|:---:|:---:|
|![image](https://github.com/user-attachments/assets/a4623c99-d5e3-47a8-912f-98d29bbf5776)|![image](https://github.com/user-attachments/assets/d2e3f136-0862-4492-95a2-0601dcb3a5b3)|
|LightMode(Mobile)|DarkMode(Mobile)|
|![image](https://github.com/user-attachments/assets/b5f25b69-16eb-495c-bc1a-76d1aaf539d3)|![image](https://github.com/user-attachments/assets/5d92b146-10aa-4210-95ba-38201563eb68)|
|Asset|TagColorPalette|
|![image](https://github.com/user-attachments/assets/586807ae-9004-4ad4-b443-96d9751c269d)|![image](https://github.com/user-attachments/assets/f3a2d83f-0ae9-417d-85a3-a0cb8cde09aa)|

### 4.2 UI
|회원가입|회원가입2|
|:---:|:---:|
|![Signup](https://github.com/user-attachments/assets/9c6e9f49-c200-4b44-bf54-7e884d88e469)|![Signup2](https://github.com/user-attachments/assets/c17d3525-aaac-457e-af89-a7ac5ed74f6c)|
|로그인|메인페이지|
|![login](https://github.com/user-attachments/assets/11722499-b2fa-4361-9e85-6925ceb06cf6)|![main](https://github.com/user-attachments/assets/72cf10bf-246d-47e3-b108-27ba41aa337a)|
|모드변경|게시글|
|![changeMode](https://github.com/user-attachments/assets/bd2c0ce9-18cc-4482-8124-e64f4aee9d15)|![Post](https://github.com/user-attachments/assets/2692c0cf-e359-4030-bd36-6544837176ef)|
|댓글달기|공유하기|
|![recommend](https://github.com/user-attachments/assets/25a5fe73-893a-4a69-8c1d-afe3f05d0805)|![공유](https://github.com/user-attachments/assets/ca257d6b-f149-48a5-ace2-cacd7afac120)|
|신고하기|내프로필|
|![신고](https://github.com/user-attachments/assets/1965f59b-ff7b-4f08-8d75-d050c5463c02)|![내 프로필](https://github.com/user-attachments/assets/e86131c3-b686-4f6a-9307-b8c281485c69)|
|글쓰기|AI해몽|
|![글쓰기](https://github.com/user-attachments/assets/1134d552-305f-4f2f-9427-a2426ba42ae3)|![AI해몽](https://github.com/user-attachments/assets/84688e6e-363c-426d-a41d-9c9cdf24d81c)|
|검색|계정설정/회원탈퇴|
|![검색](https://github.com/user-attachments/assets/bd35f1a6-5623-484a-bed7-7a3488060ff8)|![계정설정](https://github.com/user-attachments/assets/d775f365-4ea8-4ccc-9698-962ba21fa90c)|
## Ⅴ. 개발History
### 📅 데일리 스크럼(Daily Scrum)
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
- [회의록](https://docs.google.com/spreadsheets/d/1g7FxrfT_1m8kESLA2BRrnAQPoZ6RvkaNFjj1dblro_o/edit?gid=0#gid=0)  

### 💣문제상황 공유 및 해결
#### ▪ 데일리스크럼 시간을 이용한 건의사항 공유 및 추가협의진행
![image](https://github.com/user-attachments/assets/67ba384b-e6fb-4924-908c-96caa1452dd0)

![image](https://github.com/user-attachments/assets/6646ae06-098a-4f8d-98d9-9ea2118dde17)

#### ▪ 깃허브 이슈와 프로젝트를 이용한 실시간 상태공유
![image](https://github.com/user-attachments/assets/dd5de133-ab3d-43cb-b88e-1ae1b73337c8)   
![image](https://github.com/user-attachments/assets/5c0674b3-fa35-4dc8-bd05-62c3f979b885)

#### ▪ 팀 디스코드를 통한 PR내용확인(QA/QC기간)
<img width="527" alt="image" src="https://github.com/user-attachments/assets/a60242be-e959-4218-919d-623b066f04ca" />

### 🛠️ 추가개발사항
- 프로필 페이지 게시글 목록 무한스크롤 구현
- 프로필 사진 삭제기능 (API작업 및 프론트작업)
- 문의사항 페이지
- 게시글 스크랩 기능
- 알림 기능
- 관리자 페이지 기능 추가
- React Native 모바일 앱 구현

### ✨느낀점
#### [FE]황초희
```
팀프로젝트가 처음이거니와, 더불어 팀장도 첫경험이어서 미숙하고 어리버리한 부분이 많았을텐데, 제가 진행하고자 하는 부분에있어서 팀원분들 모두 적극적으로 의견을 내주시고, 잘 따라주셨고, 프로젝트의 시작부터 마무리까지 함께 소통하며 다같이 열심히 해서 좋은 결과를 낼 수 있지않았나, 생각합니다. 다시한번 소통의 중요성을 깨달을 수 있었던 시간이었고, 너무나도 뜻깊은 시간이었습니다.
```

#### [FE]김지훈
```
팀원 분들 모두가 저의 조그마한 아이디어에 살을 붙여 주시고 더 나은 결과물을 만들어내도록 노력해 주셔서 정말 감사했습니다. 첫 협업 프로젝트다 보니 처음에는 많이 미숙한 부분도 많았지만, 그래도 팀원 분들이 함께 도와주고 이끌어주신 덕분에 모두가 만족할 수 있는 결과가 나온 것 같습니다. 짧으면서도 길었던 3주 동안 모두 치열하게 프로젝트에 몰두하시느라 고생 많으셨습니다. 즐거운 연말 보내세요!
```

#### [FE]한지현
```
프로젝트를 시작 할 때 개발이 익숙하지 않은 부분이 많아 어려움이 많았었는데, 팀원들과 함께 프로젝트를 진행하면서 조금씩 새로운 것을 알아갈 수 있었습니다.소통의 중요성을 깨달을 수 있는 시간이었습니다. 또한 혼자 진행했다면 막히거나 헤맸을 부분도 팀원들과 함께라 이겨낸 것 같아 뜻 깊은 시간이었습니다.
```

#### [FE]하진희
```
첫 팀 프로젝트를 통해 서로의 코드를 보고 유지 보수 하는 과정에서 더 넓은 시야를 가지게 되었습니다. 익숙하지 않던 코드를 새롭게 배우는 즐거움과 코드 / 깃 컨벤션 적용, 깃허브 활용을 통해 성장할 수 있었습니다. 무엇보다, 팀원들의 따뜻한 노력과 애정 덕분에 이 프로젝트가 정말 특별한 경험으로 남았습니다. 앞으로도 함께 더 멋진 Dreamer를 만들어가고 싶습니다. 정말 감사드립니다, 드리머 최고!
```


