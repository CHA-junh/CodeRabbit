# BIST_NEW 배포 가이드

## 🚀 개요

BIST_NEW 프로젝트는 Git 기반의 자동화된 배포 시스템을 제공합니다. 개발 서버 WAS 구축 후 Git과 연동하여 개발 소스를 자동으로 반영할 수 있습니다.

## 📋 시스템 요구사항

### 필수 소프트웨어

- **Node.js** 18.x 이상
- **Git** 2.x 이상
- **npm** 9.x 이상
- **Windows** (배포 스크립트는 Windows용)

### 서버 환경

- **개발 서버**: `실제_서버_IP_주소` (env.dev 파일에서 설정)
- **프론트엔드**: `http://실제_서버_IP:3000`
- **백엔드 API**: `http://실제_서버_IP:8080`
- **API 문서**: `http://실제_서버_IP:8080/api-docs`

## 🔧 초기 설정

### 1. Git Hooks 설정

```bash
# Git Hooks 설정 스크립트 실행
scripts\setup-git-hooks.bat
```

이 스크립트는 다음 Git Hooks를 설정합니다:

- `pre-commit`: 코드 품질 검사 (TypeScript, ESLint)
- `pre-push`: 테스트 실행
- `post-merge`: 의존성 자동 설치
- `post-receive`: dev 브랜치 자동 배포

### 2. 환경 변수 설정

```bash
# 개발 환경 변수 파일 확인
env.dev
```

필수 환경 변수:

- `DATABASE_URL`: 데이터베이스 연결 문자열
- `JWT_SECRET`: JWT 토큰 시크릿
- `NODE_ENV`: 환경 설정 (development)

## 🔄 배포 워크플로우

### 브랜치 전략

```
main (프로덕션)
├── develop (개발 통합)
└── dev (개발 서버 배포) ← 현재 사용
    ├── feature/기능1
    ├── feature/기능2
    └── hotfix/긴급수정
```

### 개발 프로세스

#### 1. 기능 개발

```bash
# develop 브랜치에서 feature 브랜치 생성
git checkout develop
git pull origin develop
git checkout -b feature/새기능명

# 개발 작업...
git add .
git commit -m "feat: 새 기능 구현"
```

#### 2. 개발 완료 후 통합

```bash
# develop 브랜치로 병합
git checkout develop
git merge feature/새기능명
git push origin develop

# feature 브랜치 삭제
git branch -d feature/새기능명
```

#### 3. 개발 서버 배포

```bash
# dev 브랜치로 배포
git checkout dev
git merge develop
git push origin dev

# 자동 배포 실행 (Git Hook에 의해 자동 실행됨)
```

## 🛠️ 배포 도구

### 1. 빠른 배포 도구

```bash
# 대화형 배포 도구 실행
scripts\quick-deploy.bat
```

**메뉴 옵션:**

- **1**: 개발 서버 배포 (dev 브랜치)
- **2**: 현재 변경사항만 배포
- **3**: 서버 상태 확인
- **4**: 서버 재시작
- **5**: 배포 로그 확인
- **6**: Git 상태 확인

### 2. 수동 배포

```bash
# 개발 환경 배포
scripts\deploy-dev.bat

# 자동 배포 (Git Hook용)
scripts\deploy-auto.bat
```

### 3. Git 명령어로 배포

```bash
# dev 브랜치에 푸시하면 자동 배포
git push origin dev
```

## 📊 모니터링 및 로그

### 배포 로그

- **실시간 로그**: `deploy.log`
- **배포 히스토리**: `deploy-history.log`

### 서버 상태 확인

```bash
# 헬스 체크
curl http://실제_서버_IP:8080/health/dev

# 프론트엔드 확인
curl http://실제_서버_IP:3000
```

### 프로세스 모니터링

```bash
# Node.js 프로세스 확인
tasklist /fi "imagename eq node.exe"
```

## 🔍 문제 해결

### 일반적인 문제들

#### 1. 배포 실패

```bash
# 로그 확인
type deploy.log

# 서버 상태 확인
scripts\quick-deploy.bat
# 메뉴에서 "3" 선택
```

#### 2. Git Hook 작동 안함

```bash
# Git Hooks 재설정
scripts\setup-git-hooks.bat
```

#### 3. 의존성 문제

```bash
# node_modules 삭제 후 재설치
rmdir /s node_modules
npm install
```

#### 4. 포트 충돌

```bash
# 기존 프로세스 종료
taskkill /f /im node.exe
```

### 디버깅 명령어

```bash
# TypeScript 컴파일 검사
npx tsc --noEmit

# ESLint 검사
npm run lint

# 테스트 실행
npm run test

# 빌드 테스트
npm run build
```

## 📋 체크리스트

### 배포 전 체크리스트

- [ ] `dev` 브랜치에서 작업 중인지 확인
- [ ] 모든 테스트 통과
- [ ] TypeScript 컴파일 오류 없음
- [ ] ESLint 오류 없음
- [ ] 환경 변수 설정 확인

### 배포 후 체크리스트

- [ ] 서버 정상 시작 확인
- [ ] 헬스 체크 통과
- [ ] 프론트엔드 접속 확인
- [ ] API 문서 접속 확인
- [ ] 로그 파일 확인

## 🚨 주의사항

### 보안

- `env.dev` 파일에 민감한 정보가 포함되어 있으므로 Git에 커밋하지 않음
- 프로덕션 환경에서는 별도의 환경 변수 관리 필요

### 성능

- 배포 중에는 서버가 일시적으로 중단될 수 있음
- 대용량 파일 업로드 시 배포 시간이 길어질 수 있음

### 백업

- 중요한 변경사항은 반드시 Git에 커밋
- 데이터베이스 변경사항은 별도 백업 필요

## 📞 지원

### 문제 발생 시

1. 로그 파일 확인 (`deploy.log`, `deploy-history.log`)
2. 서버 상태 확인 (`scripts\quick-deploy.bat`)
3. Git 상태 확인
4. 팀 리더에게 문의

### 연락처

- **개발팀**: 개발팀 채널
- **시스템 관리자**: 시스템 관리자 연락처
- **긴급 상황**: 긴급 연락처

---

**마지막 업데이트**: 2024년 12월
**버전**: 1.0.0
