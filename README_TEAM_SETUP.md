# BIST_NEW 팀 설정 가이드

## 🚀 빠른 시작

### 1. 프로젝트 클론

```bash
git clone http://svn.buttle.co.kr/scm/repo/scmadmin/BIST_NEW.git
cd BIST_NEW
```

### 2. 의존성 설치

```bash
npm install
cd apps/client && npm install
cd ../server && npm install
```

### 3. 개발 서버 실행

```bash
# 클라이언트 (Next.js)
cd apps/client
npm run dev

# 서버 (NestJS) - 새 터미널에서
cd apps/server
npm run start:dev
```

## 🔧 Git 설정 및 문제 해결

### Git 사용자 정보 설정

```bash
git config --global user.name "당신의 이름"
git config --global user.email "당신의이메일@company.com"
```

### 브랜치 트래킹 설정 (중요!)

```bash
# 현재 브랜치를 원격 master 브랜치와 연결
git branch --set-upstream-to=origin/master master

# 또는 새로 클론한 경우
git checkout -b master origin/master
```

### 원격 저장소 확인

```bash
# 원격 저장소 목록 확인
git remote -v

# 원격 저장소 추가 (필요한 경우)
git remote add origin http://svn.buttle.co.kr/scm/repo/scmadmin/BIST_NEW.git
```

## 🚨 VS Code Git 문제 해결

### 문제 1: "no upstream configured for branch 'master'"

**해결법:**

```bash
git branch --set-upstream-to=origin/master master
```

### 문제 2: "There is no tracking information for the current branch"

**해결법:**

```bash
# 방법 1: 트래킹 설정
git branch --set-upstream-to=origin/master master

# 방법 2: pull 시 브랜치 명시
git pull origin master
```

### 문제 3: VS Code에서 Git 상태가 제대로 표시되지 않음

**해결법:**

1. **Ctrl+Shift+P** → "Developer: Reload Window"
2. VS Code 재시작
3. Git 확장 재설치

### 문제 4: Git 인증 문제

**해결법:**

```bash
# Git 자격 증명 저장
git config --global credential.helper store

# 또는 Windows 자격 증명 관리자 사용
git config --global credential.helper wincred
```

## 📁 작업 폴더 설정

### VS Code에서 작업 폴더 변경

1. **File** → **Open Folder**
2. `C:\BIST_NEW` 선택
3. **Select Folder** 클릭

### 권장사항

- **작업 폴더**: `C:\BIST_NEW` (프로젝트 루트)
- **소스 관리**: Git으로 통합 관리
- **개발 환경**: VS Code + Cursor AI

## 🎨 디자인 시안 확인

### 디자인 시안 페이지 접속

- **URL**: `http://localhost:3000/designs`
- **설명**: 디자이너가 업로드한 시안들을 확인할 수 있습니다.

## 🔄 Git 작업 흐름

### 1. 작업 시작

```bash
git pull origin master  # 최신 코드 가져오기
git checkout -b feature/작업명  # 새 브랜치 생성
```

### 2. 작업 완료

```bash
git add .
git commit -m "작업 내용 설명"
git push origin feature/작업명
```

### 3. 병합 요청

- Gitea에서 Pull Request 생성
- 코드 리뷰 후 master 브랜치로 병합

## 📞 문제 발생 시

### 로그 확인

- VS Code 출력 패널에서 Git 로그 확인
- 터미널에서 `git status` 실행

### 일반적인 해결 순서

1. Git 설정 확인 (`git config --list`)
2. 브랜치 트래킹 설정
3. 원격 저장소 연결 확인
4. VS Code 재시작

---

**참고**: 이 가이드는 Windows 환경을 기준으로 작성되었습니다.
