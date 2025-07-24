require("dotenv").config({ path: "./.env" });

const nextJest = require("next/jest");

const createJestConfig = nextJest({
	// Next.js 앱의 경로를 제공하여 next/jest가 TypeScript와 CSS 파일을 로드할 수 있도록 합니다
	dir: "./apps/client",
});

// Jest에 전달할 사용자 정의 설정
const customJestConfig = {
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

// createJestConfig는 비동기 함수이므로 .then()을 사용하여 설정을 수정할 수 있습니다
module.exports = createJestConfig(customJestConfig);
