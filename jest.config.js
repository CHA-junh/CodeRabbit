require("dotenv").config({ path: "./.env" });

// Next.js Jest 설정 대신 일반 Jest 설정 사용
module.exports = {
	// 테스트 환경 설정
	testEnvironment: "jsdom",

	// 테스트 전에 실행할 설정 파일
	setupFilesAfterEnv: ["<rootDir>/apps/client/src/test/setup.tsx"],

	// 모듈 이름 매핑 (절대 경로 지원)
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/apps/client/src/$1",
		"^@/app/(.*)$": "<rootDir>/apps/client/src/app/$1",
		"^@/components/(.*)$": "<rootDir>/apps/client/src/components/$1",
		"^@/modules/(.*)$": "<rootDir>/apps/client/src/modules/$1",
		"^@/utils/(.*)$": "<rootDir>/apps/client/src/utils/$1",
		"^@/contexts/(.*)$": "<rootDir>/apps/client/src/contexts/$1",
	},

	// 테스트 파일 패턴 - 클라이언트만 포함
	testMatch: [
		"<rootDir>/apps/client/src/**/*.test.tsx",
		"<rootDir>/apps/client/src/**/*.test.ts",
	],

	// 테스트 커버리지 설정
	collectCoverageFrom: [
		"<rootDir>/apps/client/src/**/*.{ts,tsx}",
		"!<rootDir>/apps/client/src/**/*.d.ts",
	],

	// 테스트에서 무시할 파일들
	testPathIgnorePatterns: [
		"<rootDir>/.next/",
		"<rootDir>/node_modules/",
		"<rootDir>/dist/",
	],

	// 테스트 타임아웃 (30초)
	testTimeout: 30000,

	// TypeScript 및 JSX 지원 - Jest 설정에서 직접 처리
	preset: "ts-jest",
	transform: {
		"^.+\\.(ts|tsx)$": [
			"ts-jest",
			{
				tsconfig: {
					jsx: "react-jsx",
					esModuleInterop: true,
					allowSyntheticDefaultImports: true,
					moduleResolution: "node",
					target: "es5",
					lib: ["dom", "dom.iterable", "es6"],
					allowJs: true,
					skipLibCheck: true,
					strict: true,
					noEmit: true,
					module: "esnext",
					resolveJsonModule: true,
					isolatedModules: true,
					incremental: true,
					baseUrl: ".",
					paths: {
						"@/*": ["./src/*"],
					},
				},
			},
		],
	},

	// 리포터 설정 - 통합 경로로 변경
	reporters: [
		"default",
		[
			"jest-html-reporter",
			{
				pageTitle: "BIST_NEW Test Report",
				outputPath: "./test-reports/jest-report.html",
				includeFailureMsg: true,
			},
		],
	],
};
