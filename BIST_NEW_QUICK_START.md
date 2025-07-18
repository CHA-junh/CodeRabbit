# BIST_NEW 프로젝트 빠른 시작 가이드

## 🚀 5분 만에 프로젝트 시작하기

### 1. 환경 준비 (2분)

#### 필수 소프트웨어 설치

```bash
# Node.js 18+ 설치 확인
node --version  # v18.0.0 이상

# npm 설치 확인
npm --version   # 최신 버전 권장

# Git 설치 확인
git --version
```

#### Oracle Database 준비

- Oracle Database 11g 이상 설치
- Oracle Client 설치 (oracledb 드라이버용)
- 데이터베이스 접속 정보 준비

### 2. 프로젝트 클론 및 설치 (1분)

```bash
# 프로젝트 클론
git clone <repository-url>
cd BIST_NEW

# 의존성 설치
npm install
```

### 3. 환경 변수 설정 (1분)

```bash
# 루트 디렉토리에 .env 파일 생성
touch .env
```

`.env` 파일에 다음 내용 추가:

```env
# 데이터베이스 설정
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=1521
DB_SERVICE=your_service_name

# 세션 설정
SESSION_SECRET=your-secret-key

# 서버 포트
PORT=8080
```

### 4. 개발 서버 실행 (1분)

```bash
# 전체 개발 서버 실행 (프론트엔드 + 백엔드)
npm run dev
```

### 5. 접속 확인

- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:8080
- **API 문서**: http://localhost:8080/api-docs

---

## 📚 필수 학습 자료

### 1. 기술 스택 기초 (30분)

#### Next.js 14

- [Next.js 공식 튜토리얼](https://nextjs.org/learn)
- App Router 개념 이해
- React Server Components vs Client Components

#### NestJS

- [NestJS 공식 문서](https://docs.nestjs.com/)
- 모듈, 컨트롤러, 서비스 개념
- 의존성 주입 (DI) 이해

#### TypeScript

- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- 인터페이스와 타입 정의
- 제네릭 사용법

### 2. 프로젝트 구조 이해 (15분)

```
BIST_NEW/
├── apps/
│   ├── client/          # Next.js 프론트엔드
│   └── server/          # NestJS 백엔드
├── BISBM_schema.json    # 데이터베이스 스키마
└── package.json         # 루트 설정
```

### 3. 주요 개념 학습 (20분)

#### 인증 시스템

- 세션 기반 인증
- 권한 기반 접근 제어 (RBAC)
- 메뉴 권한 관리

#### 메뉴 시스템

- 동적 컴포넌트 로딩
- 탭 기반 네비게이션
- 메뉴 트리 구조

---

## 🔧 개발 환경 설정

### VS Code 확장 프로그램

#### 필수 확장

- **TypeScript Importer**: 타입 자동 임포트
- **ES7+ React/Redux/React-Native snippets**: React 코드 스니펫
- **Tailwind CSS IntelliSense**: Tailwind CSS 자동완성
- **Prettier - Code formatter**: 코드 포맷팅
- **ESLint**: 코드 린팅

#### 권장 확장

- **Auto Rename Tag**: HTML/JSX 태그 자동 변경
- **Bracket Pair Colorizer**: 괄호 색상 구분
- **GitLens**: Git 히스토리 강화
- **Thunder Client**: API 테스트

### VS Code 설정

`.vscode/settings.json` 파일 생성:

```json
{
	"editor.formatOnSave": true,
	"editor.defaultFormatter": "esbenp.prettier-vscode",
	"typescript.preferences.importModuleSpecifier": "relative",
	"typescript.suggest.autoImports": true,
	"emmet.includeLanguages": {
		"typescript": "html",
		"typescriptreact": "html"
	}
}
```

---

## 🎯 첫 번째 작업 가이드

### 1. 로그인 페이지 확인

```bash
# 브라우저에서 접속
http://localhost:3000/signin
```

### 2. API 문서 확인

```bash
# Swagger UI 접속
http://localhost:8080/api-docs
```

### 3. 간단한 컴포넌트 수정

```typescript
// apps/client/src/components/Toast.tsx 수정
// 토스트 메시지 색상 변경해보기
```

### 4. API 엔드포인트 테스트

```bash
# 세션 확인 API 테스트
curl http://localhost:8080/api/auth/session
```

---

## 🐛 일반적인 문제 해결

### 1. Oracle 연결 오류

```bash
# 환경 변수 확인
echo $DB_USER
echo $DB_PASSWORD
echo $DB_HOST

# Oracle 클라이언트 설치 확인
npm list oracledb
```

### 2. 포트 충돌

```bash
# 포트 사용 중인 프로세스 확인
netstat -ano | findstr :3000
netstat -ano | findstr :8080

# 프로세스 종료
taskkill /PID <process_id> /F
```

### 3. 의존성 설치 오류

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules
npm install
```

### 4. TypeScript 컴파일 오류

```bash
# 타입 체크
npx tsc --noEmit

# 캐시 삭제
rm -rf .next
npm run dev
```

---

## 📖 다음 단계

### 1. 상세 문서 읽기

- [BIST_NEW_PROJECT_GUIDE.md](./BIST_NEW_PROJECT_GUIDE.md): 전체 프로젝트 가이드
- [BIST_NEW_TECHNICAL_DETAILS.md](./BIST_NEW_TECHNICAL_DETAILS.md): 기술적 세부사항

### 2. 코드 탐색

```bash
# 주요 파일들 살펴보기
cat apps/client/src/app/layout.tsx
cat apps/server/src/main.ts
cat apps/server/src/app.module.ts
```

### 3. 개발 시작

- 기존 컴포넌트 수정
- 새로운 API 엔드포인트 추가
- 데이터베이스 쿼리 작성

---

## 🆘 도움이 필요할 때

### 1. 팀 내 질문

- **프론트엔드**: [프론트엔드 개발자 연락처]
- **백엔드**: [백엔드 개발자 연락처]
- **데이터베이스**: [DBA 연락처]

### 2. 외부 리소스

- [Next.js 공식 문서](https://nextjs.org/docs)
- [NestJS 공식 문서](https://docs.nestjs.com/)
- [TypeScript 공식 문서](https://www.typescriptlang.org/docs/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

### 3. 커뮤니티

- [Next.js Discord](https://discord.gg/nextjs)
- [NestJS Discord](https://discord.gg/nestjs)
- [TypeScript GitHub](https://github.com/microsoft/TypeScript)

---

## ✅ 체크리스트

### 개발 환경 설정

- [ ] Node.js 18+ 설치
- [ ] npm 설치
- [ ] Git 설치
- [ ] VS Code 설치
- [ ] 필수 확장 프로그램 설치

### 프로젝트 설정

- [ ] 프로젝트 클론
- [ ] 의존성 설치
- [ ] 환경 변수 설정
- [ ] 개발 서버 실행
- [ ] 접속 확인

### 학습 완료

- [ ] Next.js 기초 학습
- [ ] NestJS 기초 학습
- [ ] TypeScript 기초 학습
- [ ] 프로젝트 구조 이해
- [ ] 주요 개념 학습

### 첫 작업

- [ ] 로그인 페이지 확인
- [ ] API 문서 확인
- [ ] 간단한 컴포넌트 수정
- [ ] API 엔드포인트 테스트

---

**🎉 축하합니다! 이제 BIST_NEW 프로젝트 개발을 시작할 준비가 완료되었습니다.**

_이 가이드는 새로운 팀원이 빠르게 프로젝트에 적응할 수 있도록 작성되었습니다. 추가 질문이 있으면 언제든 팀원들에게 문의하세요!_
