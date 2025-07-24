# Jest 통합 가이드

## 📋 목차

1. [개요](#개요)
2. [환경 설정](#환경-설정)
3. [실제 DB 연결 테스트](#실제-db-연결-테스트)
4. [UI 친화적 테스트 작성법](#ui-친화적-테스트-작성법)
5. [테스트 실행 및 엑셀 변환](#테스트-실행-및-엑셀-변환)
6. [모범 사례](#모범-사례)
7. [문제 해결](#문제-해결)

---

## 개요

이 가이드는 BIST_NEW 프로젝트에서 Jest를 활용한 실제 DB 연결 테스트와 UI 친화적 테스트 작성 방법을 설명합니다.

### 🎯 목표

- **실제 DB 연결**: 실제 Oracle DB를 사용한 통합 테스트
- **UI 친화적**: 고객사에 제출 가능한 사용자 시나리오 중심 테스트
- **자동화**: 테스트 실행부터 엑셀 리포트 생성까지 자동화

---

## 환경 설정

### 1. 필수 패키지 설치

#### 프로젝트 클론 후 의존성 설치

```bash
# 프로젝트 클론
git clone [repository-url]
cd BIST_NEW

# 의존성 설치 (자동으로 모든 Jest 관련 패키지 설치됨)
npm install
```

#### Jest 관련 패키지 확인

다음 패키지들이 `package.json`에 포함되어 있는지 확인하세요:

```json
{
	"dependencies": {
		"@tanstack/react-query": "^5.0.0",
		"axios": "^1.6.0"
	},
	"devDependencies": {
		"@testing-library/jest-dom": "^6.6.3",
		"@testing-library/react": "^16.3.0",
		"@testing-library/user-event": "^14.6.1",
		"@types/jest": "^30.0.0",
		"@types/node": "^20.0.0",
		"jest": "^30.0.5",
		"jest-html-reporter": "^4.3.0",
		"jest-json-reporter": "^1.2.2",
		"ts-jest": "^29.4.0",
		"xlsx": "^0.18.5"
	}
}
```

#### 누락된 패키지 설치

만약 위 패키지가 없다면 다음 명령어로 설치하세요:

```bash
npm install --save-dev @testing-library/jest-dom @testing-library/react @testing-library/user-event @types/jest @types/node jest jest-html-reporter jest-json-reporter ts-jest xlsx
npm install @tanstack/react-query axios
```

### 2. 환경변수 설정

#### .env 파일 생성

```bash
# .env 파일
NODE_ENV=development
DB_HOST=your-db-host
DB_PORT=1521
DB_SERVICE=your-service-name
DB_USER=your-username
DB_PASSWORD=your-password
```

#### DB 연결 확인

```bash
# DB 연결 상태 확인
npm run check:db-env
```

### 3. 서버 실행

```bash
# 개발 서버 실행 (8080 포트)
npm run start:dev
```

### 4. Provider Wrapping 설정

React 컴포넌트 테스트를 위해 필요한 Provider들을 설정합니다.

#### 공통 Provider 설정 (`apps/client/src/test/test-utils.tsx`)

```typescript
import "@testing-library/jest-dom";
import React from "react";
import { render } from "@testing-library/react";
import { ToastProvider } from "../contexts/ToastContext";
import { AuthProvider } from "../modules/auth/hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthProvider>
  </QueryClientProvider>
);

const customRender = (ui: React.ReactElement, options?: any) =>
  render(ui, { wrapper: AllProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
```

### 5. Jest 설정

#### Jest 설정 파일 (`jest.config.js`)

```javascript
const nextJest = require("next/jest");

const createJestConfig = nextJest({
	dir: "./apps/client",
});

const customJestConfig = {
	testEnvironment: "jsdom",
	setupFilesAfterEnv: ["<rootDir>/apps/client/src/test/setup.tsx"],
	moduleNameMapping: {
		"^@/(.*)$": "<rootDir>/apps/client/src/$1",
	},
	testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
};

module.exports = createJestConfig(customJestConfig);
```

#### 테스트 설정 파일 (`apps/client/src/test/setup.tsx`)

```typescript
import "@testing-library/jest-dom";

// 전역 테스트 설정
global.ResizeObserver = jest.fn().mockImplementation(() => ({
	observe: jest.fn(),
	unobserve: jest.fn(),
	disconnect: jest.fn(),
}));

// Mock fetch if needed
global.fetch = jest.fn();
```

---

## 실제 DB 연결 테스트

### 1. 서버 테스트 (NestJS)

#### HTTP 클라이언트 방식 테스트

```typescript
// ✅ 실제 DB 연결 테스트
import axios from "axios";

describe("USR2010M00 Service - 실제 DB 테스트", () => {
	const baseURL = "http://localhost:8080";

	test("사용자 목록 조회 API가 정상적으로 동작한다", async () => {
		const response = await axios.get(`${baseURL}/api/usr/users`);

		expect(response.status).toBe(200);
		expect(response.data.success).toBe(true);
		expect(Array.isArray(response.data.data)).toBe(true);
	});

	test("특정 사용자 조회 API가 정상적으로 동작한다", async () => {
		const userId = "TEST001";
		const response = await axios.get(`${baseURL}/api/usr/users/${userId}`);

		expect(response.status).toBe(200);
		expect(response.data.success).toBe(true);
		expect(response.data.data).toBeDefined();
	});
});
```

#### HTTP 클라이언트 방식을 사용하는 이유

**Jest의 jsdom 환경 제한사항:**

- Jest는 기본적으로 jsdom(브라우저 시뮬레이터) 환경에서 동작
- 실제 브라우저처럼 진짜 HTTP 요청을 완전히 동일하게 처리하지 못함
- CORS, 네트워크 정책, 실제 서버 연결 등의 제약이 있음

**HTTP 클라이언트 방식의 장점:**

1. **실제 서버 환경 테스트**: 실행 중인 서버의 실제 동작 검증
2. **실제 DB 연결**: Oracle DB의 실제 데이터로 테스트
3. **네트워크 레이어 검증**: HTTP 요청/응답, 상태 코드, 헤더 등 검증
4. **통합 테스트**: 프론트엔드-백엔드-데이터베이스 전체 플로우 검증

#### 주요 변경사항

1. **TestingModule 제거**: NestJS TestingModule 대신 HTTP 클라이언트 사용
2. **실제 서버 호출**: `localhost:8080`에서 실행 중인 서버로 API 호출
3. **실제 DB 응답**: Oracle DB의 실제 데이터로 테스트
4. **응답 구조 검증**: `{ success, data, message }` 형태의 API 응답 구조 검증

---

## UI 친화적 테스트 작성법

### 1. 클라이언트 테스트 (React/Next.js)

#### UI 친화적 테스트 예시

**UI 친화적 테스트 예시:**

```typescript
// ✅ 사용자 시나리오 중심 테스트
describe('사용자 관리 화면 - 사용자 시나리오 테스트', () => {
  test('사용자가 사용자 관리 화면에 접속하면 모든 주요 기능이 표시된다', async () => {
    render(<USR2010M00 />);

    await waitFor(() => {
      expect(screen.getByText('조회')).toBeInTheDocument();
    });

    expect(screen.getByText('저장')).toBeInTheDocument();
    expect(screen.getByText('비밀번호 초기화')).toBeInTheDocument();
    expect(screen.getByText('본부')).toBeInTheDocument();
    expect(screen.getByText('부서')).toBeInTheDocument();
  });

  test('사용자가 조회 버튼을 클릭하면 사용자 목록이 화면에 표시된다', async () => {
    render(<USR2010M00 />);

    await waitFor(() => {
      expect(screen.getByText('조회')).toBeInTheDocument();
    });

    const searchButton = screen.getByText('조회');
    fireEvent.click(searchButton);

    await waitFor(() => {
      const gridHeaders = screen.getAllByText('사번');
      expect(gridHeaders.length).toBeGreaterThan(0);
    });
  });
});
```

#### jsdom 환경에서의 테스트 제한사항

**Jest jsdom 환경의 특징:**

- 브라우저 시뮬레이터 환경으로 실제 브라우저와는 다름
- HTTP 요청, 네트워크 연결, 파일 시스템 접근 등이 제한됨
- CORS 정책, 실제 서버 연결 등의 제약이 있음

**클라이언트 테스트에서의 대응 방안:**

1. **UI 렌더링 중심**: 실제 HTTP 요청 대신 컴포넌트 렌더링과 사용자 인터랙션 테스트
2. **사용자 시나리오**: 실제 사용자가 화면에서 수행하는 행동들을 시뮬레이션
3. **화면 변화 검증**: 버튼 클릭, 입력, 화면 업데이트 등 시각적 결과 확인

#### UI 친화적 테스트 작성 원칙

1. **사용자 행동 중심**: "사용자가 [행동]을 하면 [결과]가 나타난다"
2. **시각적 결과 검증**: 화면 변화, 알림 메시지, 상태 변경 확인
3. **실제 사용 시나리오**: 실제 사용자가 화면에서 수행하는 행동들
4. **고객사 친화적**: 기술적 용어 대신 비즈니스 용어 사용

### 2. Key Prop/Accessibility 설정

테스트에서 요소를 쉽게 찾을 수 있도록 접근성 속성을 추가합니다.

#### Key Prop 설정

```typescript
// 모든 map() 함수에 고유한 key prop 추가
{items.map((item, index) => (
  <div key={`${item.type}-${item.id || index}`}>
    {item.name}
  </div>
))}
```

#### Accessibility 속성 추가

```typescript
// 테스트 가능한 요소에 aria-label, title, placeholder 추가
<select aria-label="본부 선택" title="본부를 선택하세요">
  {options.map(option => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))}
</select>

<input
  placeholder="사용자명 입력"
  aria-label="사용자명 입력 필드"
  title="사용자명을 입력하세요"
/>
```

---

## 테스트 실행 및 엑셀 변환

### 1. 기본 테스트 실행

```bash
# 클라이언트 테스트
npm test

# 서버 테스트
npm run test:server

# 전체 테스트
npm run test:all
```

### 2. 엑셀 변환과 함께 실행

```bash
# 클라이언트 테스트 + 엑셀 변환
npm run test:client:excel

# 서버 테스트 + 엑셀 변환
npm run test:server:excel

# 통합 테스트 + 엑셀 변환
npm run test:unified:excel
```

### 3. 특정 테스트 실행

```bash
# 특정 파일만 테스트
npm test -- --testPathPatterns=USR2010M00

# 특정 테스트만 실행
npm test -- --testNamePattern="사용자가 조회 버튼을 클릭"
```

### 4. 통합 스크립트 사용법

```bash
# 개별 변환
node scripts/convert-jest-to-excel.js --client
node scripts/convert-jest-to-excel.js --server
node scripts/convert-jest-to-excel.js --unified

# 모든 변환
node scripts/convert-jest-to-excel.js --all
```

---

## 모범 사례

### 1. 서버 테스트 작성 가이드

```typescript
// ✅ 권장: 실제 DB 연결 테스트
describe("API 통합 테스트", () => {
	const baseURL = "http://localhost:8080";

	beforeAll(() => {
		// 서버가 실행 중인지 확인
		expect(process.env.NODE_ENV).toBe("test");
	});

	test("사용자 목록 조회가 정상적으로 동작한다", async () => {
		const response = await axios.get(`${baseURL}/api/usr/users`);

		expect(response.status).toBe(200);
		expect(response.data.success).toBe(true);
		expect(Array.isArray(response.data.data)).toBe(true);

		// 실제 DB 데이터 검증
		if (response.data.data.length > 0) {
			const user = response.data.data[0];
			expect(user).toHaveProperty("userId");
			expect(user).toHaveProperty("userName");
		}
	});

	test("사용자 생성이 정상적으로 동작한다", async () => {
		const newUser = {
			userId: "TEST001",
			userName: "테스트 사용자",
			email: "test@example.com",
		};

		const response = await axios.post(`${baseURL}/api/usr/users`, newUser);

		expect(response.status).toBe(201);
		expect(response.data.success).toBe(true);
	});
});
```

### 2. 클라이언트 테스트 작성 가이드

```typescript
// ✅ 권장: UI 친화적 테스트
describe('사용자 관리 화면 테스트', () => {
  test('사용자가 화면에 접속하면 모든 주요 기능이 표시된다', async () => {
    render(<UserManagementScreen />);

    // 주요 기능 버튼들 확인
    await waitFor(() => {
      expect(screen.getByText('조회')).toBeInTheDocument();
    });

    expect(screen.getByText('저장')).toBeInTheDocument();
    expect(screen.getByText('삭제')).toBeInTheDocument();
  });

  test('사용자가 검색 조건을 입력하고 조회하면 결과가 표시된다', async () => {
    render(<UserManagementScreen />);

    // 검색 조건 입력
    const searchInput = screen.getByPlaceholderText('사용자명 입력');
    fireEvent.change(searchInput, { target: { value: '김' } });

    // 조회 버튼 클릭
    fireEvent.click(screen.getByText('조회'));

    // 결과 확인
    await waitFor(() => {
      expect(searchInput).toHaveValue('김');
    });
  });
});
```

### 3. 테스트 네이밍 컨벤션

```typescript
// ✅ 권장: 사용자 시나리오 중심 네이밍
describe("사용자 관리 기능", () => {
	test("사용자가 사용자 목록을 조회할 수 있다", () => {});
	test("사용자가 새로운 사용자를 등록할 수 있다", () => {});
	test("사용자가 기존 사용자 정보를 수정할 수 있다", () => {});
	test("사용자가 사용자 정보를 삭제할 수 있다", () => {});
});
```

---

## 문제 해결

### 1. 패키지 설치 오류

**문제**: `npm install` 실패

```bash
# 해결책: 캐시 클리어 후 재설치
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 2. Jest 설정 오류

**문제**: `Cannot find module '@testing-library/jest-dom'`

```bash
# 해결책: 패키지 재설치
npm install --save-dev @testing-library/jest-dom
```

### 3. DB 연결 오류

**문제**: `Oracle DB 연결 실패`

```bash
# 해결책: 환경변수 확인
npm run check:db-env

# .env 파일 내용 확인
cat .env
```

### 4. 서버 실행 오류

**문제**: `Port 8080 is already in use`

```bash
# 해결책: 포트 사용 중인 프로세스 종료
# Windows
netstat -ano | findstr :8080
taskkill /PID [PID] /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

### 5. JSX 파싱 오류

**문제**: `SyntaxError: Unexpected token '<'`

```bash
# 해결책: Next.js Jest 설정 사용
cat jest.config.js
cat apps/client/jest.config.js
```

### 6. Provider 오류

**문제**: `Error: useToast must be used within a ToastProvider`

**해결책**: 공통 Provider 래퍼 생성

```typescript
// apps/client/src/test/test-utils.tsx
const AllProviders = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthProvider>
  </QueryClientProvider>
);
```

### 7. Key Prop 경고

**문제**: `Warning: Each child in a list should have a unique "key" prop`

**해결책**: 고유한 key 값 사용

```typescript
// 고유한 key 값 사용
{items.map((item, index) => (
  <div key={`${item.type}-${item.id || index}`}>
    {item.name}
  </div>
))}
```

### 8. Act() 경고

**문제**: `Warning: An update to Component inside a test was not wrapped in act(...)`

**해결책**: waitFor() 사용

```typescript
// ❌ 잘못된 방법
fireEvent.click(screen.getByText("저장"));
expect(screen.getByText("저장 완료")).toBeInTheDocument();

// ✅ 올바른 방법
fireEvent.click(screen.getByText("저장"));
await waitFor(() => {
	expect(screen.getByText("저장 완료")).toBeInTheDocument();
});
```

### 9. 모호한 쿼리 오류

**문제**: `Found multiple elements with the text: 확인`

**해결책**: 정확한 쿼리 사용

```typescript
// ❌ 모호한 쿼리
screen.getByText("확인");

// ✅ 정확한 쿼리
screen.getByRole("button", { name: "확인" });
screen.getByText("저장하시겠습니까?");
```

### 10. 서버 테스트 관련 오류

#### 서버 테스트 관련

**오류: `ECONNREFUSED`**

```bash
# 원인: 서버가 실행되지 않음
# 해결: 서버 실행 후 테스트
npm run start:dev  # 서버 실행
npm run test:server  # 테스트 실행
```

**오류: `Oracle DB 연결 실패`**

```bash
# 원인: DB 연결 정보 오류
# 해결: 환경변수 확인
npm run check:db-env
```

#### 클라이언트 테스트 관련

**오류: `CORS 오류`**

```typescript
// 원인: jsdom 환경에서 HTTP 요청 제한
// 해결: UI 렌더링 테스트로 변경
test('사용자가 조회 버튼을 클릭하면 목록이 표시된다', async () => {
  render(<Component />);
  fireEvent.click(screen.getByText('조회'));

  await waitFor(() => {
    expect(screen.getByText('사번')).toBeInTheDocument();
  });
});
```

**오류: `Element not found`**

```typescript
// 원인: 실제 화면에 없는 요소 검색
// 해결: 실제 컴포넌트 구조 확인
// 1. 컴포넌트 렌더링 확인
// 2. 실제 텍스트/라벨 확인
// 3. waitFor 사용하여 비동기 로딩 대기
```

### 11. 엑셀 변환 관련

**오류: `EBUSY: resource busy or locked`**

```bash
# 원인: 엑셀 파일이 다른 프로그램에서 열려있음
# 해결: 엑셀 파일 닫기 후 재시도
npm run convert:client:excel
```

**오류: `JSON 파일을 찾을 수 없습니다`**

```bash
# 원인: 테스트가 실행되지 않아 JSON 파일이 생성되지 않음
# 해결: 테스트 먼저 실행
npm test  # 테스트 실행
npm run convert:client:excel  # 엑셀 변환
```

### 12. 디버깅 팁

1. **테스트 실행 전 확인사항**
   - 서버가 실행 중인지 확인 (`npm run start:dev`)
   - DB 연결이 정상인지 확인 (`npm run check:db-env`)
   - 환경변수가 올바른지 확인

2. **테스트 실행 중 디버깅**

   ```bash
   # 상세 로그와 함께 테스트 실행
   npm test -- --verbose

   # 특정 테스트만 실행
   npm test -- --testPathPatterns=USR2010M00
   ```

3. **엑셀 변환 디버깅**

   ```bash
   # JSON 파일 확인
   cat test-reports/client/jest-report.json

   # 수동 변환 시도
   node scripts/convert-jest-to-excel.js --client
   ```

---

## 📁 중요 파일 구조

```
BIST_NEW/
├── jest.config.js                    # 루트 Jest 설정
├── jest.server.config.js             # 서버 Jest 설정
├── package.json                      # 프로젝트 의존성
├── JEST_GUIDE.md                    # 이 파일 (통합 가이드)
├── scripts/
│   ├── convert-jest-to-excel.js     # 엑셀 변환 스크립트
│   └── check-db-env.js              # DB 환경 확인 스크립트
└── apps/
    ├── client/
    │   ├── jest.config.js           # 클라이언트 Jest 설정
    │   └── src/
    │       └── test/
    │           ├── setup.tsx        # 테스트 설정
    │           └── test-utils.tsx   # 테스트 유틸리티
    └── server/
        └── src/
            └── *.spec.ts            # 서버 테스트 파일들
```

---

## 🚀 빠른 시작

1. **환경 설정**

   ```bash
   npm install
   cp .env.example .env  # 환경변수 설정
   npm run check:db-env  # DB 연결 확인
   ```

2. **서버 실행**

   ```bash
   npm run start:dev
   ```

3. **테스트 실행**

   ```bash
   npm run test:client:excel  # 클라이언트 테스트 + 엑셀
   npm run test:server:excel  # 서버 테스트 + 엑셀
   ```

4. **결과 확인**
   ```bash
   # 엑셀 파일 위치
   test-reports/client/client-test-report.xlsx
   test-reports/server/server-test-report.xlsx
   test-reports/unified-test-report-*.xlsx
   ```

---

## 📚 참고 자료

- [Jest 공식 문서](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Axios 문서](https://axios-http.com/docs/intro)
- [XLSX 라이브러리](https://github.com/SheetJS/sheetjs)

---

## 🔄 업데이트 이력

- **2024-07-23**: Jest 설정 가이드와 테스트 가이드를 통합
- **2024-07-23**: 실제 DB 연결 테스트 방법 추가
- **2024-07-23**: UI 친화적 테스트 작성법 추가
- **2024-07-23**: 통합 엑셀 변환 스크립트 가이드 추가
- **2024-07-23**: 문제 해결 섹션 추가

### 13. Testing Library 쿼리 에러 및 엑셀 리포트 반영 안내

#### 동일 텍스트 다중 요소 에러

- **에러 메시지 예시:**
  ```
  TestingLibraryElementError: Found multiple elements with the text: 사용여부
  ```
- **원인:**
  `getByText("사용여부")` 사용 시, 화면에 "사용여부"가 2개 이상 존재
- **해결법:**
  - `getAllByText("사용여부")`로 배열로 받아서 개수/위치 체크
  - 또는 `getByRole`, `getByLabelText`, `getByTestId` 등 더 구체적인 쿼리 사용

- **예시 코드:**

  ```typescript
  // 여러 개 있을 때
  const allUseYnHeaders = screen.getAllByText("사용여부");
  expect(allUseYnHeaders.length).toBeGreaterThan(1);

  // aria-label로 특정
  const useYnSelect = screen.getByLabelText("사용여부 선택");
  ```

#### 엑셀 리포트와 실제 실패의 관계

- **테스트 코드에서 assertion 실패, 에러 throw, TestingLibraryElementError 등**
  → 모두 Jest에서 "실패"로 기록
  → 엑셀 변환 시에도 "실패"로 남음

- **console.error만 찍고 assertion/throw가 없으면**
  → Jest는 "성공"으로 간주
  → 엑셀에도 "성공"으로 기록됨
  → 반드시 assertion 또는 throw 필요

#### 권장 쿼리 패턴

- 항상 getByText 대신 getAllByText, getByRole, getByLabelText, getByTestId 등 구체적 쿼리 사용을 권장
- 실패가 의도된 경우 반드시 assertion 또는 throw로 명확히 실패 처리
