# BIST_NEW 프로젝트 상세 기술 문서

## 📋 목차

1. [시스템 아키텍처 상세](#시스템-아키텍처-상세)
2. [데이터베이스 설계 상세](#데이터베이스-설계-상세)
3. [인증 시스템 상세](#인증-시스템-상세)
4. [메뉴 시스템 상세](#메뉴-시스템-상세)
5. [프론트엔드 컴포넌트 상세](#프론트엔드-컴포넌트-상세)
6. [API 설계 상세](#api-설계-상세)
7. [성능 최적화](#성능-최적화)
8. [보안 구현 상세](#보안-구현-상세)
9. [테스트 전략](#테스트-전략)
10. [모니터링 및 로깅](#모니터링-및-로깅)

---

## 🏗 시스템 아키텍처 상세

### 전체 시스템 구성도

```
┌─────────────────────────────────────────────────────────────┐
│                    BIST_NEW 시스템                          │
├─────────────────────────────────────────────────────────────┤
│  Frontend Layer (Next.js 14)                                │
│  ├── App Router (File-based Routing)                       │
│  ├── React Server Components                                │
│  ├── Client Components                                      │
│  ├── State Management (Context API)                        │
│  └── UI Framework (Tailwind CSS + AG Grid)                 │
├─────────────────────────────────────────────────────────────┤
│  Backend Layer (NestJS 11)                                  │
│  ├── Module System                                          │
│  ├── Dependency Injection                                   │
│  ├── Guards & Interceptors                                  │
│  ├── Validation (class-validator)                          │
│  └── Documentation (Swagger)                               │
├─────────────────────────────────────────────────────────────┤
│  Data Access Layer                                          │
│  ├── TypeORM (ORM)                                         │
│  ├── Oracle Database Driver                                │
│  ├── Connection Pooling                                    │
│  └── Stored Procedure Execution                            │
├─────────────────────────────────────────────────────────────┤
│  Database Layer (Oracle)                                    │
│  ├── BISBM Schema                                          │
│  ├── User Tables                                           │
│  ├── Menu Tables                                           │
│  ├── Business Logic Tables                                 │
│  └── Stored Procedures                                     │
└─────────────────────────────────────────────────────────────┘
```

### 모듈별 의존성 관계

```
AppModule
├── ConfigModule (환경 설정)
├── TypeOrmModule (데이터베이스)
├── AuthModule (인증)
│   ├── AuthController
│   └── AuthService
├── UserModule (사용자 관리)
│   ├── UserController
│   └── UserService
├── MenuModule (메뉴 관리)
│   ├── MenuController
│   └── MenuService
├── DatabaseModule (데이터베이스)
│   └── OracleService
└── SysModule (시스템 관리)
```

---

## 🗄 데이터베이스 설계 상세

### Oracle 데이터베이스 연결 설정

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
			poolMin: 2, // 최소 연결 수
			poolMax: 10, // 최대 연결 수
			poolIncrement: 1, // 연결 증가 단위
		})
	}
}
```

### 프로시저 실행 패턴

```typescript
async executeProcedure(procedureName: string, params: any[] = []): Promise<any> {
  const connection = await this.getConnection();

  // 조회 프로시저와 수정 프로시저 구분
  const isSelectProc = procedureName.endsWith('_S');

  const bindVars: any = {
    o_result: {
      type: isSelectProc ? oracledb.CURSOR : oracledb.STRING,
      dir: oracledb.BIND_OUT
    },
  };

  // 파라미터 바인딩
  params.forEach((param, i) => {
    bindVars[`p${i + 1}`] = param;
  });

  const result = await connection.execute(
    `BEGIN ${procedureName}(:o_result${params.length > 0 ? ', ' + params.map((_, i) => `:p${i + 1}`).join(', ') : ''}); END;`,
    bindVars,
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );
}
```

### 주요 테이블 구조 상세

#### 사용자 관리 테이블

```sql
-- 사용자 기본 정보
CREATE TABLE TBL_USER_INF (
  USER_ID VARCHAR2(10) PRIMARY KEY,           -- 사용자 ID
  USER_NM VARCHAR2(20),                       -- 사용자명
  DEPT_CD VARCHAR2(20),                       -- 부서 코드
  DUTY_CD VARCHAR2(4),                        -- 직책 코드
  DUTY_DIV_CD VARCHAR2(4),                    -- 직책 구분 코드
  AUTH_CD VARCHAR2(10),                       -- 권한 코드
  WRK01_USE_YN CHAR(1),                       -- 업무1 사용 여부
  WRK02_USE_YN CHAR(1),                       -- 업무2 사용 여부
  APV_APOF_ID VARCHAR2(10),                   -- 승인 담당자 ID
  USER_PWD VARCHAR2(20),                      -- 사용자 비밀번호
  PWD_CHNG_DTTM VARCHAR2(14),                 -- 비밀번호 변경 일시
  EMAIL_ADDR VARCHAR2(100),                   -- 이메일 주소
  USR_ROLE_ID VARCHAR2(20)                    -- 사용자 역할 ID
);

-- 사용자 역할 정보
CREATE TABLE TBL_USER_ROLE (
  USR_ROLE_ID VARCHAR2(20) PRIMARY KEY,       -- 역할 ID
  USR_ROLE_NM VARCHAR2(50),                   -- 역할명
  USR_ROLE_DESC VARCHAR2(200),                -- 역할 설명
  USR_ROLE_USE_YN CHAR(1),                    -- 역할 사용 여부
  REG_DTTM VARCHAR2(14),                      -- 등록 일시
  CHNG_DTTM VARCHAR2(14)                      -- 변경 일시
);
```

#### 메뉴 관리 테이블

```sql
-- 메뉴 정보
CREATE TABLE TBL_MENU_INF (
  MENU_ID VARCHAR2(20) PRIMARY KEY,           -- 메뉴 ID
  MENU_NM VARCHAR2(50),                       -- 메뉴명
  MENU_URL VARCHAR2(200),                     -- 메뉴 URL
  UPPR_MENU_ID VARCHAR2(20),                  -- 상위 메뉴 ID
  MENU_LVL NUMBER(2),                         -- 메뉴 레벨
  MENU_ORD NUMBER(3),                         -- 메뉴 순서
  MENU_USE_YN CHAR(1),                        -- 메뉴 사용 여부
  REG_DTTM VARCHAR2(14),                      -- 등록 일시
  CHNG_DTTM VARCHAR2(14)                      -- 변경 일시
);

-- 프로그램 정보
CREATE TABLE TBL_PGM_INF (
  PGM_ID VARCHAR2(20) PRIMARY KEY,            -- 프로그램 ID
  PGM_NM VARCHAR2(50),                        -- 프로그램명
  PGM_URL VARCHAR2(200),                      -- 프로그램 URL
  PGM_DESC VARCHAR2(200),                     -- 프로그램 설명
  PGM_USE_YN CHAR(1),                         -- 프로그램 사용 여부
  REG_DTTM VARCHAR2(14),                      -- 등록 일시
  CHNG_DTTM VARCHAR2(14)                      -- 변경 일시
);
```

---

## 🔐 인증 시스템 상세

### 세션 기반 인증 플로우

```typescript
// 1. 로그인 프로세스
@Post('login')
async login(@Body() body: { empNo: string; password: string }, @Req() req: RequestWithSession) {
  // 1. 사용자 존재 확인
  const userExists = await this.userService.userExists(empNo);

  // 2. 비밀번호 검증
  const isPasswordValid = await this.userService.validateUserPassword(empNo, password);

  // 3. 사용자 정보 조회
  const userInfo = await this.userService.findUserWithDept(empNo);

  // 4. 메뉴 및 프로그램 권한 조회
  const menuList = await this.menuService.getMenuListByRole(userInfo.usrRoleId);
  const programList = await this.programService.getProgramListByRole(userInfo.usrRoleId);

  // 5. 세션에 사용자 정보 저장
  req.session.user = {
    ...userInfo,
    menuList,
    programList,
  };
}
```

### 프론트엔드 인증 상태 관리

```typescript
// modules/auth/hooks/useAuth.ts
export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	// 세션 확인
	const checkSession = async () => {
		try {
			const data = await AuthService.checkSession()
			if (data.success && data.user) {
				const userInfo: User = {
					userId: data.user.userId,
					empNo: data.user.empNo,
					name: data.user.userName,
					email: data.user.emailAddr,
					department: data.user.deptNm,
					position: data.user.dutyNm,
					role: data.user.authCd === '30' ? 'ADMIN' : 'USER',
					permissions: data.user.permissions,
					menuList: data.user.menuList,
					programList: data.user.programList,
				}
				setUser(userInfo)
			}
		} catch (error) {
			setUser(null)
		} finally {
			setLoading(false)
		}
	}
}
```

### 권한 기반 접근 제어 (RBAC)

```typescript
// 권한 확인 로직
const checkPermission = (user: User, requiredPermission: string): boolean => {
	// 관리자 권한 확인
	if (user.role === 'ADMIN') return true

	// 특정 권한 확인
	return user.permissions.includes(requiredPermission)
}

// 메뉴 권한 확인
const hasMenuAccess = (user: User, menuId: string): boolean => {
	return user.menuList.some((menu: any) => menu.MENU_ID === menuId)
}
```

---

## 📋 메뉴 시스템 상세

### 메뉴 트리 구조

```typescript
// 메뉴 데이터 구조
interface MenuItem {
	menuSeq: string // 메뉴 순서
	menuDspNm: string // 메뉴 표시명
	pgmId: string // 프로그램 ID
	menuShpDvcd: string // 메뉴 형태 구분 코드
	hgrkMenuSeq: string // 상위 메뉴 순서
	flag: string // 플래그
	menuUseYn: string // 메뉴 사용 여부
	menuLvl: number // 메뉴 레벨
	mapTitle: string // 맵 타이틀
	menuPath: string // 메뉴 경로
}
```

### 메뉴 렌더링 로직

```typescript
// mainframe/COM0000M00.tsx
const handleMenuClick = (pgmId: string) => {
	// 1. 메뉴 정보 확인
	const menu = (session.user?.menuList || []).find(
		(m: any) => m.PGM_ID === pgmId
	)

	// 2. 프로그램 정보 확인
	const program = (session.user?.programList || []).find(
		(p: any) => p.PGM_ID === pgmId
	)

	// 3. 탭 중복 확인
	if (tabs.some((tab) => tab.programId === pgmId)) {
		setActiveTab(pgmId)
		return
	}

	// 4. 탭 개수 제한 (최대 5개)
	if (tabs.length >= 5) {
		setToast({
			message: '최대 5개의 화면만 열 수 있습니다.',
			type: 'warning',
			isVisible: true,
		})
		return
	}

	// 5. 새 탭 추가
	const newTab: TabItem = {
		programId: pgmId,
		title: program.PGM_NM,
		menuPath: program.LINK_PATH,
	}
	setTabs((prev) => [...prev, newTab])
	setActiveTab(pgmId)
}
```

### 동적 컴포넌트 로딩

```typescript
// ContentFrame.tsx
const ContentFrame = ({ programId, title, menuPath }: ContentFrameProps) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadComponent = async () => {
      try {
        setLoading(true);
        setError(null);

        // 동적 임포트로 컴포넌트 로딩
        const module = await import(`../${menuPath}`);
        setComponent(() => module.default);
      } catch (err) {
        setError('컴포넌트를 로드할 수 없습니다.');
        console.error('Component load error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (menuPath) {
      loadComponent();
    }
  }, [menuPath]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!Component) return <div>컴포넌트를 찾을 수 없습니다.</div>;

  return <Component />;
};
```

---

## 🎨 프론트엔드 컴포넌트 상세

### 메인프레임 레이아웃 구조

```typescript
// COM0000M00.tsx - 메인프레임 컴포넌트
export default function COM0000M00() {
  const { user, session, logout, isAuthenticated } = useAuth();
  const [showMenuTree, setShowMenuTree] = useState(false);
  const [menuTreeLocked, setMenuTreeLocked] = useState(false);
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');

  return (
    <div className='w-screen h-screen flex flex-col overflow-hidden'>
      {/* 상단 헤더 */}
      <TopFrame
        userName={user?.name}
        userTeam={user?.department}
        userPosition={user?.position}
        userEmpNo={user?.empNo}
      />

      {/* 하단 본문 영역 */}
      <div className='flex flex-1 min-h-0 relative'>
        {/* 좌측 아이콘바 */}
        <div className='z-30'>
          <LeftFrame
            onMenuClick={() => setShowMenuTree((v) => !v)}
            onLogout={handleLogout}
          />
        </div>

        {/* 콘텐츠 영역 */}
        <div className='flex-1 flex relative'>
          {/* 메뉴트리 (슬라이드 애니메이션) */}
          <div className={`absolute left-0 top-0 h-full w-[300px] bg-[#e5e5e5] transition-transform duration-300 z-20 ${
            showMenuTree ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <MenuTree
              menuList={mappedMenuList}
              onMenuClick={handleMenuClick}
              onLockChange={handleLockChange}
            />
          </div>

          {/* 실제 콘텐츠 */}
          <div className={`flex-1 flex flex-col transition-all duration-300 ${
            showMenuTree ? 'ml-[300px]' : 'ml-0'
          }`}>
            {/* 탭 네비게이션 */}
            <Maintab
              tabs={tabs}
              activeTab={activeTab}
              onTabClick={handleTabClick}
              onTabClose={handleTabClose}
            />

            {/* 페이지 타이틀 */}
            <PageTitle
              title={tabs.find(tab => tab.programId === activeTab)?.title}
              programId={activeTab}
              onClose={() => handleTabClose(activeTab)}
            />

            {/* 콘텐츠 프레임 */}
            <ContentFrame
              programId={activeTab}
              title={tabs.find(tab => tab.programId === activeTab)?.title}
              menuPath={tabs.find(tab => tab.programId === activeTab)?.menuPath}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 인증 가드 컴포넌트

```typescript
// mainframe/page.tsx - 인증 가드
export default function MainframePage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='flex items-center space-x-2'>
          <svg className='animate-spin h-8 w-8 text-blue-600' /* ... */ />
          <span className='text-gray-600'>로딩 중...</span>
        </div>
      </div>
    );
  }

  return <COM0000M00 />;
}
```

### 토스트 알림 시스템

```typescript
// components/Toast.tsx
interface ToastProps {
  message: string;
  type: 'info' | 'warning' | 'error';
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({ message, type, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor = {
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  }[type];

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg text-white ${bgColor}`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
          ×
        </button>
      </div>
    </div>
  );
}
```

---

## 🔌 API 설계 상세

### RESTful API 설계 원칙

```typescript
// API 응답 표준 형식
interface ApiResponse<T = any> {
	success: boolean
	message: string
	data?: T
	error?: string
}

// 페이징 응답 형식
interface PaginatedResponse<T> {
	success: boolean
	message: string
	data: {
		items: T[]
		totalCount: number
		currentPage: number
		pageSize: number
		totalPages: number
	}
}
```

### 컨트롤러 설계 패턴

```typescript
// employee.controller.ts
@Controller('employee')
export class EmployeeController {
	constructor(private readonly employeeService: EmployeeService) {}

	@Post('search')
	@ApiOperation({
		summary: '직원 검색',
		description: '사원(직원)을 검색하고 프로시저 정보를 포함하여 반환합니다.',
	})
	@ApiBody({ type: EmployeeSearchParams })
	@ApiResponse({
		status: 200,
		description: '직원 검색 성공',
		type: EmployeeSearchResponseDto,
	})
	async searchEmployees(
		@Body() body: EmployeeSearchParams
	): Promise<EmployeeSearchResponseDto> {
		return this.employeeService.searchEmployees(body)
	}
}
```

### DTO (Data Transfer Object) 설계

```typescript
// dto/employee.dto.ts
export class EmployeeSearchParams {
	@ApiProperty({ description: '검색 키워드' })
	kb?: string

	@ApiProperty({ description: '사원번호' })
	empNo?: string

	@ApiProperty({ description: '사원명' })
	empNm?: string

	@ApiProperty({ description: '내부/외부 구분' })
	ownOutsDiv?: string

	@ApiProperty({ description: '퇴직 여부' })
	retirYn?: string
}

export class EmployeeSearchResponseDto {
	@ApiProperty({ description: '성공 여부' })
	success: boolean

	@ApiProperty({ description: '응답 메시지' })
	message: string

	@ApiProperty({ description: '직원 목록', type: [Employee] })
	data: Employee[]

	@ApiProperty({ description: '프로시저 정보' })
	procedureInfo: any
}
```

### 에러 처리 미들웨어

```typescript
// common/error-handler.ts
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()
		const request = ctx.getRequest<Request>()

		let status = HttpStatus.INTERNAL_SERVER_ERROR
		let message = '서버 오류가 발생했습니다.'

		if (exception instanceof HttpException) {
			status = exception.getStatus()
			message = exception.message
		} else if (exception instanceof Error) {
			message = exception.message
		}

		const errorResponse = {
			success: false,
			message,
			timestamp: new Date().toISOString(),
			path: request.url,
		}

		response.status(status).json(errorResponse)
	}
}
```

---

## ⚡ 성능 최적화

### 프론트엔드 최적화

#### 1. 코드 스플리팅

```typescript
// 동적 임포트를 통한 컴포넌트 로딩
const loadComponent = async (menuPath: string) => {
	try {
		const module = await import(`../${menuPath}`)
		return module.default
	} catch (error) {
		console.error('Component load error:', error)
		throw error
	}
}
```

#### 2. 메모이제이션

```typescript
// React.memo를 통한 불필요한 리렌더링 방지
const MenuTree = React.memo(({ menuList, onMenuClick }: MenuTreeProps) => {
  return (
    <div className="menu-tree">
      {menuList.map((menu) => (
        <MenuItem key={menu.menuSeq} menu={menu} onClick={onMenuClick} />
      ))}
    </div>
  );
});
```

#### 3. 가상화 (Virtualization)

```typescript
// AG Grid를 통한 대용량 데이터 처리
import { AgGridReact } from 'ag-grid-react';

const DataGrid = ({ data }: { data: any[] }) => {
  const columnDefs = [
    { field: 'empNo', headerName: '사원번호' },
    { field: 'empNm', headerName: '사원명' },
    { field: 'deptNm', headerName: '부서명' },
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 400 }}>
      <AgGridReact
        rowData={data}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={50}
        rowSelection="single"
        animateRows={true}
      />
    </div>
  );
};
```

### 백엔드 최적화

#### 1. 커넥션 풀 관리

```typescript
// Oracle 커넥션 풀 최적화
const poolConfig = {
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SERVICE}`,
	poolMin: 2, // 최소 연결 수
	poolMax: 10, // 최대 연결 수
	poolIncrement: 1, // 연결 증가 단위
	poolTimeout: 60, // 연결 타임아웃 (초)
	queueTimeout: 60000, // 큐 타임아웃 (밀리초)
}
```

#### 2. 캐싱 전략

```typescript
// 메뉴 데이터 캐싱
@Injectable()
export class MenuService {
	private menuCache = new Map<string, any[]>()
	private cacheTimeout = 5 * 60 * 1000 // 5분

	async getMenuListByRole(roleId: string): Promise<any[]> {
		const cacheKey = `menu_${roleId}`
		const cached = this.menuCache.get(cacheKey)

		if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
			return cached.data
		}

		const menuList = await this.executeMenuQuery(roleId)
		this.menuCache.set(cacheKey, {
			data: menuList,
			timestamp: Date.now(),
		})

		return menuList
	}
}
```

#### 3. 배치 처리

```typescript
// 대용량 데이터 배치 처리
async processBatchData(data: any[], batchSize: number = 100) {
  const batches = [];
  for (let i = 0; i < data.length; i += batchSize) {
    batches.push(data.slice(i, i + batchSize));
  }

  for (const batch of batches) {
    await this.processBatch(batch);
  }
}
```

---

## 🔒 보안 구현 상세

### 세션 보안 설정

```typescript
// main.ts - 세션 보안 설정
app.use(
	session({
		secret: process.env.SESSION_SECRET || 'bist-secret',
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true, // XSS 공격 방지
			secure: process.env.NODE_ENV === 'production', // HTTPS 환경에서만 전송
			sameSite: 'lax', // CSRF 공격 방지
			path: '/',
			maxAge: 1000 * 60 * 60 * 24, // 24시간
		},
		name: 'bist-session', // 기본 세션명 변경
	})
)
```

### 입력 검증

```typescript
// DTO 검증
export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: '사원번호를 입력해주세요.' })
  @Length(1, 10, { message: '사원번호는 1-10자리여야 합니다.' })
  empNo: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @Length(1, 20, { message: '비밀번호는 1-20자리여야 합니다.' })
  password: string;
}

// 컨트롤러에서 검증 적용
@Post('login')
async login(@Body() loginDto: LoginDto, @Req() req: RequestWithSession) {
  // 검증은 자동으로 수행됨
  const { empNo, password } = loginDto;
  // ... 로그인 로직
}
```

### SQL 인젝션 방지

```typescript
// 프로시저 실행 시 파라미터 바인딩
async executeProcedure(procedureName: string, params: any[] = []): Promise<any> {
  const connection = await this.getConnection();

  try {
    const bindVars: any = {
      o_result: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    };

    // 파라미터를 바인딩하여 SQL 인젝션 방지
    params.forEach((param, i) => {
      bindVars[`p${i + 1}`] = param;
    });

    const result = await connection.execute(
      `BEGIN ${procedureName}(:o_result${params.length > 0 ? ', ' + params.map((_, i) => `:p${i + 1}`).join(', ') : ''}); END;`,
      bindVars,
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return result;
  } finally {
    await connection.close();
  }
}
```

### CORS 설정

```typescript
// CORS 보안 설정
app.enableCors({
	origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	exposedHeaders: ['Set-Cookie'],
})
```

---

## 🧪 테스트 전략

### 단위 테스트

```typescript
// auth.service.spec.ts
describe('AuthService', () => {
	let service: AuthService
	let userService: UserService
	let menuService: MenuService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: UserService,
					useValue: {
						userExists: jest.fn(),
						validateUserPassword: jest.fn(),
						findUserWithDept: jest.fn(),
					},
				},
				{
					provide: MenuService,
					useValue: {
						getMenuListByRole: jest.fn(),
					},
				},
			],
		}).compile()

		service = module.get<AuthService>(AuthService)
		userService = module.get<UserService>(UserService)
		menuService = module.get<MenuService>(MenuService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	describe('login', () => {
		it('should return success when valid credentials provided', async () => {
			const mockUser = { userId: 'test', userName: 'Test User' }
			jest.spyOn(userService, 'userExists').mockResolvedValue(true)
			jest.spyOn(userService, 'validateUserPassword').mockResolvedValue(true)
			jest.spyOn(userService, 'findUserWithDept').mockResolvedValue(mockUser)
			jest.spyOn(menuService, 'getMenuListByRole').mockResolvedValue([])

			const result = await service.login('test', 'password')
			expect(result.success).toBe(true)
		})
	})
})
```

### 통합 테스트

```typescript
// auth.e2e-spec.ts
describe('AuthController (e2e)', () => {
	let app: INestApplication

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile()

		app = moduleFixture.createNestApplication()
		await app.init()
	})

	it('/auth/login (POST)', () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({ empNo: 'test', password: 'test' })
			.expect(200)
			.expect((res) => {
				expect(res.body).toHaveProperty('success')
			})
	})

	afterAll(async () => {
		await app.close()
	})
})
```

### 프론트엔드 테스트

```typescript
// useAuth.test.ts
import { renderHook, act } from '@testing-library/react'
import { useAuth } from './useAuth'

describe('useAuth', () => {
	it('should provide authentication state', () => {
		const { result } = renderHook(() => useAuth())

		expect(result.current).toHaveProperty('user')
		expect(result.current).toHaveProperty('isAuthenticated')
		expect(result.current).toHaveProperty('login')
		expect(result.current).toHaveProperty('logout')
	})
})
```

---

## 📊 모니터링 및 로깅

### 로깅 전략

```typescript
// utils/logger.ts
import { Logger } from '@nestjs/common'

export class AppLogger extends Logger {
	log(message: string, context?: string) {
		super.log(`[${new Date().toISOString()}] ${message}`, context)
	}

	error(message: string, trace?: string, context?: string) {
		super.error(`[${new Date().toISOString()}] ${message}`, trace, context)
	}

	warn(message: string, context?: string) {
		super.warn(`[${new Date().toISOString()}] ${message}`, context)
	}
}

// 컨트롤러에서 사용
@Controller('auth')
export class AuthController {
	private readonly logger = new AppLogger(AuthController.name)

	@Post('login')
	async login(@Body() body: any) {
		this.logger.log(`로그인 시도: ${body.empNo}`)

		try {
			// 로그인 로직
			this.logger.log(`로그인 성공: ${body.empNo}`)
		} catch (error) {
			this.logger.error(`로그인 실패: ${body.empNo}`, error.stack)
			throw error
		}
	}
}
```

### 성능 모니터링

```typescript
// interceptors/performance.interceptor.ts
@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const start = Date.now()
		const request = context.switchToHttp().getRequest()

		return next.handle().pipe(
			tap(() => {
				const duration = Date.now() - start
				console.log(`${request.method} ${request.url} - ${duration}ms`)

				// 성능 임계값 초과 시 경고
				if (duration > 1000) {
					console.warn(
						`Slow API call: ${request.method} ${request.url} - ${duration}ms`
					)
				}
			})
		)
	}
}
```

### 헬스 체크

```typescript
// health/health.controller.ts
@Controller('health')
export class HealthController {
	constructor(private readonly oracleService: OracleService) {}

	@Get()
	async check() {
		const dbStatus = this.oracleService.isConnected()

		return {
			status: dbStatus ? 'healthy' : 'unhealthy',
			timestamp: new Date().toISOString(),
			database: {
				status: dbStatus ? 'connected' : 'disconnected',
			},
			uptime: process.uptime(),
			memory: process.memoryUsage(),
		}
	}
}
```

---

## 📚 결론

BIST_NEW 프로젝트는 현대적인 웹 개발 기술을 활용하여 기존 레거시 시스템을 성공적으로 현대화한 프로젝트입니다.

### 주요 성과

1. **모노레포 구조**: Turborepo를 통한 효율적인 프로젝트 관리
2. **타입 안전성**: TypeScript를 통한 엔드-투-엔드 타입 안전성 확보
3. **모듈화 설계**: 기능별 모듈 분리로 유지보수성 향상
4. **보안 강화**: 세션 기반 인증 및 입력 검증 강화
5. **성능 최적화**: 코드 스플리팅 및 커넥션 풀 관리

### 향후 개선 방향

1. **테스트 커버리지 확대**: 단위/통합 테스트 추가
2. **모니터링 강화**: APM 도구 도입
3. **CI/CD 파이프라인**: 자동화된 배포 프로세스 구축
4. **문서화 개선**: API 문서 자동화

이 문서는 BIST_NEW 프로젝트의 기술적 구현 세부사항을 담고 있으며, 새로운 팀원의 빠른 적응과 프로젝트의 성공적인 유지보수를 위한 가이드 역할을 합니다.
