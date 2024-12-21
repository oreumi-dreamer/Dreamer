

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
![리액트]( https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black ) ![다음.js]( https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=Nextdotjs&logoColor=white ) ![CSS 모듈]( https://img.shields.io/badge/CSS%20Modules-000000?style=for-the-badge&logo=CSSModules&logoColor=white ) ![Firebase](https://img.shields.io/badge/Firebase-DD2C00?style=for-the-badge&logo=Firebase&logoColor=white)![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=Redux&logoColor=white)
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
- 비회원에게도 공개개시글을 공유하여 함께 감상가능

## Ⅲ. 프로젝트 구조와 개발 일정
### 3.1 프로젝트 폴더 구조
<details>
<summary>접기 / 펼치기 </summary>  

📦Dreamer  
 ┣ 📂public  
 ┃ ┣ 📂fonts
 ┃ ┃ ┣ 📂NanumBarunPenB  
 ┃ ┃ ┗ 📂NanumBarunPenR  
 ┃ ┣ 📂images  
 ┃ ┗ 📂metadata  
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
 ┃ ┃ ┣ 📂alarm  
 ┃ ┃ ┃ ┣ 📜page.js  
 ┃ ┃ ┃ ┗ 📜page.module.css  
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
 ┃ ┃ ┣ 📂debug  
 ┃ ┃ ┃ ┣ 📂posting  
 ┃ ┃ ┃ ┃ ┣ 📂[postId]  
 ┃ ┃ ┃ ┃ ┃ ┗ 📜page.js  
 ┃ ┃ ┃ ┃ ┣ 📜page.js  
 ┃ ┃ ┃ ┃ ┗ 📜page.module.css  
 ┃ ┃ ┃ ┣ 📂posts  
 ┃ ┃ ┃ ┃ ┣ 📂[userId]  
 ┃ ┃ ┃ ┃ ┃ ┣ 📜page.js  
 ┃ ┃ ┃ ┃ ┃ ┗ 📜page.module.css  
 ┃ ┃ ┃ ┃ ┣ 📜page.js  
 ┃ ┃ ┃ ┃ ┗ 📜page.module.css  
 ┃ ┃ ┃ ┗ 📂user-modify  
 ┃ ┃ ┃ ┃ ┣ 📜page.js  
 ┃ ┃ ┃ ┃ ┗ 📜page.module.css  
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
 ┃ ┃ ┗ 📜reset.css  
 ┃ ┣ 📂components  
 ┃ ┃ ┣ 📂auth  
 ┃ ┃ ┃ ┗ 📜AuthStateHandler.jsx  
 ┃ ┃ ┣ 📂debug  
 ┃ ┃ ┃ ┣ 📜Comments.jsx  
 ┃ ┃ ┃ ┗ 📜Comments.module.css  
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
 ┃ ┃ ┃ ┣ 📜SocialLogin.jsx  
 ┃ ┃ ┃ ┗ 📜SocialLogin.module.css  
 ┃ ┃ ┣ 📂main  
 ┃ ┃ ┃ ┣ 📜MainList.jsx  
 ┃ ┃ ┃ ┣ 📜MainList.module.css  
 ┃ ┃ ┃ ┗ 📜Post.jsx  
 ┃ ┃ ┣ 📂modal  
 ┃ ┃ ┃ ┣ 📜CommentArticles.jsx  
 ┃ ┃ ┃ ┣ 📜CommentArticles.module.css  
 ┃ ┃ ┃ ┣ 📜PostModal.jsx  
 ┃ ┃ ┃ ┗ 📜PostModal.module.css  
 ┃ ┃ ┣ 📂post  
 ┃ ┃ ┃ ┣ 📜Post.jsx  
 ┃ ┃ ┃ ┗ 📜PostContent.jsx  
 ┃ ┃ ┣ 📂profile  
 ┃ ┃ ┃ ┣ 📜PostList.jsx  
 ┃ ┃ ┃ ┣ 📜Profile.jsx  
 ┃ ┃ ┃ ┣ 📜Profile.module.css  
 ┃ ┃ ┃ ┣ 📜ProfileEdit.jsx  
 ┃ ┃ ┃ ┗ 📜ProfileInfo.jsx  
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
 ┃ ┗ 📂utils  
 ┃ ┃ ┣ 📂auth  
 ┃ ┃ ┃ ┣ 📜checkUser.js  
 ┃ ┃ ┃ ┣ 📜tokenUtils.js  
 ┃ ┃ ┃ ┣ 📜updateEmail.js  
 ┃ ┃ ┃ ┗ 📜verifyPassword.js  
 ┃ ┃ ┣ 📜calculateModalPosition.js  
 ┃ ┃ ┣ 📜constants.js  
 ┃ ┃ ┣ 📜isMyPost.js  
 ┃ ┃ ┣ 📜markdownToHtml.js  
 ┃ ┃ ┣ 📜metadata.js  
 ┃ ┃ ┣ 📜outsideClickModalClose.js  
 ┃ ┃ ┣ 📜postTime.js  
 ┃ ┃ ┣ 📜themeScript.js  
 ┃ ┃ ┗ 📜validation.js  
 ┣ 📜.eslintrc.json  
 ┣ 📜.gitignore  
 ┣ 📜.prettierrc  
 ┣ 📜build.sh  
 ┣ 📜jsconfig.json  
 ┣ 📜next.config.mjs  
 ┣ 📜package-lock.json  
 ┣ 📜package.json  
 ┗ 📜README.md
 
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
시연영상 gif 삽입

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

### ✨느낀점
#### [FE]황초희
``` 3차프로젝트 진행하면서 느낀점 ```

#### [FE]김지훈
``` 3차프로젝트 진행하면서 느낀점 ```

#### [FE]한지현
``` 3차프로젝트 진행하면서 느낀점 ```

#### [FE]하진희
``` 3차프로젝트 진행하면서 느낀점 ```


