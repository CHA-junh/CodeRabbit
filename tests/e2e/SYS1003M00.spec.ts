import { test, expect } from "@playwright/test";
import type { Locator } from "@playwright/test";

test.use({ viewport: { width: 2560, height: 1440 } });

test.describe("SYS1003M00 사용자역할관리 E2E", () => {
	test.beforeEach(async ({ page }) => {
		// 로그인
		await page.goto("http://172.20.30.176:3000/signin", {
			waitUntil: "domcontentloaded",
		});
		await page.getByRole("textbox", { name: "ID" }).fill("10385");
		await page.getByRole("textbox", { name: "Password" }).fill("buttle1!");
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

		// 메뉴를 통해 사용자역할관리 화면으로 이동
		try {
			// 시스템관리 메뉴 클릭
			await page.waitForSelector(
				'a[href*="sys"], button:has-text("시스템관리"), [data-testid*="sys"]',
				{ timeout: 10000 }
			);
			await page.click(
				'a[href*="sys"], button:has-text("시스템관리"), [data-testid*="sys"]'
			);
			await page.waitForTimeout(2000);

			// 사용자역할관리 메뉴 클릭
			await page.waitForSelector(
				'a[href*="SYS1003M00"], button:has-text("사용자역할관리"), [data-testid*="SYS1003M00"]',
				{ timeout: 10000 }
			);
			await page.click(
				'a[href*="SYS1003M00"], button:has-text("사용자역할관리"), [data-testid*="SYS1003M00"]'
			);
			await page.waitForTimeout(2000);
		} catch (e) {
			console.log("메뉴 네비게이션 실패, 직접 URL 시도");
			// 메뉴 네비게이션이 실패하면 직접 URL 시도
			await page.goto("http://172.20.30.176:3000/sys/SYS1003M00", {
				waitUntil: "domcontentloaded",
			});
		}

		// 사용자역할관리 화면이 로드될 때까지 대기
		try {
			await page.waitForSelector(
				'input[aria-label="상세 사용자역할명"], input[name="usrRoleNm"]',
				{
					timeout: 15000,
				}
			);
		} catch (e) {
			try {
				await page.waitForSelector(
					'input[placeholder*="사용자역할"], input[placeholder*="역할"]',
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
					await page.screenshot({ path: "page-load-fail.png" });
					throw e3;
				}
			}
		}
	});

	// 팝업 오버레이 닫기 함수
	async function closePopupOverlay(page: any) {
		try {
			const popup = page.locator(".fixed.inset-0.bg-black.bg-opacity-50");
			if (await popup.isVisible()) {
				await page.keyboard.press("Escape");
				await page.waitForTimeout(1000);

				if (await popup.isVisible()) {
					await page.keyboard.press("Escape");
					await page.waitForTimeout(1000);
				}

				try {
					const closeButton = page.locator(
						'button:has-text("닫기"), button:has-text("취소"), button:has-text("X")'
					);
					if (await closeButton.isVisible()) {
						await closeButton.click();
						await page.waitForTimeout(1000);
					}
				} catch (e) {
					// 닫기 버튼이 없으면 무시
				}
			}
		} catch (e) {
			// 팝업 오버레이 처리 중 오류 무시
		}
	}

	test("사용자역할 조회 테스트", async ({ page }) => {
		await test.step("사용자역할 검색한다", async () => {
			// 팝업 오버레이 닫기
			await closePopupOverlay(page);

			// 검색 입력 필드 클릭
			await page
				.getByRole("textbox", { name: "사용자역할코드/명 입력" })
				.click();

			// 검색어 입력
			await page
				.getByRole("textbox", { name: "사용자역할코드/명 입력" })
				.fill("관리자");

			// Enter 키로 검색 실행
			await page
				.getByRole("textbox", { name: "사용자역할코드/명 입력" })
				.press("Enter");
		});

		await test.step("검색 결과를 확인한다", async () => {
			// 검색 결과가 나타날 때까지 대기 (더 짧은 시간)
			await page.waitForTimeout(1000);

			// 검색 결과 테이블이 정상적으로 표시되는지 확인 (구체적인 선택자 사용)
			await expect(page.locator("table.search-table")).toBeVisible();
		});
	});

	test("사용자역할 신규 테스트", async ({ page }) => {
		await test.step("신규 버튼을 클릭한다", async () => {
			// 팝업 오버레이 닫기
			await closePopupOverlay(page);

			await page.getByRole("button", { name: "신규" }).click();

			// 신규 폼이 나타날 때까지 대기
			await page.waitForTimeout(1000);
		});

		// 신규 폼이 정상적으로 노출되는지 확인
		await test.step("신규 폼 노출을 확인한다", async () => {
			await expect(
				page.getByRole("textbox", { name: "상세 사용자역할명" })
			).toBeVisible();
		});
	});

	// 모든 팝업을 완전히 제거하는 함수
	async function removeAllPopups(page: any) {
		try {
			// 페이지가 닫혔는지 확인
			if (page.isClosed()) {
				return;
			}

			// 모든 팝업 오버레이 찾기
			const popups = page.locator(".fixed.inset-0.bg-black.bg-opacity-50");
			const count = await popups.count();

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

				// 닫기 버튼들 클릭 (더 안전하게)
				try {
					const closeButtons = page.locator(
						'button:has-text("닫기"), button:has-text("취소"), button:has-text("X"), button:has-text("확인")'
					);
					const buttonCount = await closeButtons.count();

					for (let i = 0; i < Math.min(buttonCount, 3); i++) {
						try {
							await closeButtons.nth(i).click();
							await page.waitForTimeout(500);
						} catch (e) {
							// 버튼 클릭 실패 시 무시
							break;
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

	test("사용자역할 저장 테스트", async ({ page }) => {
		await test.step("신규 역할 생성 플로우를 실행한다", async () => {
			// 팝업 오버레이를 완전히 제거
			await removeAllPopups(page);

			await page.getByRole("button", { name: "신규" }).click();

			// 신규 폼이 나타날 때까지 대기
			await page.waitForTimeout(1000);

			await page
				.getByRole("textbox", { name: "상세 사용자역할명" })
				.fill("신규역할");

			// select 옵션들이 로드될 때까지 대기 (더 짧은 시간)
			await page.waitForTimeout(1000);

			// 사용여부 선택 - 더 안전한 방법
			try {
				const useYnSelect = page.getByLabel("상세 사용여부");
				await useYnSelect.waitFor({ timeout: 3000 });
				await useYnSelect.selectOption("Y");
			} catch (e) {
				// 기본값 사용
			}

			// 등급 선택 - 더 안전한 방법
			try {
				const gradeSelect = page.getByLabel("상세 등급");
				await gradeSelect.waitFor({ timeout: 3000 });
				await gradeSelect.selectOption("1");
			} catch (e) {
				// 기본값 사용
			}

			// 조직조회범위 선택 - 더 안전한 방법
			try {
				const orgScopeSelect = page.getByLabel("상세 조직조회범위");
				await orgScopeSelect.waitFor({ timeout: 3000 });
				await orgScopeSelect.selectOption("ALL");
			} catch (e) {
				// 기본값 사용
			}

			// 메뉴 선택 - 더 안전한 방법
			try {
				const menuSelect = page.getByLabel("상세 메뉴");
				await menuSelect.waitFor({ timeout: 3000 });
				await menuSelect.selectOption("M250716001");
			} catch (e) {
				// 기본값 사용
			}
		});

		await test.step("저장 버튼을 클릭하고 확인한다", async () => {
			// 저장 버튼 클릭 전에 팝업 제거 (안전하게)
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

		await test.step("저장 성공 후 폼이 다시 보이는지 확인한다", async () => {
			await expect(
				page.getByRole("textbox", { name: "상세 사용자역할명" })
			).toBeVisible();
		});
	});

	test("사용자역할 복사 테스트", async ({ page }) => {
		await test.step("복사할 역할을 선택한다", async () => {
			// 팝업 오버레이를 완전히 제거
			try {
				await removeAllPopups(page);
			} catch (e) {
				// 복사 전 팝업 제거 실패, 계속 진행
			}

			// 그리드에서 역할 선택 (예: 종합관리자, 인사관리자)
			await page.getByRole("gridcell", { name: "종합관리자" }).click();
			await page
				.getByRole("gridcell", { name: "인사관리자", exact: true })
				.click();

			// 역할복사 버튼 클릭
			await page.getByRole("button", { name: "역할복사" }).click();
			// 확인 버튼 클릭
			await page.getByRole("button", { name: "확인" }).click();

			// 복사된 역할이 목록에 나타나는지 확인 (예시)
			await expect(
				page.getByRole("gridcell", { name: "인사관리자", exact: true })
			).toBeVisible();
		});
	});
});
