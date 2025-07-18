# BIST_NEW 프로젝트 종합 가이드 문서

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [프로젝트 구조](#프로젝트-구조)
4. [아키텍처 설계](#아키텍처-설계)
5. [데이터베이스 설계](#데이터베이스-설계)
6. [개발 환경 설정](#개발-환경-설정)
7. [프론트엔드 가이드](#프론트엔드-가이드)
8. [백엔드 가이드](#백엔드-가이드)
9. [인증 및 보안](#인증-및-보안)
10. [배포 가이드](#배포-가이드)
11. [개발 가이드라인](#개발-가이드라인)
12. [문제 해결](#문제-해결)

---

## 🎯 프로젝트 개요

### 프로젝트 소개

BIST_NEW는 기존 BIST 시스템의 현대화된 버전으로, 모노레포 구조를 기반으로 한 Next.js 프론트엔드와 NestJS 백엔드로 구성된 웹 애플리케이션입니다.

### 주요 특징

- **모노레포 구조**: Turborepo를 활용한 효율적인 워크스페이스 관리
- **현대적 기술 스택**: Next.js 14, NestJS, TypeScript, Oracle DB
- **타입 안전성**: TypeScript를 통한 엔드-투-엔드 타입 안전성
- **모듈화 설계**: 기능별 모듈 분리로 유지보수성 향상
- **보안 강화**: 세션 기반 인증 및 환경 변수 관리

### 프로젝트 목표

- 기존 레거시 시스템의 현대화
- 개발 생산성 및 유지보수성 향상
- 사용자 경험 개선
- 보안성 강화

---

## 🛠 기술 스택

### 프론트엔드

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.4.5
- **UI Library**: React 18.2.0
- **Styling**: Tailwind CSS 3.4.1
- **Grid**: AG Grid Community/Enterprise 31.0.0
- **Icons**: React Icons 5.5.0
- **State Management**: React Context API

### 백엔드

- **Framework**: NestJS 11.0.1
- **Language**: TypeScript 5.4.5
- **Database**: Oracle Database (oracledb 6.8.0)
- **ORM**: TypeORM 0.3.25
- **Validation**: class-validator 0.14.2
- **Documentation**: Swagger/OpenAPI 11.2.0
- **Session**: express-session 1.18.2

### 개발 도구

- **Package Manager**: npm
- **Monorepo**: Turborepo
- **Linting**: ESLint
- **Testing**: Jest
- **Build Tool**: Next.js, NestJS CLI

---

## 📁 프로젝트 구조

```
BIST_NEW/
├── apps/
│   ├── client/                 # Next.js 프론트엔드
│   │   ├── src/
│   │   │   ├── app/           # Next.js App Router
│   │   │   │   ├── (auth)/    # 인증 관련 페이지
│   │   │   │   ├── (main)/    # 메인 페이지
│   │   │   │   ├── mainframe/ # 메인프레임
│   │   │   │   ├── com/       # 공통 컴포넌트
│   │   │   │   ├── sys/       # 시스템 관리
│   │   │   │   └── popup/     # 팝업 페이지
│   │   │   ├── components/    # 공통 컴포넌트
│   │   │   ├── modules/       # 기능별 모듈
│   │   │   │   ├── auth/      # 인증 모듈
│   │   │   │   ├── com/       # 공통 모듈
│   │   │   │   ├── sys/       # 시스템 모듈
│   │   │   │   ├── usr/       # 사용자 모듈
│   │   │   │   └── psm/       # 프로젝트 관리 모듈
│   │   │   ├── utils/         # 유틸리티 함수
│   │   │   └── menus/         # 메뉴 구성
│   │   ├── public/            # 정적 파일
│   │   └── package.json
│   └── server/                # NestJS 백엔드
│       ├── src/
│       │   ├── auth/          # 인증 모듈
│       │   ├── user/          # 사용자 모듈
│       │   ├── menu/          # 메뉴 모듈
│       │   ├── com/           # 공통 모듈
│       │   ├── sys/           # 시스템 모듈
│       │   ├── database/      # 데이터베이스 관련
│       │   ├── entities/      # TypeORM 엔티티
│       │   ├── common/        # 공통 유틸리티
│       │   └── utils/         # 유틸리티 함수
│       └── package.json
├── packages/                  # 공유 패키지 (향후 확장)
├── BISBM_schema.json         # 데이터베이스 스키마
└── package.json              # 루트 패키지 설정
```

---

## 🏗 아키텍처 설계

### 전체 아키텍처

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│   (Oracle)      │
│                 │    │                 │    │                 │
│ - React 18      │    │ - TypeORM       │    │ - BISBM Schema  │
│ - TypeScript    │    │ - Session Auth  │    │ - Stored Proc   │
│ - Tailwind CSS  │    │ - Swagger API   │    │ - User Tables   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 프론트엔드 아키텍처

- **App Router**: Next.js 14의 새로운 라우팅 시스템
- **모듈화**: 기능별 모듈 분리 (auth, com, sys, usr, psm)
- **상태 관리**: React Context API를 통한 전역 상태 관리
- **동적 로딩**: Next.js dynamic import를 통한 코드 스플리팅

### 백엔드 아키텍처

- **모듈 기반**: NestJS 모듈 시스템을 통한 기능 분리
- **의존성 주입**: DI 컨테이너를 통한 느슨한 결합
- **데이터베이스**: Oracle DB + TypeORM + 커스텀 프로시저 실행
- **API 문서화**: Swagger를 통한 자동 API 문서 생성

---

## 🗄 데이터베이스 설계

### 데이터베이스 정보

- **DBMS**: Oracle Database
- **Schema**: BISBM
- **연결 방식**: oracledb 드라이버
- **ORM**: TypeORM

### 주요 테이블 구조

#### 사용자 관련 테이블

```sql
-- 사용자 정보
TBL_USER_INF (
  USER_ID VARCHAR2(10) PRIMARY KEY,
  USER_NM VARCHAR2(20),
  DEPT_CD VARCHAR2(20),
  DUTY_CD VARCHAR2(4),
  AUTH_CD VARCHAR2(10),
  USER_PWD VARCHAR2(20),
  EMAIL_ADDR VARCHAR2(100),
  USR_ROLE_ID VARCHAR2(20)
)

-- 사용자 역할
TBL_USER_ROLE (
  USR_ROLE_ID VARCHAR2(20) PRIMARY KEY,
  USR_ROLE_NM VARCHAR2(50),
  USR_ROLE_DESC VARCHAR2(200)
)

-- 메뉴 정보
TBL_MENU_INF (
  MENU_ID VARCHAR2(20) PRIMARY KEY,
  MENU_NM VARCHAR2(50),
  MENU_URL VARCHAR2(200),
  UPPR_MENU_ID VARCHAR2(20)
)
```

### 프로시저 기반 데이터 접근

- **조회 프로시저**: `*_S` 접미사 (CURSOR 반환)
- **수정 프로시저**: `*_I`, `*_U`, `*_D` 접미사 (STRING 반환)
- **커넥션 풀**: 최소 2개, 최대 10개 연결 관리

---

## ⚙ 개발 환경 설정

### 필수 요구사항

- **Node.js**: 18+ 버전
- **npm**: 최신 버전
- **Oracle Database**: 11g 이상
- **Oracle Client**: oracledb 드라이버 설치

### 설치 및 실행

#### 1. 프로젝트 클론 및 의존성 설치

```bash
git clone <repository-url>
cd BIST_NEW
npm install
```

#### 2. 환경 변수 설정

```bash
# 루트 디렉토리에 .env 파일 생성
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=1521
DB_SERVICE=your_service_name
SESSION_SECRET=your_session_secret
PORT=8080
```

#### 3. 개발 서버 실행

```bash
# 전체 개발 서버 실행 (프론트엔드 + 백엔드)
npm run dev

# 개별 실행
# 프론트엔드
cd apps/client && npm run dev

# 백엔드
cd apps/server && npm run start:dev
```

#### 4. 접속 확인

- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:8080
- **API 문서**: http://localhost:8080/api-docs

---

## 🎨 프론트엔드 가이드

### 프로젝트 구조

```
apps/client/src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 인증 페이지 그룹
│   ├── (main)/            # 메인 페이지 그룹
│   ├── mainframe/         # 메인프레임 레이아웃
│   ├── com/               # 공통 페이지
│   ├── sys/               # 시스템 관리
│   └── popup/             # 팝업 페이지
├── components/            # 공통 컴포넌트
├── modules/               # 기능별 모듈
│   ├── auth/              # 인증 모듈
│   │   ├── components/    # 인증 관련 컴포넌트
│   │   ├── hooks/         # 인증 관련 훅
│   │   ├── services/      # 인증 API 서비스
│   │   └── types/         # 인증 관련 타입
│   ├── com/               # 공통 모듈
│   ├── sys/               # 시스템 모듈
│   ├── usr/               # 사용자 모듈
│   └── psm/               # 프로젝트 관리 모듈
└── utils/                 # 유틸리티 함수
```

### 주요 컴포넌트

#### 인증 시스템

```typescript
// 인증 훅 사용
import { useAuth } from '@/modules/auth/hooks/useAuth'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()

  if (!isAuthenticated) {
    return <div>로그인이 필요합니다.</div>
  }

  return <div>환영합니다, {user?.name}님!</div>
}
```

#### 환경별 설정

```typescript
// utils/environment.ts
export function getSystemName(): string {
	const hostname = typeof window !== 'undefined' ? window.location.hostname : ''

	if (hostname === 'localhost') {
		return 'BIST (Local)'
	}

	if (hostname.includes('dev')) {
		return 'BIST (Dev)'
	}

	return 'BIST (Prod)'
}
```

### 스타일링 가이드

- **Tailwind CSS**: 유틸리티 클래스 기반 스타일링
- **컴포넌트 설계**: 재사용 가능한 컴포넌트 중심 설계
- **반응형 디자인**: 모바일 우선 반응형 디자인

---

## 🔧 백엔드 가이드

### 프로젝트 구조

```
apps/server/src/
├── auth/                   # 인증 모듈
├── user/                   # 사용자 모듈
├── menu/                   # 메뉴 모듈
├── com/                    # 공통 모듈
├── sys/                    # 시스템 모듈
├── database/               # 데이터베이스 관련
│   ├── database.provider.ts # Oracle 커넥션 풀
│   └── database.module.ts   # 데이터베이스 모듈
├── entities/               # TypeORM 엔티티
├── common/                 # 공통 유틸리티
└── utils/                  # 유틸리티 함수
```

### 주요 서비스

#### Oracle 데이터베이스 서비스

```typescript
// database/database.provider.ts
@Injectable()
export class OracleService implements OnModuleInit, OnModuleDestroy {
	private pool: oracledb.Pool | null = null

	async onModuleInit() {
		this.pool = await oracledb.createPool({
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SERVICE}`,
			poolMin: 2,
			poolMax: 10,
			poolIncrement: 1,
		})
	}

	async executeProcedure(
		procedureName: string,
		params: any[] = []
	): Promise<any> {
		const connection = await this.getConnection()
		// 프로시저 실행 로직
	}
}
```

#### 인증 서비스

```typescript
// auth/auth.service.ts
@Injectable()
export class AuthService {
	constructor(private oracleService: OracleService) {}

	async login(empNo: string, password: string): Promise<any> {
		// 로그인 로직
	}

	async checkSession(): Promise<any> {
		// 세션 확인 로직
	}
}
```

### API 설계 원칙

- **RESTful API**: REST 원칙 준수
- **Validation**: class-validator를 통한 입력 검증
- **Error Handling**: 일관된 에러 응답 형식
- **Documentation**: Swagger를 통한 API 문서화

---

## 🔐 인증 및 보안

### 인증 시스템

- **세션 기반 인증**: express-session을 통한 서버 사이드 세션 관리
- **쿠키 기반**: httpOnly 쿠키를 통한 보안 강화
- **세션 저장소**: MemoryStore (개발 환경)

### 보안 설정

```typescript
// main.ts
app.use(
	session({
		secret: process.env.SESSION_SECRET || 'bist-secret',
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			secure: false, // HTTPS 환경에서는 true
			sameSite: 'lax',
			path: '/',
		},
	})
)
```

### 권한 관리

- **역할 기반 접근 제어 (RBAC)**: 사용자 역할별 권한 관리
- **메뉴 권한**: 사용자별 메뉴 접근 권한
- **프로그램 권한**: 기능별 프로그램 실행 권한

---

## 🚀 배포 가이드

### 빌드 프로세스

```bash
# 전체 프로젝트 빌드
npm run build

# 개별 빌드
# 프론트엔드
cd apps/client && npm run build

# 백엔드
cd apps/server && npm run build
```

### 환경별 설정

- **개발 환경**: localhost:3000, localhost:8080
- **스테이징 환경**: dev.example.com
- **운영 환경**: prod.example.com

### 배포 체크리스트

- [ ] 환경 변수 설정 확인
- [ ] 데이터베이스 연결 테스트
- [ ] API 엔드포인트 테스트
- [ ] 프론트엔드 빌드 확인
- [ ] 보안 설정 검토

---

## 📝 개발 가이드라인

### 코딩 컨벤션

#### TypeScript

- **인터페이스 사용**: `interface`를 통한 타입 정의
- **enum 지양**: union type 사용 권장
- **명시적 타입**: 모든 변수, 함수에 명시적 타입 선언

#### 네이밍 컨벤션

- **파일명**: kebab-case (예: `user-service.ts`)
- **변수/함수**: camelCase
- **클래스**: PascalCase
- **상수**: UPPER_SNAKE_CASE

#### 컴포넌트 설계

```typescript
// 함수형 컴포넌트 사용
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
}

export function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      {onEdit && (
        <button onClick={() => onEdit(user)}>
          수정
        </button>
      )}
    </div>
  );
}
```

### 모듈화 원칙

- **단일 책임**: 각 모듈은 하나의 책임만 가짐
- **의존성 분리**: 모듈 간 의존성 최소화
- **재사용성**: 공통 기능은 별도 모듈로 분리

### 에러 처리

```typescript
// 백엔드 에러 처리
@Controller('users')
export class UsersController {
	@Get()
	async findAll(): Promise<User[]> {
		try {
			return await this.usersService.findAll()
		} catch (error) {
			throw new HttpException(
				'사용자 목록 조회에 실패했습니다.',
				HttpStatus.INTERNAL_SERVER_ERROR
			)
		}
	}
}
```

---

## 🔧 문제 해결

### 일반적인 문제들

#### 1. Oracle 연결 오류

```bash
# 환경 변수 확인
echo $DB_USER
echo $DB_PASSWORD
echo $DB_HOST

# Oracle 클라이언트 설치 확인
npm list oracledb
```

#### 2. 세션 관련 문제

```typescript
// 세션 설정 확인
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			secure: false,
			sameSite: 'lax',
		},
	})
)
```

#### 3. CORS 오류

```typescript
// CORS 설정 확인
app.enableCors({
	origin: true,
	credentials: true,
})
```

### 디버깅 팁

- **로그 확인**: 서버 콘솔 로그 확인
- **브라우저 개발자 도구**: 네트워크 탭에서 API 요청 확인
- **Swagger 문서**: API 엔드포인트 테스트

---

## 📚 추가 리소스

### 문서

- [Next.js 공식 문서](https://nextjs.org/docs)
- [NestJS 공식 문서](https://docs.nestjs.com/)
- [TypeORM 문서](https://typeorm.io/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

### 개발 도구

- **API 테스트**: Swagger UI (http://localhost:8080/api-docs)
- **데이터베이스**: Oracle SQL Developer
- **코드 에디터**: VS Code (권장)

### 팀 협업

- **버전 관리**: Git
- **코드 리뷰**: Pull Request 기반
- **이슈 관리**: GitHub Issues

---
