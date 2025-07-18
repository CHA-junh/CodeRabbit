# BIST_NEW 프로젝트

이 프로젝트는 BIST 시스템의 새로운 버전입니다.

## 🚀 시작하기

### 필수 요구사항

- Node.js 18+
- npm 또는 yarn
- MySQL 또는 MariaDB

### 설치 및 실행

1. **의존성 설치**

```bash
npm install
```

2. **환경 변수 설정**

   `apps/client/.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# 개발 환경
NEXT_PUBLIC_API_URL=http://localhost:8080

# 스테이징 환경
# NEXT_PUBLIC_API_URL=https://staging-api.example.com

# 프로덕션 환경
# NEXT_PUBLIC_API_URL=https://api.example.com
```

3. **개발 서버 실행**

```bash
# 클라이언트 (Next.js)
cd apps/client
npm run dev

# 서버 (NestJS)
cd apps/server
npm run start:dev
```

4. **브라우저에서 확인**

- **클라이언트**: http://localhost:3000
- **서버 API**: `http://localhost:8080`

## 📁 프로젝트 구조

```
BIST_NEW/
├── apps/
│   ├── client/          # Next.js 프론트엔드
│   └── server/          # NestJS 백엔드
├── packages/            # 공유 패키지들
└── README.md
```

## 🔧 환경별 설정

### 개발 환경

- `NEXT_PUBLIC_API_URL=http://localhost:8080`

### 스테이징 환경

- `NEXT_PUBLIC_API_URL=https://staging-api.example.com`

### 프로덕션 환경

- `NEXT_PUBLIC_API_URL=https://api.example.com`

## 📝 주요 변경사항

### 보안 개선

- ✅ 비밀번호 로그 마스킹
- ✅ 환경 변수를 통한 API URL 관리
- ✅ 하드코딩된 URL 제거

### 동적 컴포넌트 로딩

- ✅ Next.js dynamic import 최적화
- ✅ 컴포넌트 캐싱 구현
- ✅ 에러 처리 개선

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
