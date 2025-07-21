@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM BIST_NEW Git Hooks 설정 스크립트
REM 자동 배포를 위한 Git Hook 설정

echo 🔧 BIST_NEW Git Hooks 설정을 시작합니다...

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

REM 1. Git 저장소 확인
call :log_info "Git 저장소 확인 중..."
if not exist ".git" (
    call :log_error "Git 저장소가 아닙니다. .git 폴더를 찾을 수 없습니다."
    pause
    exit /b 1
)

REM 2. .git/hooks 디렉터리 확인
if not exist ".git\hooks" (
    call :log_info ".git/hooks 디렉터리 생성 중..."
    mkdir ".git\hooks"
)

REM 3. post-receive 훅 생성 (자동 배포용)
call :log_info "post-receive 훅 생성 중..."
(
echo @echo off
echo chcp 65001 ^>nul
echo.
echo REM BIST_NEW 자동 배포 Git Hook
echo REM dev 브랜치에 푸시 시 자동으로 배포 실행
echo.
echo echo 🚀 Git 푸시 감지 - 자동 배포 시작...
echo.
echo REM 현재 디렉터리를 프로젝트 루트로 변경
echo cd /d "%~dp0.."
echo.
echo REM 자동 배포 스크립트 실행
echo call scripts\deploy-auto.bat
echo.
echo echo ✅ 자동 배포 완료
) > ".git\hooks\post-receive"

REM 4. pre-commit 훅 생성 (코드 품질 검사)
call :log_info "pre-commit 훅 생성 중..."
(
echo @echo off
echo chcp 65001 ^>nul
echo.
echo REM BIST_NEW 코드 품질 검사 Git Hook
echo REM 커밋 전 코드 포맷팅 및 린트 검사
echo.
echo echo 🔍 코드 품질 검사 시작...
echo.
echo REM 현재 디렉터리를 프로젝트 루트로 변경
echo cd /d "%~dp0.."
echo.
echo REM TypeScript 컴파일 검사
echo npx tsc --noEmit
echo if %%errorlevel%% neq 0 ^(
echo     echo ❌ TypeScript 컴파일 오류가 있습니다.
echo     exit /b 1
echo ^)
echo.
echo REM ESLint 검사
echo npm run lint --silent
echo if %%errorlevel%% neq 0 ^(
echo     echo ❌ ESLint 오류가 있습니다.
echo     exit /b 1
echo ^)
echo.
echo echo ✅ 코드 품질 검사 통과
) > ".git\hooks\pre-commit"

REM 5. pre-push 훅 생성 (테스트 실행)
call :log_info "pre-push 훅 생성 중..."
(
echo @echo off
echo chcp 65001 ^>nul
echo.
echo REM BIST_NEW 테스트 실행 Git Hook
echo REM 푸시 전 테스트 실행
echo.
echo echo 🧪 테스트 실행 시작...
echo.
echo REM 현재 디렉터리를 프로젝트 루트로 변경
echo cd /d "%~dp0.."
echo.
echo REM 단위 테스트 실행
echo npm run test --silent
echo if %%errorlevel%% neq 0 ^(
echo     echo ❌ 테스트가 실패했습니다.
echo     exit /b 1
echo ^)
echo.
echo echo ✅ 테스트 통과
) > ".git\hooks\pre-push"

REM 6. post-merge 훅 생성 (의존성 설치)
call :log_info "post-merge 훅 생성 중..."
(
echo @echo off
echo chcp 65001 ^>nul
echo.
echo REM BIST_NEW 의존성 설치 Git Hook
echo REM 병합 후 자동 의존성 설치
echo.
echo echo 📦 의존성 설치 시작...
echo.
echo REM 현재 디렉터리를 프로젝트 루트로 변경
echo cd /d "%~dp0.."
echo.
echo REM 의존성 설치
echo npm install --silent
echo.
echo echo ✅ 의존성 설치 완료
) > ".git\hooks\post-merge"

REM 7. 훅 파일 실행 권한 설정
call :log_info "훅 파일 권한 설정 중..."
attrib +x ".git\hooks\post-receive"
attrib +x ".git\hooks\pre-commit"
attrib +x ".git\hooks\pre-push"
attrib +x ".git\hooks\post-merge"

REM 8. 설정 완료
call :log_success "Git Hooks 설정 완료! 🎉"
echo.
call :log_info "설정된 Git Hooks:"
echo   - pre-commit: 코드 품질 검사 (TypeScript, ESLint)
echo   - pre-push: 테스트 실행
echo   - post-merge: 의존성 자동 설치
echo   - post-receive: dev 브랜치 자동 배포
echo.
call :log_info "사용법:"
echo   - 일반 개발: git add . ^&^& git commit -m "메시지"
echo   - 개발 서버 배포: git push origin dev
echo.
call :log_warning "주의사항:"
echo   - dev 브랜치에 푸시하면 자동으로 배포됩니다
echo   - 배포 로그는 deploy.log 파일에서 확인 가능합니다
echo   - 배포 히스토리는 deploy-history.log 파일에 기록됩니다

pause 