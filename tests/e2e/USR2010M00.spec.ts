import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 2560, height: 1440 } });

test.describe("USR2010M00 사용자 관리 E2E", () => {
	test.beforeEach(async ({ page }) => {
		// 로그인 및 메뉴 이동 공통 처리
		await page.goto("http://localhost:3000/signin");
		await page.getByLabel("ID").fill("10385");
		await page.getByLabel("Password").fill("buttle1!");
		await page.getByRole("button", { name: "Login" }).click();

		// 로그인 후 페이지 로딩 대기 (더 안정적인 방식)
		await page.waitForLoadState("networkidle");

		// 로그인 성공 후 페이지 상태 확인
		console.log("로그인 후 URL:", await page.url());

		// 메뉴 버튼을 찾는 다양한 방법 시도
		let menuButton: any = null;

		try {
			// 방법 1: aria-label로 찾기
			menuButton = page.locator('button[aria-label="메뉴 아이콘 메뉴"]');
			await menuButton.waitFor({ timeout: 5000 });
		} catch (e) {
			console.log("aria-label로 메뉴 버튼을 찾을 수 없음");

			try {
				// 방법 2: 텍스트로 찾기
				menuButton = page.getByRole("button", { name: "메뉴" });
				await menuButton.waitFor({ timeout: 5000 });
			} catch (e2) {
				console.log("텍스트로 메뉴 버튼을 찾을 수 없음");

				try {
					// 방법 3: 더 일반적인 선택자
					menuButton = page.locator("button").filter({ hasText: "메뉴" });
					await menuButton.first().waitFor({ timeout: 5000 });
				} catch (e3) {
					console.log("일반 선택자로도 메뉴 버튼을 찾을 수 없음");

					// 디버깅을 위한 스크린샷
					await page.screenshot({ path: "debug-login-page.png" });

					// 페이지의 모든 버튼 정보 출력
					const buttons = await page.locator("button").all();
					console.log("페이지의 버튼들:", buttons.length);
					for (let i = 0; i < Math.min(buttons.length, 10); i++) {
						const text = await buttons[i].textContent();
						const ariaLabel = await buttons[i].getAttribute("aria-label");
						console.log(`버튼 ${i}: text="${text}", aria-label="${ariaLabel}"`);
					}

					throw new Error("메뉴 버튼을 찾을 수 없습니다");
				}
			}
		}

		// 메뉴 버튼 클릭
		if (menuButton) {
			await menuButton.click();
		} else {
			throw new Error("메뉴 버튼을 찾을 수 없습니다");
		}

		// 사용자관리 메뉴 진입
		await page.getByText("시스템관리").click();
		await page.getByText("사용자관리").click();
		await page.getByText("사용자관리").nth(1).click();

		// 사용자 관리 페이지 로드 대기
		await page.waitForSelector("#hqDiv", { timeout: 5000 });
		await expect(page.locator("#hqDiv")).toBeVisible();

		// 옵션 로딩 대기
		await page.waitForSelector('#hqDiv option[value="ALL"]', {
			timeout: 5000,
			state: "attached",
		});
		await page.waitForSelector('#deptDiv option[value="ALL"]', {
			timeout: 5000,
			state: "attached",
		});
	});

	test("사용자 조회", async ({ page }) => {
		await test.step("사용자명을 입력하고 검색한다", async () => {
			await page.locator("#hqDiv").selectOption("ALL");
			await page.locator("#deptDiv").selectOption("ALL");
			await page.locator("#userNm").fill("권소연");
			await page.getByRole("button", { name: "조회" }).click();
		});
		await test.step("사용자 목록 테이블이 렌더링될 때까지 대기한다", async () => {
			await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
		});
		await test.step("사용자 목록에서 원하는 사용자가 보이는지 확인한다", async () => {
			await expect(page.getByRole("gridcell", { name: "90385" })).toBeVisible();
		});
	});

	test("비밀번호 초기화", async ({ page }) => {
		await test.step("사용자명을 입력하고 검색한다", async () => {
			await page.locator("#hqDiv").selectOption("ALL");
			await page.locator("#deptDiv").selectOption("ALL");
			await page.locator("#userNm").fill("권소연");
			await page.getByRole("button", { name: "조회" }).click();
		});
		await test.step("사용자 목록 테이블이 렌더링될 때까지 대기한다", async () => {
			await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
		});
		await test.step("사용자 목록에서 원하는 사용자를 선택한다", async () => {
			await page.getByRole("gridcell", { name: "90385" }).click();
		});
		await test.step('"비밀번호 초기화" 버튼을 클릭한다', async () => {
			await page.getByRole("button", { name: "비밀번호 초기화" }).click();
		});
		await test.step("비밀번호 초기화 확인 알림창(확인 버튼)을 클릭한다", async () => {
			await page.getByRole("button", { name: "확인" }).click();
		});
		await test.step("비밀번호 초기화 성공 후 사용자관리 페이지가 다시 보이는지 확인한다", async () => {
			await expect(page.locator("#hqDiv")).toBeVisible();
		});
	});

	test("사용자 정보 저장", async ({ page }) => {
		await test.step("사용자명을 입력하고 검색한다", async () => {
			await page.locator("#hqDiv").selectOption("ALL");
			await page.locator("#deptDiv").selectOption("ALL");
			await page.locator("#userNm").fill("권소연");
			await page.getByRole("button", { name: "조회" }).click();
		});
		await test.step("사용자 목록 테이블이 렌더링될 때까지 대기한다", async () => {
			await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
		});
		await test.step("사용자 목록에서 원하는 사용자를 선택한다", async () => {
			await page.getByRole("gridcell", { name: "90385" }).click();
		});
		await test.step("승인결재자명을 입력한다", async () => {
			await page.locator("#apvApofNm").fill("권소연");
		});
		await test.step("업무 권한을 선택한다", async () => {
			await page.locator("#workAuth").selectOption({ index: 1 });
		});
		await test.step("권한 부여를 클릭한다", async () => {
			await page.locator("#workAuthAction_1").check();
		});
		await test.step("저장 버튼을 클릭하고 확인 버튼을 누른다", async () => {
			await page.getByRole("button", { name: "저장" }).click();
			await page.getByRole("button", { name: "확인" }).click();
		});
		await test.step("저장 성공 후 사용자관리 페이지가 다시 보이는지 확인한다", async () => {
			await expect(page.locator("#hqDiv")).toBeVisible();
		});
	});
});
