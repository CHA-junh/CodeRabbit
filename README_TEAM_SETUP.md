# BIST_NEW 프로젝트 팀원용 Git 사용 가이드 (C:\BIST_NEW 기준)

이 문서는 **팀원들이 반드시 C:\BIST_NEW 폴더에서만 소스 관리 및 개발**을 하도록, Git 사용법을 아주 쉽게 안내합니다.

---

## 1. 폴더 준비

- 반드시 `C:\BIST_NEW` 폴더에서만 모든 작업(개발, 커밋, 푸시 등)을 진행하세요.
- 기존 `C:\BIST_NEW` 폴더가 있다면 삭제하거나 백업하세요.

---

## 2. Git 설치 (처음 한 번만)

- [https://git-scm.com/downloads](https://git-scm.com/downloads) 접속 → **Windows용 Git** 설치
- 설치 파일은 사내 메신져로 제공
- 설치 후, 터미널(명령 프롬프트, PowerShell, VS Code 터미널 등)에서 아래 명령어로 확인
  ```
  git --version
  ```
  → 버전이 나오면 정상 설치

---

## 3. VS Code 설치 (권장)

- [https://code.visualstudio.com/](https://code.visualstudio.com/) 접속 → 설치
- VS Code는 Git 연동이 쉬워서 강력 추천!

---

## 4. 저장소 복제(최초 1회)

1. **C 드라이브에 BIST_NEW 폴더가 없다면, 빈 폴더를 직접 만드세요.**
2. **VS Code 실행 → 상단 메뉴 → 파일(F) → 폴더 열기(O)... → `C:\BIST_NEW` 폴더 선택**
3. **VS Code 내 터미널(상단 메뉴 → 터미널 → 새 터미널)에서 아래 명령어 입력**
   ```
   git init
   git remote add origin http://svn.buttle.co.kr/scm/repo/scmadmin/BIST_NEW
   git pull origin master
   ```
   > (브랜치가 main이면 master 대신 main)
4. 소스가 정상적으로 내려오면 성공!

---

## 5. 개발 및 협업 방법

### 1) 소스 수정/추가/삭제

- 항상 `C:\BIST_NEW` 폴더에서만 작업하세요.

### 2) 변경사항 커밋 & 푸시 ()

1. **좌측 소스 제어(🔃) 아이콘 클릭**
2. 변경된 파일 옆의 **"+"** 클릭(스테이징)
3. 상단 입력란에 **커밋 메시지** 입력 (예: "로그인 기능 추가")
4. **"✔" 클릭(커밋)**
5. **"⭳" 클릭(푸시)** → Gitea 서버로 업로드

### 3) 소스 동기화(최신 소스 받기)

- 작업 전에는 항상 **"가져오기(Fetch/Pull)"** 버튼 클릭
- 또는 터미널에서
  ```
  git pull origin master
  ```

---

## 6. 주의사항

- 반드시 `C:\BIST_NEW` 폴더에서만 모든 작업을 하세요.
- 다른 위치에 같은 프로젝트 폴더가 있으면 삭제/백업하세요.
- 커밋/푸시 전에는 항상 **pull(가져오기)**로 최신 소스를 먼저 받아주세요.
- 여러 명이 동시에 같은 파일을 수정하면 충돌이 날 수 있으니, 작업 전 pull은 필수!
- Git, VS Code 사용이 익숙하지 않으면 언제든 팀장/관리자에게 문의하세요.

---

## 7. 문의

- **문의: 성지훈차장 에게 직접 문의**
