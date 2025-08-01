@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM BIST_NEW 개발 환경 배포 스크립트 (Windows)
REM 사용법: scripts\deploy-dev.bat

echo 🚀 BIST_NEW 개발 환경 배포를 시작합니다...

REM 색상 정의 (Windows에서는 제한적)
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM 로그 함수
:log_info
echo %BLUE%[INFO]%NC% %~1
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

REM 1. 현재 브랜치 확인
call :log_info "현재 브랜치 확인 중..."
for /f "tokens=2" %%i in ('git branch --show-current 2^>nul') do set CURRENT_BRANCH=%%i

if not "%CURRENT_BRANCH%"=="dev" (
    call :log_error "현재 브랜치가 'dev'가 아닙니다. (현재: %CURRENT_BRANCH%)"
    call :log_info "dev 브랜치로 전환하세요: git checkout dev"
    pause
    exit /b 1
)

call :log_success "현재 브랜치: %CURRENT_BRANCH%"

REM 2. Git 상태 확인
call :log_info "Git 상태 확인 중..."
git status --porcelain >nul 2>&1
if %errorlevel% neq 0 (
    call :log_warning "커밋되지 않은 변경사항이 있습니다."
    git status --short
    set /p CONTINUE="계속 진행하시겠습니까? (y/N): "
    if /i not "!CONTINUE!"=="y" (
        call :log_info "배포가 취소되었습니다."
        pause
        exit /b 0
    )
)

REM 3. 원격 저장소에서 최신 코드 가져오기
call :log_info "원격 저장소에서 최신 코드 가져오는 중..."
git fetch origin
git pull origin dev

REM 4. 의존성 설치
call :log_info "의존성 설치 중..."
npm install

REM 5. 환경 변수 설정
call :log_info "개발 환경 변수 설정 중..."
if exist "env.dev" (
    for /f "tokens=1,* delims==" %%a in (env.dev) do (
        if not "%%a"=="" if not "%%a:~0,1%"=="#" (
            set "%%a=%%b"
        )
    )
    call :log_success "환경 변수 파일 로드 완료"
) else (
    call :log_warning "env.dev 파일이 없습니다. 기본 환경 변수를 사용합니다."
)

REM 6. 빌드 (필요한 경우)
call :log_info "프로젝트 빌드 중..."
npm run build

REM 7. 개발 서버 시작
call :log_info "개발 서버 시작 중..."

REM 서버 정보 표시 (환경 변수에서 읽기)
if defined DEV_SERVER_IP (
    call :log_info "프론트엔드: http://%DEV_SERVER_IP%:%FRONTEND_PORT%"
    call :log_info "백엔드 API: http://%DEV_SERVER_IP%:%BACKEND_PORT%"
    call :log_info "API 문서: http://%DEV_SERVER_IP%:%BACKEND_PORT%%API_DOCS_PATH%"
    call :log_info "헬스 체크: http://%DEV_SERVER_IP%:%BACKEND_PORT%%HEALTH_CHECK_PATH%"
) else (
    call :log_warning "서버 정보가 설정되지 않았습니다. env.dev 파일을 확인하세요."
    call :log_info "기본 포트 - 프론트엔드: 3000, 백엔드: 8080"
)

REM 8. 개발 서버 실행 (외부 접속 허용)
call :log_info "개발 서버를 외부 접속 허용 모드로 시작합니다..."
set HOST=0.0.0.0
npm run dev

call :log_success "개발 환경 배포가 완료되었습니다! 🎉"
pause 
