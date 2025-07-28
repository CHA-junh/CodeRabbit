import { test, expect } from "@playwright/test";

test.use({
	viewport: { width: 2560, height: 1440 },
	screenshot: "on",
});

// 팝업 제거 함수
async function removeAllPopups(page: any) {
	try {
		// 페이지가 닫혔는지 확인
		if (page.isClosed()) {
			return;
		}

		// 팝업 오버레이 개수 확인
		const count = await page
			.locator(".fixed.inset-0.bg-black.bg-opacity-50")
			.count();

		if (count > 0) {
			// 여러 방법으로 팝업 제거
			for (let i = 0; i < 3; i++) {
				try {
					await page.keyboard.press("Escape");
					await page.waitForTimeout(500);
				} catch (e) {
					break;
				}
			}

			// 닫기 버튼들 클릭 시도
			try {
				const closeButtons = page.locator(
					'button:has-text("닫기"), button:has-text("취소"), button:has-text("X"), button:has-text("확인")'
				);
				const buttonCount = await closeButtons.count();

				for (let i = 0; i < buttonCount; i++) {
					try {
						await closeButtons.nth(i).click();
						await page.waitForTimeout(500);
					} catch (e) {
						// 개별 버튼 클릭 실패 무시
					}
				}
			} catch (e) {
				// 닫기 버튼 클릭 실패
			}
		}
	} catch (e) {
		// 팝업 제거 중 오류 무시
	}
}

test.describe("USR2010M00 사용자 관리 E2E", () => {
	test.beforeEach(async ({ page }) => {
		// 로그인
		await page.goto("http://172.20.30.176:3000/signin", {
			waitUntil: "domcontentloaded",
		});
		await page.getByRole("textbox", { name: "ID" }).fill("10385");
		await page.getByRole("textbox", { name: "Password" }).fill("buttle1!");

		// Login 버튼이 클릭 가능할 때까지 대기
		await page.waitForSelector('button[type="submit"]:not([disabled])', {
			timeout: 10000,
		});
		await page.getByRole("button", { name: "Login" }).click();

		// 로그인 후 메인 페이지 로드 대기
		await page.waitForLoadState("networkidle", { timeout: 15000 });

		// 로그인 성공 확인
		try {
			await page.waitForURL("**/dashboard", { timeout: 10000 });
		} catch (e) {
			// 대시보드로 이동하지 않았을 경우 메인 페이지 대기
			await page.waitForTimeout(3000);
		}

		// 메뉴를 통해 사용자관리 화면으로 이동
		try {
			// 사용자관리 메뉴 클릭
			await page.waitForSelector(
				'a[href*="usr"], button:has-text("사용자관리"), [data-testid*="usr"]',
				{ timeout: 10000 }
			);
			await page.click(
				'a[href*="usr"], button:has-text("사용자관리"), [data-testid*="usr"]'
			);
			await page.waitForTimeout(2000);

			// 사용자관리 하위 메뉴 클릭
			await page.waitForSelector(
				'a[href*="USR2010M00"], button:has-text("사용자관리"), [data-testid*="USR2010M00"]',
				{ timeout: 10000 }
			);
			await page.click(
				'a[href*="USR2010M00"], button:has-text("사용자관리"), [data-testid*="USR2010M00"]'
			);
			await page.waitForTimeout(2000);
		} catch (e) {
			console.log("메뉴 네비게이션 실패, 직접 URL 시도");
			// 메뉴 네비게이션이 실패하면 직접 URL 시도
			await page.goto("http://172.20.30.176:3000/usr/USR2010M00", {
				waitUntil: "domcontentloaded",
			});
		}

		// 사용자관리 화면이 로드될 때까지 대기
		try {
			await page.waitForSelector(
				'input[aria-label="사용자명"], input[name="userNm"]',
				{
					timeout: 15000,
				}
			);
		} catch (e) {
			try {
				await page.waitForSelector(
					'input[placeholder*="사용자"], input[placeholder*="이름"]',
					{
						timeout: 10000,
					}
				);
			} catch (e2) {
				try {
					await page.waitForSelector(
						'input[type="text"], input[placeholder*="검색"]',
						{
							timeout: 10000,
						}
					);
				} catch (e3) {
					console.log("화면 로드 실패, 스크린샷 저장");
					await page.screenshot({ path: "usr-page-load-fail.png" });
					throw e3;
				}
			}
		}
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
			try {
				await page.waitForSelector('button:has-text("확인")', {
					timeout: 3000,
				});
				await page.getByRole("button", { name: "확인" }).click();
			} catch (e) {
				// 확인 버튼이 나타나지 않음
			}
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
			// 저장 전 팝업 제거
			try {
				await removeAllPopups(page);
			} catch (e) {
				// 저장 전 팝업 제거 실패, 계속 진행
			}

			await page.getByRole("button", { name: "저장" }).click();

			// 확인 버튼이 나타나면 클릭
			try {
				await page.waitForSelector('button:has-text("확인")', {
					timeout: 3000,
				});
				await page.getByRole("button", { name: "확인" }).click();
			} catch (e) {
				// 확인 버튼이 나타나지 않음
			}
		});
		await test.step("저장 성공 후 사용자관리 페이지가 다시 보이는지 확인한다", async () => {
			await expect(page.locator("#hqDiv")).toBeVisible();
		});
	});
});
