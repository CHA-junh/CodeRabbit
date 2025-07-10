# BIST_NEW 프로젝트 최초 소스 동기화 가이드

이 문서는 **팀원들이 최초로 소스코드를 내려받아 개발을 시작하는 방법**을 쉽게 안내합니다.

---

## 1. Git 설치 (처음 한 번만)

- [https://git-scm.com/downloads](https://git-scm.com/downloads) 접속 → **Windows용 Git** 설치
- 설치 후, 터미널(명령 프롬프트, PowerShell, VS Code 터미널 등)에서 아래 명령어로 확인
  ```
  git --version
  ```
  → 버전이 나오면 정상 설치

---

## 2. VS Code 설치 (권장)

- [https://code.visualstudio.com/](https://code.visualstudio.com/) 접속 → 설치
- VS Code는 Git 연동이 쉬워서 강력 추천!


---

## 3. 저장소 복제(다운로드) 방법

### 방법 1: VS Code에서 복제(추천)

1. **VS Code 실행**
2. **상단 메뉴 → 보기 → 명령 팔레트** 또는 `Ctrl + Shift + P`
3. **"git clone"** 입력 → "Git: Clone" 선택
4. **저장소 주소 입력**
   ```
   http://svn.buttle.co.kr/scm/repo/scmadmin/BIST_NEW
   ```
5. **로컬에 저장할 폴더 선택**
   - 예: 내 문서, 바탕화면 등 (자동으로 BIST_NEW 폴더가 생김)
6. **복제 완료 후 "열기" 클릭**

### 방법 2: 명령 프롬프트/터미널에서 복제

1. 원하는 폴더로 이동
   ```
   cd C:\Users\내이름\Documents
   ```
2. 아래 명령어 입력
   ```
   git clone http://svn.buttle.co.kr/scm/repo/scmadmin/BIST_NEW
   ```
3. 복제 완료 후, VS Code에서 `BIST_NEW` 폴더 열기

---

## 4. 최초 세팅 후 할 일

- **VS Code에서 소스 제어(🔃) 아이콘 클릭**
  - 변경사항이 없으면 정상!
- **프로젝트별로 필요한 의존성 설치**
  - 예: Node.js 프로젝트라면 `npm install`

---

## 5. 이후 협업 방법

- 소스 수정 → **add → commit → push**
- 작업 전에는 **pull(가져오기)**로 최신 소스 동기화

---

## 요약

1. **git clone [저장소 주소]** → 최초 소스 내려받기
2. **VS Code에서 폴더 열기**
3. **필요한 패키지 설치(npm install 등)**
4. **이후 add → commit → push, 그리고 pull**

---

### ⚠️ 주의사항

- 여러 명이 동시에 같은 파일을 수정하면 충돌이 날 수 있으니, 작업 전에는 꼭 **pull(가져오기)** 하세요.
- Git, VS Code 사용이 익숙하지 않으면 언제든 팀장/관리자에게 문의하세요!

---

**문의: sosa0070@buttle.co.kr 또는 팀장에게 직접 문의**
