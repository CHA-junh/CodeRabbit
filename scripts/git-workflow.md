# BIST_NEW Git 브랜치 전략 및 CI/CD 워크플로우

## 🌿 브랜치 전략 (Git Flow)

### 주요 브랜치

- `main` - 프로덕션 배포용 (안정 버전)
- `develop` - 개발 통합용 (기능 개발 완료 후)
- `dev` - 개발 서버 배포용 (현재 사용 중)
- `feature/*` - 기능 개발용
- `hotfix/*` - 긴급 수정용

### 브랜치별 배포 환경

- `main` → 프로덕션 서버
- `develop` → 스테이징 서버
- `dev` → 개발 서버 (현재: 124.111.208.66)

## 🔄 개발 워크플로우

### 1. 기능 개발 시작

```bash
# develop 브랜치에서 feature 브랜치 생성
git checkout develop
git pull origin develop
git checkout -b feature/새기능명

# 개발 작업...
git add .
git commit -m "feat: 새 기능 구현"
```

### 2. 개발 완료 후 통합

```bash
# develop 브랜치로 병합
git checkout develop
git merge feature/새기능명
git push origin develop

# feature 브랜치 삭제
git branch -d feature/새기능명
```

### 3. 개발 서버 배포

```bash
# dev 브랜치로 배포
git checkout dev
git merge develop
git push origin dev

# 개발 서버 자동 배포 실행
scripts/deploy-dev.bat
```

## 🚀 CI/CD 파이프라인 구성

### 자동화 단계

1. **코드 푸시** → Git Hook 트리거
2. **테스트 실행** → Unit Test, E2E Test
3. **빌드 검증** → TypeScript 컴파일, Next.js 빌드
4. **배포 실행** → 개발 서버 자동 배포

### 배포 조건

- `dev` 브랜치에 푸시 시 자동 배포
- 테스트 통과 시에만 배포 진행
- 배포 실패 시 롤백 자동 실행

## 📋 체크리스트

### 개발자 체크리스트

- [ ] 기능 개발 전 `develop` 브랜치 최신화
- [ ] `feature/*` 브랜치에서 개발
- [ ] 커밋 메시지 컨벤션 준수
- [ ] 테스트 코드 작성
- [ ] PR 생성 시 리뷰 요청

### 배포 체크리스트

- [ ] `dev` 브랜치 상태 확인
- [ ] 환경 변수 설정 검증
- [ ] 데이터베이스 마이그레이션 확인
- [ ] 배포 후 헬스 체크
- [ ] 로그 모니터링

## 🔧 설정 파일

### Git Hooks

- `pre-commit`: 코드 포맷팅, 린트 검사
- `pre-push`: 테스트 실행
- `post-merge`: 의존성 설치

### 환경별 설정

- `env.dev` - 개발 환경
- `env.staging` - 스테이징 환경
- `env.prod` - 프로덕션 환경
