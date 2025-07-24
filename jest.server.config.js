require("dotenv").config({ path: "./.env" });

module.exports = {
	moduleFileExtensions: ["js", "json", "ts"],
	rootDir: ".",
	testRegex: "apps/server/src/.*\\.(spec|real-db\\.spec)\\.ts$",
	transform: {
		"^.+\\.(t|j)s$": "ts-jest",
	},
	transformIgnorePatterns: [
		"node_modules/(?!(node-fetch|data-uri-to-buffer|fetch-blob|formdata-polyfill)/)",
	],
	collectCoverageFrom: [
		"apps/server/src/**/*.(t|j)s",
		"!apps/server/src/**/*.d.ts",
	],
	coverageDirectory: "./coverage/server",
	testEnvironment: "node",
	testTimeout: 30000,
	reporters: [
		"default",
		[
			"jest-html-reporter",
			{
				pageTitle: "Server Test Report",
				outputPath: "./test-reports/server/jest-report.html",
				includeFailureMsg: true,
			},
		],
	],
};
