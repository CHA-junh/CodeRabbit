@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM BIST_NEW 빠른 배포 스크립트
REM 개발자가 쉽게 사용할 수 있는 간단한 배포 도구

echo ⚡ BIST_NEW 빠른 배포를 시작합니다...

REM 색상 정의
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM 로그 함수
:log_info
echo %BLUE%[QUICK-DEPLOY]%NC% %~1
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

REM 1. 메뉴 표시
:menu
cls
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    BIST_NEW 빠른 배포 도구                   ║
echo ╠══════════════════════════════════════════════════════════════╣
echo ║                                                              ║
echo ║  1. 개발 서버 배포 (dev 브랜치)                              ║
echo ║  2. 현재 변경사항만 배포                                     ║
echo ║  3. 서버 상태 확인                                           ║
echo ║  4. 서버 재시작                                              ║
echo ║  5. 배포 로그 확인                                           ║
echo ║  6. Git 상태 확인                                            ║
echo ║  0. 종료                                                     ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

set /p choice="선택하세요 (0-6): "

if "%choice%"=="1" goto deploy_dev
if "%choice%"=="2" goto deploy_current
if "%choice%"=="3" goto check_status
if "%choice%"=="4" goto restart_server
if "%choice%"=="5" goto check_logs
if "%choice%"=="6" goto check_git
if "%choice%"=="0" goto exit
goto menu

REM 2. 개발 서버 배포
:deploy_dev
call :log_info "개발 서버 배포를 시작합니다..."
call :log_info "dev 브랜치로 전환 중..."

git checkout dev
if %errorlevel% neq 0 (
    call :log_error "dev 브랜치 전환 실패"
    pause
    goto menu
)

git pull origin dev
if %errorlevel% neq 0 (
    call :log_error "원격 저장소에서 코드 가져오기 실패"
    pause
    goto menu
)

call scripts\deploy-auto.bat
pause
goto menu

REM 3. 현재 변경사항만 배포
:deploy_current
call :log_info "현재 변경사항 배포를 시작합니다..."

REM 현재 브랜치 확인
for /f "tokens=2" %%i in ('git branch --show-current 2^>nul') do set CURRENT_BRANCH=%%i
call :log_info "현재 브랜치: %CURRENT_BRANCH%"

REM 변경사항 확인
git status --porcelain >nul 2>&1
if %errorlevel% equ 0 (
    call :log_warning "커밋되지 않은 변경사항이 있습니다."
    git status --short
    set /p CONTINUE="계속 진행하시겠습니까? (y/N): "
    if /i not "!CONTINUE!"=="y" goto menu
)

REM 의존성 설치 및 빌드
call :log_info "의존성 설치 중..."
npm install --silent

call :log_info "빌드 중..."
npm run build --silent

REM 서버 재시작
call :log_info "서버 재시작 중..."
taskkill /f /im node.exe >nul 2>&1
timeout /t 3 /nobreak >nul

set HOST=0.0.0.0
start /b npm run dev > deploy.log 2>&1

call :log_success "현재 변경사항 배포 완료!"
pause
goto menu

REM 4. 서버 상태 확인
:check_status
call :log_info "서버 상태 확인 중..."

echo.
echo 📊 서버 상태:
echo.

REM 백엔드 서버 확인
if defined HEALTH_CHECK_PATH (
    curl -f http://localhost:%BACKEND_PORT%%HEALTH_CHECK_PATH% >nul 2>&1
) else (
    curl -f http://localhost:%BACKEND_PORT%/health/dev >nul 2>&1
)
if %errorlevel% equ 0 (
    if defined DEV_SERVER_IP (
        echo ✅ 백엔드 서버: 정상 동작 (http://%DEV_SERVER_IP%:%BACKEND_PORT%)
    ) else (
        echo ✅ 백엔드 서버: 정상 동작 (localhost:%BACKEND_PORT%)
    )
) else (
    echo ❌ 백엔드 서버: 응답 없음
)

REM 프론트엔드 서버 확인
curl -f http://localhost:%FRONTEND_PORT% >nul 2>&1
if %errorlevel% equ 0 (
    if defined DEV_SERVER_IP (
        echo ✅ 프론트엔드 서버: 정상 동작 (http://%DEV_SERVER_IP%:%FRONTEND_PORT%)
    ) else (
        echo ✅ 프론트엔드 서버: 정상 동작 (localhost:%FRONTEND_PORT%)
    )
) else (
    echo ❌ 프론트엔드 서버: 응답 없음
)

echo.
echo 📋 프로세스 정보:
tasklist /fi "imagename eq node.exe" /fo table

pause
goto menu

REM 5. 서버 재시작
:restart_server
call :log_info "서버 재시작 중..."

taskkill /f /im node.exe >nul 2>&1
call :log_info "기존 프로세스 종료 완료"

timeout /t 3 /nobreak >nul

set HOST=0.0.0.0
start /b npm run dev > deploy.log 2>&1

call :log_success "서버 재시작 완료!"
call :log_info "서버 시작 대기 중..."
timeout /t 10 /nobreak >nul

call :log_info "서버 상태 확인 중..."
if defined HEALTH_CHECK_PATH (
    curl -f http://localhost:%BACKEND_PORT%%HEALTH_CHECK_PATH% >nul 2>&1
) else (
    curl -f http://localhost:%BACKEND_PORT%/health/dev >nul 2>&1
)
if %errorlevel% equ 0 (
    call :log_success "서버 정상 동작 확인"
) else (
    call :log_warning "서버 응답 없음 - 로그를 확인해주세요"
)

pause
goto menu

REM 6. 배포 로그 확인
:check_logs
call :log_info "배포 로그 확인 중..."

echo.
echo 📄 최근 배포 로그 (deploy.log):
echo ═══════════════════════════════════════════════════════════════
if exist "deploy.log" (
    type deploy.log
) else (
    echo 로그 파일이 없습니다.
)

echo.
echo 📄 배포 히스토리 (deploy-history.log):
echo ═══════════════════════════════════════════════════════════════
if exist "deploy-history.log" (
    type deploy-history.log
) else (
    echo 히스토리 파일이 없습니다.
)

pause
goto menu

REM 7. Git 상태 확인
:check_git
call :log_info "Git 상태 확인 중..."

echo.
echo 🌿 Git 상태:
echo ═══════════════════════════════════════════════════════════════
git status

echo.
echo 📋 최근 커밋:
echo ═══════════════════════════════════════════════════════════════
git log --oneline -5

echo.
echo 🌿 브랜치 정보:
echo ═══════════════════════════════════════════════════════════════
git branch -a

pause
goto menu

REM 8. 종료
:exit
call :log_info "빠른 배포 도구를 종료합니다."
exit /b 0 