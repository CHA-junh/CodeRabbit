# SVN 사용 가이드 (팀원용)

## 📋 개요

- **저장소**: `http://172.20.30.90/scm/svn/BIST_NEW`
- **로컬 경로**: `C:\BIST_NEW`
- **도구**: TortoiseSVN + Cursor AI

## 🛠️ 필수 도구 설치

### 1. TortoiseSVN 설치

1. [TortoiseSVN 다운로드](https://tortoisesvn.net/downloads.html)
2. **Windows 64-bit** 버전 설치
3. 컴퓨터 재부팅

### 2. Cursor AI 설치

1. [Cursor AI 다운로드](https://cursor.sh/)
2. 설치 및 실행

## 🚀 초기 설정

### 첫 번째 사용자 (프로젝트 생성)

1. **C:\BIST_NEW 폴더에서 우클릭**
2. **TortoiseSVN → Import**
3. **URL**: `http://172.20.30.90/scm/svn/BIST_NEW`
4. **Import message**: `Initial project setup`
5. **OK** 클릭

### 다른 팀원들 (프로젝트 가져오기)

1. **상위 폴더에서 우클릭**
2. **TortoiseSVN → Checkout**
3. **URL**: `http://172.20.30.90/scm/svn/BIST_NEW`
4. **Checkout directory**: `C:\BIST_NEW`
5. **OK** 클릭

## 📝 일상적인 사용법

### 코드 편집

1. **Cursor AI**에서 `C:\BIST_NEW` 폴더 열기
2. 코드 수정 및 개발
3. 파일 저장

### 변경사항 커밋

1. **C:\BIST_NEW 폴더에서 우클릭**
2. **TortoiseSVN → Commit**
3. **변경사항 확인** 후 체크
4. **Commit message** 입력
5. **OK** 클릭

### 최신 버전 가져오기

1. **C:\BIST_NEW 폴더에서 우클릭**
2. **TortoiseSVN → Update**
3. **OK** 클릭

### 변경사항 확인

1. **C:\BIST_NEW 폴더에서 우클릭**
2. **TortoiseSVN → Check for modifications**
3. 변경된 파일 목록 확인

## 🔍 파일 상태 아이콘

- **🟢** - 수정됨 (Modified)
- **🔴** - 충돌 (Conflict)
- **🟡** - 추가됨 (Added)
- **🔵** - 삭제됨 (Deleted)
- **⚪** - 정상 (Normal)

## ⚠️ 주의사항

### 커밋 전 확인사항

- [ ] 코드가 정상 작동하는지 테스트
- [ ] 불필요한 파일이 포함되지 않았는지 확인
- [ ] 의미있는 커밋 메시지 작성

### 충돌 해결

1. **TortoiseSVN → Resolve** 선택
2. **Merge Tool** 사용하여 충돌 해결
3. **Resolved**로 표시
4. **Commit** 실행

## 🚫 제외할 파일들

다음 파일들은 SVN에서 제외됩니다:

- `node_modules/`
- `.next/`
- `dist/`
- `.env`
- `*.log`

## 📞 문제 해결

### 일반적인 문제들

1. **인증 오류**: 사용자명/비밀번호 확인
2. **충돌**: Merge Tool 사용하여 해결
3. **연결 오류**: 네트워크 연결 확인

### 도움말

- **TortoiseSVN 도움말**: 우클릭 → TortoiseSVN → Help
- **팀 리더에게 문의**: 복잡한 문제 발생 시

## 🎯 권장 워크플로우

1. **매일 시작할 때**: `Update` 실행
2. **개발 중**: 정기적으로 `Commit` 실행
3. **작업 완료 후**: 최종 `Commit` 실행
4. **주기적으로**: `Check for modifications` 확인
