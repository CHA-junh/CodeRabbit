@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM BIST_NEW 자동 배포 스크립트 (Git Hook용)
REM Git post-receive 훅에서 호출되어 자동 배포 실행

echo 🚀 BIST_NEW 자동 배포를 시작합니다...

REM 색상 정의
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM 로그 함수
:log_info
echo %BLUE%[AUTO-DEPLOY]%NC% %~1
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

REM 1. 배포 시작 시간 기록
set DEPLOY_START=%date% %time%
call :log_info "배포 시작: %DEPLOY_START%"

REM 2. 현재 브랜치 확인
for /f "tokens=2" %%i in ('git branch --show-current 2^>nul') do set CURRENT_BRANCH=%%i
call :log_info "배포 브랜치: %CURRENT_BRANCH%"

REM 3. dev 브랜치가 아닌 경우 배포 중단
if not "%CURRENT_BRANCH%"=="dev" (
    call :log_warning "dev 브랜치가 아니므로 배포를 건너뜁니다. (현재: %CURRENT_BRANCH%)"
    exit /b 0
)

REM 4. 기존 프로세스 종료
call :log_info "기존 서버 프로세스 종료 중..."
taskkill /f /im node.exe >nul 2>&1
timeout /t 3 /nobreak >nul

REM 5. 최신 코드 가져오기
call :log_info "최신 코드 동기화 중..."
git fetch origin
git reset --hard origin/dev

REM 6. 의존성 설치
call :log_info "의존성 설치 중..."
npm install --silent
if %errorlevel% neq 0 (
    call :log_error "의존성 설치 실패"
    exit /b 1
)

REM 7. 환경 변수 설정
call :log_info "환경 변수 설정 중..."
if exist "env.dev" (
    for /f "tokens=1,* delims==" %%a in (env.dev) do (
        if not "%%a"=="" if not "%%a:~0,1%"=="#" (
            set "%%a=%%b"
        )
    )
    call :log_success "환경 변수 로드 완료"
) else (
    call :log_warning "env.dev 파일이 없습니다"
)

REM 8. 빌드 실행
call :log_info "프로젝트 빌드 중..."
npm run build --silent
if %errorlevel% neq 0 (
    call :log_error "빌드 실패"
    exit /b 1
)

REM 9. 테스트 실행 (선택적)
call :log_info "테스트 실행 중..."
npm run test --silent
if %errorlevel% neq 0 (
    call :log_warning "테스트 실패 - 배포는 계속 진행됩니다"
)

REM 10. 서버 시작
call :log_info "개발 서버 시작 중..."
set HOST=0.0.0.0
set NODE_ENV=development

REM 백그라운드에서 서버 시작
start /b npm run dev > deploy.log 2>&1

REM 11. 서버 시작 대기
call :log_info "서버 시작 대기 중..."
timeout /t 10 /nobreak >nul

REM 12. 헬스 체크
call :log_info "헬스 체크 실행 중..."

REM 백엔드 헬스 체크
if defined HEALTH_CHECK_PATH (
    curl -f http://localhost:%BACKEND_PORT%%HEALTH_CHECK_PATH% >nul 2>&1
) else (
    curl -f http://localhost:%BACKEND_PORT%/health/dev >nul 2>&1
)
if %errorlevel% equ 0 (
    call :log_success "백엔드 서버 정상 동작"
) else (
    call :log_warning "백엔드 서버 응답 없음"
)

REM 프론트엔드 헬스 체크
curl -f http://localhost:%FRONTEND_PORT% >nul 2>&1
if %errorlevel% equ 0 (
    call :log_success "프론트엔드 서버 정상 동작"
) else (
    call :log_warning "프론트엔드 서버 응답 없음"
)

REM 13. 배포 완료
set DEPLOY_END=%date% %time%
call :log_success "자동 배포 완료! 🎉"
call :log_info "배포 완료: %DEPLOY_END%"

REM 서버 정보 표시 (환경 변수에서 읽기)
if defined DEV_SERVER_IP (
    call :log_info "프론트엔드: http://%DEV_SERVER_IP%:%FRONTEND_PORT%"
    call :log_info "백엔드 API: http://%DEV_SERVER_IP%:%BACKEND_PORT%"
    call :log_info "API 문서: http://%DEV_SERVER_IP%:%BACKEND_PORT%%API_DOCS_PATH%"
) else (
    call :log_warning "서버 정보가 설정되지 않았습니다. env.dev 파일을 확인하세요."
    call :log_info "기본 포트 - 프론트엔드: 3000, 백엔드: 8080"
)

REM 14. 배포 로그 저장
echo [%DEPLOY_END%] 자동 배포 완료 - 브랜치: %CURRENT_BRANCH% >> deploy-history.log

exit /b 0 