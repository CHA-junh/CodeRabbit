@echo off
echo ========================================
echo    BIST_NEW Git 문제 해결 스크립트
echo ========================================
echo.

echo 1. Git 사용자 정보 확인...
git config --global user.name
git config --global user.email
echo.

echo 2. 원격 저장소 확인...
git remote -v
echo.

echo 3. 브랜치 트래킹 설정...
git branch --set-upstream-to=origin/master master
echo.

echo 4. 최신 코드 가져오기...
git pull origin master
echo.

echo 5. Git 상태 확인...
git status
echo.

echo ========================================
echo    문제 해결 완료!
echo ========================================
echo.
echo 만약 여전히 문제가 있다면:
echo 1. VS Code를 재시작하세요
echo 2. README_TEAM_SETUP.md 파일을 확인하세요
echo 3. 팀장에게 문의하세요
echo.

pause 