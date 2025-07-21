@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM BIST_NEW 데이터베이스 정보 업데이트 스크립트
REM Oracle Database 연결 정보만 업데이트하는 도구

echo 🗄️ BIST_NEW 데이터베이스 정보 설정을 시작합니다...

REM 색상 정의
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM 로그 함수
:log_info
echo %BLUE%[DB-SETUP]%NC% %~1
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

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                Oracle Database 정보 설정 도구                ║
echo ╠══════════════════════════════════════════════════════════════╣
echo ║                                                              ║
echo ║  Oracle Database 연결 정보만 업데이트합니다.                 ║
echo ║  서버 정보는 별도로 설정해주세요.                            ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM 1. 데이터베이스 호스트 입력
:input_host
set /p DB_HOST="데이터베이스 호스트 (기본: localhost): "
if "%DB_HOST%"=="" set DB_HOST=localhost

REM 2. 데이터베이스 포트 입력
:input_port
set /p DB_PORT="데이터베이스 포트 (기본: 1521): "
if "%DB_PORT%"=="" set DB_PORT=1521

REM 3. 데이터베이스 서비스명 입력
:input_service
set /p DB_SERVICE="데이터베이스 서비스명 (기본: orcl): "
if "%DB_SERVICE%"=="" set DB_SERVICE=orcl

REM 4. 사용자명 입력
:input_user
set /p DB_USER="데이터베이스 사용자명 (기본: BISBM): "
if "%DB_USER%"=="" set DB_USER=BISBM

REM 5. 비밀번호 입력
:input_password
set /p DB_PASSWORD="데이터베이스 비밀번호: "
if "%DB_PASSWORD%"=="" (
    call :log_error "비밀번호는 필수입니다."
    goto input_password
)

REM 6. 입력 정보 확인
echo.
call :log_info "입력된 데이터베이스 정보:"
echo   - 호스트: %DB_HOST%
echo   - 포트: %DB_PORT%
echo   - 서비스명: %DB_SERVICE%
echo   - 사용자명: %DB_USER%
echo   - 비밀번호: ********
echo.

set /p CONFIRM="이 정보가 맞습니까? (y/N): "
if /i not "%CONFIRM%"=="y" (
    call :log_info "다시 입력하겠습니다."
    goto input_host
)

REM 7. env.dev 파일 업데이트
call :log_info "env.dev 파일을 업데이트 중..."

REM 기존 파일 백업
if exist "env.dev" (
    copy "env.dev" "env.dev.backup" >nul
    call :log_info "기존 env.dev 파일을 env.dev.backup으로 백업했습니다."
) else (
    call :log_error "env.dev 파일을 찾을 수 없습니다."
    call :log_info "먼저 서버 정보 설정 도구를 실행하세요: scripts\update-server-info.bat"
    pause
    exit /b 1
)

REM 새로운 env.dev 파일 생성 (데이터베이스 정보만 업데이트)
call :log_info "기존 env.dev 파일에서 데이터베이스 정보만 업데이트 중..."

REM 기존 파일을 읽어서 데이터베이스 정보만 교체
for /f "usebackq delims=" %%a in ("env.dev.backup") do (
    set "current_line=%%a"
    set "line_content=!current_line!"
    
    REM 빈 줄 처리
    if "!line_content!"=="" (
        echo.
    ) else (
        REM 주석 처리
        set "first_char=!line_content:~0,1!"
        if "!first_char!"=="#" (
            echo !line_content!
        ) else (
            REM 환경 변수 처리
            for /f "tokens=1,* delims==" %%b in ("!line_content!") do (
                set "var_name=%%b"
                set "var_value=%%c"
                
                if "!var_name!"=="DATABASE_URL" (
                    echo DATABASE_URL=%DB_HOST%:%DB_PORT%/%DB_SERVICE%
                ) else if "!var_name!"=="DB_HOST" (
                    echo DB_HOST=%DB_HOST%
                ) else if "!var_name!"=="DB_PORT" (
                    echo DB_PORT=%DB_PORT%
                ) else if "!var_name!"=="DB_SERVICE" (
                    echo DB_SERVICE=%DB_SERVICE%
                ) else if "!var_name!"=="DB_USER" (
                    echo DB_USER=%DB_USER%
                ) else if "!var_name!"=="DB_PASSWORD" (
                    echo DB_PASSWORD=%DB_PASSWORD%
                ) else (
                    echo !line_content!
                )
            )
        )
    )
) > env.dev

REM 8. 설정 완료
call :log_success "데이터베이스 정보 설정 완료! 🎉"
echo.
call :log_info "설정된 데이터베이스 정보:"
echo   - 연결 문자열: %DB_HOST%:%DB_PORT%/%DB_SERVICE%
echo   - 사용자: %DB_USER%
echo   - 스키마: BISBM (기본)
echo.
call :log_info "업데이트된 항목:"
echo   - DATABASE_URL
echo   - DB_HOST
echo   - DB_PORT
echo   - DB_SERVICE
echo   - DB_USER
echo   - DB_PASSWORD
echo.
call :log_info "다음 단계:"
echo   1. Oracle Client 설치 확인
echo   2. 데이터베이스 연결 테스트
echo   3. 개발 서버 실행
echo.
call :log_warning "주의: env.dev 파일에는 민감한 정보가 포함되어 있으므로"
echo   Git에 커밋하지 마세요.

REM 9. 연결 테스트 옵션
echo.
set /p TEST_CONNECTION="데이터베이스 연결을 테스트하시겠습니까? (y/N): "
if /i "%TEST_CONNECTION%"=="y" (
    call :log_info "데이터베이스 연결 테스트 중..."
    call scripts\test-db-connection.bat
)

pause 