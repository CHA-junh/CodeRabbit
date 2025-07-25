import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";

// 환경변수로 경로 지정, 없으면 .env 사용
const envPath = process.env.PLAYWRIGHT_ENV_PATH || ".env";
dotenv.config({ path: envPath });

export default defineConfig({
	testDir: "./tests/e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [
		["json", { outputFile: "test-results/results.json" }],
		["html", { open: "never" }],
	],
	use: {
		baseURL: process.env.BASE_URL || "http://localhost:3000",
		viewport: { width: 2560, height: 1440 },
		trace: "on-first-retry",
		screenshot: "on",
		video: "on",
	},
	projects: [
		{ name: "chromium", use: { ...devices["Desktop Chrome"] } },
		//{ name: "firefox", use: { ...devices["Desktop Firefox"] } },
	],
	webServer: {
		command: "npm run dev",
		url: process.env.BASE_URL || "http://localhost:3000",
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000,
	},
});
