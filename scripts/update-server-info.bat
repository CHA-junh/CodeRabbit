@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM BIST_NEW 서버 정보 업데이트 스크립트
REM 개발 서버 정보를 쉽게 설정할 수 있는 도구

echo 🔧 BIST_NEW 서버 정보 설정을 시작합니다...

REM 색상 정의
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM 로그 함수
:log_info
echo %BLUE%[SETUP]%NC% %~1
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
echo ║                    서버 정보 설정 도구                       ║
echo ╠══════════════════════════════════════════════════════════════╣
echo ║                                                              ║
echo ║  실제 개발 서버 정보를 입력해주세요.                         ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM 1. 서버 IP 주소 입력
:input_ip
set /p DEV_SERVER_IP="개발 서버 IP 주소를 입력하세요: "
if "%DEV_SERVER_IP%"=="" (
    call :log_error "IP 주소는 필수입니다."
    goto input_ip
)

REM 2. 프론트엔드 포트 입력
:input_frontend_port
set /p FRONTEND_PORT="프론트엔드 포트 (기본: 3000): "
if "%FRONTEND_PORT%"=="" set FRONTEND_PORT=3000

REM 3. 백엔드 포트 입력
:input_backend_port
set /p BACKEND_PORT="백엔드 포트 (기본: 8080): "
if "%BACKEND_PORT%"=="" set BACKEND_PORT=8080

REM 4. API 문서 경로 입력
:input_api_docs
set /p API_DOCS_PATH="API 문서 경로 (기본: /api-docs): "
if "%API_DOCS_PATH%"=="" set API_DOCS_PATH=/api-docs

REM 5. 헬스 체크 경로 입력
:input_health_check
set /p HEALTH_CHECK_PATH="헬스 체크 경로 (기본: /health/dev): "
if "%HEALTH_CHECK_PATH%"=="" set HEALTH_CHECK_PATH=/health/dev

REM 6. 입력 정보 확인
echo.
call :log_info "입력된 서버 정보:"
echo   - 서버 IP: %DEV_SERVER_IP%
echo   - 프론트엔드 포트: %FRONTEND_PORT%
echo   - 백엔드 포트: %BACKEND_PORT%
echo   - API 문서 경로: %API_DOCS_PATH%
echo   - 헬스 체크 경로: %HEALTH_CHECK_PATH%
echo.

set /p CONFIRM="이 정보가 맞습니까? (y/N): "
if /i not "%CONFIRM%"=="y" (
    call :log_info "다시 입력하겠습니다."
    goto input_ip
)

REM 7. env.dev 파일 업데이트
call :log_info "env.dev 파일을 업데이트 중..."

REM 기존 파일이 있으면 백업
if exist "env.dev" (
    copy "env.dev" "env.dev.backup" >nul
    call :log_info "기존 env.dev 파일을 env.dev.backup으로 백업했습니다."
    
    REM 기존 파일을 읽어서 서버 정보만 교체
    call :log_info "기존 설정을 보존하면서 서버 정보만 업데이트 중..."
    
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
                    
                    if "!var_name!"=="DEV_SERVER_IP" (
                        echo DEV_SERVER_IP=%DEV_SERVER_IP%
                    ) else if "!var_name!"=="FRONTEND_PORT" (
                        echo FRONTEND_PORT=%FRONTEND_PORT%
                    ) else if "!var_name!"=="BACKEND_PORT" (
                        echo BACKEND_PORT=%BACKEND_PORT%
                    ) else if "!var_name!"=="API_DOCS_PATH" (
                        echo API_DOCS_PATH=%API_DOCS_PATH%
                    ) else if "!var_name!"=="HEALTH_CHECK_PATH" (
                        echo HEALTH_CHECK_PATH=%HEALTH_CHECK_PATH%
                    ) else if "!var_name!"=="PORT" (
                        echo PORT=%BACKEND_PORT%
                    ) else if "!var_name!"=="CLIENT_PORT" (
                        echo CLIENT_PORT=%FRONTEND_PORT%
                    ) else if "!var_name!"=="CORS_ORIGIN" (
                        echo CORS_ORIGIN=http://%DEV_SERVER_IP%:%FRONTEND_PORT%
                    ) else (
                        echo !line_content!
                    )
                )
            )
        )
    ) > env.dev.tmp
) else (
    REM 새 파일 생성 (기본 템플릿)
    call :log_info "새로운 env.dev 파일을 생성 중..."
    
    (
    echo # BIST_NEW 개발 환경 변수
    echo # 서버 정보
    echo DEV_SERVER_IP=%DEV_SERVER_IP%
    echo FRONTEND_PORT=%FRONTEND_PORT%
    echo BACKEND_PORT=%BACKEND_PORT%
    echo API_DOCS_PATH=%API_DOCS_PATH%
    echo HEALTH_CHECK_PATH=%HEALTH_CHECK_PATH%
    echo.
    echo # 데이터베이스 설정 (별도 도구로 설정)
    echo DATABASE_URL=your_database_host:1521/your_database_service
    echo DB_HOST=your_database_host
    echo DB_PORT=1521
    echo DB_SERVICE=your_database_service
    echo DB_USER=your_database_user
    echo DB_PASSWORD=your_database_password
    echo.
    echo # JWT 설정
    echo JWT_SECRET=your_jwt_secret_key
    echo JWT_EXPIRES_IN=24h
    echo.
    echo # 애플리케이션 설정
    echo NODE_ENV=development
    echo PORT=%BACKEND_PORT%
    echo CLIENT_PORT=%FRONTEND_PORT%
    echo.
    echo # 로깅 설정
    echo LOG_LEVEL=debug
    echo LOG_FILE=app.log
    echo.
    echo # 세션 설정
    echo SESSION_SECRET=your_session_secret
    echo SESSION_COOKIE_MAX_AGE=86400000
    echo.
    echo # CORS 설정
    echo CORS_ORIGIN=http://%DEV_SERVER_IP%:%FRONTEND_PORT%
    echo CORS_CREDENTIALS=true
    echo.
    echo # 파일 업로드 설정
    echo UPLOAD_MAX_SIZE=10mb
    echo UPLOAD_DEST=./uploads
    echo.
    echo # 이메일 설정 ^(필요시^)
    echo SMTP_HOST=smtp.example.com
    echo SMTP_PORT=587
    echo SMTP_USER=your_email@example.com
    echo SMTP_PASS=your_email_password
    echo.
    echo # 외부 API 설정 ^(필요시^)
    echo EXTERNAL_API_URL=https://api.example.com
    echo EXTERNAL_API_KEY=your_api_key
    ) > env.dev.tmp
)

REM 새 파일로 교체
move "env.dev.tmp" "env.dev" >nul

REM 8. 설정 완료
call :log_success "서버 정보 설정 완료! 🎉"
echo.
call :log_info "설정된 서버 정보:"
echo   - 프론트엔드: http://%DEV_SERVER_IP%:%FRONTEND_PORT%
echo   - 백엔드 API: http://%DEV_SERVER_IP%:%BACKEND_PORT%
echo   - API 문서: http://%DEV_SERVER_IP%:%BACKEND_PORT%%API_DOCS_PATH%
echo   - 헬스 체크: http://%DEV_SERVER_IP%:%BACKEND_PORT%%HEALTH_CHECK_PATH%
echo.
call :log_info "다음 단계:"
echo   1. 데이터베이스 정보 설정: scripts\update-db-info.bat
echo   2. JWT 시크릿 키 설정
echo   3. 기타 환경 변수 설정
echo.
call :log_warning "주의: env.dev 파일에는 민감한 정보가 포함될 수 있으므로"
echo   Git에 커밋하지 마세요.

pause 