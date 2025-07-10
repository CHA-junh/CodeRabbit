# BIST_NEW Monorepo Project

비즈니스 인텔리전스 시스템 - NestJS + Next.js Monorepo

## 📋 프로젝트 정보

- **SVN Repository**: `http://172.20.30.90/scm/svn/BIST_NEW`
- **Local Path**: `C:\BIST_NEW`
- **Architecture**: Monorepo (NestJS Server + Next.js Client)

## 🚀 실행 방법

### 전체 앱 실행 (서버 + 클라이언트)

```bash
npm run dev
```

### 개별 실행

```bash
# 서버만 실행
npm run dev:server

# 클라이언트만 실행
npm run dev:client
```

## 📁 프로젝트 구조

```
BIST_NEW/
├── apps/
│   ├── server/          # NestJS 백엔드
│   └── client/          # Next.js 프론트엔드
├── shared/              # 공통 라이브러리
└── package.json         # 루트 설정
```

## 🔗 접속 URL

- **클라이언트**: `http://localhost:3000`
- **서버 API**: `http://localhost:8080`

## 🗄️ 데이터베이스

- **Type**: Oracle Database
- **Connection**: Connection Pool
- **Environment**: `.env` 파일 설정 필요

## 📝 SVN 사용법

### 초기 체크아웃

```bash
svn checkout http://172.20.30.90/scm/svn/BIST_NEW C:\BIST_NEW
```

### 커밋

```bash
svn commit -m "커밋 메시지"
```

### 업데이트

```bash
svn update
```

## ⚙️ 환경 설정

1. `.env` 파일 생성
2. Oracle DB 연결 정보 설정
3. `npm install` 실행

## 🛠️ 개발 도구

- **Backend**: NestJS, TypeScript, Oracle DB
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Version Control**: SVN (TortoiseSVN)
