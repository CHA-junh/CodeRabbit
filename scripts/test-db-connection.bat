@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM BIST_NEW 데이터베이스 연결 테스트 스크립트
REM Oracle Database 연결 상태를 확인하는 도구

echo 🧪 BIST_NEW 데이터베이스 연결 테스트를 시작합니다...

REM 색상 정의
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM 로그 함수
:log_info
echo %BLUE%[DB-TEST]%NC% %~1
goto :eof

:log_success
echo %GREEN%[SUCCESS]%NC% %~1
goto :eof

:log_warning
echo %YELLOW%[WARNING]%NC% %~1
goto :eof

:log_error
echo %RED%[ERROR]%NC% %~1
goto :eof

REM 1. 환경 변수 로드
call :log_info "환경 변수 로드 중..."
if exist "env.dev" (
    for /f "tokens=1,* delims==" %%a in (env.dev) do (
        if not "%%a"=="" if not "%%a:~0,1%"=="#" (
            set "%%a=%%b"
        )
    )
    call :log_success "환경 변수 파일 로드 완료"
) else (
    call :log_error "env.dev 파일을 찾을 수 없습니다."
    pause
    exit /b 1
)

REM 2. 필수 환경 변수 확인
call :log_info "필수 환경 변수 확인 중..."
if not defined DB_HOST (
    call :log_error "DB_HOST 환경 변수가 설정되지 않았습니다."
    pause
    exit /b 1
)
if not defined DB_PORT (
    call :log_error "DB_PORT 환경 변수가 설정되지 않았습니다."
    pause
    exit /b 1
)
if not defined DB_SERVICE (
    call :log_error "DB_SERVICE 환경 변수가 설정되지 않았습니다."
    pause
    exit /b 1
)
if not defined DB_USER (
    call :log_error "DB_USER 환경 변수가 설정되지 않았습니다."
    pause
    exit /b 1
)
if not defined DB_PASSWORD (
    call :log_error "DB_PASSWORD 환경 변수가 설정되지 않았습니다."
    pause
    exit /b 1
)

call :log_success "모든 필수 환경 변수가 설정되었습니다."

REM 3. 연결 정보 표시
echo.
call :log_info "데이터베이스 연결 정보:"
echo   - 호스트: %DB_HOST%
echo   - 포트: %DB_PORT%
echo   - 서비스명: %DB_SERVICE%
echo   - 사용자: %DB_USER%
echo   - 연결 문자열: %DB_HOST%:%DB_PORT%/%DB_SERVICE%
echo.

REM 4. Oracle Client 확인
call :log_info "Oracle Client 확인 중..."
sqlplus -V >nul 2>&1
if %errorlevel% equ 0 (
    call :log_success "Oracle Client가 설치되어 있습니다."
    sqlplus -V
) else (
    call :log_warning "Oracle Client가 설치되어 있지 않거나 PATH에 없습니다."
    call :log_info "Oracle Instant Client 설치가 필요할 수 있습니다."
)

REM 5. Node.js 데이터베이스 연결 테스트
call :log_info "Node.js를 통한 데이터베이스 연결 테스트 중..."

REM 테스트 스크립트 생성
(
echo const oracledb = require^('oracledb'^);
echo const dotenv = require^('dotenv'^);
echo.
echo dotenv.config^(^);
echo.
echo async function testConnection^(^) {
echo   try {
echo     console.log^('🔍 데이터베이스 연결 테스트 시작...'^);
echo     console.log^('📋 연결 정보:'^);
echo     console.log^('   - 호스트:', process.env.DB_HOST^);
echo     console.log^('   - 포트:', process.env.DB_PORT^);
echo     console.log^('   - 서비스명:', process.env.DB_SERVICE^);
echo     console.log^('   - 사용자:', process.env.DB_USER^);
echo     console.log^(^);
echo.
echo     const connection = await oracledb.getConnection^({
echo       user: process.env.DB_USER,
echo       password: process.env.DB_PASSWORD,
echo       connectString: `$^{process.env.DB_HOST^}:$^{process.env.DB_PORT^}/$^{process.env.DB_SERVICE^}`
echo     }^);
echo.
echo     console.log^('✅ 데이터베이스 연결 성공!'^);
echo.
echo     // 간단한 쿼리 테스트
echo     const result = await connection.execute^('SELECT 1 as test FROM dual'^);
echo     console.log^('✅ 쿼리 테스트 성공:', result.rows[0]^);
echo.
echo     // BISBM 스키마 확인
echo     try {
echo       const schemaResult = await connection.execute^('SELECT COUNT^(^*^) as table_count FROM user_tables'^);
echo       console.log^('📊 테이블 개수:', schemaResult.rows[0][0]^);
echo     } catch ^(schemaError^) {
echo       console.log^('⚠️  스키마 정보 조회 실패:', schemaError.message^);
echo     }
echo.
echo     await connection.close^(^);
echo     console.log^('🔌 연결 종료 완료'^);
echo     process.exit^(0^);
echo   } catch ^(error^) {
echo     console.error^('❌ 데이터베이스 연결 실패:', error.message^);
echo     console.error^('🔍 오류 상세:', error^);
echo     process.exit^(1^);
echo   }
echo }
echo.
echo testConnection^(^);
) > test-db-connection.js

REM 6. 테스트 실행
call :log_info "연결 테스트 실행 중..."
node test-db-connection.js

REM 7. 테스트 결과 확인
if %errorlevel% equ 0 (
    call :log_success "데이터베이스 연결 테스트 성공! 🎉"
    echo.
    call :log_info "다음 단계:"
    echo   1. 개발 서버 실행: npm run dev
    echo   2. API 테스트: http://localhost:8080/api-docs
    echo   3. 프론트엔드 확인: http://localhost:3000
) else (
    call :log_error "데이터베이스 연결 테스트 실패! ❌"
    echo.
    call :log_info "문제 해결 방법:"
    echo   1. Oracle Database 서비스가 실행 중인지 확인
    echo   2. 방화벽 설정 확인
    echo   3. Oracle Client 설치 확인
    echo   4. 연결 정보 재확인
    echo   5. 네트워크 연결 상태 확인
)

REM 8. 임시 파일 정리
if exist "test-db-connection.js" del "test-db-connection.js"

echo.
pause 